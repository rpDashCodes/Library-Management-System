document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    const dropDown = document.getElementById('searchBy');
    const searchButton = document.getElementById('search-button');
    const successMessage = document.getElementById('success-message');
    const failureMessage = document.getElementById('failure-message');
    const serverMessage = document.getElementById('server-message');
    const content = document.getElementById('content');
    let searchBy = "name";


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


    const userName = document.getElementById('userName');
    function getAdminName() {
        fetch('getMemberName')
            .then(response => response.json())
            .then(data => {
                userName.textContent = `Welcome, ${data.name}`;
            })
            .catch(error => {
                userName.textContent = `Welcome, User`;
            });
    };
    getAdminName();


    function clearMessage() {
        successMessage.textContent = "";
        failureMessage.textContent = "";
    }

    dropDown.addEventListener("change", () => {
        searchBy = dropDown.value;
        document.getElementById('search-input').placeholder = `Search book by ${searchBy}`;
    }
    );

    function fetchBooks() {
        const searchInput = document.getElementById('search-input').value;

        if (searchInput != "") {
            clearMessage();
            const bookSearch = {
                searchBy: searchBy.toLowerCase(),
                searchInput: searchInput
            };
            fetch('/member/dashboard/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookSearch)
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(responseData => {
                        throw new Error(responseData.message || "unable to complete the operation");
                    })
                }
                return response.text();
            }).then(html => {
                if (html.includes("No books found")) {
                    clearMessage();
                    content.innerHTML = "";
                    serverMessage.style.display = "block";
                    serverMessage.style.backgroundColor = '#a62f44';
                    failureMessage.textContent = "No books found try searching with different keyword";
                    setTimeout(() => {
                        serverMessage.style.display = "none";
                    }, 7000);
                }
                else {

                    content.innerHTML = html;
                }
            }).catch(error => {
                clearMessage();
                serverMessage.style.display = "block";
                serverMessage.style.backgroundColor = "#a62f44";
                failureMessage.textContent = error.message;
                setTimeout(() => {
                    serverMessage.style.display = "none";
                }, 7000);
            });
        }
    }

    searchButton.addEventListener("click", fetchBooks);
    document.getElementById('search-input').addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            fetchBooks();
        }
    });

    function issueRequest(bookId) {
        fetch('/member/dashboard/issue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId: bookId })
        }).then(response => {
            if (!response.ok) {
                return response.json().then(responseData => {
                    throw new Error(responseData.message || "unable to complete the operation");
                })
            }
            return response.json();
        }).then(data => {
            clearMessage();
            serverMessage.style.display = "block";
            serverMessage.style.backgroundColor = '#00ff77';
            successMessage.textContent = data.message;
            setTimeout(() => {
                serverMessage.style.display = "none";
            }, 7000);
        })
            .catch(error => {
                clearMessage();
                serverMessage.style.display = "block";
                serverMessage.style.backgroundColor = "#a62f44";
                failureMessage.textContent = error.message;
                setTimeout(() => {
                    serverMessage.style.display = "none";
                }, 7000);
            });
    }
    content.addEventListener('click', function (e) {
        if (e.target.classList.contains('issue')) {
            const bookId = e.target.id;
            issueRequest(bookId);//request to issue book
        }
    });
});