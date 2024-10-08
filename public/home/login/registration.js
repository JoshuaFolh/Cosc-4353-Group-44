function register(event) {
    window.location.href = "../index.html";
    event.preventDefault();
}

const reg_ele = document.querySelector(".registration_form");
reg_ele.addEventListener("submit", register, false);