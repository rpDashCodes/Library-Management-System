document.addEventListener("DOMContentLoaded",()=>{
    const booksButton = document.getElementById("book");//targets the books div which on click will show all books in the content container
    booksButton.addEventListener("click",()=>{
        fetch('/adDashboard/members',{
            method: 'GET',
        })
    })
});