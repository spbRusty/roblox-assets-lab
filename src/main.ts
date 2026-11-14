import * as THREE from 'three'
import './style.css'

const host = document.querySelector<HTMLDivElement>('#viewer')
if (!host) throw new Error('3D viewer container was not found')
const viewer: HTMLDivElement = host

const scene = new THREE.Scene()
scene.background = new THREE.Color('#202a32')
const camera = new THREE.PerspectiveCamera(35, 1, .1, 100)
camera.position.set(.2, .15, 9.4)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true
viewer.replaceChildren(renderer.domElement)

scene.add(new THREE.HemisphereLight(0xe5f2ff, 0x333b32, 2.1))
const key = new THREE.DirectionalLight(0xffe3bd, 3)
key.position.set(-3, 6, 5)
key.castShadow = true
scene.add(key)
const rim = new THREE.DirectionalLight(0x8dc9dc, 2.4)
rim.position.set(3, 2, -5)
scene.add(rim)

const gun = new THREE.Group()
scene.add(gun)

// Roblox-inspired palette: bold, readable shapes and matte materials.
const receiver = new THREE.MeshStandardMaterial({ color: 0x3d4852, roughness: .72, metalness: .22 })
const olive = new THREE.MeshStandardMaterial({ color: 0x718b50, roughness: .82, metalness: .08 })
const oliveDark = new THREE.MeshStandardMaterial({ color: 0x526b3c, roughness: .86 })
const metal = new THREE.MeshStandardMaterial({ color: 0x8997a0, roughness: .48, metalness: .62 })
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x28323a, roughness: .62, metalness: .42 })
const black = new THREE.MeshStandardMaterial({ color: 0x1b242b, roughness: .92 })
const rubber = new THREE.MeshStandardMaterial({ color: 0x30383b, roughness: .98 })
const orange = new THREE.MeshStandardMaterial({ color: 0xf09a43, roughness: .62, metalness: .08 })
const glass = new THREE.MeshStandardMaterial({ color: 0x65c5d4, roughness: .18, metalness: .25, emissive: 0x123c49, emissiveIntensity: .35 })

function box(x:number,y:number,z:number,sx:number,sy:number,sz:number,m:THREE.Material,rz=0,ry=0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m)
  o.position.set(x,y,z); o.rotation.set(0,ry,rz)
  o.castShadow = true; o.receiveShadow = true; gun.add(o); return o
}
function cyl(x:number,y:number,z:number,r:number,len:number,m:THREE.Material,axis='x',segments=20) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,segments),m)
  if (axis === 'x') o.rotation.z = Math.PI/2
  if (axis === 'z') o.rotation.x = Math.PI/2
  o.position.set(x,y,z); o.castShadow = true; o.receiveShadow = true; gun.add(o); return o
}
function sideBolt(x:number,y:number,z:number,r=.055) {
  cyl(x,y,z,r,.035,metal,'z',16)
  cyl(x,y,z + (z > 0 ? .022 : -.022),r*.34,.04,black,'z',12)
}

// Telescopic stock with cheek rest, adjustment rail and rubber butt pad.
box(-2.72,.12,0,1.18,.43,.48,olive)
box(-3.36,.12,0,.2,.66,.58,rubber)
box(-3.36,.12,.302,.2,.46,.035,orange)
box(-2.75,.42,0,.78,.12,.43,oliveDark)
box(-2.18,.12,0,.25,.28,.42,darkMetal)
for (let i=0;i<5;i++) box(-3.08+i*.16,-.17,.25,.07,.08,.045,metal)
box(-2.05,.12,0,.7,.24,.42,darkMetal)

// Receiver and upper cover.
box(-.48,.1,0,2.42,.58,.66,receiver)
box(-.46,.43,0,2.34,.18,.62,olive)
box(-.45,.12,.342,1.82,.31,.045,darkMetal)
box(-.38,.25,.373,.78,.12,.025,metal)
box(-.65,.25,.394,.46,.055,.018,orange)
box(-1.12,.05,.365,.52,.24,.035,black)
box(-1.12,.05,.39,.34,.13,.02,metal)
box(-.98,.48,.365,.52,.07,.06,oliveDark)
box(-.02,.47,.365,.28,.1,.06,orange)
sideBolt(-1.42,.13,.38); sideBolt(.12,.12,.38); sideBolt(-.2,-.12,.38)

// Ejection port, charging handle and selector on the visible side.
box(-.05,.12,.405,.55,.22,.035,black)
box(-.05,.12,.43,.38,.12,.025,darkMetal)
box(-.26,.12,.45,.08,.12,.025,orange)
box(-1.45,.39,.35,.42,.09,.09,metal)
box(-1.62,.39,.4,.12,.14,.08,black)
cyl(-.92,-.12,.4,.09,.045,metal,'z')
box(-.92,-.23,.42,.07,.18,.035,orange,-.35)

// Handguard, top and side rails, segmented vent panels.
box(1.05,.13,0,1.62,.59,.72,olive)
box(1.05,.45,0,1.66,.12,.76,oliveDark)
box(1.05,-.18,0,1.5,.1,.74,darkMetal)
for (let i=0;i<10;i++) {
  const x = .34 + i*.15
  box(x,.13,.375,.055,.34,.035,metal)
  box(x,.13,-.375,.055,.34,.035,metal)
}
for (let i=0;i<7;i++) {
  const x=.52+i*.17
  box(x,.14,.401,.09,.12,.025,black)
  box(x,.14,-.401,.09,.12,.025,black)
}
box(1.05,.58,0,1.72,.08,.24,darkMetal)
for(let i=0;i<15;i++) box(.27+i*.11,.65,0,.055,.08,.3,metal)
box(1.05,-.52,0,1.25,.08,.26,darkMetal)
for(let i=0;i<9;i++) box(.55+i*.13,-.58,0,.06,.08,.31,metal)

// Barrel, gas block and a chunky slotted muzzle device.
cyl(2.28,.19,0,.115,2.65,darkMetal)
cyl(1.62,.19,0,.19,.28,metal)
cyl(1.78,.19,0,.145,.16,black)
cyl(3.48,.19,0,.17,.22,metal)
cyl(3.68,.19,0,.205,.38,oliveDark)
cyl(3.88,.19,0,.16,.035,black)
for(let i=0;i<4;i++) {
  box(3.67,.19,.19,.07,.12,.035,orange,0,i*Math.PI/2)
}

// Front and rear iron sights.
box(1.82,.69,0,.22,.16,.24,darkMetal)
box(1.82,.84,0,.065,.22,.08,metal)
box(1.82,.96,0,.12,.045,.09,orange)
box(-1.35,.68,0,.22,.14,.22,darkMetal)
box(-1.35,.81,0,.07,.18,.08,metal)
box(-1.35,.91,0,.12,.04,.1,orange)

// Compact optic with clear blue lenses, adjustment turrets and mount.
box(.05,.78,0,.62,.18,.3,darkMetal)
cyl(.05,1.02,0,.18,.74,black)
cyl(.05,1.02,.0,.145,.76,metal)
cyl(.46,1.02,0,.225,.12,oliveDark)
cyl(-.36,1.02,0,.205,.12,oliveDark)
cyl(.53,1.02,0,.16,.025,glass)
cyl(-.43,1.02,0,.15,.025,glass)
cyl(.05,1.27,0,.1,.12,black,'y')
cyl(.05,1.34,0,.13,.08,orange,'y')
cyl(-.18,1.02,0,.09,.12,metal,'y')
box(.05,.75,0,.34,.12,.42,olive)

// Pistol grip, textured panels, trigger and guard.
box(-.72,-.52,0,.43,.92,.49,oliveDark,-.22)
box(-.72,-.52,.255,.32,.62,.035,rubber,-.22)
box(-.72,-.52,.278,.2,.48,.02,black,-.22)
for(let i=0;i<5;i++) box(-.86+i*.07,-.52,.3,.025,.42,.018,metal,-.22)
box(-.05,-.26,0,.66,.09,.52,darkMetal)
box(.24,-.39,0,.08,.24,.5,metal)
box(-.34,-.39,0,.08,.24,.5,metal)
cyl(-.08,-.34,0,.035,.2,orange,'z')
box(-.45,-.05,.38,.16,.08,.06,orange)

// Curved-looking block magazine with ribs and base plate.
box(.48,-.67,0,.58,1.08,.5,oliveDark,-.1)
box(.48,-.67,.26,.43,.9,.035,receiver,-.1)
for(let i=0;i<7;i++) box(.48,-.35-i*.105,.285,.39,.035,.025,metal,-.1)
box(.5,-1.23,0,.66,.13,.56,black,-.1)
box(.5,-1.23,.29,.42,.055,.025,orange,-.1)

// Small pins, sling loops and visible hardware.
sideBolt(-1.48,-.18,.37,.045); sideBolt(-.48,-.18,.37,.045); sideBolt(.72,-.19,.39,.045)
box(-2.05,-.1,.3,.12,.12,.12,metal)
box(2.02,-.18,.3,.14,.12,.12,metal)
cyl(-2.05,-.25,.3,.07,.06,metal,'z')
cyl(2.02,-.25,.3,.07,.06,metal,'z')

// Soft ground shadow.
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.2}))
floor.rotation.x = -Math.PI/2; floor.position.y = -1.37; floor.receiveShadow = true; scene.add(floor)

let yaw=-.18, pitch=.12, zoom=1, drag=false, lx=0, ly=0
function update() {
  gun.rotation.set(pitch,yaw,0)
  camera.position.set(.2,.15,9.4/zoom)
  camera.lookAt(.05,.02,0)
}
update()
function resize() {
  const w=viewer.clientWidth, h=viewer.clientHeight
  if(!w||!h)return
  renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix()
}
const observer = new ResizeObserver(resize)
observer.observe(viewer); resize()
renderer.domElement.style.position='absolute'
renderer.domElement.style.inset='0'
renderer.domElement.style.width='100%'
renderer.domElement.style.height='100%'
renderer.domElement.style.display='block'
renderer.domElement.style.cursor='grab'
renderer.domElement.addEventListener('pointerdown',e=>{
  if(e.button!==0)return
  drag=true; lx=e.clientX; ly=e.clientY
  renderer.domElement.setPointerCapture(e.pointerId)
  renderer.domElement.style.cursor='grabbing'
})
renderer.domElement.addEventListener('pointermove',e=>{
  if(!drag)return
  yaw+=(e.clientX-lx)*.008
  pitch=THREE.MathUtils.clamp(pitch+(e.clientY-ly)*.006,-1.1,1.1)
  lx=e.clientX; ly=e.clientY; update()
})
const stop=()=>{drag=false;renderer.domElement.style.cursor='grab'}
renderer.domElement.addEventListener('pointerup',stop)
renderer.domElement.addEventListener('pointercancel',stop)
renderer.domElement.addEventListener('lostpointercapture',stop)
renderer.domElement.addEventListener('wheel',e=>{
  e.preventDefault()
  zoom=THREE.MathUtils.clamp(zoom+(e.deltaY>0?-.08:.08),.65,1.55)
  update()
},{passive:false})
let frame=0
function animate(){frame=requestAnimationFrame(animate);renderer.render(scene,camera)}
animate()
window.addEventListener('beforeunload',()=>{
  cancelAnimationFrame(frame); observer.disconnect(); renderer.dispose()
})
