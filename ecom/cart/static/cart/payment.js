document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("paymentForm");
    const cardNumberInput = document.getElementById("cardNumber");
    const expiryInput = document.getElementById("expiry");
    const cvvInput = document.getElementById("cvv");
    const cardNameInput = document.getElementById("cardName");

    // Format card number (add spaces every 4 digits)
    cardNumberInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = "";

        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += " ";
            }
            formattedValue += value[i];
        }

        e.target.value = formattedValue;
    });

    // Format and validate expiry date (MM/YY) in real-time
    expiryInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        
        // Auto-insert "/" after 2 digits (MM/YY)
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        
        e.target.value = value;
        
        // Real-time validation (check while typing)
        const expiry = e.target.value;
        const errorElement = expiryInput.nextElementSibling;
        
        // Remove old error if exists
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        
        // Basic format check (MM/YY)
        if (expiry.length >= 5 && !expiry.match(/^\d{2}\/\d{2}$/)) {
            showError("Please enter a valid expiry date (MM/YY)", expiryInput);
            return;
        }
        
        // If format is correct, validate month and year
        if (expiry.match(/^\d{2}\/\d{2}$/)) {
            const [monthStr, yearStr] = expiry.split('/');
            const month = parseInt(monthStr, 10);
            const year = parseInt(yearStr, 10);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            // Validate month (1-12)
            if (month < 1 || month > 12) {
                showError("Month must be between 01-12", expiryInput);
                return;
            }
            
            // Validate year (must be current or future)
            const fullYear = 2000 + year;
            if (fullYear < currentDate.getFullYear() || 
                (fullYear === currentDate.getFullYear() && month < currentMonth)) {
                showError("Card has expired or will expire soon", expiryInput);
                return;
            }
        }
    });

    // Allow only numbers in CVV (3-4 digits)
    cvvInput.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
        
        // Real-time CVV validation (3 or 4 digits)
        const cvv = e.target.value;
        const errorElement = cvvInput.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        
        if (cvv.length > 0 && !cvv.match(/^\d{3,4}$/)) {
            showError("CVV must be 3 or 4 digits", cvvInput);
        }
    });

    // Credit Card form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form values
        const cardNumber = cardNumberInput.value.replace(/\s/g, "");
        const cardName = cardNameInput.value.trim();
        const expiry = expiryInput.value;
        const cvv = cvvInput.value;

        // Validate card number (16 digits)
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            showError("Please enter a valid 16-digit card number", cardNumberInput);
            return;
        }

        // Validate card name (not empty)
        if (cardName === "") {
            showError("Please enter the cardholder name", cardNameInput);
            return;
        }

        // Validate expiry date (MM/YY format)
        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            showError("Please enter a valid expiry date in MM/YY format", expiryInput);
            return;
        }
        
        const [monthStr, yearStr] = expiry.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        // Validate month (1-12)
        if (month < 1 || month > 12) {
            showError("Please enter a valid month (01-12)", expiryInput);
            return;
        }
        
        // Validate year
        const fullYear = 2000 + year;
        if (fullYear < currentDate.getFullYear() || 
            (fullYear === currentDate.getFullYear() && month < currentMonth)) {
            showError("Please enter an expiry date in the future", expiryInput);
            return;
        }

        // Validate CVV (3 or 4 digits)
        if (!cvv.match(/^\d{3,4}$/)) {
            showError("Please enter a valid CVV (3 or 4 digits)", cvvInput);
            return;
        }

        // Show processing state
        const payButton = document.querySelector('.pay-button');
        const originalButtonText = payButton.innerHTML;
        payButton.disabled = true;
        payButton.innerHTML = 'Processing... <div class="spinner"></div>';

        // Simulate payment processing (2 seconds delay)
        setTimeout(() => {
            showSuccessModal();
            payButton.disabled = false;
            payButton.innerHTML = originalButtonText;
        }, 2000);
    });

    // Show error message near the input field
    function showError(message, inputElement = null) {
        // Remove any existing error messages
        const existingError = inputElement ? 
            inputElement.nextElementSibling : 
            document.querySelector('.error-message');
        
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insert error message near the input field if specified
        if (inputElement) {
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        } else {
            // Default: Insert before pay button
            const payButton = document.querySelector('.pay-button');
            payButton.parentNode.insertBefore(errorElement, payButton);
        }
        
        // Scroll to error (if needed)
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Show success modal
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('active');
        
        // Close modal when button is clicked
        document.getElementById('successButton').addEventListener('click', function() {
            modal.classList.remove('active');
            // Here you could redirect to another page if needed
            // window.location.href = "/thank-you";
        });
    }
});