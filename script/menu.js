//menu Hamburguer

let menu = document.querySelector('#menu-container')
let menuItems = document.querySelector('#menu-items, #menu-container> ul > img')
menu.addEventListener("click", ()=>{
    menuItems.classList.toggle("show-items")
})

//Ver mais(perfil)

let adHidden = [...document.querySelectorAll('.hidden')]
let showAd = document.querySelector('#seeAds')

showAd.addEventListener('click', ()=>{
    adHidden.map((ad)=>{
        ad.classList.toggle('show-ads')
    })
})