// State and district data
const stateDistricts = {
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Karnataka": ["Bangalore Urban", "Bangalore Rural", "Belgaum", "Bellary", "Bidar", "Chamrajnagar", "Chickmagalur", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Salem"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Sangli", "Satara", "Ratnagiri", "Sindhudurg"]
};

// Initialize form elements
const form = document.getElementById('userDetailsForm');
const stateSelect = document.getElementById('state');
const districtSelect = document.getElementById('district');
const backButton = document.getElementById('backButton');
const proceedButton = document.getElementById('proceedButton');

// Populate states dropdown
function populateStates() {
    Object.keys(stateDistricts).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Update districts based on selected state
function updateDistricts() {
    const selectedState = stateSelect.value;
    districtSelect.innerHTML = '<option value="">Select District</option>';
    
    if (selectedState && stateDistricts[selectedState]) {
        stateDistricts[selectedState].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;
    } else {
        districtSelect.disabled = true;
    }
}

// Validate phone number
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate PIN code
function validatePincode(pincode) {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
}

// Show error message
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear error message
function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        clearError(field);
        
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            switch (field.id) {
                case 'phone':
                    if (!validatePhone(field.value)) {
                        showError(field, 'Please enter a valid 10-digit mobile number');
                        isValid = false;
                    }
                    break;
                case 'email':
                    if (!validateEmail(field.value)) {
                        showError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                    break;
                case 'pincode':
                    if (!validatePincode(field.value)) {
                        showError(field, 'Please enter a valid 6-digit PIN code');
                        isValid = false;
                    }
                    break;
            }
        }
    });
    
    return isValid;
}
// Load saved data (if any)
function loadSavedData() {
    const savedData = localStorage.getItem('userDetails');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = form.elements[key];
            if (field) {
                if (field.type === 'radio') {
                    const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    field.value = data[key];
                }
            }
        });
        
        // Update districts if state is selected
        if (data.state) {
            updateDistricts();
            if (data.district) {
                districtSelect.value = data.district;
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateStates();
    loadSavedData();
    
    stateSelect.addEventListener('change', updateDistricts);
    form.addEventListener('submit', handleSubmit);
});

// Real-time validation
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const pincodeInput = document.getElementById('pincode');

phoneInput.addEventListener('input', () => {
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid 10-digit mobile number');
    } else {
        clearError(phoneInput);
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.value && !validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
    } else {
        clearError(emailInput);
    }
});

pincodeInput.addEventListener('input', () => {
    if (pincodeInput.value && !validatePincode(pincodeInput.value)) {
        showError(pincodeInput, 'Please enter a valid 6-digit PIN code');
    } else {
        clearError(pincodeInput);
    }
});