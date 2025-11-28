document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURATION ---
    // Use the SAME Web App URL that hosts your doGet and doPost functions
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyD5KB-T91NWomJdTIE4JLIM1l1WVjGDD9GkW4It9hE50fyagD2X_nE55ouKLvkSQQW/exec"; 
    
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const statusMessage = document.getElementById('statusMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset state
        statusMessage.textContent = '';
        loginBtn.textContent = 'Verifying...';
        loginBtn.disabled = true;

        // Collect credentials
        const admNo = document.getElementById('admNo').value.trim();
        const password = document.getElementById('password').value;

        // IMPORTANT: Use fetch with query parameters for the doGet request
        // The URL needs to be constructed like this: /exec?admNo=X&password=Y
        const validationUrl = `${SCRIPT_URL}?admNo=${encodeURIComponent(admNo)}&password=${encodeURIComponent(password)}`;

        fetch(validationUrl, {
            method: 'GET', // Uses the doGet function in Apps Script
        })
        .then(response => response.json())
        .then(data => {
            loginBtn.textContent = 'Log In';
            loginBtn.disabled = false;

            if(data.result === "success") {
                statusMessage.textContent = 'Login Successful!';
                statusMessage.style.color = 'green';
                
                // --- SESSION MANAGEMENT (Rudimentary but effective) ---
                // Store student data locally
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('studentData', JSON.stringify(data.data));

                // Redirect to the dashboard
                window.location.href = 'dashboard.html'; 

            } else {
                statusMessage.textContent = data.message || 'Invalid Admission Number or Password.';
                statusMessage.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Login Error:', error);
            statusMessage.textContent = 'Network or Server Error. Try again.';
            statusMessage.style.color = 'red';
            loginBtn.textContent = 'Log In';
            loginBtn.disabled = false;
        });
    });

});



