const baseURL = 'http://localhost:3000/';

const reg_ele = document.querySelector(".registration_form");
reg_ele.addEventListener("submit", register);

async function register(e) { 
    e.preventDefault(); 
    var obj = { 
        user: username.value,
        pass: password.value
    };

    const res = await fetch(baseURL + 'registration', {
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
            //at this point the new user should be added to the db
            //and then redirected to the login page
            //but we have no db so they will just be logged in
            var sessionTimeout = 1; //hours
            var loginDuration = new Date();
            loginDuration.setTime(loginDuration.getTime() + (sessionTimeout*60*60*1000));
            //document.cookie = "logged_in=true; " + "expires=" + loginDuration.toGMTString() + "; path=/";
            window.location.href = "../../index.html";
        }
        else {
            document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
        }
    })
}