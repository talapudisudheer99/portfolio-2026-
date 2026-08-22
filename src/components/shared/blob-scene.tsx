"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { usePalette } from "@/components/palette-provider"
import { useAtmosphereReady } from "@/components/shared/atmosphere-ready"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import {
  getMoonPaletteLook,
  type MoonPaletteLook,
} from "@/data/moon-palette-looks"
import type { BlobPaletteId } from "@/data/blob-palettes"
import {
  atmosphere,
  sectionMoodOrder,
  sectionMoods,
  type SectionMoodId,
} from "@/lib/motion"
import { createSpaceProps } from "@/lib/space-props-3d"

type MoonMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>

/**
 * Phase 08 — ONE global WebGL atmosphere.
 * NASA LRO Moon only — palette recolors lighting + soft albedo (no planet tour, no limb shells).
 */
export function AmbientAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useHydratedReducedMotion()
  const reducedRef = useRef(reducedMotion)
  const { paletteId } = usePalette()
  const { markReady } = useAtmosphereReady()
  const markReadyRef = useRef(markReady)
  const paletteRef = useRef<BlobPaletteId>(paletteId)
  const lookRef = useRef<MoonPaletteLook>(getMoonPaletteLook(paletteId))
  const sunRef = useRef<THREE.DirectionalLight | null>(null)
  const fillRef = useRef<THREE.DirectionalLight | null>(null)
  const rimRef = useRef<THREE.DirectionalLight | null>(null)
  const ambientRef = useRef<THREE.AmbientLight | null>(null)
  const moonRef = useRef<MoonMesh | null>(null)
  const applyLookRef = useRef<((look: MoonPaletteLook) => void) | null>(null)
  const moodTargetRef = useRef<{
    id: SectionMoodId
    intensity: number
    speed: number
    tint: THREE.Color
  }>({
    id: "hero",
    intensity: sectionMoods.hero.intensity,
    speed: sectionMoods.hero.speed,
    tint: new THREE.Color(sectionMoods.hero.tint),
  })
  const moodCurrentRef = useRef<{
    intensity: number
    speed: number
    tint: THREE.Color
  }>({
    intensity: sectionMoods.hero.intensity,
    speed: sectionMoods.hero.speed,
    tint: new THREE.Color(sectionMoods.hero.tint),
  })

  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    markReadyRef.current = markReady
  }, [markReady])

  useEffect(() => {
    paletteRef.current = paletteId
    const look = getMoonPaletteLook(paletteId)
    lookRef.current = look
    applyLookRef.current?.(look)
  }, [paletteId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement!
    const w = parent.clientWidth || window.innerWidth
    const h = parent.clientHeight || window.innerHeight
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    // Props need landscape width — hide on tablet/portrait so they don’t pin to corners
    const hideProps =
      isMobile ||
      window.matchMedia("(max-width: 1023px)").matches ||
      window.innerHeight >= window.innerWidth * 0.95
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.25)
    // High tessellation — bump needs dense mesh or crater edges soften
    const segments = isMobile ? 160 : 320

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      })
    } catch {
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !isMobile,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
        })
      } catch {
        markReadyRef.current()
        return
      }
    }

    const gl = renderer.getContext()
    if (!gl) {
      renderer.dispose()
      markReadyRef.current()
      return
    }

    renderer.setSize(w, h)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100)
    camera.position.z = 4.35

    const disposables: { dispose: () => void }[] = []
    const root = new THREE.Group()
    const horizonY = isMobile ? atmosphere.horizonYMobile : atmosphere.horizonY
    const horizonScale = isMobile
      ? atmosphere.horizonScaleMobile
      : atmosphere.horizonScale
    // Mars-style: moon as bottom horizon, not a center companion
    root.position.y = horizonY
    root.scale.setScalar(horizonScale)
    scene.add(root)

    const sun = new THREE.DirectionalLight(0xfff5e8, 2.35)
    sun.position.set(4.0, 1.9, 3.7)
    scene.add(sun)
    sunRef.current = sun

    const fill = new THREE.DirectionalLight(0x9aadc8, 0.34)
    fill.position.set(-3.8, -0.6, 2.2)
    scene.add(fill)
    fillRef.current = fill

    const ambient = new THREE.AmbientLight(0x101218, 0.13)
    scene.add(ambient)
    ambientRef.current = ambient

    const rim = new THREE.DirectionalLight(0xc5d0e0, 0.2)
    rim.position.set(-2.4, 0.5, 3.8)
    scene.add(rim)
    rimRef.current = rim

    // Margin props share moon lights — no second WebGL scene
    const spaceProps = hideProps
      ? null
      : createSpaceProps(disposables, { aspect: w / Math.max(h, 1) })
    if (spaceProps) scene.add(spaceProps.group)

    const loader = new THREE.TextureLoader()
    const colorUrl = isMobile ? "/moon/color-2k.jpg" : "/moon/color-4k.jpg"
    const bumpUrl = "/moon/displacement-2k.jpg"
    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    let cancelled = false
    let moon: MoonMesh | null = null

    function applyLook(look: MoonPaletteLook) {
      lookRef.current = look
      sun.color.setHex(look.sunColor)
      sun.intensity = look.sunIntensity
      sun.position.set(...look.sunPosition)
      fill.color.setHex(look.fillColor)
      fill.intensity = look.fillIntensity
      rim.color.setHex(look.rimColor)
      rim.intensity = look.rimIntensity
      ambient.color.setHex(look.ambientColor)
      ambient.intensity = look.ambientIntensity
      renderer.toneMappingExposure = look.exposure
      spaceProps?.setPalette(paletteRef.current)

      if (moon) {
        moon.material.color.setHex(look.albedo)
        moon.material.bumpScale = isMobile
          ? look.bumpScale * 0.75
          : look.bumpScale
        moon.material.roughness = look.roughness
        moon.material.needsUpdate = true
      }
    }

    applyLookRef.current = applyLook
    applyLook(getMoonPaletteLook(paletteRef.current))

    if (!atmosphere.moonEnabled) {
      // Props-only mode — skip moon mesh/textures, still unlock hero
      renderer.render(scene, camera)
      revealAtmosphere()
    } else {
      Promise.all([loader.loadAsync(colorUrl), loader.loadAsync(bumpUrl)])
        .then(([colorMap, bumpMap]) => {
          if (cancelled) {
            colorMap.dispose()
            bumpMap.dispose()
            return
          }

          colorMap.colorSpace = THREE.SRGBColorSpace
          colorMap.anisotropy = maxAniso
          colorMap.wrapS = colorMap.wrapT = THREE.ClampToEdgeWrapping
          colorMap.generateMipmaps = true
          colorMap.minFilter = THREE.LinearMipmapLinearFilter
          colorMap.magFilter = THREE.LinearFilter

          // Height as bump + micro-roughness — crater rims catch light differently
          bumpMap.colorSpace = THREE.NoColorSpace
          bumpMap.anisotropy = maxAniso
          bumpMap.wrapS = bumpMap.wrapT = THREE.ClampToEdgeWrapping
          bumpMap.generateMipmaps = true
          bumpMap.minFilter = THREE.LinearMipmapLinearFilter
          bumpMap.magFilter = THREE.LinearFilter

          disposables.push(colorMap, bumpMap)

          const look = lookRef.current
          const geo = new THREE.SphereGeometry(1.55, segments, segments)
          try {
            geo.computeTangents()
          } catch {
            /* bump still works without explicit tangents */
          }

          const mat = new THREE.MeshStandardMaterial({
            map: colorMap,
            bumpMap,
            bumpScale: isMobile ? look.bumpScale * 0.75 : look.bumpScale,
            displacementMap: bumpMap,
            displacementScale: isMobile ? 0.022 : 0.038,
            displacementBias: -0.01,
            roughnessMap: bumpMap,
            roughness: look.roughness,
            metalness: 0.02,
            color: look.albedo,
            flatShading: false,
            envMapIntensity: 0,
          })
          mat.customProgramCacheKey = () => "moon-relief-v2"
          mat.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <map_fragment>",
              /* glsl */ `
            #include <map_fragment>
            diffuseColor.rgb = pow(max(diffuseColor.rgb, vec3(0.0)), vec3(0.94));
            diffuseColor.rgb = (diffuseColor.rgb - 0.5) * 1.08 + 0.5;
            `
            )
          }

          moon = new THREE.Mesh(geo, mat) as MoonMesh
          moon.rotation.set(
            THREE.MathUtils.degToRad(6),
            THREE.MathUtils.degToRad(-28),
            THREE.MathUtils.degToRad(3)
          )
          // Avoid z-fighting shimmer on dense mesh
          moon.frustumCulled = true
          root.add(moon)
          moonRef.current = moon
          disposables.push(geo, mat)

          renderer.render(scene, camera)
          revealAtmosphere()
        })
        .catch(() => {
          if (cancelled) return
          const look = lookRef.current
          const geo = new THREE.SphereGeometry(1.32, 96, 96)
          const mat = new THREE.MeshStandardMaterial({
            color: look.albedo,
            roughness: 0.95,
            metalness: 0,
          })
          moon = new THREE.Mesh(geo, mat) as MoonMesh
          root.add(moon)
          moonRef.current = moon
          disposables.push(geo, mat)
          renderer.render(scene, camera)
          revealAtmosphere()
        })
    }

    function revealAtmosphere() {
      if (cancelled) return
      parent.classList.add("is-ready")
      markReadyRef.current()
    }

    // Never leave the page waiting forever if textures hang
    const revealFailsafe = window.setTimeout(() => {
      if (!cancelled) revealAtmosphere()
    }, 2200)

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    function onPointerMove(e: PointerEvent) {
      if (isMobile) return
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let scrollY = 0
    function onScroll() {
      scrollY = window.scrollY
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const ratios = new Map<SectionMoodId, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.mood as
            | SectionMoodId
            | undefined
          if (!id) continue
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best: SectionMoodId = "hero"
        let bestRatio = -1
        for (const { id } of sectionMoodOrder) {
          const r = ratios.get(id) ?? 0
          if (r > bestRatio) {
            bestRatio = r
            best = id
          }
        }
        const mood = sectionMoods[best]
        moodTargetRef.current.id = best
        moodTargetRef.current.intensity = mood.intensity
        moodTargetRef.current.speed = mood.speed
        moodTargetRef.current.tint.set(mood.tint)
        document.documentElement.dataset.sectionMood = best
      },
      {
        threshold: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85],
        rootMargin: "-8% 0px -28% 0px",
      }
    )

    const observed: Element[] = []
    for (const { id, selector } of sectionMoodOrder) {
      const el = document.querySelector(selector)
      if (!el) continue
      ;(el as HTMLElement).dataset.mood = id
      observer.observe(el)
      observed.push(el)
    }

    let frameId = 0
    const clock = new THREE.Clock()
    let lastScrollProgress = 0
    let scrollVelocity = 0
    /** Horizon sentinel — smoothed pose per chapter. */
    const sentinelPose = { y: 0, scale: 1, fade: 1, spin: 1 }
    const sentinelTable = isMobile
      ? atmosphere.sentinelMobile
      : atmosphere.sentinel
    const pageH = () =>
      document.documentElement.scrollHeight - window.innerHeight
    let pageVisible = document.visibilityState === "visible"

    function onVisibility() {
      pageVisible = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", onVisibility)

    function animate() {
      frameId = requestAnimationFrame(animate)
      if (!pageVisible) return

      const cur = moodCurrentRef.current
      const tgt = moodTargetRef.current
      cur.intensity += (tgt.intensity - cur.intensity) * 0.05
      cur.speed += (tgt.speed - cur.speed) * 0.05
      cur.tint.lerp(tgt.tint, 0.05)

      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05

      const sp = Math.min(scrollY / (pageH() || 1), 1)
      const look = lookRef.current
      const dt = Math.max(clock.getDelta(), 0.001)
      const elapsed = clock.elapsedTime
      const rawVel = Math.abs(sp - lastScrollProgress) / dt
      scrollVelocity += (Math.min(rawVel * 0.35, 1) - scrollVelocity) * 0.15
      lastScrollProgress = sp

      if (!reducedRef.current) {
        fill.intensity = look.fillIntensity * (0.9 + 0.15 * cur.intensity)
        // Keep rim body-colored — no hard ring shells, no mood wash
        rim.color.setHex(look.rimColor)
        rim.intensity = look.rimIntensity * (0.9 + 0.12 * cur.intensity)

        // Horizon sentinel — limb stays at the bottom; section mood picks pose.
        // Hero: rest · Sameward: slight rise + dim · Deeper: settle + soften.
        const moodId = tgt.id
        const poseTarget = sentinelTable[moodId] ?? sentinelTable.hero
        const poseK = 1 - Math.exp(-(4.2 + scrollVelocity * 2.5) * dt)
        sentinelPose.y += (poseTarget.y - sentinelPose.y) * poseK
        sentinelPose.scale += (poseTarget.scale - sentinelPose.scale) * poseK
        sentinelPose.fade += (poseTarget.fade - sentinelPose.fade) * poseK
        sentinelPose.spin += (poseTarget.spin - sentinelPose.spin) * poseK

        if (moon) {
          const spinBase =
            0.00115 *
            cur.speed *
            sentinelPose.spin *
            (isMobile ? 0.75 : 1)
          moon.rotation.y += spinBase * (1 + scrollVelocity * 0.45)
          moon.rotation.x =
            THREE.MathUtils.degToRad(6) + mouse.y * 0.014
          moon.rotation.z =
            THREE.MathUtils.degToRad(3) + mouse.x * 0.008
        }

        spaceProps?.update(
          elapsed,
          sp,
          mouse,
          moodTargetRef.current.id,
          scrollVelocity
        )

        // Slow orbit drift — tiny L/R + yaw on the horizon (no flyby)
        const orbit = isMobile ? atmosphere.orbitMobile : atmosphere.orbit
        const orbitAngle =
          elapsed * orbit.rate + sp * Math.PI * orbit.scrollTurns
        const orbitSin = Math.sin(orbitAngle)
        const orbitCos = Math.cos(orbitAngle * 0.85)
        // Quiet a touch when Sameward dims — still readable, less fight with UI
        const orbitGain = 0.55 + 0.45 * sentinelPose.fade

        const targetX =
          orbitSin * orbit.x * orbitGain +
          mouse.x * atmosphere.mouseInfluence * 0.08
        const targetY =
          horizonY +
          sentinelPose.y +
          orbitCos * orbit.y * orbitGain +
          mouse.y * 0.012
        const targetZ = 0
        const targetScale = horizonScale * sentinelPose.scale
        const targetRotZ =
          -orbitSin * orbit.bank * orbitGain + mouse.x * 0.005
        const targetRotY =
          orbitSin * orbit.yaw * orbitGain + mouse.x * 0.01
        const targetRotX =
          orbitCos * orbit.bank * 0.45 * orbitGain + mouse.y * 0.006

        const k = 1 - Math.exp(-(9 + scrollVelocity * 5) * dt)
        root.position.x += (targetX - root.position.x) * k
        root.position.y += (targetY - root.position.y) * k
        root.position.z += (targetZ - root.position.z) * k
        const s = root.scale.x
        root.scale.setScalar(s + (targetScale - s) * k)
        root.rotation.z += (targetRotZ - root.rotation.z) * k
        root.rotation.y += (targetRotY - root.rotation.y) * k
        root.rotation.x += (targetRotX - root.rotation.x) * k

        // Dim with Sameward / deeper so UI owns the frame
        sun.intensity =
          look.sunIntensity *
          (0.72 + 0.28 * sentinelPose.fade) *
          cur.intensity *
          (isMobile ? 0.9 : 1)

        parent.style.setProperty(
          "--atmosphere-scroll-fade",
          String(Math.max(0.35, sentinelPose.fade))
        )
      }

      renderer.render(scene, camera)
    }

    if (!reducedRef.current) {
      animate()
    } else {
      renderer.render(scene, camera)
    }

    function onResize() {
      const nw = parent.clientWidth || window.innerWidth
      const nh = parent.clientHeight || window.innerHeight
      if (nw < 2 || nh < 2) return
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      renderer.render(scene, camera)
    }
    window.addEventListener("resize", onResize)

    const ro = new ResizeObserver(() => onResize())
    ro.observe(parent)

    function onContextLost(e: Event) {
      e.preventDefault()
    }
    function onContextRestored() {
      onResize()
      renderer.render(scene, camera)
    }
    canvas.addEventListener("webglcontextlost", onContextLost, false)
    canvas.addEventListener("webglcontextrestored", onContextRestored, false)

    parent.style.setProperty(
      "--atmosphere-opacity",
      String(isMobile ? atmosphere.opacityMobile : atmosphere.opacity)
    )

    return () => {
      cancelled = true
      window.clearTimeout(revealFailsafe)
      applyLookRef.current = null
      parent.classList.remove("is-ready")
      delete document.documentElement.dataset.atmosphere
      cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      canvas.removeEventListener("webglcontextrestored", onContextRestored)
      ro.disconnect()
      observer.disconnect()
      observed.forEach((el) => {
        delete (el as HTMLElement).dataset.mood
      })
      delete document.documentElement.dataset.sectionMood
      renderer.dispose()
      disposables.forEach((d) => d.dispose())
      moonRef.current = null
      sunRef.current = null
      fillRef.current = null
      rimRef.current = null
      ambientRef.current = null
    }
  }, [])

  return (
    <div
      ref={sceneRootRef}
      className="atmosphere-scene blob-scene-fixed"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

/** @deprecated Use AmbientAtmosphere — alias for existing imports */
export const BlobScene = AmbientAtmosphere
