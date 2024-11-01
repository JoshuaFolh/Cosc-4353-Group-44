function gotoLink(link) {
    window.location.href = link.value;
}

const baseURL = 'http://localhost:3000/'; //the URL of the server

const username = document.getElementById('username');
const password = document.getElementById('password');
const login_ele = document.getElementById('login_form');

login_ele.addEventListener('submit', authenticate);

async function authenticate(e) { 
    e.preventDefault(); 
    var obj = { 
        user: username.value,
        pass: password.value
    };

    const res = await fetch(baseURL + 'login', { //https://www.youtube.com/watch?v=5TxF9PQaq4U&list=LL&index=3
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            parcel: obj
        })
    }).then((response) => { 
        return response.json();
    }).then((json) => { 
        if (json.auth == "valid") { 
            var sessionTimeout = 1; //hours
            var loginDuration = new Date();
            loginDuration.setTime(loginDuration.getTime() + (sessionTimeout*60*60*1000));
            document.cookie = "logged_in=true; " + "expires=" + loginDuration.toGMTString() + "; path=/";
            window.location.href = "./home/home.html";
        }
        else {
            document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
        }
    })
}