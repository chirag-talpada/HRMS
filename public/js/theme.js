const MenuBtn = document.querySelector("#menu-btn");
const SideMenu = document.querySelector("#sidebar");
const CloseBtn = document.querySelector("#close-btn");
const ThemeToggler = document.querySelector(".theme-toggler");

ThemeToggler.addEventListener("click", () => {
    document.body.classList.toggle('dark-theme-variables')

    ThemeToggler.querySelector('.theme-toggler__button--light').classList.toggle('theme-toggler__button--active')
    ThemeToggler.querySelector('.theme-toggler__button--dark').classList.toggle('theme-toggler__button--active')
})