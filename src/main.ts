import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js'
import './style.css'

const host = document.querySelector<HTMLDivElement>('#viewer')
if (!host) throw new Error('3D viewer container was not found')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#151a17')
scene.fog = new THREE.Fog('#151a17', 18, 38)

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
camera.position.set(0, 4.0, 16)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
host.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.065
controls.target.set(0, 0, 0)
camera.lookAt(0, 0, 0)
controls.minDistance = 5
controls.maxDistance = 23
controls.maxPolarAngle = Math.PI * 0.88
controls.update()

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

const materials = {
  main: new THREE.MeshStandardMaterial({ color: '#303639', metalness: 0.72, roughness: 0.38 }),
  dark: new THREE.MeshStandardMaterial({ color: '#191d20', metalness: 0.78, roughness: 0.34 }),
  metal: new THREE.MeshStandardMaterial({ color: '#697174', metalness: 0.86, roughness: 0.28 }),
  accent: new THREE.MeshStandardMaterial({ color: '#665b41', metalness: 0.58, roughness: 0.48 }),
  polymer: new THREE.MeshStandardMaterial({ color: '#414643', metalness: 0.22, roughness: 0.7 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#456f78', metalness: 0.25, roughness: 0.12, transmission: 0.28, transparent: true, opacity: 0.8 }),
}

function box(name: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, material: THREE.Material, rz = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material)
  mesh.name = name
  mesh.position.set(x, y, z)
  mesh.rotation.z = THREE.MathUtils.degToRad(rz)
  mesh.castShadow = true
  mesh.receiveShadow = true
  rifle.add(mesh)
  return mesh
}

function cylinderX(name: string, x: number, y: number, z: number, length: number, diameter: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(diameter / 2, diameter / 2, length, 24), material)
  mesh.name = name
  mesh.position.set(x, y, z)
  mesh.rotation.z = Math.PI / 2
  mesh.castShadow = true
  mesh.receiveShadow = true
  rifle.add(mesh)
  return mesh
}

function cylinderY(name: string, x: number, y: number, z: number, diameter: number, height: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(diameter / 2, diameter / 2, height, 20), material)
  mesh.name = name
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  rifle.add(mesh)
  return mesh
}

// Приклад
box('Stock_Core', -4.05, 0, 0, 2.25, 0.72, 0.82, materials.polymer)
box('Stock_Rear_Pad', -5.23, -0.02, 0, 0.22, 0.88, 0.9, materials.dark)
box('Stock_Top_Ridge', -4.15, 0.43, 0, 1.65, 0.12, 0.7, materials.main)
box('Stock_Adjustment_Rail', -3.2, -0.04, 0, 0.22, 0.42, 0.88, materials.metal)
for (let i = 0; i < 4; i++) box('Stock_Slot', -4.75 + i * 0.32, -0.01, -0.416, 0.12, 0.38, 0.025, materials.dark)

// Корпус и ствольная коробка
box('Lower_Receiver', -0.45, 0, 0, 3.55, 0.82, 0.82, materials.main)
box('Upper_Receiver', -0.25, 0.48, 0, 3.2, 0.24, 0.72, materials.dark)
box('Left_Receiver_Panel', -0.35, 0.02, -0.43, 1.75, 0.48, 0.055, materials.polymer)
box('Right_Receiver_Panel', -0.35, 0.02, 0.43, 1.75, 0.48, 0.055, materials.polymer)
box('Ejection_Port', 0.65, 0.17, -0.47, 0.7, 0.22, 0.035, materials.dark)
box('Ejection_Port_Cover', 0.65, 0.31, -0.49, 0.58, 0.055, 0.035, materials.metal)
box('Charging_Handle', -0.95, 0.57, -0.47, 0.48, 0.12, 0.12, materials.metal)

// Цевьё, ствол и дульная часть
box('Handguard_Core', 2, 0.02, 0, 2.65, 0.72, 0.78, materials.polymer)
cylinderX('Barrel', 3.55, 0.02, 0, 2.15, 0.24, materials.metal)
cylinderX('Muzzle_Brake', 4.78, 0.02, 0, 0.5, 0.34, materials.dark)
cylinderX('Muzzle_Rim', 5.05, 0.02, 0, 0.08, 0.38, materials.metal)
cylinderX('Gas_Block', 2.72, 0.02, 0, 0.32, 0.48, materials.main)
box('Gas_Tube', 1.75, 0.48, 0, 1.65, 0.1, 0.12, materials.metal)
for (let i = 0; i < 6; i++) {
  const x = 1.05 + i * 0.34
  box('Vent_Left', x, 0.03, -0.405, 0.19, 0.12, 0.025, materials.dark)
  box('Vent_Right', x, 0.03, 0.405, 0.19, 0.12, 0.025, materials.dark)
}

// Верхняя и боковые планки
box('Top_Rail_Base', 0.55, 0.64, 0, 4.45, 0.12, 0.22, materials.dark)
for (let i = 0; i < 22; i++) box('Top_Rail_Tooth', -1.55 + i * 0.2, 0.75, 0, 0.105, 0.12, 0.34, materials.metal)
box('Left_Side_Rail', 1.95, 0.02, -0.47, 2.25, 0.16, 0.12, materials.dark)
box('Right_Side_Rail', 1.95, 0.02, 0.47, 2.25, 0.16, 0.12, materials.dark)
for (let i = 0; i < 9; i++) {
  const x = 1.05 + i * 0.23
  box('Side_Tooth_Left', x, 0.02, -0.55, 0.12, 0.2, 0.08, materials.metal)
  box('Side_Tooth_Right', x, 0.02, 0.55, 0.12, 0.2, 0.08, materials.metal)
}

// Рукоять и магазин
box('Grip_Mount', -0.8, -0.55, 0, 0.62, 0.18, 0.58, materials.dark)
const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.34, 1.05, 4), materials.polymer)
grip.name = 'Pistol_Grip'
grip.position.set(-0.72, -1.03, 0)
grip.rotation.z = -0.12
grip.castShadow = true
rifle.add(grip)
box('Grip_Base', -0.55, -1.53, 0, 0.55, 0.14, 0.65, materials.dark)
for (let i = 0; i < 4; i++) box('Grip_Texture', -0.84, -0.82 - i * 0.17, -0.326, 0.42, 0.035, 0.025, materials.dark)
box('Magazine_Neck', 0.15, -0.55, 0, 0.62, 0.36, 0.58, materials.dark)
box('Magazine_Body', 0.18, -1.05, 0, 0.72, 0.78, 0.62, materials.polymer, -5)
box('Magazine_Lower', 0.23, -1.48, 0, 0.66, 0.16, 0.58, materials.dark, -5)
box('Magazine_Floorplate', 0.23, -1.59, 0, 0.78, 0.1, 0.68, materials.metal, -5)
for (let i = 0; i < 5; i++) box('Magazine_Rib', 0.18, -0.82 - i * 0.13, -0.323, 0.48, 0.035, 0.025, materials.dark)

// Спусковая скоба и органы управления
box('Trigger_Guard_Top', -0.72, -0.42, 0, 0.72, 0.09, 0.48, materials.metal)
box('Trigger_Guard_Front', -0.38, -0.58, 0, 0.09, 0.25, 0.48, materials.metal)
box('Trigger_Guard_Rear', -1.05, -0.58, 0, 0.09, 0.25, 0.48, materials.metal)
box('Trigger', -0.72, -0.52, 0, 0.08, 0.25, 0.1, materials.metal, -12)
cylinderY('Selector_Axle', -0.95, 0.06, -0.49, 0.18, 0.12, materials.metal)
box('Selector_Lever', -0.78, 0.08, -0.53, 0.34, 0.07, 0.08, materials.accent, -18)

// Механические прицельные приспособления
box('Front_Sight_Base', 2.78, 0.88, 0, 0.38, 0.14, 0.42, materials.dark)
box('Front_Sight_Post', 2.78, 1.12, 0, 0.07, 0.38, 0.07, materials.metal)
box('Front_Sight_Hood_L', 2.58, 1.12, 0, 0.07, 0.34, 0.1, materials.metal)
box('Front_Sight_Hood_R', 2.98, 1.12, 0, 0.07, 0.34, 0.1, materials.metal)
box('Rear_Sight_Base', -1.18, 0.9, 0, 0.42, 0.16, 0.38, materials.dark)
box('Rear_Sight_Housing', -1.18, 1.08, 0, 0.34, 0.22, 0.32, materials.metal)
box('Rear_Sight_Aperture', -1.18, 1.1, 0, 0.12, 0.13, 0.34, materials.dark)

// Компактный оптический модуль
box('Optic_Mount', 0, 0.92, 0, 0.68, 0.18, 0.48, materials.dark)
box('Optic_Body', 0, 1.2, 0, 0.78, 0.42, 0.54, materials.main)
cylinderX('Optic_Front_Ring', 0.42, 1.2, 0, 0.12, 0.5, materials.metal)
cylinderX('Optic_Rear_Ring', -0.42, 1.2, 0, 0.12, 0.5, materials.metal)
box('Optic_Glass_Front', 0.49, 1.2, 0, 0.025, 0.32, 0.32, materials.glass)
box('Optic_Glass_Rear', -0.49, 1.2, 0, 0.025, 0.32, 0.32, materials.glass)
box('Optic_Turret', 0, 1.49, 0, 0.22, 0.16, 0.22, materials.dark)
cylinderY('Optic_Turret_Cap', 0, 1.59, 0, 0.28, 0.06, materials.metal)

// Крепёж и маркировочные элементы
for (const side of [-1, 1]) {
  for (let i = 0; i < 4; i++) cylinderY('Receiver_Fastener', -1.05 + i * 0.43, 0.04, side * 0.475, 0.09, 0.035, materials.metal)
  for (let i = 0; i < 5; i++) box('Handguard_Mark', 1.05 + i * 0.32, 0.34, side * 0.414, 0.12, 0.035, 0.025, materials.accent)
}
box('Rear_Sling_Lug', -3, -0.32, 0, 0.18, 0.16, 0.94, materials.metal)
box('Front_Sling_Lug', 2.55, -0.34, 0, 0.16, 0.14, 0.9, materials.metal)

// Центрируем объект относительно его геометрического центра
const bounds = new THREE.Box3().setFromObject(rifle)
const center = bounds.getCenter(new THREE.Vector3())
const size = bounds.getSize(new THREE.Vector3())
rifle.position.set(-center.x, -center.y, -center.z)

// Подбираем дистанцию по габаритам модели, чтобы она целиком попадала в кадр.
const maxDimension = Math.max(size.x, size.y, size.z)
const fitDistance = (maxDimension / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
camera.position.set(0, Math.max(2.8, size.y * 0.8), Math.max(14, fitDistance * 1.18))
camera.lookAt(0, 0, 0)
controls.target.set(0, 0, 0)
controls.update()

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

document.querySelector<HTMLButtonElement>('#front')?.addEventListener('click', () => {
  camera.position.set(0, 3.0, 16)
  controls.target.set(0, 0, 0)
})
document.querySelector<HTMLButtonElement>('#top')?.addEventListener('click', () => {
  camera.position.set(0, 15, 0.01)
  controls.target.set(0, 0, 0)
})
document.querySelector<HTMLButtonElement>('#reset')?.addEventListener('click', () => {
  camera.position.set(0, 4.0, 16)
  controls.target.set(0, 0, 0)
})

document.querySelector<HTMLButtonElement>('#download')?.addEventListener('click', () => {
  const exporter = new OBJExporter()
  const obj = exporter.parse(rifle)
  const blob = new Blob([obj], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'R01_Rifle.obj'
  link.click()
  URL.revokeObjectURL(url)
})

const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener('beforeunload', () => {
  observer.disconnect()
  controls.dispose()
  renderer.dispose()
  clock.stop()
})