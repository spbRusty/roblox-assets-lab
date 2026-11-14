import * as THREE from 'three'
import './style.css'
const host=document.querySelector<HTMLDivElement>('#viewer')
if(!host) throw new Error('3D viewer container was not found')
const viewer: HTMLDivElement = host
const scene=new THREE.Scene(); scene.background=new THREE.Color('#151a17')
const camera=new THREE.PerspectiveCamera(35,1,.1,100); camera.position.set(.5,1.1,7.8)
const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.25; renderer.shadowMap.enabled=true; viewer.replaceChildren(renderer.domElement)
scene.add(new THREE.HemisphereLight(0xd9e5d9,0x202820,2))
const key=new THREE.DirectionalLight(0xfff0d9,3); key.position.set(-3,6,5); key.castShadow=true; scene.add(key)
const rim=new THREE.DirectionalLight(0x91b5a1,2.5); rim.position.set(3,2,-5); scene.add(rim)
const gun=new THREE.Group(); scene.add(gun)
const dark=new THREE.MeshStandardMaterial({color:0x252e28,roughness:.8,metalness:.25}), metal=new THREE.MeshStandardMaterial({color:0x59645b,roughness:.45,metalness:.75}), edge=new THREE.MeshStandardMaterial({color:0x89958b,roughness:.4,metalness:.8}), rubber=new THREE.MeshStandardMaterial({color:0x151b17,roughness:.95}), glass=new THREE.MeshStandardMaterial({color:0x527b75,roughness:.15,metalness:.3})
function box(x:number,y:number,z:number,sx:number,sy:number,sz:number,m:THREE.Material,rz=0){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);o.rotation.z=rz;o.castShadow=true;o.receiveShadow=true;gun.add(o);return o}
function cyl(x:number,y:number,z:number,r:number,len:number,m:THREE.Material,axis='x'){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,20),m);if(axis==='x')o.rotation.z=Math.PI/2;if(axis==='z')o.rotation.x=Math.PI/2;o.position.set(x,y,z);o.castShadow=true;gun.add(o);return o}
// Телескопический приклад
box(-2.55,.12,0,1.4,.48,.5,dark);box(-2.55,.39,0,1.15,.12,.46,metal);box(-3.3,.1,0,.16,.58,.56,rubber)
// Корпус
box(-.45,.08,0,2.45,.55,.64,metal);box(-.42,.39,0,2.35,.2,.59,edge);box(-.42,.1,.33,1.85,.28,.04,dark)
// Цевьё с рёбрами
box(.95,.14,0,1.55,.58,.7,dark);box(.95,.47,0,1.62,.1,.74,metal)
for(let i=0;i<9;i++){const x=.28+i*.17;box(x,.12,.36,.055,.38,.05,metal);box(x,-.17,0,.055,.06,.74,metal)}
// Ствол и дульный тормоз
cyl(2.35,.22,0,.105,2.45,metal);cyl(1.15,.53,0,.055,1.55,dark);cyl(3.38,.22,0,.16,.16,edge);cyl(3.62,.22,0,.19,.42,dark)
for(let i=0;i<3;i++)box(3.55+i*.1,.22,.18,.055,.12,.03,edge)
// Планка Пикатинни
box(-.1,.57,0,2.7,.08,.22,dark)
for(let i=0;i<19;i++)box(-1.38+i*.145,.65,0,.075,.09,.29,edge)
// Оптический прицел
box(.02,.78,0,.55,.2,.25,dark);cyl(.02,1.02,0,.17,.78,dark);cyl(.43,1.02,0,.22,.1,edge);cyl(-.39,1.02,0,.2,.1,edge);cyl(.49,1.02,0,.16,.02,glass);box(.02,1.25,0,.2,.17,.2,metal);cyl(.02,1.37,0,.09,.1,dark,'y')
// Мушки
box(1.68,.7,0,.2,.12,.2,dark);box(1.68,.84,0,.055,.22,.07,edge);box(-1.22,.72,0,.2,.12,.2,dark);box(-1.22,.83,0,.06,.18,.08,edge)
// Рукоятка, спусковая скоба
box(-.72,-.53,.02,.42,.92,.48,dark,-.22);box(-.72,-.53,.27,.31,.62,.03,rubber,-.22);box(-.05,-.25,0,.62,.08,.5,dark);box(.23,-.38,0,.08,.25,.5,edge);box(-.34,-.38,0,.08,.25,.5,edge);cyl(-.08,-.32,0,.035,.22,edge,'z')
// Изогнутый магазин и мелкие детали
box(.48,-.65,0,.55,1.12,.48,dark,-.1);box(.48,-.65,.25,.4,.9,.03,metal,-.1);box(.53,-1.23,0,.62,.12,.53,rubber)
box(.35,.22,.34,.55,.16,.03,rubber);box(-.9,.47,.38,.38,.07,.08,edge)
cyl(-.85,.03,.36,.09,.035,edge,'z');cyl(-1.25,-.02,.36,.065,.035,edge,'z');cyl(.82,-.02,.36,.065,.035,edge,'z')
box(.95,-.02,.4,1.3,.12,.08,metal);for(let i=0;i<8;i++)box(.38+i*.16,-.02,.46,.07,.2,.04,edge)
// Тень
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.22}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.36;floor.receiveShadow=true;scene.add(floor)
let yaw=-.18,pitch=.12,zoom=1,drag=false,lx=0,ly=0
function update(){gun.rotation.set(pitch,yaw,0);camera.position.set(.2,.15,7.8/zoom);camera.lookAt(.05,.02,0)}
update()
function resize(){const w=viewer.clientWidth,h=viewer.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
const observer=new ResizeObserver(resize);observer.observe(host);resize()
renderer.domElement.style.cursor='grab';renderer.domElement.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=true;lx=e.clientX;ly=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='grabbing'})
renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-lx)*.008;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-ly)*.006,-1.1,1.1);lx=e.clientX;ly=e.clientY;update()})
const stop=()=>{drag=false;renderer.domElement.style.cursor='grab'};renderer.domElement.addEventListener('pointerup',stop);renderer.domElement.addEventListener('pointercancel',stop);renderer.domElement.addEventListener('lostpointercapture',stop)
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+(e.deltaY>0?-.08:.08),.65,1.55);update()},{passive:false})
let frame=0;function animate(){frame=requestAnimationFrame(animate);renderer.render(scene,camera)}animate()
window.addEventListener('beforeunload',()=>{cancelAnimationFrame(frame);observer.disconnect();renderer.dispose()})
