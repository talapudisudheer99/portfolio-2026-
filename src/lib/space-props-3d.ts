import * as THREE from "three"

import { getBlobPalette, type BlobPaletteId } from "@/data/blob-palettes"
import type { SectionMoodId } from "@/lib/motion"

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
  const color = new THREE.TextureLoader().load("/moon/color-2k.jpg")
  color.colorSpace = THREE.SRGBColorSpace
  color.wrapS = color.wrapT = THREE.RepeatWrapping
  color.anisotropy = 8
  const bump = new THREE.TextureLoader().load("/moon/displacement-2k.jpg")
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
} {
  const root = new THREE.Group()
  root.name = "prop-astronaut"
  const accent = {
    value: new THREE.Color(getBlobPalette("molten-metal").blob.color1),
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
    mat.opacity = 1
    mat.depthWrite = false
    mat.needsUpdate = true
  })

  function setPalette(id: BlobPaletteId) {
    accent.value.setHex(getBlobPalette(id).blob.color1)
  }

  return { group: root, setPalette }
}

/** Realistic-ish PBR props — same scene/lights as the moon (no second canvas). */
export function createSpaceProps(
  disposables: Disposable[],
  options: { aspect: number } = { aspect: 16 / 10 }
): {
  group: THREE.Group
  update: (
    t: number,
    scroll: number,
    mouse: { x: number; y: number },
    section: SectionMoodId,
    velocity: number
  ) => void
  setPalette: (id: BlobPaletteId) => void
} {
  const group = new THREE.Group()
  group.name = "space-props"

  // Far margins — clear of hero copy + post-portal right companion
  const camZ = 4.35
  const fovRad = THREE.MathUtils.degToRad(36)
  const propZ = 2.85
  const dist = camZ - propZ
  const vHalf = Math.tan(fovRad * 0.5) * dist
  const hHalf = vHalf * Math.max(1.25, Math.min(options.aspect, 2.2))
  const edgeX = hHalf * 0.82
  const edgeY = vHalf * 0.62

  // —— Astronaut — left, above the moon, approaching the limb ——
  const astroBuilt = buildAstronautRelief(disposables)
  const astro = astroBuilt.group
  astro.scale.setScalar(0.4)
  astro.position.set(-edgeX * 0.86, -edgeY * 0.34, propZ - 0.02)
  astro.rotation.set(0.04, 0.08, 0.12)
  group.add(astro)

  // —— Asteroids — hero: one on the right limb + one speck (third parked) ——
  const rocks: THREE.Mesh[] = []
  const rockBank = createRockTextureBank(disposables)
  const rockSpecs = [
    {
      seed: 11,
      scale: 0.04,
      stretch: [1.28, 0.78, 1.08] as const,
      pos: [edgeX * 0.7, -edgeY * 0.52, propZ - 0.02] as const,
      amount: 0.32,
    },
    {
      seed: 29,
      scale: 0.022,
      stretch: [0.82, 1.22, 0.9] as const,
      pos: [edgeX * 0.88, -edgeY * 0.34, propZ + 0.04] as const,
      amount: 0.28,
    },
    {
      seed: 47,
      scale: 0.02,
      stretch: [1.14, 0.88, 1.16] as const,
      pos: [edgeX * 1.2, edgeY * 0.95, propZ] as const,
      amount: 0.26,
    },
  ]

  for (const spec of rockSpecs) {
    // Sphere UVs match moon equirect maps; high segment count avoids faceting
    const geo = new THREE.SphereGeometry(1, 96, 72)
    displaceRock(geo, spec.amount, spec.seed)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x9a9084,
      roughness: 0.97,
      metalness: 0.01,
      flatShading: false,
    })
    applyRockMaps(mat, rockBank, spec.seed)
    track(disposables, geo, mat)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = `prop-asteroid-${spec.seed}`
    mesh.castShadow = false
    mesh.receiveShadow = false
    mesh.scale.set(
      spec.scale * spec.stretch[0],
      spec.scale * spec.stretch[1],
      spec.scale * spec.stretch[2]
    )
    mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2])
    mesh.rotation.set(spec.seed * 0.1, spec.seed * 0.07, spec.seed * 0.04)
    group.add(mesh)
    rocks.push(mesh)
  }

  // —— Ringed system (small accent — 40% of prior scale) ——
  const ringed = buildRingedSystem(disposables)
  const system = ringed.group
  system.scale.setScalar(0.085)
  system.position.set(edgeX * 0.92, edgeY * 0.78, propZ - 0.22)
  group.add(system)

  const astroHome = astro.position.clone()
  const systemHome = system.position.clone()
  const rockHomes = rocks.map((r) => r.position.clone())
  const rockScale0 = rocks.map((r) => r.scale.clone())
  const astroScale0 = astro.scale.x
  const systemScale0 = system.scale.x

  const astroPos = astroHome.clone()
  const systemPos = systemHome.clone()
  const rockPos = rockHomes.map((p) => p.clone())
  let astroS = astroScale0
  let systemS = systemScale0

  type HeroFocus = "astro" | "rocks" | "system" | "balanced"
  type Pose = { x: number; y: number; z: number; scale: number }

  /** Section roles — one hero prop, others support (clear of right companion + copy). */
  function sectionLayout(section: SectionMoodId): {
    astro: Pose
    rocks: Pose[]
    system: Pose
    hero: HeroFocus
    float: number
  } {
    const ex = edgeX
    const ey = edgeY
    const z = propZ
    switch (section) {
      case "projects":
        // Sameward — full figure in the left gutter, not a helmet fill
        return {
          hero: "astro",
          float: 0.32,
          astro: { x: -ex * 0.88, y: -ey * 0.38, z: 3.12, scale: 1.46 },
          system: { x: ex * 1.08, y: ey * 0.92, z: 2.2, scale: 0.7 },
          rocks: [
            { x: ex * 1.1, y: -ey * 0.72, z: 2.25, scale: 0.85 },
            { x: ex * 1.15, y: ey * 0.25, z: 2.18, scale: 0.55 },
            { x: ex * 1.22, y: ey * 0.95, z: 2.1, scale: 0 },
          ],
        }
      case "skills":
        // Capabilities — one asteroid in the right gutter (readable, not a wall)
        return {
          hero: "rocks",
          float: 0.38,
          astro: { x: -ex * 0.82, y: -ey * 0.82, z: 2.55, scale: 0.7 },
          system: { x: ex * 0.95, y: ey * 0.82, z: 2.35, scale: 1.38 },
          rocks: [
            { x: ex * 0.9, y: -ey * 0.28, z: 3.18, scale: 4.32 },
            { x: -ex * 1.05, y: ey * 0.72, z: 2.4, scale: 1.38 },
            { x: ex * 1.12, y: ey * 0.45, z: 2.28, scale: 0.84 },
          ],
        }
      case "experience":
        // Experience — system as a corner accent, rings stay off the timeline
        return {
          hero: "system",
          float: 0.36,
          astro: { x: -ex * 1.12, y: ey * 0.35, z: 2.2, scale: 0.38 },
          system: { x: ex * 0.92, y: ey * 0.7, z: 3.08, scale: 3.12 },
          rocks: [
            { x: -ex * 1.08, y: -ey * 0.75, z: 2.35, scale: 1.1 },
            { x: ex * 1.12, y: -ey * 0.78, z: 2.28, scale: 0.8 },
            { x: -ex * 1.15, y: ey * 0.85, z: 2.18, scale: 0.55 },
          ],
        }
      case "about":
        // Profile — props recede; moon fills the floor
        return {
          hero: "balanced",
          float: 0.3,
          astro: { x: -ex * 1.12, y: -ey * 0.55, z: 2.08, scale: 0.42 },
          system: { x: ex * 1.05, y: ey * 0.88, z: 2.05, scale: 0.48 },
          rocks: [
            { x: -ex * 0.95, y: -ey * 0.92, z: 2.0, scale: 0.32 },
            { x: ex * 0.92, y: -ey * 0.78, z: 1.98, scale: 0.3 },
            { x: -ex * 1.05, y: ey * 0.85, z: 1.95, scale: 0.26 },
          ],
        }
      case "contact":
        return {
          hero: "balanced",
          float: 0.22,
          astro: { x: -ex * 0.7, y: ey * 0.55, z: 1.85, scale: 0.28 },
          system: { x: ex * 0.88, y: ey * 0.9, z: 1.8, scale: 0.32 },
          rocks: [
            { x: -ex * 0.55, y: ey * 0.82, z: 1.78, scale: 0.22 },
            { x: ex * 0.5, y: ey * 0.62, z: 1.75, scale: 0.2 },
            { x: -ex * 0.35, y: ey * 1.05, z: 1.72, scale: 0.18 },
          ],
        }
      case "hero":
      default:
        return {
          hero: "balanced",
          float: 0.4,
          astro: { x: -ex * 0.86, y: -ey * 0.34, z: z - 0.02, scale: 1.12 },
          system: { x: ex * 0.92, y: ey * 0.78, z: z - 0.22, scale: 1.2 },
          rocks: [
            { x: ex * 0.7, y: -ey * 0.52, z: z - 0.02, scale: 1.2 },
            { x: ex * 0.88, y: -ey * 0.34, z: z + 0.04, scale: 0.84 },
            { x: ex * 1.2, y: ey * 0.95, z, scale: 0 },
          ],
        }
    }
  }

  function heroBoost(hero: HeroFocus, which: HeroFocus) {
    if (hero === "balanced") return 1
    if (hero === which) return 1
    return 0.42
  }

  function update(
    t: number,
    _scroll: number,
    mouse: { x: number; y: number },
    section: SectionMoodId,
    velocity: number
  ) {
    const contactExit = section === "contact" ? 1 : 0
    const breath = 1 - contactExit * 0.55
    const vel = Math.min(1, velocity)
    const layout = sectionLayout(section)
    const floatAmp = 0.014 * layout.float * breath
    const follow = 0.055 + vel * 0.04

    // —— Astronaut ——
    const astL = layout.astro
    const astTx =
      astL.x +
      Math.sin(t * 0.38 + 1) * floatAmp * 1.1 +
      mouse.x * 0.02 * breath
    const astTy =
      astL.y +
      Math.cos(t * 0.45) * floatAmp +
      Math.sin(t * 0.7) * 0.012 * layout.float +
      mouse.y * 0.014 * breath
    const astTz = astL.z + Math.cos(t * 0.3) * 0.02
    const astTargetS =
      astroScale0 * astL.scale * heroBoost(layout.hero, "astro")

    astroPos.x += (astTx - astroPos.x) * follow
    astroPos.y += (astTy - astroPos.y) * follow
    astroPos.z += (astTz - astroPos.z) * (follow + 0.015)
    astroS += (astTargetS - astroS) * 0.07
    astro.position.copy(astroPos)
    astro.scale.setScalar(astroS)
    astro.rotation.y = 0.08 + Math.sin(t * 0.28) * 0.03
    astro.rotation.z = 0.12 + Math.sin(t * 0.38) * 0.02
    astro.rotation.x = 0.04 + Math.cos(t * 0.24) * 0.02

    // —— Ringed system ——
    const sysL = layout.system
    let sysTx =
      sysL.x +
      Math.cos(t * 0.32) * floatAmp * 1.15 +
      mouse.x * 0.018 * breath
    let sysTy =
      sysL.y +
      Math.sin(t * 0.28) * floatAmp +
      mouse.y * 0.012 * breath
    const sysTz = sysL.z
    const sysTargetS =
      systemScale0 * sysL.scale * heroBoost(layout.hero, "system")

    systemPos.x += (sysTx - systemPos.x) * follow
    systemPos.y += (sysTy - systemPos.y) * follow
    systemPos.z += (sysTz - systemPos.z) * (follow + 0.015)
    systemS += (sysTargetS - systemS) * 0.07
    system.position.copy(systemPos)
    system.scale.setScalar(systemS)
    system.rotation.y = t * 0.05
    system.rotation.z = Math.sin(t * 0.22) * 0.04
    ringed.updateLocal(t)

    // —— Asteroids ——
    const rockHero = heroBoost(layout.hero, "rocks")
    rocks.forEach((rock, i) => {
      const L = layout.rocks[i] ?? layout.rocks[0]!
      const phase = i * 1.7
      let tx =
        L.x +
        Math.sin(t * (0.25 + i * 0.06) + phase) * floatAmp * 0.9 -
        mouse.x * 0.012 * breath
      let ty =
        L.y +
        Math.cos(t * (0.22 + i * 0.05) + phase) * floatAmp * 0.8 +
        mouse.y * 0.01 * breath
      const tz = L.z
      const rp = rockPos[i]!
      rp.x += (tx - rp.x) * follow
      rp.y += (ty - rp.y) * follow
      rp.z += (tz - rp.z) * (follow + 0.015)
      rock.position.copy(rp)

      const base = rockScale0[i]!
      const rockS = L.scale * rockHero
      rock.visible = rockS > 0.02
      rock.scale.copy(base).multiplyScalar(Math.max(rockS, 0.001))

      rock.rotation.x += 0.0007 + i * 0.00025 + vel * 0.002
      rock.rotation.y += 0.001 + i * 0.0002 + vel * 0.0025
      rock.rotation.z += 0.0004 + vel * 0.001
    })
  }

  function setPalette(id: BlobPaletteId) {
    astroBuilt.setPalette(id)
    ringed.setPalette(id)
  }

  return { group, update, setPalette }
}
