
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    const pendingButton = document.getElementById("pendingButton");
    const blockButton = document.getElementById("blockButton");
    const deleteButton = document.getElementById("deleteButton");
    const content = document.getElementById('content');
    const forms = Array.from(document.getElementsByTagName("form"));
    const successMessage = document.getElementById('successMessage');
    const failuremessage = document.getElementById('failureMessage');



    const adminName = document.getElementById('adName');
    function getAdminName() {
        fetch('adSetting/getAdminName')
            .then(response => response.json())
            .then(data => {
                adminName.textContent = `Welcome, ${data.adminName}`;
            })
            .catch(error => {
                adminName.textContent = `Welcome, Admin`;
            });
    };
    getAdminName();

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


    function hideAllForm() {
        document.getElementById("blockUserForm-container").style.display = "none";
        document.getElementById("deleteUserForm-container").style.display = "none";
        document.getElementById("unblockUserForm-container").style.display = "none";
        content.innerHTML = "";
    }
    function clearMessage() {
        successMessage.textContent = "";
        failuremessage.textContent = "";
        content.innerHTML = "";
    }

    function extractFormData(formId) {
        const form = document.getElementById(formId);
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;

    }
    async function fetchPending() {
        try {
            clearMessage();
            fetch('adMember/pending', {
                method: 'GET'
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(responseData => {
                        throw new Error(responseData.message || "unable to fetch data from server");
                    })
                }

                return response.text();
            })
                .then(html => {

                    if (html == "No pending request found") {
                        successMessage.textContent = html;

                    }
                    else {
                        document.getElementById('content').innerHTML = html;
                    }
                })
        } catch (error) {
            clearMessage();
            failuremessage.textContent = error.message;
        }
    }
    pendingButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        fetchPending();

    });
    deleteButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        document.getElementById("deleteUserForm-container").style.display = "block";

    });
    blockButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        document.getElementById("blockUserForm-container").style.display = "block";
        document.getElementById("unblockUserForm-container").style.display = "block";

    });

    function applyChoice(choice, rollNo) {//function to approve or reject the member
        fetch(`adMember/${choice}`, {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ rollNo: rollNo })
        }).then(response => {
            if (!response.ok) {
                return response.json().then(responseData => {
                    throw new Error(responseData.message || "unable to complete the operation");
                })
            }
            return response.json();
        }).then(parsedData => {
            clearMessage();
            successMessage.textContent = parsedData;
            fetchPending();
        }).catch(error => {
            clearMessage();
            failuremessage.textContent = error.message;
        })
    }

    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = extractFormData(form.id);
            const endPoint = `adMember/${form.id}`;
            fetch(endPoint, {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(responseData => {
                        throw new Error(responseData.message || "unable to complete the operation");
                    })
                }
                return response.json();
            }).then(parsedData => {
                form.reset();
                clearMessage();
                successMessage.textContent = parsedData.message;
            }).catch(error => {
                clearMessage();
                failuremessage.textContent = error.message;
            })

        });
    });

    content.addEventListener('click', function (e) {
        if (e.target.classList.contains('approve-button')) {
            const rollNo = e.target.id;
            applyChoice('approve', rollNo);
        }
        else if (e.target.classList.contains('reject-button')) {
            const rollNo = e.target.id;
            applyChoice('reject', rollNo);
        }
    });

});