// Sticky Navbar
let header = document.querySelector('header');
let menu = document.getElementById('menu-icon');
let navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    header.classList.toggle('shadow', window.scrollY > 0);
});

menu.onclick = () => {
    function a() {
        navbar.classList.toggle('active')
    }
    a()
}