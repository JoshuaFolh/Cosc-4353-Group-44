const baseURL = 'http://localhost:3000/';

const name = document.getElementById('name');
const description = document.getElementById('description');
const loc = document.getElementById('loc');
const skills = document.getElementById('Skills');
const stateSel = document.getElementById('StateSel');
const Urgency = document.getElementById('Urgency');

const reg_ele = document.getElementById('subBtn');
reg_ele.addEventListener('click', addEvent);

async function addEvent(e) {
    e.preventDefault();

    // Gather skills (multi-select values)

    const obj = { 
        name: name.value,
        description: description.value,
        loc: loc.value,
        skills: skills.value,
        Urgency: Urgency.value // Ensure "UrgencySel" is used if correcting elsewhere
    };

    const res = await fetch(baseURL + 'create_event', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            parcel: obj
        })
    }).then(response => response.json())
      .then(json => {
          if (json.status === "good") {
              console.log("Event created");
          } else {
              console.log("Event creation failed");
          }
      }).catch(err => {
          console.error("Error:", err);
      });
}
