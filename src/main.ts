import * as THREE from 'three'
import './style.css'

type AssetId = 'rifle' | 'tank'
type Asset = { id: AssetId; name: string; subtitle: string; type: string; author: string; status: string }

const assets: Asset[] = [
  { id:'rifle', name:'ASSAULT RIFLE', subtitle:'R-01', type:'Штурмовая винтовка', author:'Quaternius · CC0 / процедурные детали', status:'Демонстрационная модель' },
  { id:'tank', name:'MAIN BATTLE TANK', subtitle:'T-02', type:'Основной боевой танк', author:'Roblox Assets Lab · процедурная модель', status:'Демонстрационная модель' }
]

const host = document.querySelector<HTMLDivElement>('#viewer')
const gallery = document.querySelector<HTMLDivElement>('#gallery')
const title = document.querySelector<HTMLHeadingElement>('#asset-title')
const eyebrow = document.querySelector<HTMLDivElement>('#asset-eyebrow')
const description = document.querySelector<HTMLParagraphElement>('#asset-description')
const label = document.querySelector<HTMLDivElement>('#viewer-code')
const details = document.querySelector<HTMLDivElement>('#asset-details')
if (!host || !gallery || !title || !eyebrow || !description || !label || !details) throw new Error('Gallery interface is incomplete')

const scene = new THREE.Scene()
scene.background = new THREE.Color('#202a32')
const camera = new THREE.PerspectiveCamera(35, 1, .1, 100)
const renderer = new THREE.WebGLRenderer({ antialias:true })
renderer.setPixelRatio(Math.min(devicePixelRatio,2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true
host.replaceChildren(renderer.domElement)

scene.add(new THREE.HemisphereLight(0xe5f2ff,0x333b32,2.1))
const keyLight = new THREE.DirectionalLight(0xffe3bd,3)
keyLight.position.set(-3,6,5); keyLight.castShadow = true; scene.add(keyLight)
const rimLight = new THREE.DirectionalLight(0x8dc9dc,2.4)
rimLight.position.set(3,2,-5); scene.add(rimLight)

const floor = new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.2}))
floor.rotation.x = -Math.PI/2
floor.position.y = -1.5
floor.receiveShadow = true
scene.add(floor)

const mat = (color:number,roughness=.8,metalness=.08) => new THREE.MeshStandardMaterial({color,roughness,metalness})
const M = {
  receiver:mat(0x3d4852,.72,.22), olive:mat(0x718b50,.82), oliveDark:mat(0x526b3c,.86),
  metal:mat(0x8997a0,.48,.62), darkMetal:mat(0x28323a,.62,.42), black:mat(0x1b242b,.92),
  rubber:mat(0x30383b,.98), orange:mat(0xf09a43,.62), glass:new THREE.MeshStandardMaterial({color:0x65c5d4,roughness:.18,metalness:.25,emissive:0x123c49,emissiveIntensity:.35})
}

function addBox(g:THREE.Group,x:number,y:number,z:number,sx:number,sy:number,sz:number,m:THREE.Material,rz=0,ry=0) {
  const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m)
  o.position.set(x,y,z);o.rotation.set(0,ry,rz);o.castShadow=true;o.receiveShadow=true;g.add(o);return o
}
function addCylinder(g:THREE.Group,x:number,y:number,z:number,r:number,len:number,m:THREE.Material,axis:'x'|'y'|'z'='x',segments=20) {
  const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,segments),m)
  if(axis==='x')o.rotation.z=Math.PI/2
  if(axis==='z')o.rotation.x=Math.PI/2
  o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o
}
function addBolt(g:THREE.Group,x:number,y:number,z:number,r=.055) {
  addCylinder(g,x,y,z,r,.035,M.metal,'z',16)
  addCylinder(g,x,y,z+(z>0?.022:-.022),r*.34,.04,M.black,'z',12)
}

function createRifle() {
  const gun=new THREE.Group()
  const box=(x:number,y:number,z:number,sx:number,sy:number,sz:number,m:THREE.Material,rz=0,ry=0)=>addBox(gun,x,y,z,sx,sy,sz,m,rz,ry)
  const cyl=(x:number,y:number,z:number,r:number,len:number,m:THREE.Material,axis:'x'|'y'|'z'='x')=>addCylinder(gun,x,y,z,r,len,m,axis)
  box(-2.72,.12,0,1.18,.43,.48,M.olive);box(-3.36,.12,0,.2,.66,.58,M.rubber);box(-3.36,.12,.302,.2,.46,.035,M.orange)
  box(-2.75,.42,0,.78,.12,.43,M.oliveDark);box(-2.18,.12,0,.25,.28,.42,M.darkMetal)
  for(let i=0;i<5;i++)box(-3.08+i*.16,-.17,.25,.07,.08,.045,M.metal)
  box(-2.05,.12,0,.7,.24,.42,M.darkMetal)
  box(-.48,.1,0,2.42,.58,.66,M.receiver);box(-.46,.43,0,2.34,.18,.62,M.olive);box(-.45,.12,.342,1.82,.31,.045,M.darkMetal)
  box(-.38,.25,.373,.78,.12,.025,M.metal);box(-.65,.25,.394,.46,.055,.018,M.orange);box(-1.12,.05,.365,.52,.24,.035,M.black)
  box(-1.12,.05,.39,.34,.13,.02,M.metal);box(-.98,.48,.365,.52,.07,.06,M.oliveDark);box(-.02,.47,.365,.28,.1,.06,M.orange)
  addBolt(gun,-1.42,.13,.38);addBolt(gun,.12,.12,.38);addBolt(gun,-.2,-.12,.38)
  box(-.05,.12,.405,.55,.22,.035,M.black);box(-.05,.12,.43,.38,.12,.025,M.darkMetal);box(-.26,.12,.45,.08,.12,.025,M.orange)
  box(-1.45,.39,.35,.42,.09,.09,M.metal);box(-1.62,.39,.4,.12,.14,.08,M.black);cyl(-.92,-.12,.4,.09,.045,M.metal,'z');box(-.92,-.23,.42,.07,.18,.035,M.orange,-.35)
  box(1.05,.13,0,1.62,.59,.72,M.olive);box(1.05,.45,0,1.66,.12,.76,M.oliveDark);box(1.05,-.18,0,1.5,.1,.74,M.darkMetal)
  for(let i=0;i<10;i++){const x=.34+i*.15;box(x,.13,.375,.055,.34,.035,M.metal);box(x,.13,-.375,.055,.34,.035,M.metal)}
  for(let i=0;i<7;i++){const x=.52+i*.17;box(x,.14,.401,.09,.12,.025,M.black);box(x,.14,-.401,.09,.12,.025,M.black)}
  box(1.05,.58,0,1.72,.08,.24,M.darkMetal);for(let i=0;i<15;i++)box(.27+i*.11,.65,0,.055,.08,.3,M.metal)
  box(1.05,-.52,0,1.25,.08,.26,M.darkMetal);for(let i=0;i<9;i++)box(.55+i*.13,-.58,0,.06,.08,.31,M.metal)
  cyl(2.28,.19,0,.115,2.65,M.darkMetal);cyl(1.62,.19,0,.19,.28,M.metal);cyl(1.78,.19,0,.145,.16,M.black);cyl(3.48,.19,0,.17,.22,M.metal);cyl(3.68,.19,0,.205,.38,M.oliveDark);cyl(3.88,.19,0,.16,.035,M.black)
  for(let i=0;i<4;i++)box(3.67,.19,.19,.07,.12,.035,M.orange,0,i*Math.PI/2)
  box(1.82,.69,0,.22,.16,.24,M.darkMetal);box(1.82,.84,0,.065,.22,.08,M.metal);box(1.82,.96,0,.12,.045,.09,M.orange)
  box(-1.35,.68,0,.22,.14,.22,M.darkMetal);box(-1.35,.81,0,.07,.18,.08,M.metal);box(-1.35,.91,0,.12,.04,.1,M.orange)
  box(.05,.78,0,.62,.18,.3,M.darkMetal);cyl(.05,1.02,0,.18,.74,M.black);cyl(.05,1.02,0,.145,.76,M.metal);cyl(.46,1.02,0,.225,.12,M.oliveDark);cyl(-.36,1.02,0,.205,.12,M.oliveDark);cyl(.53,1.02,0,.16,.025,M.glass);cyl(-.43,1.02,0,.15,.025,M.glass);cyl(.05,1.27,0,.1,.12,M.black,'y');cyl(.05,1.34,0,.13,.08,M.orange,'y');cyl(-.18,1.02,0,.09,.12,M.metal,'y');box(.05,.75,0,.34,.12,.42,M.olive)
  box(-.72,-.52,0,.43,.92,.49,M.oliveDark,-.22);box(-.72,-.52,.255,.32,.62,.035,M.rubber,-.22);box(-.72,-.52,.278,.2,.48,.02,M.black,-.22)
  for(let i=0;i<5;i++)box(-.86+i*.07,-.52,.3,.025,.42,.018,M.metal,-.22)
  box(-.05,-.26,0,.66,.09,.52,M.darkMetal);box(.24,-.39,0,.08,.24,.5,M.metal);box(-.34,-.39,0,.08,.24,.5,M.metal);cyl(-.08,-.34,0,.035,.2,M.orange,'z');box(-.45,-.05,.38,.16,.08,.06,M.orange)
  box(.48,-.67,0,.58,1.08,.5,M.oliveDark,-.1);box(.48,-.67,.26,.43,.9,.035,M.receiver,-.1)
  for(let i=0;i<7;i++)box(.48,-.35-i*.105,.285,.39,.035,.025,M.metal,-.1)
  box(.5,-1.23,0,.66,.13,.56,M.black,-.1);box(.5,-1.23,.29,.42,.055,.025,M.orange,-.1)
  addBolt(gun,-1.48,-.18,.37,.045);addBolt(gun,-.48,-.18,.37,.045);addBolt(gun,.72,-.19,.39,.045)
  box(-2.05,-.1,.3,.12,.12,.12,M.metal);box(2.02,-.18,.3,.14,.12,.12,M.metal)
  cyl(-2.05,-.25,.3,.07,.06,M.metal,'z');cyl(2.02,-.25,.3,.07,.06,M.metal,'z')
  return gun
}

function createTank() {
  const tank=new THREE.Group()
  const hull=new THREE.Group();tank.add(hull)
  // Lower hull and angular upper glacis.
  addBox(hull,0,-.05,0,3.65,.72,1.78,M.oliveDark)
  addBox(hull,.28,.34,0,3.05,.62,1.66,M.olive)
  addBox(hull,1.35,.18,0,.9,.42,1.7,M.oliveDark,-.18)
  addBox(hull,-1.48,.12,0,.72,.42,1.7,M.olive,-.12)
  addBox(hull,0,.56,0,2.2,.16,1.38,M.oliveDark)
  // Side armor skirts with segmented panels.
  for(const side of [-1,1]){
    const z=side*.94
    addBox(hull,0,-.02,z,2.95,.72,.16,M.oliveDark)
    for(let i=0;i<6;i++){
      const x=-1.25+i*.5
      addBox(hull,x,-.03,z+side*.095,.43,.58,.055,i%2?M.olive:M.oliveDark)
      addBox(hull,x,-.03,z+side*.13,.08,.46,.035,M.metal)
      addBolt(hull,x-.14,.18,z+side*.16,.035)
      addBolt(hull,x+.14,.18,z+side*.16,.035)
    }
    // Track loop, road wheels and individual tread shoes.
    addBox(hull,0,-.55,side*1.02,3.75,.78,.28,M.black)
    for(let i=0;i<7;i++){
      const x=-1.48+i*.49
      addCylinder(hull,x,-.57,side*1.2,.29,.18,M.darkMetal,'z',24)
      addCylinder(hull,x,-.57,side*1.305,.19,.035,M.metal,'z',20)
      addCylinder(hull,x,-.57,side*1.33,.075,.04,M.oliveDark,'z',16)
    }
    for(let i=0;i<17;i++){
      const x=-1.78+i*.22
      addBox(hull,x,-.12,side*1.19,.16,.09,.12,M.metal,0)
      addBox(hull,x,-.98,side*1.19,.16,.09,.12,M.metal,0)
    }
    // Front and rear track idlers.
    for(const x of [-1.82,1.82]){
      addCylinder(hull,x,-.55,side*1.2,.31,.2,M.darkMetal,'z',24)
      addCylinder(hull,x,-.55,side*1.32,.18,.04,M.metal,'z',20)
    }
    // Side-mounted fuel cans and tow hooks.
    addBox(hull,-1.35,.43,z+side*.12,.34,.38,.18,M.oliveDark)
    addBox(hull,-1.35,.43,z+side*.22,.2,.24,.035,M.orange)
    addCylinder(hull,1.48,-.26,z+side*.15,.11,.13,M.metal,'z',16)
  }
  // Rear engine deck, cooling grilles and exhausts.
  addBox(hull,-1.42,.58,0,.92,.16,1.42,M.oliveDark)
  for(let side of [-1,1])for(let i=0;i<7;i++)addBox(hull,-1.72+i*.1,.68,side*.42,.035,.025,.55,M.metal)
  for(let side of [-1,1]){
    addCylinder(hull,-1.82,.32,side*.58,.13,.28,M.darkMetal,'x',16)
    addCylinder(hull,-1.82,.32,side*.58,.09,.3,M.metal,'x',16)
  }
  // Turret ring and angular turret body.
  addCylinder(tank,.12,.66,0,.78,.24,M.darkMetal,'y',32)
  addCylinder(tank,.12,.79,0,.7,.12,M.metal,'y',32)
  const turret=new THREE.Group();turret.position.set(.12,.83,0);tank.add(turret)
  addBox(turret,-.05,.12,0,1.9,.72,1.48,M.olive)
  addBox(turret,.02,.48,0,1.42,.18,1.22,M.oliveDark)
  addBox(turret,.72,.18,0,.48,.58,1.25,M.oliveDark,-.12)
  addBox(turret,-.78,.2,0,.38,.54,1.28,M.oliveDark,.12)
  // Turret cheek armor and side panels.
  for(const side of [-1,1]){
    addBox(turret,-.08,.06,side*.77,.92,.42,.12,M.oliveDark)
    addBox(turret,-.08,.06,side*.85,.62,.23,.055,M.olive)
    for(let i=0;i<3;i++)addBolt(turret,-.38+i*.3,.12,side*.89,.045)
    addBox(turret,-.62,.5,side*.5,.3,.16,.22,M.darkMetal)
    addBox(turret,-.62,.59,side*.5,.18,.04,.16,M.orange)
  }
  // Main cannon with thermal sleeve, muzzle brake and bore.
  addCylinder(turret,1.28,.28,0,.14,2.2,M.darkMetal,'x',24)
  addCylinder(turret,1.05,.28,0,.205,.62,M.oliveDark,'x',24)
  addCylinder(turret,2.23,.28,0,.19,.42,M.metal,'x',24)
  addCylinder(turret,2.47,.28,0,.16,.06,M.black,'x',24)
  for(let i=0;i<4;i++)addBox(turret,2.3,.28,.18,.07,.12,.045,M.orange,0,i*Math.PI/2)
  // Mantlet and coaxial machine gun.
  addBox(turret,.88,.28,0,.48,.5,.62,M.oliveDark)
  addCylinder(turret,1.05,.05,.36,.055,1.15,M.darkMetal,'x',16)
  addCylinder(turret,1.62,.05,.36,.085,.12,M.metal,'x',16)
  // Commander cupola, hatch, periscopes.
  addCylinder(turret,-.42,.57,0,.36,.16,M.darkMetal,'y',24)
  addCylinder(turret,-.42,.69,0,.29,.12,M.olive,'y',24)
  addBox(turret,-.42,.77,0,.48,.06,.4,M.oliveDark)
  addBox(turret,-.42,.81,.23,.22,.025,.035,M.metal)
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5
    addBox(turret,-.42+Math.cos(a)*.28,.7,Math.sin(a)*.28,.12,.12,.1,M.glass,0,a)
  }
  // Independent sight module and headlights.
  addBox(turret,-.78,.48,.48,.38,.22,.3,M.darkMetal)
  addBox(turret,-.78,.49,.64,.22,.12,.025,M.glass)
  addCylinder(turret,-.78,.65,.48,.09,.12,M.orange,'y',16)
  for(const side of [-1,1]){
    addBox(hull,1.72,.28,side*.83,.28,.2,.12,M.darkMetal)
    addBox(hull,1.72,.3,side*.9,.16,.11,.035,M.glass)
    addBox(hull,1.88,.3,side*.9,.07,.13,.035,M.orange)
  }
  // Antenna and lifting eyes.
  addCylinder(turret,-.82,.95,-.52,.025,.62,M.darkMetal,'y',10)
  addCylinder(turret,-.82,1.27,-.52,.04,.05,M.orange,'y',12)
  for(const x of [-1.45,1.45])for(const side of [-1,1])addCylinder(hull,x,.48,side*.68,.07,.09,M.metal,'y',12)
  // Broad rear tow bar.
  addBox(hull,-2.02,-.28,0,.24,.16,.82,M.darkMetal)
  addCylinder(hull,-2.17,-.28,0,.09,.38,M.metal,'z',16)
  return tank
}

const models:Record<AssetId,THREE.Group>={rifle:createRifle(),tank:createTank()}
let active:AssetId='rifle'
let yaw=-.18,pitch=.12,zoom=1,drag=false,lx=0,ly=0

function fitCamera(model:THREE.Group) {
  const bounds=new THREE.Box3().setFromObject(model)
  const sphere=bounds.getBoundingSphere(new THREE.Sphere())
  const radius=Math.max(sphere.radius,1)
  const distance=radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*0.78
  camera.position.set(sphere.center.x+.2,sphere.center.y+.15,distance)
  camera.lookAt(sphere.center)
  return sphere.center
}
let target=new THREE.Vector3()
function updateCamera(){
  const model=models[active]
  model.rotation.set(pitch,yaw,0)
  camera.position.set(target.x+.2,target.y+.15,9.4/zoom)
  camera.lookAt(target)
}
function selectAsset(id:AssetId) {
  active=id
  scene.remove(models.rifle,models.tank)
  scene.add(models[id])
  const asset=assets.find(a=>a.id===id)!
  title!.innerHTML=asset.name+' <span>'+asset.subtitle+'</span>'
  eyebrow!.textContent=id==='tank'?'ПРОЦЕДУРНАЯ 3D-МОДЕЛЬ · ROBLOX STYLE':'ГОТОВАЯ 3D-МОДЕЛЬ · QUATERNIUS'
  description!.textContent=id==='tank'?'Детализированный стилизованный танк: башня, пушка, гусеницы, катки, люки и внешнее оборудование.':'Детализированная игровая винтовка. Зажми левую кнопку мыши и вращай модель. Колесо мыши — масштаб.'
  label!.innerHTML='<span class="live-dot"></span> LIVE PREVIEW <span class="separator">/</span> '+asset.subtitle
  details!.innerHTML='<div class="detail-block"><span class="detail-key">ТИП</span><strong>'+asset.type+'</strong></div><div class="detail-block"><span class="detail-key">МОДЕЛЬ</span><strong>3D · процедурная геометрия</strong></div><div class="detail-block"><span class="detail-key">АВТОР</span><strong>'+asset.author+'</strong></div><div class="detail-block"><span class="detail-key">СТАТУС</span><strong class="status">'+asset.status+'</strong></div>'
  yaw=id==='tank'?.42:-.18;pitch=id==='tank'?.08:.12;zoom=1
  const center=fitCamera(models[id]);target.copy(center)
  const bounds=new THREE.Box3().setFromObject(models[id]);const sphere=bounds.getBoundingSphere(new THREE.Sphere())
  const dist=sphere.radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*1.32
  camera.position.set(center.x+dist*.12,center.y+dist*.08,dist)
  camera.lookAt(center)
  gallery!.querySelectorAll<HTMLButtonElement>('.asset-card').forEach(b=>{
    const selected=b.dataset.asset===id
    b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))
  })
}
gallery.innerHTML=assets.map(a=>'<button class="asset-card" type="button" data-asset="'+a.id+'" aria-pressed="'+(a.id===active)+'"><span class="asset-thumb '+a.id+'"><i></i></span><span class="asset-copy"><strong>'+a.name+'</strong><small>'+a.type+'</small></span><span class="asset-index">'+a.subtitle+'</span></button>').join('')
gallery.querySelectorAll<HTMLButtonElement>('.asset-card').forEach(button=>button.addEventListener('click',()=>selectAsset(button.dataset.asset as AssetId)))
selectAsset('rifle')

function resize(){
  const w=host!.clientWidth,h=host!.clientHeight
  if(!w||!h)return
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()
}
const observer=new ResizeObserver(resize);observer.observe(host);resize()
renderer.domElement.style.position='absolute';renderer.domElement.style.inset='0';renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';renderer.domElement.style.display='block';renderer.domElement.style.cursor='grab'
renderer.domElement.addEventListener('pointerdown',e=>{
  if(e.button!==0)return
  drag=true;lx=e.clientX;ly=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='grabbing'
})
renderer.domElement.addEventListener('pointermove',e=>{
  if(!drag)return
  yaw+=(e.clientX-lx)*.008;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-ly)*.006,-1.1,1.1);lx=e.clientX;ly=e.clientY
  models[active].rotation.set(pitch,yaw,0)
})
const stop=()=>{drag=false;renderer.domElement.style.cursor='grab'}
renderer.domElement.addEventListener('pointerup',stop);renderer.domElement.addEventListener('pointercancel',stop);renderer.domElement.addEventListener('lostpointercapture',stop)
renderer.domElement.addEventListener('wheel',e=>{
  e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+(e.deltaY>0?-.08:.08),.65,1.55)
  const distance=camera.position.distanceTo(target);camera.position.set(target.x+.2,target.y+.15,distance*(zoom<1?1.06:.94));camera.lookAt(target)
},{passive:false})
let frame=0
function animate(){frame=requestAnimationFrame(animate);renderer.render(scene,camera)}
animate()
window.addEventListener('beforeunload',()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.dispose()})
