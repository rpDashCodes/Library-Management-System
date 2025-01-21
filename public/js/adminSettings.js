document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    
    const forms = Array.from(document.getElementsByTagName('form'));
    const changeNameForm = document.getElementById('changeNameForm-container');
    const changePasswordForm = document.getElementById('changePasswordForm-container');
    const changeNameButton = document.getElementById("change-Name-Button");
    const changePasswordButton = document.getElementById('change-Password-Button');
    const logOut = document.getElementById('logOut-Button');
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');
    
    const adminName = document.getElementById('adName');
    function getAdminName() {
        fetch('adSetting/getAdminName')
            .then(response => response.json())
            .then(data => {
                adminName.textContent =`Welcome, ${data.adminName}`;
            })
            .catch(error => {
                adminName.textContent =`Welcome, Admin`;
            });
    };
    getAdminName();

    function clearMessage(){
        successMessage.textContent = "";
        failureMessage.textContent = "";
    };

    hamburger.textContent = "☰";
    hamburger.addEventListener("click", () => {
        const navBar = document.getElementById('navigation');

        if (hamburger.textContent == "☰") {
            hamburger.innerHTML = '<img src="/image/plus.svg" alt="close" style="width: 20px; height: 20px;">';
            navBar.style.width = "67px";
        }
        else {
            hamburger.textContent = "☰";
            navBar.style.width = "0px";
            greet.style.padding = '5px 12px';
        }
    });

    function closeAllForms() {
        changeNameForm.style.display = 'none';
        changePasswordForm.style.display = 'none';
    }

    changeNameButton.addEventListener('click', () => {
        closeAllForms();
        changeNameForm.style.display = 'block';

    });
    changePasswordButton.addEventListener('click', () => {
        closeAllForms();
        changePasswordForm.style.display = 'block';
    });
    logOut.addEventListener('click', () => {
        window.location.href = "/logout";
    });

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const formAction = form.getAttribute('action');
            fetch(formAction, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if(!response.ok)
                    {
                        return response.json().then(data => {throw new Error(data.message
                             || 'Something went wrong');});
                    }
                        return response.json();
                })
                .then(data => {
                    form.reset();
                    clearMessage();
                    successMessage.textContent = data.message;
                    getAdminName();
                })
                .catch(error => {
                    clearMessage();
                    failureMessage.textContent = error.message;
                });
        });
    });

});