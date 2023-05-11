let menu = document.querySelector('#menu-container')
let menuItems = document.querySelector('#menu-items')



menu.addEventListener("click", ()=>{
    menuItems.classList.toggle("show-items")
})