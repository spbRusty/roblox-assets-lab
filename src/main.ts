import * as THREE from 'three'
import './style.css'

const host = document.querySelector<HTMLDivElement>('#viewer')
if (!host) throw new Error('3D viewer container was not found')

host.innerHTML = ''
host.style.position = 'absolute'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x151a17)

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
camera.position.set(0, 1.45, 14)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.35
renderer.setClearColor(0x151a17, 1)
renderer.domElement.style.cssText = 'display:block;position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;z-index:1'
host.appendChild(renderer.domElement)

scene.add(new THREE.HemisphereLight(0xffffff, 0x38443c, 2.3))
const keyLight = new THREE.DirectionalLight(0xfff1d9, 3.0)
keyLight.position.set(4, 8, 8)
scene.add(keyLight)
const fillLight = new THREE.DirectionalLight(0x9eb9ad, 2.0)
fillLight.position.set(-6, 2, -5)
scene.add(fillLight)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x202722, roughness: 0.95 }),
)
floor.rotation.x = -Math.PI / 2
floor.position.y = -2.15
scene.add(floor)

const grid = new THREE.GridHelper(24, 48, 0x657568, 0x344038)
grid.position.y = -2.13
const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
gridMaterials.forEach((m) => { m.transparent = true; m.opacity = 0.3 })
scene.add(grid)

const rifle = new THREE.Group()
scene.add(rifle)

const metal = new THREE.MeshStandardMaterial({ color: 0x66716a, metalness: 0.72, roughness: 0.34 })
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x303a34, metalness: 0.76, roughness: 0.32 })
const polymer = new THREE.MeshStandardMaterial({ color: 0x242b27, metalness: 0.18, roughness: 0.72 })
const edge = new THREE.MeshStandardMaterial({ color: 0x87938a, metalness: 0.8, roughness: 0.28 })

function box(w:number,h:number,d:number, material:THREE.Material, x:number,y:number,z:number, bevel=0) {
  const geometry = new THREE.BoxGeometry(w,h,d)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x,y,z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  rifle.add(mesh)
  return mesh
}
function cylinderX(radius:number,length:number,material:THREE.Material,x:number,y:number,z:number,radius2=radius) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius,radius2,length,20),material)
  mesh.rotation.z = Math.PI/2
  mesh.position.set(x,y,z)
  mesh.castShadow = true
  rifle.add(mesh)
  return mesh
}

// Receiver and upper/lower body
box(3.55,0.62,0.76,metal,-0.05,0.0,0)
box(2.55,0.24,0.79,darkMetal,-0.15,0.39,0)
box(1.55,0.19,0.82,polymer,-0.65,-0.39,0)
// Handguard with cooling slots and rails
box(2.15,0.52,0.84,darkMetal,-2.05,0.02,0)
for (let i=0;i<7;i++) {
  box(0.12,0.26,0.025,polymer,-2.85+i*0.27,0.02,0.435)
  box(0.12,0.26,0.025,polymer,-2.85+i*0.27,0.02,-0.435)
}
// Barrel and muzzle
cylinderX(0.115,1.45,darkMetal,2.55,0.05,0)
cylinderX(0.17,0.32,metal,3.43,0.05,0)
cylinderX(0.125,0.12,polymer,3.63,0.05,0)
// Stock
box(1.45,0.34,0.58,polymer,-3.45,0.03,0)
box(0.25,0.55,0.62,darkMetal,-2.75,0.0,0)
box(0.16,0.48,0.64,edge,-4.13,0.03,0)
// Pistol grip and magazine
const grip = box(0.58,0.96,0.52,polymer,-0.35,-0.72,0)
grip.rotation.z = -0.18
const magazine = box(0.62,1.22,0.57,darkMetal,0.62,-0.82,0)
magazine.rotation.z = -0.1
box(0.68,0.12,0.61,polymer,0.62,-1.43,0)
// Trigger guard
box(0.58,0.08,0.48,darkMetal,0.15,-0.48,0)
box(0.08,0.32,0.08,darkMetal,-0.05,-0.3,0)
// Top picatinny rail
box(2.9,0.12,0.28,polymer,-0.05,0.57,0)
for (let i=0;i<15;i++) box(0.09,0.09,0.34,edge,-1.42+i*0.19,0.66,0)
// Front and rear sights / optic
box(0.14,0.34,0.16,darkMetal,1.55,0.82,0)
box(0.42,0.32,0.42,darkMetal,-0.75,0.82,0)
cylinderX(0.15,0.46,edge,-0.75,0.84,0)
cylinderX(0.105,0.48,polymer,-0.75,0.84,0.02)
// Selector, pins, ejection port and side details
box(0.68,0.22,0.035,polymer,0.65,0.12,0.405)
box(0.42,0.07,0.035,edge,0.65,0.22,0.43)
for (const x of [-1.05,-0.45,0.25,1.1]) {
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,0.035,16),edge)
  pin.rotation.x = Math.PI/2
  pin.position.set(x,-0.02,0.405)
  rifle.add(pin)
}
// Rotate slightly to show front and right side, while keeping barrel horizontal
rifle.rotation.y = -0.18
rifle.rotation.x = -0.04

let dragging = false
let lastX = 0
let lastY = 0
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return
  dragging = true; lastX = e.clientX; lastY = e.clientY
  renderer.domElement.setPointerCapture(e.pointerId)
  renderer.domElement.style.cursor = 'grabbing'
})
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!dragging) return
  rifle.rotation.y += (e.clientX-lastX)*0.008
  rifle.rotation.x = THREE.MathUtils.clamp(rifle.rotation.x+(e.clientY-lastY)*0.008,-1.35,1.35)
  lastX=e.clientX; lastY=e.clientY
})
const stopDrag=()=>{dragging=false;renderer.domElement.style.cursor='grab'}
renderer.domElement.addEventListener('pointerup',stopDrag)
renderer.domElement.addEventListener('pointercancel',stopDrag)
renderer.domElement.addEventListener('lostpointercapture',stopDrag)
renderer.domElement.addEventListener('wheel',(e)=>{
  e.preventDefault()
  camera.position.z=THREE.MathUtils.clamp(camera.position.z+(e.deltaY>0?1:-1),8,22)
},{passive:false})

function resize() {
  const width = Math.max(host.clientWidth,1)
  const height = Math.max(host.clientHeight,320)
  camera.aspect=width/height
  camera.updateProjectionMatrix()
  renderer.setSize(width,height,false)
}
const observer=new ResizeObserver(resize)
observer.observe(host)
window.addEventListener('resize',resize)
resize()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
}
animate()

window.addEventListener('beforeunload',()=>{
  observer.disconnect()
  renderer.dispose()
})
