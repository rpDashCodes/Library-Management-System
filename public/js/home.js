document.addEventListener("DOMContentLoaded", (e) => {
    const hamburger = document.querySelector('.hamburger');
    const loginButton = document.getElementById("login");
    loginButton.addEventListener("click", () => {
        document.getElementById('login-role').classList.toggle('hidden');
        e.stopPropagation();

    });


    // Hamburger Menu Toggle Functionality
    hamburger.textContent = "☰";
    hamburger.addEventListener("click", () => {
        const navLinks = document.querySelector('.nav-links');

        if (hamburger.textContent == "☰") {
            hamburger.textContent = "X";
        }
        else {
            hamburger.textContent = "☰";
        }
        navLinks.classList.toggle('nav-active');
    })
})