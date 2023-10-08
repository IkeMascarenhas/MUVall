//menu Hamburguer(Geral)

let menu = document.querySelector('#menu-container')
let menuItems = document.querySelector('#menu-items')
let fechar = document.querySelector('#close')
menu.addEventListener("click", ()=>{
    menuItems.classList.toggle("show-items")
})


fechar.addEventListener("click", () => {
    menuItems.classList.toggle("show-items")
})


let NaoPropagar = [...document.querySelectorAll('.NaoPropagar')]
NaoPropagar.map((el)=>{
    el.addEventListener('click', (evt)=>{
        evt.stopPropagation()
    })
})

