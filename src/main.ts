import './style.css'

const host = document.querySelector<HTMLDivElement>('#viewer')
if (!host) throw new Error('3D viewer container was not found')

host.innerHTML = `
  <div class="weapon-stage" aria-label="Интерактивная модель штурмовой винтовки">
    <svg class="weapon-model" viewBox="0 0 1100 520" role="img" aria-label="Штурмовая винтовка">
      <defs>
        <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#89958c"/><stop offset=".35" stop-color="#536057"/><stop offset="1" stop-color="#242d28"/></linearGradient>
        <linearGradient id="poly" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#424c45"/><stop offset="1" stop-color="#141b17"/></linearGradient>
        <linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a0aaa2"/><stop offset="1" stop-color="#46534a"/></linearGradient>
        <filter id="shadow" x="-30%" y="-40%" width="160%" height="200%"><feGaussianBlur stdDeviation="13"/></filter>
      </defs>
      <ellipse cx="540" cy="390" rx="440" ry="30" fill="#000" opacity=".42" filter="url(#shadow)"/>
      <g stroke="#111813" stroke-width="7" stroke-linejoin="round">
        <!-- stock -->
        <path d="M92 215 L250 215 L285 242 L282 298 L245 321 L105 310 L75 280 L75 244Z" fill="url(#poly)"/>
        <path d="M92 225 L235 225 L245 243 L105 243Z" fill="#68746b" stroke="none" opacity=".6"/>
        <path d="M105 256 L248 256 L248 290 L110 292Z" fill="#202923" stroke-width="4"/>
        <path d="M110 302 L245 302 L225 321 L128 316Z" fill="#121915"/>
        <!-- receiver main -->
        <path d="M240 215 L735 207 L786 232 L780 294 L724 320 L285 317 L245 291Z" fill="url(#steel)"/>
        <path d="M260 215 L734 207 L754 231 L280 244Z" fill="url(#top)" stroke="none"/>
        <path d="M270 252 L745 248 L742 285 L285 296Z" fill="#333e37" stroke-width="4"/>
        <path d="M310 300 L690 300 L670 323 L325 323Z" fill="#1b241e"/>
        <!-- handguard -->
        <path d="M255 202 L535 202 L555 225 L550 294 L530 315 L260 304 L240 279Z" fill="url(#poly)"/>
        <path d="M265 210 L525 210 L535 225 L260 230Z" fill="#7a877d" stroke="none" opacity=".65"/>
        <!-- handguard ribs -->
        <g stroke="#111813" stroke-width="5" fill="#68756c">
          <path d="M285 238 L300 238 L300 291 L285 290Z"/><path d="M320 238 L335 238 L335 293 L320 292Z"/>
          <path d="M355 238 L370 238 L370 294 L355 293Z"/><path d="M390 238 L405 238 L405 295 L390 294Z"/>
          <path d="M425 238 L440 238 L440 296 L425 295Z"/><path d="M460 238 L475 238 L475 296 L460 295Z"/>
          <path d="M495 238 L510 238 L510 297 L495 296Z"/>
        </g>
        <!-- barrel and flash hider -->
        <path d="M535 237 L900 237 L900 267 L535 267Z" fill="url(#steel)"/>
        <path d="M880 226 L1010 226 L1030 239 L1030 266 L1010 279 L880 279Z" fill="url(#poly)"/>
        <path d="M920 230 L920 275 M950 230 L950 275 M980 230 L980 275 M1008 238 L1008 267" stroke="#87938a" stroke-width="5"/>
        <!-- upper rail -->
        <path d="M285 188 L748 188 L760 210 L275 210Z" fill="url(#top)"/>
        <g fill="#7f8c82" stroke="#1a211c" stroke-width="3">
          <path d="M300 181 L315 181 L315 194 L300 194Z"/><path d="M328 181 L343 181 L343 194 L328 194Z"/>
          <path d="M356 181 L371 181 L371 194 L356 194Z"/><path d="M384 181 L399 181 L399 194 L384 194Z"/>
          <path d="M412 181 L427 181 L427 194 L412 194Z"/><path d="M440 181 L455 181 L455 194 L440 194Z"/>
          <path d="M468 181 L483 181 L483 194 L468 194Z"/><path d="M496 181 L511 181 L511 194 L496 194Z"/>
          <path d="M524 181 L539 181 L539 194 L524 194Z"/><path d="M552 181 L567 181 L567 194 L552 194Z"/>
          <path d="M580 181 L595 181 L595 194 L580 194Z"/><path d="M608 181 L623 181 L623 194 L608 194Z"/>
          <path d="M636 181 L651 181 L651 194 L636 194Z"/><path d="M664 181 L679 181 L679 194 L664 194Z"/>
          <path d="M692 181 L707 181 L707 194 L692 194Z"/>
        </g>
        <!-- scope -->
        <path d="M438 178 L455 142 L610 142 L630 178Z" fill="url(#poly)"/>
        <path d="M456 145 L610 145 L626 160 L445 160Z" fill="#89968d"/>
        <path d="M462 141 L475 116 L590 116 L607 141Z" fill="url(#steel)"/>
        <path d="M474 118 L585 118 L585 139 L474 139Z" fill="#15221f"/>
        <ellipse cx="530" cy="129" rx="49" ry="10" fill="#6c978f" stroke="#111813" stroke-width="5"/>
        <!-- front/rear sights -->
        <path d="M285 181 L305 181 L310 133 L297 119 L283 133Z" fill="url(#steel)"/>
        <path d="M716 184 L738 184 L738 143 L726 131 L714 143Z" fill="url(#steel)"/>
        <!-- pistol grip -->
        <path d="M365 306 L455 306 L442 383 L410 424 L360 409 L346 387Z" fill="url(#poly)"/>
        <path d="M370 322 L438 322 L426 380 L397 407 L374 395Z" fill="#303a33"/>
        <path d="M376 340 L432 340 M371 357 L428 357 M367 374 L423 374" stroke="#707c72" stroke-width="5"/>
        <!-- magazine -->
        <path d="M550 307 L655 307 L673 365 L656 466 L635 481 L570 474 L548 451 L538 365Z" fill="url(#poly)"/>
        <path d="M560 326 L645 326 L654 367 L642 446 L575 442 L555 367Z" fill="#3c4840" stroke-width="4"/>
        <path d="M555 448 L654 452 L649 473 L575 478Z" fill="#111914"/>
        <path d="M568 350 L644 350 M565 370 L641 370 M566 390 L638 390 M570 410 L634 410" stroke="#758177" stroke-width="4"/>
        <!-- trigger guard -->
        <path d="M460 305 L525 305 L516 352 L497 368 L465 362 L452 342Z" fill="none" stroke="#111813" stroke-width="12"/>
        <path d="M481 309 L489 339 L500 339 L504 310" fill="none" stroke="#9aa59b" stroke-width="5"/>
        <!-- ejection port, selector, pins -->
        <path d="M630 238 L715 235 L715 269 L630 271Z" fill="#151d18" stroke-width="4"/>
        <path d="M640 244 L705 242 L705 261 L640 263Z" fill="#89968c" stroke="none"/>
        <circle cx="300" cy="276" r="10" fill="#9ba69d"/><circle cx="300" cy="276" r="4" fill="#1b241e" stroke="none"/>
        <circle cx="720" cy="291" r="9" fill="#9ba69d"/><circle cx="720" cy="291" r="4" fill="#1b241e" stroke="none"/>
        <path d="M745 281 L785 281 L785 292 L745 292Z" fill="#9ba69d"/>
      </g>
      <g fill="#aab5ac" opacity=".75">
        <circle cx="330" cy="219" r="4"/><circle cx="360" cy="219" r="4"/><circle cx="390" cy="219" r="4"/>
        <circle cx="420" cy="219" r="4"/><circle cx="450" cy="219" r="4"/><circle cx="480" cy="219" r="4"/>
      </g>
    </svg>
  </div>
`

const stage = host.querySelector<HTMLDivElement>('.weapon-stage')!
const weapon = host.querySelector<SVGSVGElement>('.weapon-model')!
let dragging = false
let lastX = 0
let lastY = 0
let rotateX = -8
let rotateY = -12
let zoom = 1

function applyTransform() {
  weapon.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${zoom})`
}
applyTransform()

stage.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return
  dragging = true
  lastX = event.clientX
  lastY = event.clientY
  stage.setPointerCapture(event.pointerId)
  stage.classList.add('dragging')
})
stage.addEventListener('pointermove', (event) => {
  if (!dragging) return
  rotateY += (event.clientX - lastX) * 0.45
  rotateX = Math.max(-55, Math.min(55, rotateX - (event.clientY - lastY) * 0.35))
  lastX = event.clientX
  lastY = event.clientY
  applyTransform()
})
const stopDragging = () => {
  dragging = false
  stage.classList.remove('dragging')
}
stage.addEventListener('pointerup', stopDragging)
stage.addEventListener('pointercancel', stopDragging)
stage.addEventListener('lostpointercapture', stopDragging)
stage.addEventListener('wheel', (event) => {
  event.preventDefault()
  zoom = Math.max(0.65, Math.min(1.55, zoom + (event.deltaY > 0 ? -0.06 : 0.06)))
  applyTransform()
}, { passive: false })
