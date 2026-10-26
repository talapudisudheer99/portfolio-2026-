"use client"

import gsap from "gsap"
import { useEffect, useRef } from "react"
import * as THREE from "three"

import { usePalette } from "@/components/palette-provider"
import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import {
  getMoonPaletteLook,
  type MoonPaletteLook,
} from "@/data/moon-palette-looks"
import type { BlobPaletteId } from "@/data/blob-palettes"
import {
  atmosphere,
  depthField,
  sectionMoodOrder,
  sectionMoods,
  type SectionMoodId,
} from "@/lib/motion"
import { createSpaceProps, type SectionScrolls } from "@/lib/space-props-3d"

type MoonMesh = THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>

const CAMERA_Z = 4.35
const FOV = 36
const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(FOV) / 2)

const easeOutCubic = (x: number) => 1 - (1 - x) ** 3
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** Moon opacity for a scroll position — gone once the hero has left. */
function moonFade(scrollY: number, vh: number) {
  const { fadeStart, fadeEnd } = depthField.moon
  const p = clamp01((scrollY / vh - fadeStart) / (fadeEnd - fadeStart))
  return 1 - p * p * (3 - 2 * p)
}

/** Section tops in scroll px — the props' timeline is built on these. */
function measureSections(): SectionScrolls {
  const vh = window.innerHeight
  const top = (selector: string, fallback: number) => {
    const el = document.querySelector(selector)
    if (!el) return fallback
    return el.getBoundingClientRect().top + window.scrollY
  }
  const max = Math.max(0, document.documentElement.scrollHeight - vh)
  return {
    work: top("#work", vh),
    projects: top("#projects", vh * 2),
    skills: top("#skills", vh * 3),
    experience: top("#experience", vh * 5),
    about: top("#about", vh * 7),
    contact: top("#contact", vh * 8),
    max,
  }
}

/**
 * ONE global WebGL layer on a real depth field.
 *
 * The camera never moves; every object moves up the screen at its own
 * fraction of the scroll speed (see `depthField`). The moon is the hero
 * horizon: it rises slowly and fades out as Sameward arrives. Props are
 * anchored to sections. When nothing is on screen the scene stops drawing.
 */
export function AmbientAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useHydratedReducedMotion()
  const reducedRef = useRef(reducedMotion)
  const { paletteId } = usePalette()
  const paletteRef = useRef<BlobPaletteId>(paletteId)
  const applyLookRef = useRef<((look: MoonPaletteLook) => void) | null>(null)

  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    paletteRef.current = paletteId
    applyLookRef.current?.(getMoonPaletteLook(paletteId))
  }, [paletteId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement!

    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData
    )
    /** Props need landscape room beside the content column. */
    const propsAllowed = () =>
      window.innerWidth >= 1024 && window.innerHeight < window.innerWidth * 0.95
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75)
    const segments = isMobile ? 96 : 160

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "default" : "high-performance",
        failIfMajorPerformanceCaveat: false,
      })
    } catch {
      return
    }
    if (!renderer.getContext()) {
      renderer.dispose()
      return
    }

    let vw = parent.clientWidth || window.innerWidth
    let vh = parent.clientHeight || window.innerHeight
    renderer.setSize(vw, vh)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(FOV, vw / vh, 0.1, 100)
    camera.position.z = CAMERA_Z

    const disposables: { dispose: () => void }[] = []
    const root = new THREE.Group()
    const horizonY = isMobile ? atmosphere.horizonYMobile : atmosphere.horizonY
    const horizonScale = isMobile
      ? atmosphere.horizonScaleMobile
      : atmosphere.horizonScale
    root.position.y = horizonY - depthField.intro.rise
    root.scale.setScalar(horizonScale)
    scene.add(root)

    const sun = new THREE.DirectionalLight(0xfff5e8, 2.35)
    sun.position.set(4.0, 1.9, 3.7)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x9aadc8, 0.34)
    fill.position.set(-3.8, -0.6, 2.2)
    scene.add(fill)
    const ambient = new THREE.AmbientLight(0x101218, 0.13)
    scene.add(ambient)
    const rim = new THREE.DirectionalLight(0xc5d0e0, 0.2)
    rim.position.set(-2.4, 0.5, 3.8)
    scene.add(rim)

    /** Set when something changed that a still (reduced-motion) frame must show. */
    let dirty = true
    function requestDraw() {
      dirty = true
    }

    let spaceProps: ReturnType<typeof createSpaceProps> | null = null
    let moon: MoonMesh | null = null
    let cancelled = false
    let look = getMoonPaletteLook(paletteRef.current)

    const loader = new THREE.TextureLoader()
    const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)

    function applyLook(next: MoonPaletteLook) {
      look = next
      sun.color.setHex(next.sunColor)
      sun.intensity = next.sunIntensity
      sun.position.set(...next.sunPosition)
      fill.color.setHex(next.fillColor)
      fill.intensity = next.fillIntensity
      rim.color.setHex(next.rimColor)
      rim.intensity = next.rimIntensity
      ambient.color.setHex(next.ambientColor)
      ambient.intensity = next.ambientIntensity
      renderer.toneMappingExposure = next.exposure
      spaceProps?.setPalette(paletteRef.current)
      if (moon) {
        moon.material.color.setHex(next.albedo)
        moon.material.bumpScale = isMobile ? next.bumpScale * 0.75 : next.bumpScale
        moon.material.roughness = next.roughness
        moon.material.needsUpdate = true
      }
      requestDraw()
    }
    applyLookRef.current = applyLook
    applyLook(look)

    function setupMap(tex: THREE.Texture, color: boolean) {
      tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
      tex.anisotropy = maxAniso
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
    }

    function applyMoonRelief(mat: THREE.MeshStandardMaterial) {
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
    }

    let introStart = -1
    const clock = new THREE.Clock()

    /** Moon + props go live in the same frame, then fade/rise in together. */
    function reveal() {
      if (cancelled || introStart >= 0) return
      if (!spaceProps && propsAllowed()) {
        spaceProps = createSpaceProps(disposables)
        scene.add(spaceProps.group)
        spaceProps.setPalette(paletteRef.current)
      }
      introStart = clock.getElapsedTime()
      parent.classList.add("is-ready")
      requestDraw()
    }

    function mountMoon(map: THREE.Texture | null) {
      if (cancelled) {
        map?.dispose()
        return
      }
      if (map) {
        setupMap(map, true)
        disposables.push(map)
      }
      const geo = new THREE.SphereGeometry(1.55, segments, segments)
      const mat = new THREE.MeshStandardMaterial({
        map,
        roughness: look.roughness,
        metalness: 0.02,
        color: look.albedo,
        envMapIntensity: 0,
        transparent: true,
      })
      applyMoonRelief(mat)
      moon = new THREE.Mesh(geo, mat) as MoonMesh
      moon.rotation.set(
        THREE.MathUtils.degToRad(6),
        THREE.MathUtils.degToRad(-28),
        THREE.MathUtils.degToRad(3)
      )
      root.add(moon)
      disposables.push(geo, mat)
      applyLook(look)
      // Compile shaders now so the first animated frame doesn't stall.
      renderer.compile(scene, camera)
      reveal()
    }

    function applyBump(bump: THREE.Texture) {
      if (cancelled || !moon) {
        bump.dispose()
        return
      }
      setupMap(bump, false)
      const prev = moon.material.bumpMap
      moon.material.bumpMap = bump
      moon.material.bumpScale = isMobile ? look.bumpScale * 0.75 : look.bumpScale
      moon.material.displacementMap = bump
      moon.material.displacementScale = isMobile ? 0.022 : 0.038
      moon.material.displacementBias = -0.01
      moon.material.roughnessMap = bump
      moon.material.needsUpdate = true
      disposables.push(bump)
      if (prev && prev !== bump) prev.dispose()
      requestDraw()
    }

    function swapColor(next: THREE.Texture) {
      if (cancelled || !moon) {
        next.dispose()
        return
      }
      setupMap(next, true)
      const prev = moon.material.map
      moon.material.map = next
      moon.material.needsUpdate = true
      disposables.push(next)
      if (prev && prev !== next) prev.dispose()
      requestDraw()
    }

    // 1k color first (preloaded in <head>) so the horizon arrives with the hero.
    // Phones stay on 1k; desktop upgrades to 2k once the page has settled.
    loader
      .loadAsync("/moon/color-1k.jpg")
      .then((map) => {
        mountMoon(map)
        const upgrade = !isMobile && !saveData
        loader
          .loadAsync("/moon/displacement-1k.jpg")
          .then((lo) => {
            applyBump(lo)
            if (upgrade) {
              return loader.loadAsync("/moon/displacement-2k.jpg").then(applyBump)
            }
          })
          .catch(() => {})
        if (upgrade) {
          loader.loadAsync("/moon/color-2k.jpg").then(swapColor).catch(() => {})
        }
      })
      .catch(() => mountMoon(null))

    // Never leave the hero without its horizon on a slow connection.
    const revealFailsafe = window.setTimeout(reveal, 2500)

    // —— Inputs ——
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let sections = measureSections()
    let measureQueued = 0
    const remeasure = () => {
      if (measureQueued) return
      measureQueued = window.requestAnimationFrame(() => {
        measureQueued = 0
        sections = measureSections()
        requestDraw()
      })
    }
    const bodyObserver = new ResizeObserver(remeasure)
    bodyObserver.observe(document.body)
    window.addEventListener("load", remeasure)

    // Section mood → light tint + html[data-section-mood] for CSS
    const moodTarget: { intensity: number; tint: THREE.Color } = {
      intensity: sectionMoods.hero.intensity,
      tint: new THREE.Color(sectionMoods.hero.tint),
    }
    const moodCurrent: { intensity: number } = { intensity: moodTarget.intensity }
    const ratios = new Map<SectionMoodId, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.mood as
            | SectionMoodId
            | undefined
          if (id) ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
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
        moodTarget.intensity = sectionMoods[best].intensity
        moodTarget.tint.set(sectionMoods[best].tint)
        document.documentElement.dataset.sectionMood = best
      },
      { threshold: [0.1, 0.25, 0.4, 0.55, 0.7, 0.85], rootMargin: "-8% 0px -28% 0px" }
    )
    const observed: Element[] = []
    for (const { id, selector } of sectionMoodOrder) {
      const el = document.querySelector(selector)
      if (!el) continue
      ;(el as HTMLElement).dataset.mood = id
      observer.observe(el)
      observed.push(el)
    }

    let pageVisible = document.visibilityState === "visible"
    function onVisibility() {
      pageVisible = document.visibilityState === "visible"
      if (pageVisible) requestDraw()
    }
    document.addEventListener("visibilitychange", onVisibility)

    // —— Frame ——
    let lastScroll = window.scrollY
    let velocity = 0
    let drewSomething = false

    /** One frame. Runs on the GSAP ticker, after Lenis has moved the page. */
    function frame() {
      if (!pageVisible || cancelled) return
      const reduced = reducedRef.current
      const dt = Math.min(Math.max(clock.getDelta(), 0.001), 0.1)
      const t = clock.elapsedTime
      const scrollY = Math.max(0, window.scrollY)

      const scrollDelta = scrollY - lastScroll
      const rawVel = Math.abs(scrollDelta) / dt / Math.max(vh, 1)
      if (scrollY !== lastScroll) dirty = true
      lastScroll = scrollY
      velocity += (Math.min(rawVel * 0.35, 1) - velocity) * 0.15

      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      moodCurrent.intensity +=
        (moodTarget.intensity - moodCurrent.intensity) * 0.05

      const intro =
        introStart < 0
          ? 0
          : reduced
            ? 1
            : easeOutCubic(clamp01((t - introStart) / depthField.intro.duration))

      // —— Moon: real parallax (same direction as the page, slower) ——
      let moonVisible = false
      if (moon) {
        const fade = moonFade(scrollY, vh)
        moonVisible = fade > 0.005 && introStart >= 0
        moon.visible = moonVisible
        if (moonVisible) {
          const worldPerPx = (2 * HALF_FOV_TAN * CAMERA_Z) / vh
          const rate = reduced ? 0 : depthField.moon.rate
          const orbit = isMobile ? atmosphere.orbitMobile : atmosphere.orbit
          const a = reduced ? 0 : t * orbit.rate
          const s = Math.sin(a)
          const c = Math.cos(a * 0.85)
          root.position.x = s * orbit.x + mouse.x * atmosphere.mouseInfluence * 0.08
          root.position.y =
            horizonY +
            scrollY * rate * worldPerPx +
            c * orbit.y +
            mouse.y * 0.012 -
            (1 - intro) * depthField.intro.rise
          root.rotation.set(
            c * orbit.bank * 0.45 + mouse.y * 0.006,
            s * orbit.yaw + mouse.x * 0.01,
            -s * orbit.bank + mouse.x * 0.005
          )
          if (!reduced) {
            // Idle spin + the globe turns with the page (scroll-scrubbed)
            moon.rotation.y +=
              0.00115 * (isMobile ? 0.75 : 1) * (1 + velocity * 0.45) +
              scrollDelta * 0.00035
            moon.rotation.x = THREE.MathUtils.degToRad(6) + mouse.y * 0.014
            moon.rotation.z = THREE.MathUtils.degToRad(3) + mouse.x * 0.008
          }
          moon.material.opacity = fade
        }
      }

      sun.intensity = look.sunIntensity * moodCurrent.intensity * (isMobile ? 0.9 : 1)
      fill.intensity = look.fillIntensity * (0.9 + 0.15 * moodCurrent.intensity)

      // —— Props ——
      let propsVisible = false
      if (spaceProps) {
        const allowed = propsAllowed() && !reduced
        spaceProps.group.visible = allowed
        if (allowed) {
          propsVisible = spaceProps.update({
            t,
            dt,
            scrollY,
            vw,
            vh,
            mouse,
            velocity,
            scrollDelta,
            sections,
            intro,
          })
        }
      }

      const animating = !reduced || dirty
      if (moonVisible || propsVisible) {
        if (animating) {
          renderer.render(scene, camera)
          drewSomething = true
          dirty = false
        }
      } else if (drewSomething) {
        // Nothing in view — clear once, then stop drawing (saves the GPU).
        renderer.clear()
        drewSomething = false
      }
    }

    gsap.ticker.add(frame)

    function onResize() {
      const nw = parent.clientWidth || window.innerWidth
      const nh = parent.clientHeight || window.innerHeight
      if (nw < 2 || nh < 2) return
      vw = nw
      vh = nh
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      remeasure()
      requestDraw()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(parent)

    function onContextLost(e: Event) {
      e.preventDefault()
    }
    canvas.addEventListener("webglcontextlost", onContextLost, false)
    canvas.addEventListener("webglcontextrestored", onResize, false)

    parent.style.setProperty(
      "--atmosphere-opacity",
      String(isMobile ? atmosphere.opacityMobile : atmosphere.opacity)
    )

    return () => {
      cancelled = true
      window.clearTimeout(revealFailsafe)
      window.cancelAnimationFrame(measureQueued)
      applyLookRef.current = null
      parent.classList.remove("is-ready")
      gsap.ticker.remove(frame)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("load", remeasure)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      canvas.removeEventListener("webglcontextrestored", onResize)
      ro.disconnect()
      bodyObserver.disconnect()
      observer.disconnect()
      observed.forEach((el) => {
        delete (el as HTMLElement).dataset.mood
      })
      delete document.documentElement.dataset.sectionMood
      renderer.dispose()
      disposables.forEach((d) => d.dispose())
    }
  }, [])

  return (
    <div className="atmosphere-scene blob-scene-fixed" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
