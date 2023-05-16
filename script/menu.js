//menu Hamburguer

let menu = document.querySelector('#menu-container')
let menuItems = document.querySelector('#menu-items')
menu.addEventListener("click", ()=>{
    menuItems.classList.toggle("show-items")
})

//Ver mais(perfil)

let adHidden = [...document.querySelectorAll('.hidden')]
let showAd = document.querySelector('#seeAds')

showAd.addEventListener('click', ()=>{
    showAd.innerHTML='Ver menos'
    adHidden.map((ad)=>{
        ad.classList.toggle('show-ads')
    })
})