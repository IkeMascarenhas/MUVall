//menu Hamburguer(Geral)

let menu = document.querySelector('#menu-container')
let menuItems = document.querySelector('#menu-items')
menu.addEventListener("click", ()=>{
    menuItems.classList.toggle("show-items")
})

//Ver mais(perfil)

// let adHidden = [...document.querySelectorAll('.hidden')]
// let showAd = document.querySelector('#seeAds')

// showAd.addEventListener('click', ()=>{
//     showAd.innerHTML='Ver menos'
//     adHidden.map((ad)=>{
//         ad.classList.toggle('show-ads')
//     })
// })

// Adicionar Logo(Cadastro anunciante)

let addLogo = document.querySelector('.addLogo')
let logoFile = document.querySelector('#Logo')
let boxLogo = document.querySelector('#boxLogo')

console.log(logoFile)

logoFile.addEventListener('change', (e)=>{
    const preview = document.querySelector('#preview-image')

    if(preview){
        preview.remove()
    }

    const logoTarget = e.target
    const file = logoTarget.files[0]


     const reader = new FileReader()

    reader.addEventListener('load', (e)=>{
        const readerTarget = e.target
        var previewImage = document.createElement('img')
        previewImage.setAttribute('src', readerTarget.result)
        previewImage.setAttribute('class', 'imgLogo')
        previewImage.id = 'preview-image'
        boxLogo.appendChild(previewImage)

    })
    
    reader.readAsDataURL(file)


    console.log(file)
    // let previewImage = document.createElement('img')
    // previewImage.setAttribute('src', logo.value)
    // previewImage.setAttribute('class', 'imgLogo')
    // boxLogo.appendChild(previewImage)
})








