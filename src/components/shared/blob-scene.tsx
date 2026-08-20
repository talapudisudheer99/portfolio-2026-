"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { usePalette } from "@/components/palette-provider"
import { useHydratedReducedMotion } from "@/components/shared/motion"
import { defaultBlobPaletteId, getBlobPalette } from "@/data/blob-palettes"

const initialBlob = getBlobPalette(defaultBlobPaletteId).blob

export function BlobScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { palette } = usePalette()
  const reducedMotion = useHydratedReducedMotion()
  const reducedRef = useRef(reducedMotion)
  const uniformsRef = useRef<{
    uColor1: { value: THREE.Color }
    uColor2: { value: THREE.Color }
    uColor3: { value: THREE.Color }
  } | null>(null)
  const glowMatRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const light2Ref = useRef<THREE.DirectionalLight | null>(null)

  useEffect(() => {
    reducedRef.current = reducedMotion
  }, [reducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement!
    const w = parent.clientWidth || window.innerWidth
    const h = parent.clientHeight || window.innerHeight
    const dpr = Math.min(window.devicePixelRatio, 2)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
    camera.position.z = 4.2

    const disposables: { dispose: () => void }[] = []

    const blobUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uColor1: { value: new THREE.Color(initialBlob.color1) },
      uColor2: { value: new THREE.Color(initialBlob.color2) },
      uColor3: { value: new THREE.Color(initialBlob.color3) },
    }
    uniformsRef.current = blobUniforms

    const blobVert = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDisplacement;

      float noise3d(vec3 p) {
        return sin(p.x * 1.5 + uTime * 0.4)
             * sin(p.y * 1.8 + uTime * 0.3)
             * sin(p.z * 1.3 + uTime * 0.5)
             + sin(p.x * 3.0 - uTime * 0.6) * 0.3
             + sin(p.y * 4.0 + uTime * 0.8) * 0.15;
      }

      void main() {
        vec3 pos = position;
        vec3 norm = normal;

        float n = noise3d(pos * 1.2) * 0.25;
        n += noise3d(pos * 2.5 + uTime * 0.3) * 0.12;
        n += noise3d(pos * 5.0 - uTime * 0.2) * 0.06;

        float mx = uMouse.x * 0.15;
        float my = uMouse.y * 0.15;
        n += (norm.x * mx + norm.y * my) * 0.2;

        pos += norm * n;
        vDisplacement = n;

        vNormal = normalize(normalMatrix * norm);
        vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `

    const blobFrag = `
      uniform float uTime;
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

        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(vNormal, halfDir), 0.0), 60.0);

        float rim = fresnel * 0.8;
        vec3 color = baseColor * 0.6 + baseColor * rim + vec3(1.0) * spec * 0.4;

        float iri = sin(vDisplacement * 20.0 + uTime) * 0.5 + 0.5;
        color += uColor3 * iri * fresnel * 0.15;

        float alpha = 0.85 + fresnel * 0.15;
        gl_FragColor = vec4(color, alpha);
      }
    `

    const blobGeo = new THREE.SphereGeometry(1.3, 128, 128)
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
      opacity: 0.06,
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

    // Mouse (smoothed, global)
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    function onMouseMove(e: MouseEvent) {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove)

    // Scroll-driven position
    let scrollY = 0
    function onScroll() {
      scrollY = window.scrollY
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    let frameId: number
    const t0 = performance.now()
    const pageH = () => document.documentElement.scrollHeight - window.innerHeight

    function animate() {
      frameId = requestAnimationFrame(animate)
      const t = (performance.now() - t0) / 1000

      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04

      // Scroll progress 0→1
      const sp = Math.min(scrollY / (pageH() || 1), 1)

      if (!reducedRef.current) {
        blobUniforms.uTime.value = t
        blobUniforms.uMouse.value.set(mouse.x, mouse.y)
        blobUniforms.uScroll.value = sp

        blob.rotation.y += 0.002 + mouse.x * 0.001
        blob.rotation.x += 0.001 + mouse.y * 0.001

        // Move blob position based on scroll — drifts around the viewport
        blob.position.x = Math.sin(sp * Math.PI * 2) * 1.2
        blob.position.y = Math.cos(sp * Math.PI * 1.5) * 0.8 - sp * 0.5

        glowMesh.position.copy(blob.position)
        glowMesh.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05)
        glowMat.opacity = 0.05 + Math.sin(t * 1.5) * 0.02
      }

      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      const nw = parent.clientWidth || window.innerWidth
      const nh = parent.clientHeight || window.innerHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
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
    <div className="blob-scene-fixed" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
