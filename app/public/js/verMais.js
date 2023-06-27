let adHidden = [...document.querySelectorAll('.hidden')]
let showAd = document.querySelector('#seeAds')

showAd.addEventListener('click', ()=>{
    showAd.remove()
    adHidden.map((ad)=>{
        ad.classList.toggle('show-ads')
    })

})

let avaHidden = [...document.querySelectorAll('.hide')]
let showAva = document.querySelector('#seeAva')

showAva.addEventListener('click', ()=>{
    showAva.remove()
    avaHidden.map((ad)=>{
        ad.classList.toggle('show-ads')
    })

})

