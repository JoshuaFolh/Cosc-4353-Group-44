document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-event');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const eventId = button.getAttribute('data-id');

            try {
                const response = await fetch(`/events/${eventId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Event deleted successfully!');
                    button.closest('.event_container').remove(); // Remove event from DOM
                } else {
                    alert('Error deleting event');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Failed to delete event');
            }
        });
    });
});
