//Extract and send member credential to server 
function extractMemberData(e) {
    e.preventDefault(); // Prevent form submission for validation

    const memberLoginForm = e.target;
    const errorMessageElement = document.getElementById('error-message');
    const rollNo = memberLoginForm.rollNo.value.trim().toUpperCase();
    const password = memberLoginForm.password.value.trim();

    const formData = {

        'rollNo': rollNo,
        'password': password,
        'role' : 'member'
    }


    // Reset error message
    errorMessageElement.textContent = '';

    // Basic Validation

    if (!password || !rollNo) {
        errorMessageElement.textContent = 'Please fill in all fields.';
        return;
    }

    fetch('/loginSubmit', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Failed to login.');
            });
        }
        return response.json();
    }).then(data => {
        alert(data.message || "signIn successfull");
        memberLoginForm.reset();
    }).catch(error => {
        errorMessageElement.textContent = error.message;

    })
}

//Extract and send Admin login credential
function extractAdminData(e) {
    console.log('admin request');
    e.preventDefault(); // Prevent form submission for validation
    const adminLoginForm = e.target;
    const errorMessageElement = document.getElementById('error-message');
    const adminId = adminLoginForm.adminId.value.trim();
    const password = adminLoginForm.password.value.trim();

    const formData = {
        'adminId': adminId,
        'password': password,
        'role' : 'admin'
    }
    // Reset error message
    errorMessageElement.textContent = '';

    // Basic Validation

    if (!password || !adminId) {
        errorMessageElement.textContent = 'Please fill in all fields.';
        return;
    }

    fetch('/loginSubmit', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message|| 'Failed to login.');
            });
        }
        return response.json();
    }).then(data => {
        errorMessageElement.style.color = 'green';
        errorMessageElement.textContent = data.message;
        setTimeout(() => {
            adminLoginForm.reset();
            window.location.href = data.redirect;
        }, 500);
    }).catch(error => {
        errorMessageElement.textContent = error.message;

    })
}

document.addEventListener("DOMContentLoaded", () => {

    const memberLoginForm = document.getElementById('mlogin-form');
    if(memberLoginForm)
    {
        memberLoginForm.addEventListener('submit', extractMemberData);
    }
    const adminLoginForm = document.getElementById('adlogin-form');
    if(adminLoginForm)
    {
        adminLoginForm.addEventListener('submit', extractAdminData);
    }

});