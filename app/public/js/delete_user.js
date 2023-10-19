const deletar = [...document.querySelectorAll(".delete")]
const cadastrados = document.querySelector("#cadastrados")
const quantCadastrados = [...document.querySelectorAll("tbody>tr")]

cadastrados.innerHTML=quantCadastrados.length

deletar.map((el)=>{
    el.addEventListener('click', ()=>{
        el.parentElement.remove()
        cadastrados.innerHTML=[...document.querySelectorAll("tbody>tr")].length
    })
})

