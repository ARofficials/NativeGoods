// DOM Elements
const editButton = document.getElementById('editButton');
const uploadLabel = document.getElementById('uploadLabel');
const imageUpload = document.getElementById('imageUpload');
const profilePicture = document.getElementById('profilePicture');
const removeProfilePictureButton = document.getElementById('removeProfilePicture');
const inputs = document.querySelectorAll('.form-group input');

// State
let isEditing = false;

// Functions
function toggleEditMode() {
    isEditing = !isEditing;

    // Update button text and icon
    editButton.innerHTML = isEditing
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Save'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>Edit';

    // Toggle input fields
    inputs.forEach(input => {
        input.disabled = !isEditing;
    });

    // Toggle image upload button
    uploadLabel.style.display = isEditing ? 'flex' : 'none';
    removeProfilePictureButton.style.display = isEditing ? 'block' : 'none';

    // Save changes when editing is turned off
    if (!isEditing) {
        saveProfileChanges();
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePicture.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function saveProfileChanges() {
    const profileForm = document.getElementById('profileForm');
    const inputs = profileForm.querySelectorAll('input');
    // Enable disabled fields before creating FormData
    inputs.forEach(input => {
        if (input.disabled) {
            input.disabled = false;
        }
    });

    const formData = new FormData(profileForm);
    // Debug: Log FormData entries
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    try {
        const response = await fetch('/update-profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert('Response OK ,Profile updated successfully!');
        } else {
            alert(data.error || 'Failed to update profile.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the profile.');
    }finally {
        // Re-disable the fields after submission
        inputs.forEach(input => {
            if (input.hasAttribute('data-was-disabled')) {
                input.disabled = true;
                    }
            });
        }
}
async function removeProfilePicture() {
    try {
        const response = await fetch('/remove-profile-picture/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile picture removed successfully!');
            profilePicture.src = 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360'; // Set default image
        } else {
            alert(data.error || 'Failed to remove profile picture.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while removing the profile picture.');
    }
}

// Event Listeners
editButton.addEventListener('click', toggleEditMode);
imageUpload.addEventListener('change', handleImageUpload);
removeProfilePictureButton.addEventListener('click', removeProfilePicture);