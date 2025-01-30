document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    
    const changePasswordForm = document.getElementById('changePasswordForm-container');
    const changePasswordButton = document.getElementById('change-Password-Button');
    const logOut = document.getElementById('logOut-Button');
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');
    
    const memberName = document.getElementById('userName');
    function getMemberName() {
        fetch('getMemberName')
            .then(response => response.json())
            .then(data => {
                memberName.textContent =`Welcome, ${data.name}`;
            })
            .catch(error => {
                memberName.textContent =`Welcome, User`;
            });
    };
    getMemberName();

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

    changePasswordButton.addEventListener('click', () => {
        changePasswordForm.style.display = 'block';
    });
    logOut.addEventListener('click', () => {
        window.location.href = "/logout";
    });

    
        changePasswordForm.addEventListener('submit', (e) => {
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
                })
                .catch(error => {
                    clearMessage();
                    failureMessage.textContent = error.message;
                });
        });

});