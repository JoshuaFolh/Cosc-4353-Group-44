function gotoLink(link) {
    window.location.href = link.value;
}

//auth should be backend later
function auth(event) {
    var user = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    if (user == "admin" && pw == "admin") {
        //redirect to home page
        window.location.href = "./home/home.html";
    }
    else {
        document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block");
    }
    event.preventDefault();
}

const ele = document.querySelector("form");
ele.addEventListener("submit", auth, false);

