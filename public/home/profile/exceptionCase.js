document.getElementById('SkillsForm').addEventListener('submit', function(event) {
    let skillsSelect = document.getElementById('Skills');
    let selectedOptions = skillsSelect.selectedOptions;
    let hiddenInput = document.getElementById('hiddenSkill');
    
    if (selectedOptions.length === 0) {
        hiddenInput.disabled = false;
    } else {
        hiddenInput.disabled = true;
    }
});
