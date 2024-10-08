function gotoLink(link) {
    window.location.href = link.value;
}

const baseURL = 'http://localhost:3000/'; //the URL of the server

const username = document.getElementById('username');
const password = document.getElementById('password');
const login_ele = document.getElementById('login_form');

login_ele.addEventListener('submit', authenticate);

async function authenticate(e) { 
    e.preventDefault(); //prevent submit from doing its default behavior because it will normally refresh the page
    var obj = { //object to store the user + pw
        user: username.value,
        pass: password.value
    };

    const res = await fetch(baseURL, { //https://www.youtube.com/watch?v=5TxF9PQaq4U&list=LL&index=3
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            parcel: obj
        })
    }).then((response) => { //he doesn't go over this in the video
        //basically the fetch() function returns a "response stream"
        //this is NOT the same as a JSON. we have to return response.json() to be able to access the JSON
        return response.json();
    }).then((json) => { //here we can use the JSON
        //we can also do this with text, so we could've returned response.text() previously
        //and then done .then((text)) => {} to work with the raw text
        if (json.auth == "correct") { 
            window.location.href = "./home/home.html";
        }
        else {
            document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
        }
    })
}