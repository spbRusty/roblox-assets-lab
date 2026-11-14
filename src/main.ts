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

const loader = new FBXLoader()
loader.load(
  './models/Quaternius_AssaultRifle2_1.fbx',
  (model) => {
    model.name = 'Quaternius_AssaultRifle'
    model.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return
      node.castShadow = true
      node.receiveShadow = true
      if (!node.material) {
        node.material = new THREE.MeshStandardMaterial({ color: '#777d78', metalness: 0.35, roughness: 0.58 })
      }
    })

    // Поворачиваем модель горизонтально по её самой длинной оси.
    let bounds = new THREE.Box3().setFromObject(model)
    let size = bounds.getSize(new THREE.Vector3())
    if (size.y > size.x && size.y > size.z) model.rotation.z = -Math.PI / 2
    else if (size.z > size.x && size.z > size.y) model.rotation.y = Math.PI / 2

    bounds = new THREE.Box3().setFromObject(model)
    size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    model.position.sub(center)
    const longest = Math.max(size.x, size.y, size.z)
    model.scale.setScalar(9.2 / longest)
    rifle.add(model)

    const fitted = new THREE.Box3().setFromObject(rifle)
    const fittedSize = fitted.getSize(new THREE.Vector3())
    floor.position.y = -fittedSize.y * 0.72
    grid.position.y = floor.position.y + 0.015
    camera.position.set(0, Math.max(1.2, fittedSize.y * 0.28), 11.5)
    camera.lookAt(0, 0, 0)
  },
  undefined,
  (error) => {
    console.error('Не удалось загрузить модель Quaternius:', error)
    const message = document.createElement('div')
    message.className = 'model-error'
    message.textContent = 'Не удалось загрузить 3D-модель'
    host.appendChild(message)
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