document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    const addBookButton = document.getElementById("addBookButton");
    const updateBookButton = document.getElementById("updateBookButton");
    const deleteBookButton = document.getElementById("deleteBookButton");
    const collectBookButton = document.getElementById("collectBookButton");
    const forms = Array.from(document.getElementsByTagName("form"));
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



    hamburger.textContent = "☰";
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
        document.getElementById("addBookForm-container").style.display = "none";
        document.getElementById("updateBookForm-container").style.display = "none";
        document.getElementById("deleteBookForm-container").style.display = "none";
        document.getElementById("collectBookForm-container").style.display = "none";
    }
    function clearMessage() {
        successMessage.textContent = "";
        failureMessage.textContent = "";
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

    addBookButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage
        document.getElementById("addBookForm-container").style.display = "block";

    });
    updateBookButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        document.getElementById("updateBookForm-container").style.display = "block";

    });
    deleteBookButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        document.getElementById("deleteBookForm-container").style.display = "block";

    });
    collectBookButton.addEventListener('click', function () {
        hideAllForm();
        clearMessage();
        document.getElementById("collectBookForm-container").style.display = "block";

    });

    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = extractFormData(form.id);
            const endPoint = `adBook/${form.id}`;
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
                failureMessage.textContent = error.message;
            })

        });
    });
});