"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { usePalette } from "@/components/palette-provider"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import { defaultBlobPaletteId, getBlobPalette } from "@/data/blob-palettes"
import {
  atmosphere,
  sectionMoodOrder,
  sectionMoods,
  type SectionMoodId,
} from "@/lib/motion"

const initialBlob = getBlobPalette(defaultBlobPaletteId).blob

/**
 * Phase 08 — ONE global WebGL atmosphere.
 * Task 16: section moods shift color/intensity/speed via uniforms only.
 */
export function AmbientAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { palette } = usePalette()
  const reducedMotion = useHydratedReducedMotion()
  const reducedRef = useRef(reducedMotion)
  const uniformsRef = useRef<{
    uColor1: { value: THREE.Color }
    uColor2: { value: THREE.Color }
    uColor3: { value: THREE.Color }
    uIntensity: { value: number }
    uMoodColor: { value: THREE.Color }
    uMoodMix: { value: number }
    uSpeed: { value: number }
  } | null>(null)
  const glowMatRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const light2Ref = useRef<THREE.DirectionalLight | null>(null)
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
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement!
    const w = parent.clientWidth || window.innerWidth
    const h = parent.clientHeight || window.innerHeight
    const isMobile = window.matchMedia("(max-width: 767px)").matches
    const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.75)
    const segments = isMobile ? 40 : 96

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    camera.position.z = 4.2

    const disposables: { dispose: () => void }[] = []

    const blobUniforms: {
      uTime: { value: number }
      uMouse: { value: THREE.Vector2 }
      uScroll: { value: number }
      uIntensity: { value: number }
      uSpeed: { value: number }
      uMoodMix: { value: number }
      uMoodColor: { value: THREE.Color }
      uColor1: { value: THREE.Color }
      uColor2: { value: THREE.Color }
      uColor3: { value: THREE.Color }
    } = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uIntensity: { value: sectionMoods.hero.intensity },
      uSpeed: { value: sectionMoods.hero.speed },
      uMoodMix: { value: atmosphere.moodMix },
      uMoodColor: { value: new THREE.Color(sectionMoods.hero.tint) },
      uColor1: { value: new THREE.Color(initialBlob.color1) },
      uColor2: { value: new THREE.Color(initialBlob.color2) },
      uColor3: { value: new THREE.Color(initialBlob.color3) },
    }
    uniformsRef.current = blobUniforms

    const blobVert = `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec2 uMouse;
      uniform float uScroll;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      float noise3d(vec3 p) {
        float t = uTime * uSpeed;
        return sin(p.x * 1.5 + t * 0.4)
             * sin(p.y * 1.8 + t * 0.3)
             * sin(p.z * 1.3 + t * 0.5)
             + sin(p.x * 3.0 - t * 0.6) * 0.3
             + sin(p.y * 4.0 + t * 0.8) * 0.15;
      }

      void main() {
        vec3 pos = position;
        vec3 norm = normal;

        float n = noise3d(pos * 1.2) * 0.3;
        n += noise3d(pos * 2.5 + uTime * uSpeed * 0.3) * 0.14;
        n += noise3d(pos * 5.0 - uTime * uSpeed * 0.2) * 0.07;
        n += sin(uScroll * 6.28318 + pos.y * 2.0) * 0.04;

        float mx = uMouse.x * ${atmosphere.mouseInfluence.toFixed(2)};
        float my = uMouse.y * ${atmosphere.mouseInfluence.toFixed(2)};
        n += (norm.x * mx + norm.y * my) * 0.28;

        pos += norm * n;
        vDisplacement = n;
        vNormal = normalize(normalMatrix * norm);
        vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const blobFrag = `
      uniform float uTime;
      uniform float uIntensity;
      uniform float uMoodMix;
      uniform vec3 uMoodColor;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      void main() {
        vec3 viewDir = normalize(-vPosition);
        float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
        fresnel = pow(fresnel, 3.0);

        vec3 baseColor = mix(uColor2, uColor1, smoothstep(-0.1, 0.3, vDisplacement));
        baseColor = mix(baseColor, uColor3, fresnel * 0.6);
        baseColor = mix(baseColor, uMoodColor, uMoodMix);

        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(vNormal, halfDir), 0.0), 60.0);

        float rim = fresnel * 0.8;
        vec3 color = baseColor * 0.6 + baseColor * rim + vec3(1.0) * spec * 0.4;
        color *= uIntensity;

        float iri = sin(vDisplacement * 20.0 + uTime) * 0.5 + 0.5;
        color += uColor3 * iri * fresnel * 0.15;

        float alpha = (0.85 + fresnel * 0.15) * uIntensity;
        gl_FragColor = vec4(color, alpha);
      }
    `

    const blobGeo = new THREE.SphereGeometry(1.3, segments, segments)
    const blobMat = new THREE.ShaderMaterial({
      vertexShader: blobVert,
      fragmentShader: blobFrag,
      uniforms: blobUniforms,
      transparent: true,
    })
    const blob = new THREE.Mesh(blobGeo, blobMat)
    scene.add(blob)
    disposables.push(blobGeo, blobMat)

    const glowGeo = new THREE.SphereGeometry(1.8, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: initialBlob.glow,
      transparent: true,
      opacity: atmosphere.glowIntensity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    })
    const glowMesh = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glowMesh)
    disposables.push(glowGeo, glowMat)
    glowMatRef.current = glowMat

    const light1 = new THREE.DirectionalLight(0xffffff, 1.5)
    light1.position.set(3, 2, 4)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(initialBlob.light, 0.8)
    light2.position.set(-2, -1, 2)
    scene.add(light2)
    light2Ref.current = light2
    scene.add(new THREE.AmbientLight(0x111111, 0.5))

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

    // Task 16 — one system, section mood targets via IntersectionObserver
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
        // Task 13 — journey continuity signal for CSS (subtle, no layout change)
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
    const t0 = performance.now()
    const pageH = () =>
      document.documentElement.scrollHeight - window.innerHeight
    let pageVisible = document.visibilityState === "visible"

    function onVisibility() {
      pageVisible = document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", onVisibility)

    if (reducedRef.current) {
      blobUniforms.uTime.value = 0
      blobUniforms.uIntensity.value = 0.55
      renderer.render(scene, camera)
    }

    function animate() {
      frameId = requestAnimationFrame(animate)
      if (!pageVisible) return

      const t = ((performance.now() - t0) / 1000) * atmosphere.timeScale
      const cur = moodCurrentRef.current
      const tgt = moodTargetRef.current
      cur.intensity += (tgt.intensity - cur.intensity) * 0.05
      cur.speed += (tgt.speed - cur.speed) * 0.05
      cur.tint.lerp(tgt.tint, 0.05)

      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06

      const sp = Math.min(scrollY / (pageH() || 1), 1)

      if (!reducedRef.current) {
        blobUniforms.uTime.value = t
        blobUniforms.uMouse.value.set(
          isMobile ? 0 : mouse.x,
          isMobile ? 0 : mouse.y
        )
        blobUniforms.uScroll.value = sp
        blobUniforms.uIntensity.value = cur.intensity * (isMobile ? 0.85 : 1)
        blobUniforms.uSpeed.value = cur.speed * (isMobile ? 0.75 : 1)
        blobUniforms.uMoodColor.value.copy(cur.tint)
        blobUniforms.uMoodMix.value = isMobile
          ? atmosphere.moodMixMobile
          : atmosphere.moodMix

        const rotScale = isMobile ? 0.55 : 1
        blob.rotation.y += (0.0025 + mouse.x * 0.0014) * rotScale * cur.speed
        blob.rotation.x += (0.0012 + mouse.y * 0.0012) * rotScale * cur.speed
        blob.scale.setScalar(1 + Math.sin(t * 0.35) * 0.018 + sp * 0.04)

        const ampX = isMobile ? atmosphere.scrollX * 0.55 : atmosphere.scrollX
        const ampY = isMobile ? atmosphere.scrollY * 0.55 : atmosphere.scrollY
        blob.position.x = Math.sin(sp * Math.PI * 2) * ampX
        blob.position.y =
          Math.cos(sp * Math.PI * 1.5) * ampY - sp * 0.65

        glowMesh.position.copy(blob.position)
        glowMesh.scale.setScalar(1 + Math.sin(t * 0.8) * 0.06)
        glowMat.opacity =
          atmosphere.glowIntensity + Math.sin(t * 1.5) * 0.025
      }

      renderer.render(scene, camera)
    }

    if (!reducedRef.current) {
      animate()
    }

    function onResize() {
      const nw = parent.clientWidth || window.innerWidth
      const nh = parent.clientHeight || window.innerHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener("resize", onResize)

    parent.style.setProperty(
      "--atmosphere-opacity",
      String(isMobile ? atmosphere.opacityMobile : atmosphere.opacity)
    )

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.disconnect()
      observed.forEach((el) => {
        delete (el as HTMLElement).dataset.mood
      })
      delete document.documentElement.dataset.sectionMood
      // Task 18 — release WebGL context so remounts do not leak contexts
      renderer.forceContextLoss()
      renderer.dispose()
      disposables.forEach((d) => d.dispose())
      uniformsRef.current = null
      glowMatRef.current = null
      light2Ref.current = null
    }
  }, [])

  useEffect(() => {
    uniformsRef.current?.uColor1.value.set(palette.blob.color1)
    uniformsRef.current?.uColor2.value.set(palette.blob.color2)
    uniformsRef.current?.uColor3.value.set(palette.blob.color3)
    glowMatRef.current?.color.set(palette.blob.glow)
    light2Ref.current?.color.set(palette.blob.light)
  }, [palette])

  return (
    <div className="atmosphere-scene blob-scene-fixed" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

/** @deprecated Use AmbientAtmosphere — alias for existing imports */
export const BlobScene = AmbientAtmosphere
