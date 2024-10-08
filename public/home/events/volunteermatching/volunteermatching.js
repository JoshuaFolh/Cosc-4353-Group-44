function addVolunteer() {
    const volunteer_rect = document.querySelector(".volunteer_rect");
    volunteer_rect.innerHTML += `<div class="volunteer_item">Volunteer Details</div>`;
}

function addEvent() {
    const event_rect = document.querySelector(".event_rect");
    event_rect.innerHTML += `<div class="event_item">Event Details</div>`;
}