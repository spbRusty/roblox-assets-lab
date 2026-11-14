import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import './style.css'

const host = document.querySelector<HTMLDivElement>('#viewer')
if (!host) throw new Error('3D viewer container was not found')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#151a17')
scene.fog = new THREE.Fog('#151a17', 18, 38)

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
camera.position.set(0, 2.1, 9.5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
host.appendChild(renderer.domElement)

// Управление вращением напрямую через pointer events: ЛКМ + движение мыши.
let dragging = false
let lastX = 0
let lastY = 0
const rotateSpeed = 0.008
renderer.domElement.style.touchAction = 'none'
renderer.domElement.style.cursor = 'grab'
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return
  dragging = true
  lastX = event.clientX
  lastY = event.clientY
  renderer.domElement.setPointerCapture(event.pointerId)
  renderer.domElement.style.cursor = 'grabbing'
})
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return
  const dx = event.clientX - lastX
  const dy = event.clientY - lastY
  lastX = event.clientX
  lastY = event.clientY
  rifle.rotation.y += dx * rotateSpeed
  rifle.rotation.x = THREE.MathUtils.clamp(rifle.rotation.x + dy * rotateSpeed, -Math.PI * 0.48, Math.PI * 0.48)
})
const stopDragging = () => {
  dragging = false
  renderer.domElement.style.cursor = 'grab'
}
renderer.domElement.addEventListener('pointerup', stopDragging)
renderer.domElement.addEventListener('pointercancel', stopDragging)
renderer.domElement.addEventListener('lostpointercapture', stopDragging)
renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault()
  camera.position.multiplyScalar(event.deltaY > 0 ? 1.08 : 0.92)
  const distance = camera.position.length()
  if (distance < 5) camera.position.setLength(5)
  if (distance > 35) camera.position.setLength(35)
}, { passive: false })

scene.add(new THREE.HemisphereLight(0xc9d8d1, 0x252923, 2.0))
const key = new THREE.DirectionalLight(0xfff0d8, 3.1)
key.position.set(3, 9, 7)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
scene.add(key)
const rim = new THREE.DirectionalLight(0x8aa9a5, 2.2)
rim.position.set(-7, 3, -5)
scene.add(rim)
const fill = new THREE.PointLight(0xc5d0c8, 18, 18)
fill.position.set(0, 5, 5)
scene.add(fill)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: '#202722', roughness: 0.92, metalness: 0.05 }),
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -2.05
floor.receiveShadow = true
scene.add(floor)

const grid = new THREE.GridHelper(24, 48, '#46534a', '#2b342e')
grid.position.y = -2.035
const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
gridMaterials.forEach((material) => { material.transparent = true; material.opacity = 0.32 })
scene.add(grid)

const rifle = new THREE.Group()
scene.add(rifle)

const modelStatus = document.createElement('div')
modelStatus.className = 'model-error'
modelStatus.textContent = 'Загрузка 3D-модели…'
host.appendChild(modelStatus)

let modelReady = false
function showFallback() {
  if (modelReady) return
  modelReady = true
  modelStatus.remove()

  const dark = new THREE.MeshStandardMaterial({ color: 0x303a35, metalness: 0.72, roughness: 0.34 })
  const body = new THREE.MeshStandardMaterial({ color: 0x59645d, metalness: 0.55, roughness: 0.42 })
  const black = new THREE.MeshStandardMaterial({ color: 0x171c19, metalness: 0.35, roughness: 0.5 })
  const gun = new THREE.Group()
  const box = (w:number,h:number,d:number, material:THREE.Material, x:number,y:number,z:number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material)
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; gun.add(mesh)
    return mesh
  }
  // Receiver, handguard, barrel and muzzle
  box(3.35,0.48,0.62,body,0,0,0)
  box(2.05,0.38,0.7,dark,-1.95,0,0)
  const cylinder = (radius:number,length:number,material:THREE.Material,x:number,y:number,z:number) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,16),material)
    mesh.rotation.z = Math.PI/2; mesh.position.set(x,y,z); mesh.castShadow = true; gun.add(mesh)
  }
  cylinder(0.095,1.5,dark,2.72,0.02,0)
  cylinder(0.16,0.22,black,3.58,0.02,0)
  // Stock, pistol grip, magazine
  box(1.45,0.32,0.48,dark,-3.15,0.02,0)
  box(0.55,0.9,0.46,black,-0.45,-0.58,0).rotation.z = -0.2
  box(0.62,1.05,0.48,body,0.55,-0.72,0).rotation.z = -0.12
  // Top rail and optic
  box(2.8,0.12,0.24,black,-0.05,0.31,0)
  box(0.72,0.32,0.38,dark,-0.25,0.53,0)
  cylinder(0.17,0.42,black,-0.25,0.55,0)
  // Sight, trigger guard and small details
  box(0.12,0.28,0.14,black,1.1,0.48,0)
  box(0.08,0.28,0.08,dark,0.05,-0.35,0)
  box(0.42,0.08,0.5,black,-1.75,-0.22,0)
  rifle.add(gun)
  camera.position.set(0,1.3,11.5)
  camera.lookAt(0,0,0)
}

const loader = new FBXLoader()
const modelUrl = new URL(`${import.meta.env.BASE_URL}models/Quaternius_AssaultRifle2_1.fbx`, window.location.origin).toString()
const fallbackTimer = window.setTimeout(() => {
  console.error('FBX loading timed out:', modelUrl)
  showFallback()
}, 10000)

loader.load(
  modelUrl,
  (model) => {
    if (modelReady) return
    let meshCount = 0
    model.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return
      meshCount++
      node.castShadow = true
      node.receiveShadow = true
      const visibleMaterial = new THREE.MeshStandardMaterial({
        color: 0x66736b, metalness: 0.58, roughness: 0.42,
      })
      node.material = visibleMaterial
    })

    let bounds = new THREE.Box3().setFromObject(model)
    let size = bounds.getSize(new THREE.Vector3())
    if (meshCount === 0 || !Number.isFinite(size.x + size.y + size.z) || Math.max(size.x,size.y,size.z) < 0.001) {
      console.error('FBX contains no visible mesh geometry; using fallback')
      showFallback()
      return
    }

    // Keep the longest model axis horizontal.
    if (size.y > size.x && size.y > size.z) model.rotation.z = -Math.PI / 2
    else if (size.z > size.x && size.z > size.y) model.rotation.y = Math.PI / 2

    bounds = new THREE.Box3().setFromObject(model)
    size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    model.position.sub(center)
    model.scale.setScalar(8.4 / Math.max(size.x,size.y,size.z))
    rifle.add(model)
    modelReady = true
    window.clearTimeout(fallbackTimer)
    modelStatus.remove()

    const fitted = new THREE.Box3().setFromObject(rifle)
    const fittedSize = fitted.getSize(new THREE.Vector3())
    floor.position.y = -Math.max(1.7, fittedSize.y * 0.8)
    grid.position.y = floor.position.y + 0.015
    camera.position.set(0, Math.max(1.0, fittedSize.y * 0.3), 11.5)
    camera.lookAt(0,0,0)
  },
  undefined,
  (error) => {
    console.error('Не удалось загрузить модель Quaternius:', error)
    window.clearTimeout(fallbackTimer)
    showFallback()
  },
)

function resize() {
  if (!host) return
  const width = Math.max(host.clientWidth, 1)
  const height = Math.max(host.clientHeight, 320)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height, false)
}
const observer = new ResizeObserver(resize)
observer.observe(host)
resize()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

window.addEventListener('beforeunload', () => {
  observer.disconnect()
  renderer.dispose()
})