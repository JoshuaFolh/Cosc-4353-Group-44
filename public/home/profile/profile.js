const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

reg_ele.addEventListener('submit', profile_change);

async function profile_change(e) { 
    e.preventDefault(); 
    var obj = { 
        fullName: fullName.value,
        address1: address1.value,
        address2: address2.value,
        city: city.value,
        zipCode: zipCode.value,
        preference: preference.value,
        stateSel: stateSel.value,
        skills: skills.value, // This will be an array if multiple values are selected
        availability: availability.value
    };

    const res = await fetch(baseURL + 'profile', {
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
            document.cookie = "profile_change=true; " + "expires=" + loginDuration.toGMTString() + "; path=/";
            window.location.href = 'public\home\profile\profile.html';
        }
        else {
            document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
        }
    })
}