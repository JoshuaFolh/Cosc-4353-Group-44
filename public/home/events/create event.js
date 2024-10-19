const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

reg_ele.addEventListener('submit', event_create);

async function event_create(e) { 
    e.preventDefault(); 
    var obj = { 
        name: name.value,
        description: description.value,
        location: location.value,
        skills: skills.value,
        UrgencyForm: UrgencyForm.value
    };

    const res = await fetch(baseURL + 'create event', {
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
            var sessionTimeout = 1; //hour
            var loginDuration = new Date();
            loginDuration.setTime(loginDuration.getTime() + (sessionTimeout*60*60*1000));
            document.cookie = "event_create=true; " + "expires=" + loginDuration.toGMTString() + "; path=/";
            window.location.href = 'public\home\events\create event.js';
        }
        else {
            document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
        }
    })
}