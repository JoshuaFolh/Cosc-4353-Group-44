const baseURL = 'http://localhost:3000/';

//not in use
function addVolunteer() {
    const volunteer_rect = document.querySelector(".volunteer_rect");
    volunteer_rect.innerHTML += `<div class="volunteer_item">Volunteer Details</div>`;
}

function addEvent(string) {
    const event_rect = document.querySelector(".event_rect");
    event_rect.innerHTML += '<div class="event_item">' + string + '</div>';
}

function clearEvents() {
    const event_rect = document.querySelector(".event_rect");
    event_rect.innerHTML = "";
}

const volunteer_ele = document.querySelector(".volunteer_lookup");
volunteer_ele.addEventListener("submit", findEventsForVolunteer);

async function findEventsForVolunteer(e) { 
    clearEvents();
    e.preventDefault(); 
    var obj = { 
        user: username.value,
    };

    const res = await fetch(baseURL + 'find_events', {
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
        if (json.status == "no such user found!") {
            console.log("joever");
        }
        else {
            console.log(json);
            for (const i in json) {
                addEvent(
                    json[i].name + '<br>' +
                    json[i].skills + '<br>'
                );
            }
        }
    })
}