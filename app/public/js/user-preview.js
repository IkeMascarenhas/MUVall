let labelImg = document.querySelector('#logo-nome>label>img')
let userFile = document.querySelector('#img-perfil')


userFile.addEventListener('change', (e)=>{
    labelImg.src='imagem/perfil.png'
    const userTarget = e.target
    const file = userTarget.files[0]

     const reader = new FileReader()

    reader.addEventListener('load', (e)=>{
        const readerTarget = e.target
        var previewImage = document.createElement('img')
        labelImg.src=readerTarget.result
    })
    
    reader.readAsDataURL(file)

    // let previewImage = document.createElement('img')
    // previewImage.setAttribute('src', logo.value)
    // previewImage.setAttribute('class', 'imgLogo')
    // boxLogo.appendChild(previewImage)
})