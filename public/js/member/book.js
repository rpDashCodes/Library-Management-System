document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    const recentBorrow = document.getElementById('Recent-Borrow');
    const pastBook = document.getElementById('Past-Book');
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');
    const serverMessage = document.getElementById('serverMessage');
    const content = document.getElementById('content');


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

   recentBorrow.addEventListener("click", ()=> fetchBooks("active"));//both are calling same function with different type to fetch data from two routes
    pastBook.addEventListener("click",()=> fetchBooks("past"));

    function fetchBooks(type) {
   clearMessage();
            fetch(`/member/book/${type}`, {
                method: 'GET'
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(responseData => {
                        throw new Error(responseData.message || "unable to complete the operation");
                    })
                }
                return response.text();
            }).then(html => {
                if (html.includes("No Issue Found")) {
                    
                    clearMessage();
                    content.innerHTML = "";
                    serverMessage.style.display = "block";
                    serverMessage.style.backgroundColor = '#a62f44';
                    failureMessage.textContent = "No Issue Record Found";
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
    });