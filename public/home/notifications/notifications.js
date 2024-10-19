const baseURL = 'http://localhost:3000/';

function addNotif(string) {
    const inbox = document.querySelector(".inbox_preview");
    inbox.innerHTML += '<button class="notif_preview" type="button" value="' + string + '" onclick="update(this.value)"><span class="notif">' +
    string + '</span></button>';
}

function update(string) {
    const notif_focus = document.querySelector(".notif_focus");
    notif_focus.innerText = string;
}

const ele = document.querySelector(".button-add_notif");
ele.addEventListener("click", add_notif);

async function add_notif(e) { 
    e.preventDefault(); 
    const res = await fetch(baseURL + 'notifs_update', {
        method: "GET",
    }).then((response) => {
        return response.json();
    }).then((json) => {
        for (let element of json.notifs) {
            //console.log(element);
            addNotif(element);
        }
    })

}