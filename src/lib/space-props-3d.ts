import * as THREE from "three"

import { getBlobPalette, type BlobPaletteId } from "@/data/blob-palettes"

type Disposable = { dispose: () => void }

function track(
  disposables: Disposable[],
  ...items: (Disposable | THREE.Material | THREE.BufferGeometry | THREE.Texture)[]
) {
  for (const item of items) disposables.push(item)
}

function mulberry(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Uneven asteroid body — lumpy silhouette + a few bowls.
 * Surface grit is bump-only (no vertex displacement map — that shredded the mesh).
 */
function displaceRock(
  geo: THREE.BufferGeometry,
  amount: number,
  seed: number
) {
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  const nrm = new THREE.Vector3()
  const rand = mulberry(seed)
  const n3 = (x: number, y: number, z: number, f: number) =>
    Math.sin(x * f + seed * 0.17) *
      Math.cos(y * f * 0.91 + seed * 0.31) *
      Math.sin(z * f * 1.07 + seed * 0.11)

  const stretch = [
    0.82 + rand() * 0.32,
    0.78 + rand() * 0.38,
    0.84 + rand() * 0.28,
  ] as const

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    nrm.copy(v).normalize()
    const nx = nrm.x
    const ny = nrm.y
    const nz = nrm.z
    const coarse = n3(nx, ny, nz, 1.4) * amount
    const mid = n3(nx + 1.1, ny - 0.7, nz + 0.4, 2.8) * amount * 0.28
    const lobe =
      1 +
      Math.abs(n3(nx, ny, nz, 0.9)) * 0.22 +
      Math.abs(n3(ny, nz, nx, 1.25)) * 0.14
    const radial = lobe + coarse * 0.55 + mid
    v.copy(nrm).multiplyScalar(radial)
    v.x *= stretch[0]
    v.y *= stretch[1]
    v.z *= stretch[2]
    pos.setXYZ(i, v.x, v.y, v.z)
  }

  for (let c = 0; c < 7; c++) {
    const center = new THREE.Vector3(
      rand() * 2 - 1,
      rand() * 2 - 1,
      rand() * 2 - 1
    ).normalize()
    const radius = 0.18 + rand() * 0.28
    const depth = amount * (0.14 + rand() * 0.18)
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      nrm.copy(v).normalize()
      const d = nrm.distanceTo(center)
      if (d >= radius) continue
      const t = d / radius
      const bowl = Math.pow(1 - t, 2)
      v.addScaledVector(nrm, -bowl * depth)
      pos.setXYZ(i, v.x, v.y, v.z)
    }
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
}

/** Shared NASA moon maps — sphere UVs + strong bump (not canvas noise). */
function createRockTextureBank(disposables: Disposable[]) {
  const color = new THREE.TextureLoader().load("/moon/color-1k.jpg")
  color.colorSpace = THREE.SRGBColorSpace
  color.wrapS = color.wrapT = THREE.RepeatWrapping
  color.anisotropy = 8
  const bump = new THREE.TextureLoader().load("/moon/displacement-1k.jpg")
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping
  bump.anisotropy = 8
  track(disposables, color, bump)
  return { color, bump }
}

function applyRockMaps(
  mat: THREE.MeshStandardMaterial,
  bank: { color: THREE.Texture; bump: THREE.Texture },
  seed: number
) {
  const uvRepeat = 1.15 + (seed % 5) * 0.06
  const ox = (seed * 0.17) % 1
  const oy = (seed * 0.11) % 1

  const map = bank.color.clone()
  map.needsUpdate = true
  map.repeat.set(uvRepeat, uvRepeat * 0.95)
  map.offset.set(ox, oy)

  const bumpMap = bank.bump.clone()
  bumpMap.needsUpdate = true
  bumpMap.repeat.set(uvRepeat * 1.08, uvRepeat)
  bumpMap.offset.set(ox * 0.65, oy * 0.65)

  mat.map = map
  mat.bumpMap = bumpMap
  mat.bumpScale = 0.32
  mat.needsUpdate = true
}

function makeSunAlbedo(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const img = ctx.createImageData(size, size)
  const cx = size * 0.5
  const cy = size * 0.5
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx
      const ny = (y - cy) / cy
      const r = Math.hypot(nx, ny)
      const a = Math.atan2(ny, nx)
      const swirl =
        Math.sin(a * 3.2 + r * 8.5) * 0.28 +
        Math.sin(a * 7.1 - r * 14) * 0.18 +
        Math.sin((nx * 9 + ny * 6) * 1.4) * 0.12
      const core = Math.max(0, 1 - r * 0.92)
      const heat = Math.min(1, core * 1.15 + swirl * 0.35)
      const o = (y * size + x) * 4
      img.data[o] = Math.floor(255 * Math.min(1, 0.55 + heat * 0.5))
      img.data[o + 1] = Math.floor(255 * Math.min(1, 0.18 + heat * 0.55))
      img.data[o + 2] = Math.floor(255 * Math.min(1, 0.02 + heat * 0.12))
      img.data[o + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  // Soft limb darkening overlay
  const g = ctx.createRadialGradient(cx, cy, size * 0.12, cx, cy, size * 0.52)
  g.addColorStop(0, "rgba(255, 240, 120, 0)")
  g.addColorStop(0.55, "rgba(255, 80, 20, 0.12)")
  g.addColorStop(1, "rgba(60, 10, 40, 0.55)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function makeRingAlbedo(
  stops: [number, string][]
): THREE.CanvasTexture {
  const w = 512
  const h = 64
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const g = ctx.createLinearGradient(0, 0, w, 0)
  for (const [t, c] of stops) g.addColorStop(t, c)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // Fine radial banding
  ctx.globalCompositeOperation = "multiply"
  for (let i = 0; i < 28; i++) {
    const x = (i / 28) * w
    ctx.fillStyle = i % 2 === 0 ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.08)"
    ctx.fillRect(x, 0, w / 56, h)
  }
  ctx.globalCompositeOperation = "source-over"
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.anisotropy = 4
  return tex
}

function makeHaloSprite(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.48
  )
  g.addColorStop(0, "rgba(255, 200, 80, 0.55)")
  g.addColorStop(0.35, "rgba(255, 90, 40, 0.22)")
  g.addColorStop(0.65, "rgba(120, 40, 160, 0.12)")
  g.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

type OrbitMoon = {
  mesh: THREE.Mesh
  radius: number
  speed: number
  phase: number
  tilt: number
}

function buildRingedSystem(disposables: Disposable[]): {
  group: THREE.Group
  updateLocal: (t: number) => void
  setPalette: (id: BlobPaletteId) => void
} {
  const root = new THREE.Group()
  root.name = "prop-ringed-system"

  const sunTex = makeSunAlbedo()
  const haloTex = makeHaloSprite()
  track(disposables, sunTex, haloTex)

  const coreMat = new THREE.MeshStandardMaterial({
    map: sunTex,
    emissiveMap: sunTex,
    emissive: new THREE.Color(0xff6a20),
    emissiveIntensity: 1.35,
    roughness: 0.55,
    metalness: 0.05,
  })
  track(disposables, coreMat)
  const coreGeo = new THREE.SphereGeometry(0.22, 48, 40)
  track(disposables, coreGeo)
  const core = new THREE.Mesh(coreGeo, coreMat)
  root.add(core)

  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.9,
  })
  track(disposables, haloMat)
  const halo = new THREE.Sprite(haloMat)
  halo.scale.set(0.95, 0.95, 1)
  root.add(halo)

  const glow = new THREE.PointLight(0xff7a28, 0.55, 1.8, 2)
  glow.position.set(0, 0, 0.05)
  root.add(glow)

  const ringPivot = new THREE.Group()
  ringPivot.rotation.x = THREE.MathUtils.degToRad(62)
  ringPivot.rotation.z = THREE.MathUtils.degToRad(-18)
  root.add(ringPivot)

  const ringSpecs: {
    inner: number
    outer: number
    opacity: number
    stops: [number, string][]
    spin: number
  }[] = [
    {
      inner: 0.32,
      outer: 0.46,
      opacity: 0.72,
      spin: 0.08,
      stops: [
        [0, "rgba(255, 200, 40, 0.95)"],
        [0.45, "rgba(255, 90, 30, 0.9)"],
        [1, "rgba(220, 40, 90, 0.55)"],
      ],
    },
    {
      inner: 0.5,
      outer: 0.68,
      opacity: 0.62,
      spin: -0.055,
      stops: [
        [0, "rgba(255, 120, 40, 0.85)"],
        [0.4, "rgba(255, 50, 120, 0.8)"],
        [0.75, "rgba(160, 40, 200, 0.7)"],
        [1, "rgba(60, 100, 255, 0.55)"],
      ],
    },
    {
      inner: 0.74,
      outer: 0.92,
      opacity: 0.48,
      spin: 0.035,
      stops: [
        [0, "rgba(200, 40, 160, 0.65)"],
        [0.5, "rgba(80, 60, 220, 0.7)"],
        [1, "rgba(40, 180, 255, 0.75)"],
      ],
    },
  ]

  const ringMeshes: { mesh: THREE.Mesh; spin: number }[] = []
  for (const spec of ringSpecs) {
    const tex = makeRingAlbedo(spec.stops)
    track(disposables, tex)
    const geo = new THREE.RingGeometry(spec.inner, spec.outer, 96, 1)
    // Fix UVs so gradient runs radially
    const uv = geo.attributes.uv
    const pos = geo.attributes.position
    for (let i = 0; i < uv.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const r = Math.hypot(x, y)
      const t =
        (r - spec.inner) / Math.max(1e-4, spec.outer - spec.inner)
      uv.setXY(i, Math.max(0, Math.min(1, t)), 0.5)
    }
    uv.needsUpdate = true
    track(disposables, geo)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: spec.opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    track(disposables, mat)
    const mesh = new THREE.Mesh(geo, mat)
    ringPivot.add(mesh)
    ringMeshes.push({ mesh, spin: spec.spin })
  }

  const moons: OrbitMoon[] = []
  const moonColors = [0xffe08a, 0xff6a4a, 0xc45cff, 0x5ad0ff]
  const moonSpecs = [
    { radius: 0.39, speed: 0.55, phase: 0.2, scale: 0.028, tilt: 0.08 },
    { radius: 0.58, speed: 0.38, phase: 1.6, scale: 0.034, tilt: -0.05 },
    { radius: 0.72, speed: 0.28, phase: 3.1, scale: 0.022, tilt: 0.12 },
    { radius: 0.84, speed: 0.2, phase: 4.4, scale: 0.03, tilt: -0.1 },
  ]
  for (let i = 0; i < moonSpecs.length; i++) {
    const spec = moonSpecs[i]!
    const mat = new THREE.MeshStandardMaterial({
      color: moonColors[i]!,
      emissive: moonColors[i]!,
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.1,
    })
    track(disposables, mat)
    const geo = new THREE.SphereGeometry(1, 20, 16)
    track(disposables, geo)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.scale.setScalar(spec.scale)
    ringPivot.add(mesh)
    moons.push({
      mesh,
      radius: spec.radius,
      speed: spec.speed,
      phase: spec.phase,
      tilt: spec.tilt,
    })
  }

  function updateLocal(t: number) {
    core.rotation.y = t * 0.18
    core.rotation.z = Math.sin(t * 0.2) * 0.04
    const pulse = 0.88 + Math.sin(t * 1.4) * 0.08
    halo.scale.setScalar(0.95 * pulse)
    glow.intensity = 0.48 + Math.sin(t * 1.2) * 0.12
    for (const r of ringMeshes) {
      r.mesh.rotation.z += r.spin * 0.016
    }
    for (const m of moons) {
      const a = t * m.speed + m.phase
      m.mesh.position.set(
        Math.cos(a) * m.radius,
        Math.sin(a) * m.radius,
        Math.sin(a * 2) * m.tilt * 0.08
      )
      m.mesh.rotation.y = a
    }
  }

  function setPalette(id: BlobPaletteId) {
    const pal = getBlobPalette(id)
    coreMat.emissive.setHex(pal.blob.light)
    glow.color.setHex(pal.blob.glow)
    haloMat.color.setHex(pal.blob.color3)
    for (const r of ringMeshes) {
      const mat = r.mesh.material as THREE.MeshBasicMaterial
      mat.color.setHex(pal.blob.color1)
    }
    moons.forEach((m, i) => {
      const hex = i % 2 === 0 ? pal.blob.color1 : pal.blob.color3
      const mat = m.mesh.material as THREE.MeshStandardMaterial
      mat.color.setHex(hex)
      mat.emissive.setHex(hex)
    })
  }

  return { group: root, updateLocal, setPalette }
}

/**
 * Illustration cutout — the swimming EVA (visor / backpack 3/4).
 * Violet pixels follow the site palette.
 */
function buildAstronautRelief(disposables: Disposable[]): {
  group: THREE.Group
  setPalette: (id: BlobPaletteId) => void
  fade: (target: number) => void
} {
  const root = new THREE.Group()
  root.name = "prop-astronaut"
  const accent = {
    value: new THREE.Color(getBlobPalette("ice-fire").blob.color1),
  }

  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
    premultipliedAlpha: true,
  })
  mat.customProgramCacheKey = () => "astro-png-edge-v4"
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uAccent = accent
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uAccent;
vec3 astroRgb2Hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 astroHsv2Rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}`
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
{
  vec3 c = diffuseColor.rgb;
  float a = diffuseColor.a;
#ifdef USE_MAP
  vec2 texel = vec2(1.0 / 780.0, 1.0 / 796.0);
  float aBlur =
    a +
    texture2D(map, vMapUv + vec2(texel.x, 0.0)).a +
    texture2D(map, vMapUv - vec2(texel.x, 0.0)).a +
    texture2D(map, vMapUv + vec2(0.0, texel.y)).a +
    texture2D(map, vMapUv - vec2(0.0, texel.y)).a;
  aBlur *= 0.2;
  a = min(a, aBlur);
#endif
  a = smoothstep(0.1, 0.58, a);
  float interior = smoothstep(0.78, 0.96, a);
  vec3 hsv = astroRgb2Hsv(max(c, vec3(0.0)));
  vec3 acc = astroRgb2Hsv(uAccent);
  float hueDist = min(abs(hsv.x - 0.75), 1.0 - abs(hsv.x - 0.75));
  float hueW = 1.0 - smoothstep(0.06, 0.13, hueDist);
  float satW = smoothstep(0.07, 0.2, hsv.y);
  float valW = smoothstep(0.02, 0.1, hsv.z);
  float w = clamp(hueW * satW * valW * interior, 0.0, 1.0);
  vec3 tinted = astroHsv2Rgb(vec3(acc.x, mix(hsv.y, acc.y, 0.28), hsv.z));
  c = mix(c, tinted, w);
  float rim = 1.0 - smoothstep(0.32, 0.88, a);
  c = mix(c, vec3(0.0), rim * 0.65);
  diffuseColor.rgb = c * a;
  diffuseColor.a = a;
}`
      )
  }
  track(disposables, mat)

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat)
  mesh.name = "prop-astronaut-card"
  mesh.renderOrder = 3
  root.add(mesh)
  track(disposables, mesh.geometry)

  const loader = new THREE.TextureLoader()
  loader.load("/space/astronaut.png", (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    tex.premultiplyAlpha = true
    tex.needsUpdate = true
    track(disposables, tex)

    const img = tex.image as { width: number; height: number }
    const aspect = img.height / Math.max(img.width, 1)
    mesh.geometry.dispose()
    const geo = new THREE.PlaneGeometry(1, aspect)
    mesh.geometry = geo
    track(disposables, geo)

    mat.map = tex
    mat.depthWrite = false
    mat.needsUpdate = true
    textureReady = true
  })

  let textureReady = false

  function setPalette(id: BlobPaletteId) {
    accent.value.setHex(getBlobPalette(id).blob.color1)
  }

  /** Ease opacity up once the PNG is in — no pop on slow networks. */
  function fade(target: number) {
    const goal = textureReady ? target : 0
    mat.opacity += (goal - mat.opacity) * 0.08
    if (Math.abs(goal - mat.opacity) < 0.002) mat.opacity = goal
  }

  return { group: root, setPalette, fade }
}

/** Section tops in scroll px (measured from the DOM by the scene). */
export interface SectionScrolls {
  work: number
  projects: number
  skills: number
  experience: number
  about: number
  contact: number
  /** Last scrollable px */
  max: number
}

export interface PropsFrame {
  /** Seconds since mount */
  t: number
  /** Seconds since the last frame */
  dt: number
  scrollY: number
  /** Viewport size in CSS px */
  vw: number
  vh: number
  mouse: { x: number; y: number }
  /** 0..1 smoothed scroll speed */
  velocity: number
  /** Signed px scrolled since the last frame */
  scrollDelta: number
  sections: SectionScrolls
  /** 0 → 1 entrance progress (eased) */
  intro: number
}

/** World-space pose. z is depth (bigger = closer to the camera). */
interface Pose {
  x: number
  y: number
  z: number
  s: number
}

interface Layout {
  astro: Pose
  planet: Pose
  rocks: [Pose, Pose, Pose]
}

type SectionId = "hero" | "work" | "projects" | "skills" | "experience" | "about" | "contact"

const CAMERA_Z = 4.35
const smoothstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

/**
 * The hero cast — astronaut, ringed planet, three asteroids — stays with the
 * reader through the whole page.
 *
 * Every section has its own composition (props placed in that section's
 * open space, at different depths). While you read a section the cast holds
 * its composition and drifts slowly upward (parallax: near props drift more).
 * Between sections the cast travels to the next composition, scrubbed by the
 * scroll position. On top, every prop follows its target through a soft
 * spring — so motion has weight and keeps easing for a moment after the
 * scroll stops — banks into its direction of travel, and bobs when idle.
 */
export function createSpaceProps(disposables: Disposable[]): {
  group: THREE.Group
  update: (frame: PropsFrame) => boolean
  setPalette: (id: BlobPaletteId) => void
} {
  const group = new THREE.Group()
  group.name = "space-props"

  const astroBuilt = buildAstronautRelief(disposables)
  const astro = astroBuilt.group
  group.add(astro)

  const ringed = buildRingedSystem(disposables)
  const system = ringed.group
  group.add(system)

  const rockBank = createRockTextureBank(disposables)
  const rockSpecs = [
    { seed: 11, scale: 0.04, stretch: [1.28, 0.78, 1.08], amount: 0.32 },
    { seed: 29, scale: 0.022, stretch: [0.82, 1.22, 0.9], amount: 0.28 },
    { seed: 47, scale: 0.02, stretch: [1.14, 0.88, 1.16], amount: 0.26 },
  ] as const
  const rocks = rockSpecs.map((spec) => {
    const geo = new THREE.SphereGeometry(1, 64, 48)
    displaceRock(geo, spec.amount, spec.seed)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x9a9084,
      roughness: 0.97,
      metalness: 0.01,
    })
    applyRockMaps(mat, rockBank, spec.seed)
    track(disposables, geo, mat)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = `prop-asteroid-${spec.seed}`
    mesh.rotation.set(spec.seed * 0.1, spec.seed * 0.07, spec.seed * 0.04)
    group.add(mesh)
    return {
      mesh,
      base: new THREE.Vector3(
        spec.scale * spec.stretch[0],
        spec.scale * spec.stretch[1],
        spec.scale * spec.stretch[2]
      ),
    }
  })

  const ASTRO_BASE = 0.4
  const PLANET_BASE = 0.085

  let layouts: Record<SectionId, Layout> | null = null
  let aspectKey = 0

  /**
   * Section compositions. Authored in SCREEN terms so they hold at any depth:
   * sx -1 (left edge) .. 1 (right edge), sy -1 (bottom) .. 1 (top), z depth
   * (bigger = closer), s scale. Each sits in that section's open space.
   */
  function buildLayouts(aspect: number): Record<SectionId, Layout> {
    const tan = Math.tan(THREE.MathUtils.degToRad(18))
    const P = (sx: number, sy: number, z: number, s: number): Pose => {
      const vHalf = tan * (CAMERA_Z - z)
      return { x: sx * vHalf * aspect, y: sy * vHalf, z, s }
    }
    const hidden = (sx: number, sy: number): Pose => P(sx, sy, 2.2, 0)

    // Hero keeps the original (live-site) composition, authored in world
    // units against the prop plane at z 2.85.
    const z0 = 2.85
    const vHalf0 = tan * (CAMERA_Z - z0)
    const ex = vHalf0 * Math.max(1.25, Math.min(aspect, 2.2)) * 0.82
    const ey = vHalf0 * 0.62
    const W = (x: number, y: number, z: number, s: number): Pose => ({
      x: x * ex,
      y: y * ey,
      z,
      s,
    })

    return {
      // Astronaut left above the limb, planet top-right, rocks on the right limb
      hero: {
        astro: W(-0.86, -0.34, z0 - 0.02, 1.12),
        planet: W(0.92, 0.78, z0 - 0.22, 1.2),
        rocks: [W(0.7, -0.52, z0 - 0.02, 1.2), W(0.88, -0.34, z0 + 0.04, 0.84), hidden(1.3, 0.8)],
      },
      // Selected work: cast settles in the open space under the cards
      work: {
        astro: P(-0.76, -0.7, 2.7, 0.6),
        planet: P(0.9, 0.85, 2.4, 0.8),
        rocks: [P(0.95, -0.75, 2.6, 1.0), P(0.5, -0.86, 2.3, 0.7), P(-0.97, 0.4, 2.2, 0.5)],
      },
      // Sameward: astronaut floats up beside the tablet's top-left corner
      // The tablet owns this frame: the astronaut drifts back, small and far,
      // in the top-left gutter (clear of the tablet edge)
      projects: {
        astro: P(-0.9, 0.62, 2.35, 0.4),
        planet: P(0.92, 0.82, 2.2, 0.7),
        rocks: [P(0.93, -0.6, 2.25, 0.85), P(0.95, 0.2, 2.18, 0.55), P(-0.95, -0.75, 2.1, 0.5)],
      },
      // Capabilities: astronaut in the gap above the cards, a big asteroid
      // drifts in close on the right
      skills: {
        astro: P(0.02, 0.5, 2.6, 0.5),
        planet: P(0.95, 0.85, 2.3, 1.0),
        rocks: [P(0.92, -0.2, 3.18, 4.1), P(-0.97, -0.85, 2.4, 1.1), P(0.2, 0.9, 2.2, 0.6)],
      },
      // Experience: the planet comes close in the open space under the stats
      experience: {
        astro: P(-1.4, 0.3, 2.2, 0.38),
        planet: P(-0.72, -0.6, 2.95, 2.5),
        rocks: [P(0.97, -0.7, 2.35, 1.1), P(0.98, 0.7, 2.28, 0.8), P(-0.98, 0.9, 2.18, 0.55)],
      },
      // Profile: astronaut drifts in the open space under the stats (right)
      about: {
        astro: P(0.55, -0.6, 2.4, 0.6),
        planet: P(0.97, 0.92, 2.05, 0.5),
        rocks: [P(-0.97, -0.6, 2.0, 0.6), P(0.2, -0.8, 1.98, 0.5), P(-0.98, 0.85, 1.95, 0.3)],
      },
      // Contact: astronaut settles in the open space under the socials
      contact: {
        astro: P(-0.6, -0.68, 2.85, 0.47),
        planet: P(0.97, 0.9, 1.9, 0.35),
        rocks: [P(-0.98, 0.75, 1.8, 0.35), P(0.97, -0.8, 1.8, 0.3), hidden(-1.3, 0.8)],
      },
    }
  }

  const order: SectionId[] = ["hero", "work", "projects", "skills", "experience", "about", "contact"]

  /**
   * Hold windows in scroll px: a composition holds while its section fills
   * the screen; the cast travels in the gaps between windows.
   */
  function holds(S: SectionScrolls, vh: number): [number, number][] {
    const tops = [0, S.work, S.projects, S.skills, S.experience, S.about, S.contact, S.max + vh]
    return order.map((_, i) => {
      const top = tops[i]!
      const nextTop = tops[i + 1]!
      const start = i === 0 ? 0 : Math.min(top - vh * 0.15, S.max)
      const end = Math.min(Math.max(start, nextTop - vh * 0.85), S.max)
      return [start, end]
    })
  }

  const blendTarget = (out: Pose, a: Pose, b: Pose, k: number) => {
    out.x = a.x + (b.x - a.x) * k
    out.y = a.y + (b.y - a.y) * k
    out.z = a.z + (b.z - a.z) * k
    out.s = a.s + (b.s - a.s) * k
    return out
  }

  /** Target poses for the current scroll, plus how far through the hold we are. */
  function targetFor(
    scroll: number,
    S: SectionScrolls,
    vh: number,
    pick: (l: Layout) => Pose,
    out: Pose
  ) {
    const L = layouts!
    const H = holds(S, vh)
    for (let i = 0; i < order.length; i++) {
      const [start, end] = H[i]!
      const here = pick(L[order[i]!])
      if (scroll <= end || i === order.length - 1) {
        if (scroll >= start || i === 0) {
          // Inside a hold: slow upward drift (parallax) across the section
          const span = Math.max(1, end - start)
          const p = Math.min(1, Math.max(0, (scroll - start) / span))
          blendTarget(out, here, here, 0)
          // Hero starts exactly on its composition (no offset on first paint)
          const drift = i === 0 ? p * 0.5 : p - 0.5
          out.y += drift * 0.22 * (here.z / 2.85)
          return out
        }
        // Travelling from the previous composition into this one
        const prev = pick(L[order[i - 1]!])
        const prevEnd = H[i - 1]![1]
        const k = smoothstep((scroll - prevEnd) / Math.max(1, start - prevEnd))
        blendTarget(out, prev, here, k)
        out.y += (0.5 * (1 - k) - 0.5 * k) * 0.22 * (out.z / 2.85)
        return out
      }
    }
    return out
  }

  // Live (spring-smoothed) state per prop
  type Live = { p: THREE.Vector3; v: THREE.Vector3; s: number; roll: number }
  const mkLive = (): Live => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), s: 0, roll: 0 })
  const astroLive = mkLive()
  const planetLive = mkLive()
  const rockLive = rocks.map(mkLive)
  let primed = false

  const target: Pose = { x: 0, y: 0, z: 0, s: 0 }
  let spinBoost = 0

  /**
   * Critically-damped spring toward the target — weight + overshoot-free
   * settle. `stiffness` ~ how fast it catches up (1/s).
   */
  function follow(live: Live, tgt: Pose, dt: number, stiffness: number) {
    if (!primed) {
      live.p.set(tgt.x, tgt.y, tgt.z)
      live.s = tgt.s
      return
    }
    const w = stiffness
    const steps = Math.max(1, Math.ceil(dt / (1 / 120)))
    const h = dt / steps
    for (let i = 0; i < steps; i++) {
      const ax = w * w * (tgt.x - live.p.x) - 2 * w * live.v.x
      const ay = w * w * (tgt.y - live.p.y) - 2 * w * live.v.y
      const az = w * w * (tgt.z - live.p.z) - 2 * w * live.v.z
      live.v.x += ax * h
      live.v.y += ay * h
      live.v.z += az * h
      live.p.x += live.v.x * h
      live.p.y += live.v.y * h
      live.p.z += live.v.z * h
    }
    live.s += (tgt.s - live.s) * (1 - Math.exp(-dt * stiffness * 0.9))
    // Bank into the direction of travel
    const bankTarget = THREE.MathUtils.clamp(-live.v.x * 0.35, -0.5, 0.5)
    live.roll += (bankTarget - live.roll) * (1 - Math.exp(-dt * 6))
  }

  function visibleAt(live: Live, radius: number, aspect: number) {
    if (live.s < 0.02) return false
    const d = CAMERA_Z - live.p.z
    const vHalf = Math.tan(THREE.MathUtils.degToRad(18)) * d
    const hHalf = vHalf * aspect
    const r = radius * live.s
    return Math.abs(live.p.x) - r < hHalf * 1.05 && Math.abs(live.p.y) - r < vHalf * 1.05
  }

  /** Returns true when at least one prop is on screen. */
  function update(frame: PropsFrame) {
    const { t, dt, scrollY, vw, vh, mouse, velocity, scrollDelta, sections, intro } = frame
    const aspect = vw / Math.max(vh, 1)
    if (!layouts || Math.abs(aspect - aspectKey) > 0.01) {
      layouts = buildLayouts(aspect)
      aspectKey = aspect
    }
    const vel = Math.min(1, velocity)
    spinBoost += (Math.min(Math.abs(scrollDelta) * 0.0009, 0.05) - spinBoost) * 0.2
    const introDrop = (1 - intro) * 0.18
    let anyVisible = false

    // —— Astronaut ——
    targetFor(scrollY, sections, vh, (l) => l.astro, target)
    target.y -= introDrop
    follow(astroLive, target, dt, 4.2)
    const bobA = Math.sin(t * 0.7) * 0.025
    astro.position.set(
      astroLive.p.x + Math.sin(t * 0.38 + 1) * 0.02 + mouse.x * 0.03,
      astroLive.p.y + Math.cos(t * 0.45) * 0.022 + bobA + mouse.y * 0.02,
      astroLive.p.z
    )
    astro.scale.setScalar(ASTRO_BASE * Math.max(astroLive.s, 0.001))
    astro.rotation.set(
      0.04 + Math.cos(t * 0.24) * 0.03,
      0.08 + Math.sin(t * 0.28) * 0.05 + mouse.x * 0.08,
      0.12 + Math.sin(t * 0.38) * 0.04 + astroLive.roll
    )
    astro.visible = visibleAt(astroLive, ASTRO_BASE * 0.75, aspect)
    astroBuilt.fade(astro.visible ? 1 : 0)
    anyVisible ||= astro.visible

    // —— Planet ——
    targetFor(scrollY, sections, vh, (l) => l.planet, target)
    target.y -= introDrop
    follow(planetLive, target, dt, 3.2)
    system.position.set(
      planetLive.p.x + Math.cos(t * 0.32) * 0.018 + mouse.x * 0.02,
      planetLive.p.y + Math.sin(t * 0.28) * 0.016 + mouse.y * 0.014,
      planetLive.p.z
    )
    system.scale.setScalar(PLANET_BASE * Math.max(planetLive.s, 0.001))
    // Ring plane tilts with the page — reads as a real 3D body
    system.rotation.set(
      Math.sin(scrollY * 0.0008) * 0.32,
      t * 0.05,
      Math.sin(t * 0.22) * 0.04 + planetLive.roll * 0.6
    )
    system.visible = visibleAt(planetLive, PLANET_BASE * 1.2, aspect)
    if (system.visible) ringed.updateLocal(t)
    anyVisible ||= system.visible

    // —— Asteroids ——
    rocks.forEach((rock, i) => {
      const live = rockLive[i]!
      targetFor(scrollY, sections, vh, (l) => l.rocks[i]!, target)
      target.y -= introDrop
      follow(live, target, dt, 3.6 + i * 0.5)
      const phase = i * 1.7
      rock.mesh.position.set(
        live.p.x + Math.sin(t * (0.25 + i * 0.06) + phase) * 0.016 - mouse.x * 0.016,
        live.p.y + Math.cos(t * (0.22 + i * 0.05) + phase) * 0.014 + mouse.y * 0.012,
        live.p.z
      )
      rock.mesh.scale.copy(rock.base).multiplyScalar(Math.max(live.s, 0.001))
      rock.mesh.rotation.x += 0.0007 + i * 0.00025 + spinBoost + vel * 0.002
      rock.mesh.rotation.y += 0.001 + i * 0.0002 + spinBoost * 1.3 + vel * 0.0025
      rock.mesh.rotation.z += 0.0004 + live.roll * 0.01
      rock.mesh.visible = visibleAt(live, rock.base.x * 1.4, aspect)
      anyVisible ||= rock.mesh.visible
    })

    primed = true
    // Keep drawing while springs are still settling
    const settling =
      astroLive.v.lengthSq() + planetLive.v.lengthSq() > 1e-7 ||
      rockLive.some((l) => l.v.lengthSq() > 1e-7)
    return anyVisible || settling
  }

  function setPalette(id: BlobPaletteId) {
    astroBuilt.setPalette(id)
    ringed.setPalette(id)
  }

  return { group, update, setPalette }
}
