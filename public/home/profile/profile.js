const baseURL = 'http://localhost:3000/';

const fullName = document.getElementById('Full Name');
const address1 = document.getElementById('Address 1');
const address2 = document.getElementById('Address 2');
const city = document.getElementById('City');
const zipCode = document.getElementById('Zip Code');
const preference = document.getElementById('Preference');
const stateSel = document.getElementById('StateSel');
const skills = document.getElementById('Skills');
const availability = document.getElementById('availability');

const reg_ele = document.getElementById('subBtn');
reg_ele.addEventListener('click', profile_change);

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
    //console.log(fullName.value);

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
        if (json.status == "good") { 
            //window.location.href = 'public\home\profile\profile.html';
            console.log("profile success");
        }
        else {
            //document.querySelectorAll(".form_message-error").forEach(x => x.style.display = "block"); //display error message
            console.log("profile failure");
        }
    })
}