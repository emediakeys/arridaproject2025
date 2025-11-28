document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURATION ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzj76G7DjCxdbLhfvl_EGoHlkCIrUH0o-FCgvKBafO2MI88-qXYL3TvjkMcMvlZ77U/exec"; 
    
    // **PAYSTACK CONFIGURATION**
    // ⚠️ REPLACE THIS WITH YOUR ACTUAL PAYSTACK PUBLIC KEY
    const PAYSTACK_PUBLIC_KEY = "sk_test_1d5e80e83d487c098f27ef5e6d0fe58003c6a438"; 
    const APPLICATION_FEE_NAIRA = 7500;
    // Paystack takes amount in kobo (100 kobo = 1 Naira)
    const APPLICATION_FEE_KOBO = APPLICATION_FEE_NAIRA * 100;
    
    // --- Element and Field Variables ---
    const payBtn = document.getElementById('payBtn');
    const submitBtn = document.getElementById('submitBtn');
    const paymentStatus = document.getElementById('payment-status');
    const form = document.getElementById('admissionForm');
    const emailInput = document.getElementById('email'); // To get the student's email for Paystack
    
    // Passport Elements
    const passportInput = document.getElementById('passport');
    const passportBase64Field = document.getElementById('passportBase64');
    const previewContainer = document.getElementById('preview-container');
    
    // Document Elements
    const birthCertInput = document.getElementById('birthCert');
    const birthCertBase64Field = document.getElementById('birthCertBase64');
    const olevelInput = document.getElementById('olevel');
    const olevelBase64Field = document.getElementById('olevelBase64');
    
    // Holds the transaction reference after successful payment
    let transactionReference = null;

    // --- 1. FILE TO BASE64 CONVERSION LOGIC ---
    
    function convertFileToBase64(fileInput, base64Field, previewElement = null) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    base64Field.value = e.target.result;
                    if (previewElement) {
                        previewElement.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    convertFileToBase64(passportInput, passportBase64Field, previewContainer);
    convertFileToBase64(birthCertInput, birthCertBase64Field);
    convertFileToBase64(olevelInput, olevelBase64Field);
    
    // --- 2. PAYSTACK INTEGRATION ---
    
    payBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const studentEmail = emailInput.value.trim();

        if (!studentEmail || !form.checkValidity()) {
            // Check if required fields are filled before opening payment
            alert("Please fill in your name and a valid email address first.");
            emailInput.focus();
            return;
        }

        payBtn.textContent = "Opening Payment...";
        payBtn.disabled = true;

        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: studentEmail,
            amount: APPLICATION_FEE_KOBO,
            currency: 'NGN',
            ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Unique transaction reference
            metadata: {
                custom_fields: [{
                    display_name: "Application Fee",
                    variable_name: "application_fee",
                    value: APPLICATION_FEE_NAIRA
                }]
            },
            callback: function(response){
                // Payment was successful. 
                transactionReference = response.reference;
                
                payBtn.style.display = 'none'; // Hide pay button
                paymentStatus.style.display = 'block'; // Show success message
                
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Application (Payment Confirmed)";
                
                alert("Payment Successful! Reference: " + transactionReference + ". You can now submit your form.");
            },
            onClose: function(){
                // User closed the popup
                payBtn.textContent = `Pay ₦${APPLICATION_FEE_NAIRA} Now`;
                payBtn.disabled = false;
                alert('Payment cancelled. You must pay to submit the form.');
            }
        });

        handler.openIframe(); 
    });

    // --- 3. HANDLE FORM SUBMISSION ---
    
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        if (!transactionReference) {
            alert("Please complete the ₦7,500 payment before submitting.");
            return; 
        }

        document.getElementById('loading').style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Data...";

        // Collect all data from the form fields
        const formData = new FormData(form);
        const dataObject = {};
        formData.forEach((value, key) => dataObject[key] = value);

        // Add the crucial Base64 documents and Payment Reference manually
        dataObject['passportBase64'] = passportBase64Field.value;
        dataObject['birthCertBase64'] = birthCertBase64Field.value;
        dataObject['olevelBase64'] = olevelBase64Field.value;
        dataObject['paymentRef'] = transactionReference; // **NEW: Send the Paystack reference**

        // Send the JSON data to the Google Apps Script Web App
        fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(dataObject)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            if(data.result === "success") {
                alert("Success! Your Admission Number is: " + data.admNo + ". Check your email shortly for the receipt.");
                form.reset();
            } else {
                alert("Submission Error: " + data.message);
                submitBtn.disabled = false;
                submitBtn.textContent = "Try Submitting Again";
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            alert("A network error occurred. Please check your connection and try again.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Try Submitting Again";
        });
    });

});
