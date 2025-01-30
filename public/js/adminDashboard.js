document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const greet = document.getElementById('greet');
    const booksButton = document.getElementById("book");//targets the books div which on click will show all books in the content container
    const membersButton = document.getElementById("member");//targets the members div which on click will show all members in the content container
    const issuedBooksButton = document.getElementById("issuedBooks");//targets the issuedBooks div which on click will show all issued books in the content container
    const availableBooksButton = document.getElementById("availableBooks");//targets the availableBooks div which on click will show all available books in the content container
    const pendingRequestsButton = document.getElementById("pendingRequest");//targets the pendingRequests div which on click will show all pending requests in the content container
    const successMessage = document.getElementById('successMessage');
    const failureMessage = document.getElementById('failureMessage');

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
    function clearMessage() {
        successMessage.textContent = "";
        failureMessage.textContent = "";
    }

    function applyChoice(choice, issueId) {//function to approve or reject the issue
        fetch(`adBook/${choice}`, {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ issueId: issueId })
        }).then(response => {
            if (!response.ok) {
                return response.json().then(responseData => {
                    throw new Error(responseData.message || "unable to complete the operation");
                })
            }
            return response.json();
        }).then(parsedData => {
            
            clearMessage();
            successMessage.textContent = parsedData.message;
                fetchIssuedBooks();
        }).catch(error => {
            clearMessage();
            failureMessage.textContent = error.message;
        })
    }

    function fetchIssuedBooks() {
        clearMessage();
        document.getElementById("content").innerHTML='';
        fetch('/admin/adDashboard/issuedBooks', {
            method: 'GET',
        }).then(response => response.text())
            .then(html => {
                if(html.includes("No Issued"))
                {
                    successMessage.textContent = html;
                }
                else{
                    const contentDiv = document.getElementById('content');
                contentDiv.innerHTML = html;
                }
            })
    }
    
    pendingRequestsButton.addEventListener("click", () => {
        window.location.href = "/admin/adMember";
    });


    booksButton.addEventListener("click", () => {
        clearMessage();
        fetch('/admin/adDashboard/book', {
            method: 'GET',
        }).then(response => response.text())
            .then(html => {
                const contentDiv = document.getElementById('content');
                contentDiv.innerHTML = html;
            })
    });

    membersButton.addEventListener("click", () => {
        clearMessage();
        fetch('/admin/adDashboard/member', {
            method: 'GET',
        }).then(response => response.text())
            .then(html => {
                const contentDiv = document.getElementById('content');
                contentDiv.innerHTML = html;
            })
    });

    issuedBooksButton.addEventListener("click", fetchIssuedBooks);
    content.addEventListener('click', function (e) {//function to get choice approve or reject the issue
        if (e.target.classList.contains('approve-button')) {
            const issueId = e.target.id;
            applyChoice('approveIssue', issueId);
        }
        else if (e.target.classList.contains('reject-button')) {
            const issueId = e.target.id;
            applyChoice('rejectIssue', issueId);
        }
        else if(e.target.classList.contains('collect')){
            const issueId = e.target.id;
            console.log('issueId',issueId);
            applyChoice('collectBookForm', issueId);//it will hit the collectBookForm endpoint in book section
        }
    });
});