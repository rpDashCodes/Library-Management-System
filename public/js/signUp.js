
document.addEventListener("DOMContentLoaded", () => {

    const signform = document.getElementById('signup-form');
    const errorMessageElement = document.getElementById('error-message');

    signform.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent form submission for validation
        const email = signform.email.value.trim();
        const firstName = signform.firstName.value.trim();
        const lastName = signform.lastName.value.trim();
        const password = signform.password.value.trim();
        const confirmPassword = signform['confirm-password'].value.trim();
        const gender = signform.gender.value.trim();
        const dateOfBirth = signform.dateOfBirth.value.trim();
        const rollNo = signform.rollNo.value.trim().toUpperCase();

        const formData = {
            'email': email,
            'firstName': firstName,
            'lastName': lastName,
            'password': password,
            'gender': gender,
            'dateOfBirth': dateOfBirth,
            'rollNo': rollNo
        }


        // Reset error message
        errorMessageElement.textContent = '';

        // Basic Validation
        if (password !== confirmPassword) {
            errorMessageElement.textContent = 'Passwords do not match.';
            return;
        }

        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            errorMessageElement.textContent = 'Please fill in all fields.';
            return;
        }

        fetch('/signSubmit', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to sign up.');
                });
            }
            return response.json();
        }).then(data => {
            alert(data.message || "registration successfull");
            signform.reset();
        }).catch(error => {
                errorMessageElement.textContent = error.message;

            })

    });
});