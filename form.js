<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Admission Portal</title>

    <link rel="icon" type="image/png" sizes="32x32" href="icon.jpg">
    <link rel="icon" type="image/png" sizes="16x16" href="icon.jpg">
    <link rel="apple-touch-icon" href="icon.jpg">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        
        /* Wizard Transitions */
        .step-panel { display: none; opacity: 0; transform: translateY(10px); transition: all 0.3s ease-in-out; }
        .step-panel.active { display: block; opacity: 1; transform: translateY(0); }

        /* Custom Inputs - Enhanced visibility for borders */
        .form-input { 
            @apply mt-1 block w-full border border-gray-400 rounded-lg shadow-sm p-3 transition-all duration-200 bg-white text-gray-800;
            outline: none;
        }
        /* "In Action" State - Solid #333 Border */
        .form-input:focus { 
            border-color: #333 !important; 
            @apply ring-4 ring-gray-900/5;
        }
        .form-input.error { 
            @apply border-red-500 bg-red-50 ring-red-500/10;
        }

        /* Progress Dots */
        .step-dot { @apply w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 border-2; }
        .step-dot.active { @apply bg-blue-600 text-white border-blue-600 shadow-md; }
        .step-dot.completed { @apply bg-green-500 text-white border-green-500; }
        .step-dot.pending { @apply bg-white text-gray-400 border-gray-200; }

        /* Modal Blur */
        .modal-overlay { background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 50; }
        @media print { .print-hidden { display: none !important; } }
    </style>
</head>
<body class="bg-gray-100 min-h-screen py-4 sm:py-10 px-4">

<div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200">
    
    <!-- EXIT BUTTON -->
    <a href="index.html" class="absolute top-3 right-3 z-40 bg-white/80 backdrop-blur border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all shadow-sm flex items-center gap-1 print-hidden">
        <i class="fas fa-times-circle"></i> EXIT
    </a>

    <!-- HEADER -->
    <header class="bg-blue-800 p-6 sm:p-8 text-center text-white print-hidden">
        <h1 class="text-2xl sm:text-3xl font-extrabold">Student Application</h1>
        <p class="text-blue-200 text-xs sm:text-sm mt-1">Complete your registration in 4 easy steps</p>
    </header>

    <!-- PROGRESS BAR -->
    <div class="px-4 sm:px-8 pt-8 pb-4 print-hidden border-b border-gray-100">
        <div class="relative flex justify-between items-center max-w-lg mx-auto">
            <!-- Connecting Lines -->
            <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0 rounded-full"></div>
            <div id="progressLine" class="absolute top-1/2 left-0 h-1 bg-blue-600 -z-0 rounded-full transition-all duration-500" style="width: 0%"></div>

            <!-- Dots -->
            <div class="flex flex-col items-center gap-2">
                <div class="step-dot active" id="dot-1">1</div>
                <span class="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center">Biodata</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="step-dot pending" id="dot-2">2</div>
                <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Contact</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="step-dot pending" id="dot-3">3</div>
                <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Docs</span>
            </div>
            <div class="flex flex-col items-center gap-2">
                <div class="step-dot pending" id="dot-4">4</div>
                <span class="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Payment</span>
            </div>
        </div>
    </div>

    <div class="p-5 sm:p-10">
        <form id="admissionForm">
            
            <!-- STEP 1: BIODATA -->
            <div id="step-1" class="step-panel active">
                <h3 class="text-lg font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <i class="fas fa-user-circle text-blue-600"></i> Biodata & Passport
                </h3>
                
                <div class="mb-6 flex flex-col md:flex-row gap-6 items-center">
                    <div class="relative group">
                        <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden" id="passportBox">
                            <img id="passportPreview" src="" class="w-full h-full object-cover hidden">
                            <i class="fas fa-camera text-gray-300 text-3xl" id="cameraIcon"></i>
                        </div>
                        <input type="file" id="passport" accept="image/*" class="hidden" required>
                        <button type="button" onclick="document.getElementById('passport').click()" class="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                        <input type="hidden" id="passportBase64">
                    </div>
                    <div class="flex-1 w-full text-center md:text-left">
                        <p class="text-sm font-bold text-gray-700">Upload Passport Photo</p>
                        <p class="text-xs text-gray-400 mt-1">Ensure your face is clearly visible. System will compress image automatically.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" name="firstName" required class="form-input">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required class="form-input">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" id="dob" name="dob" required class="form-input">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Gender</label>
                        <select id="gender" name="gender" required class="form-input">
                            <option value="">Select...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- STEP 2: CONTACT -->
            <div id="step-2" class="step-panel">
                <h3 class="text-lg font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <i class="fas fa-address-book text-blue-600"></i> Contact & Login
                </h3>
                
                <div class="mb-5">
                    <label class="block text-sm font-medium text-gray-700">Home Address</label>
                    <textarea id="address" name="address" rows="2" required class="form-input" placeholder="Enter full residential address"></textarea>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" name="email" required class="form-input" placeholder="example@email.com">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Dashboard Password</label>
                        <input type="password" id="password" name="password" required class="form-input" placeholder="Min 6 chars">
                    </div>
                </div>
            </div>

            <!-- STEP 3: ACADEMICS -->
            <div id="step-3" class="step-panel">
                <h3 class="text-lg font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <i class="fas fa-graduation-cap text-blue-600"></i> Course & Background
                </h3>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700">Academic Program</label>
                    <select name="course" id="course" required class="form-input font-semibold text-blue-900">
                        <option value="">-- Select Course --</option>
                        <option value="Community Health Extension Workers">Community Health Extension Workers</option>
                        <option value="Public Health">Public Health</option>
                        <option value="Pharmacy Technician">Pharmacy Technician</option>
                        <option value="Medical Laboratory Technician">Medical Laboratory Technician</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div class="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Birth Certificate</label>
                        <input type="file" id="birthCert" accept=".pdf, image/*" required class="text-xs w-full">
                        <input type="hidden" id="birthCertBase64">
                    </div>
                    <div class="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200">
                        <label class="block text-sm font-bold text-gray-700 mb-1">O'Level Result</label>
                        <input type="file" id="olevel" accept=".pdf, image/*" required class="text-xs w-full">
                        <input type="hidden" id="olevelBase64">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label class="block text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-tight">NOK Name</label><input type="text" name="nokName" class="form-input text-sm" required></div>
                    <div><label class="block text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-tight">NOK Phone</label><input type="tel" name="nokPhone" class="form-input text-sm" required></div>
                    <div><label class="block text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-tight">Sponsor</label><input type="text" name="sponsor" class="form-input text-sm" required></div>
                    <div><label class="block text-[10px] uppercase text-gray-400 font-bold mb-1 tracking-tight">Prev School</label><input type="text" name="prevSchool" class="form-input text-sm" required></div>
                </div>
            </div>

            <!-- STEP 4: PAYMENT -->
            <div id="step-4" class="step-panel text-center">
                <div class="py-8 px-4 bg-yellow-50 rounded-2xl border border-yellow-100 max-w-sm mx-auto">
                    <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-sm">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">Review & Pay</h3>
                    <p class="text-sm text-gray-500 mb-6">Total application fee:</p>
                    <p class="text-4xl font-extrabold text-blue-900 mb-6">₦7,500<span class="text-lg font-normal text-gray-400">.00</span></p>
                    
                    <button type="button" id="payBtn" class="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1">
                        Pay Securely Now
                    </button>
                    
                    <p id="payment-status" class="mt-4 text-green-700 font-bold hidden flex items-center justify-center gap-2">
                        <i class="fas fa-check-circle"></i> Payment Verified
                    </p>
                </div>
            </div>

            <!-- BUTTONS -->
            <div class="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 print-hidden">
                <button type="button" id="prevBtn" class="w-full sm:w-auto px-8 py-3 rounded-xl border border-gray-300 text-gray-500 font-bold hover:bg-gray-50 transition hidden order-2 sm:order-1">
                    <i class="fas fa-arrow-left mr-2"></i> Previous
                </button>
                <div class="hidden sm:block flex-1 order-2"></div>
                <button type="button" id="nextBtn" class="w-full sm:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-blue-200 shadow-xl transition transform active:scale-95 order-1 sm:order-3">
                    Next Step <i class="fas fa-arrow-right ml-2"></i>
                </button>
                <button type="submit" id="submitBtn" class="hidden w-full sm:w-auto px-10 py-3 bg-blue-800 hover:bg-blue-900 text-white font-extrabold rounded-xl shadow-xl transition transform active:scale-95 disabled:opacity-50 order-1 sm:order-3" disabled>
                    Submit Application
                </button>
            </div>

        </form>
    </div>

    <!-- LOADING OVERLAY -->
    <div id="loading" class="hidden fixed inset-0 modal-overlay flex flex-col items-center justify-center text-white">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="font-bold text-lg">Processing Application...</p>
        <p class="text-xs text-blue-200 text-center px-4">Please do not refresh the page.</p>
    </div>
</div>

<!-- POPUP MODAL -->
<div id="customPopup" class="modal-overlay fixed inset-0 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center">
        <div id="popupIcon" class="mb-4 text-4xl"></div>
        <h3 id="popupTitle" class="text-xl font-bold text-gray-900 mb-2"></h3>
        <p id="popupMessage" class="text-gray-600 mb-8 text-sm leading-relaxed"></p>
        <div id="popupActions" class="flex flex-col gap-3"></div>
    </div>
</div>

<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
    // Updated SCRIPT_URL with your live Apps Script ID
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMEpK3kKSrQR99hvVBA0fvs-_eWGKHzfQutXHy7X369_ELy0t8BpI-2mrSYnWKVkNX4Q/exec"; 
    const PAYSTACK_PUBLIC_KEY = "pk_test_29f23a0e0bde6c074ae9efb019002a8d95e721b4"; 
    const FEE_KOBO = 750000;

    let currentStep = 1;
    let transactionReference = null;
    let lastSubmittedData = null;

    function updateWizard() {
        document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`step-${currentStep}`).classList.add('active');

        document.getElementById('prevBtn').classList.toggle('hidden', currentStep === 1);
        if (currentStep === 4) {
            document.getElementById('nextBtn').classList.add('hidden');
            document.getElementById('submitBtn').classList.remove('hidden');
        } else {
            document.getElementById('nextBtn').classList.remove('hidden');
            document.getElementById('submitBtn').classList.add('hidden');
        }

        document.getElementById('progressLine').style.width = `${((currentStep - 1) / 3) * 100}%`;

        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`dot-${i}`);
            const label = dot.nextElementSibling;
            if (i < currentStep) {
                dot.className = 'step-dot completed';
                dot.innerHTML = '<i class="fas fa-check text-xs"></i>';
                label.className = 'text-[9px] sm:text-[10px] font-bold text-green-600 uppercase tracking-wider text-center';
            } else if (i === currentStep) {
                dot.className = 'step-dot active';
                dot.innerHTML = i === 4 ? '<i class="fas fa-credit-card text-[10px]"></i>' : i;
                label.className = 'text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center';
            } else {
                dot.className = 'step-dot pending';
                dot.innerHTML = i === 4 ? '<i class="fas fa-credit-card text-[10px]"></i>' : i;
                label.className = 'text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center';
            }
        }
        window.scrollTo(0,0);
    }

    function validateStep() {
        const stepPanel = document.getElementById(`step-${currentStep}`);
        const fields = stepPanel.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(f => {
            if (f.hasAttribute('required') && !f.value.trim()) {
                f.classList.add('error');
                isValid = false;
            } else {
                f.classList.remove('error');
            }
        });

        if (currentStep === 1 && !document.getElementById('passportBase64').value) {
            showCustomPopup("Please upload a passport photograph.", 'error', 'Missing File');
            return false;
        }

        if (!isValid) showCustomPopup("Please fill in all required fields marked in red.", 'error', 'Incomplete Section');
        return isValid;
    }

    document.getElementById('nextBtn').onclick = () => {
        if (validateStep()) { currentStep++; updateWizard(); }
    };
    document.getElementById('prevBtn').onclick = () => {
        currentStep--; updateWizard();
    };

    function compressImage(file, maxWidth, quality, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const cvs = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; }
                cvs.width = w; cvs.height = h;
                const ctx = cvs.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);
                callback(cvs.toDataURL('image/jpeg', quality));
            };
        };
    }

    function bindFileUpload(id, hiddenId, type='doc') {
        const input = document.getElementById(id);
        const preview = document.getElementById('passportPreview');
        const icon = document.getElementById('cameraIcon');
        
        input.addEventListener('change', (e) => {
            const f = e.target.files[0];
            if (!f) return;

            if (f.type.startsWith('image/')) {
                const width = type === 'passport' ? 300 : 900;
                compressImage(f, width, 0.5, (b64) => {
                    document.getElementById(hiddenId).value = b64;
                    if (id === 'passport') {
                        preview.src = b64;
                        preview.classList.remove('hidden');
                        icon.classList.add('hidden');
                    }
                });
            } else if (f.type === 'application/pdf') {
                if (f.size > 1024 * 1024) {
                    showCustomPopup("PDF must be under 1MB.", 'error', 'File Too Large');
                    input.value = "";
                    return;
                }
                const r = new FileReader();
                r.onload = (ev) => document.getElementById(hiddenId).value = ev.target.result;
                r.readAsDataURL(f);
            }
        });
    }

    bindFileUpload('passport', 'passportBase64', 'passport');
    bindFileUpload('birthCert', 'birthCertBase64');
    bindFileUpload('olevel', 'olevelBase64');

    document.getElementById('payBtn').onclick = () => {
        const email = document.getElementById('email').value.trim();
        if (!email) { showCustomPopup("Please provide an email on Step 2.", 'error', 'Error'); return; }

        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: FEE_KOBO,
            currency: 'NGN',
            ref: 'ADM-' + Date.now(),
            callback: (response) => {
                transactionReference = response.reference;
                document.getElementById('payBtn').classList.add('hidden');
                document.getElementById('payment-status').classList.remove('hidden');
                document.getElementById('submitBtn').disabled = false;
                showCustomPopup("Payment Confirmed! Click 'Submit Application' to complete.", 'success', 'Done');
            }
        });
        handler.openIframe();
    };

    document.getElementById('admissionForm').onsubmit = function(e) {
        e.preventDefault();
        
        if (!transactionReference) { 
            showCustomPopup("Payment required.", 'error', 'Error'); 
            return; 
        }

        document.getElementById('loading').classList.replace('hidden', 'flex');
        
        const fd = new FormData(this);
        const data = {};
        fd.forEach((v, k) => data[k] = v);
        
        data.passportBase64 = document.getElementById('passportBase64').value;
        data.birthCertBase64 = document.getElementById('birthCertBase64').value;
        data.olevelBase64 = document.getElementById('olevelBase64').value;
        data.paymentRef = transactionReference;
        data.action = 'submitApplication';

        fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(data)
        })
        .then(async res => {
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            return res.json();
        })
        .then(res => {
            document.getElementById('loading').classList.replace('flex', 'hidden');
            if (res.result === 'success') {
                lastSubmittedData = data;
                showCustomPopup("ID: " + res.admNo, 'success', 'Application Successful!', [
                    { text: 'Print Slip', handler: () => printSummary(res.admNo), primary: true },
                    { text: 'Finish', handler: () => location.reload(), primary: false }
                ]);
            } else {
                showCustomPopup(res.message || "The server rejected the application.", 'error', 'Submission Failed');
            }
        })
        .catch((err) => {
            console.error("Submission Error:", err);
            document.getElementById('loading').classList.replace('flex', 'hidden');
            showCustomPopup("A network error occurred. Ensure your Google Apps Script is deployed with access set to 'Anyone'.", 'error', 'Network Error');
        });
    };

    function showCustomPopup(msg, type='error', title='Notice', actions=[]) {
        document.getElementById('popupTitle').textContent = title;
        document.getElementById('popupMessage').textContent = msg;
        document.getElementById('popupIcon').innerHTML = type === 'success' ? 
            '<i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>' : 
            '<i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>';
        
        const container = document.getElementById('popupActions');
        container.innerHTML = '';
        if (actions.length === 0) actions.push({ text: 'OK', handler: closeCustomPopup, primary: true });
        
        actions.forEach(a => {
            const btn = document.createElement('button');
            btn.textContent = a.text;
            btn.className = a.primary ? 'w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg' : 'w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl';
            btn.onclick = a.handler;
            container.appendChild(btn);
        });
        document.getElementById('customPopup').classList.replace('hidden', 'flex');
    }

    function closeCustomPopup() { document.getElementById('customPopup').classList.replace('flex', 'hidden'); }

    function printSummary(admNo) {
        closeCustomPopup();
        const d = lastSubmittedData;
        const printArea = `
            <div class="max-w-2xl mx-auto p-10 bg-white border mt-10 shadow-lg rounded-xl">
                <div class="text-center mb-8 border-b-4 border-blue-900 pb-4">
                    <h1 class="text-4xl font-black text-blue-900 uppercase">Application Slip</h1>
                    <p class="text-gray-500">Academic Session: ${new Date().getFullYear()}/${new Date().getFullYear()+1}</p>
                </div>
                <div class="flex justify-between items-start mb-10">
                    <div class="space-y-2">
                        <p class="text-xs font-bold text-gray-400 uppercase">Applicant</p>
                        <h2 class="text-2xl font-bold text-gray-800">${d.firstName} ${d.lastName}</h2>
                        <p class="text-gray-600">${d.email}</p>
                        <p class="text-blue-600 font-bold">${d.course}</p>
                    </div>
                    <img src="${d.passportBase64}" class="w-32 h-32 object-cover border-4 border-gray-100 rounded-xl shadow-lg">
                </div>
                <div class="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div><p class="text-[10px] text-gray-400 font-bold uppercase">Admission ID</p><p class="font-mono text-xl font-bold text-blue-800">${admNo}</p></div>
                    <div><p class="text-[10px] text-gray-400 font-bold uppercase">Payment Ref</p><p class="font-mono text-sm text-gray-600">${d.paymentRef}</p></div>
                </div>
                <div class="mt-10 text-center print-hidden">
                    <button onclick="window.print()" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700">Print Now</button>
                    <button onclick="location.reload()" class="ml-4 text-gray-400 hover:text-gray-600 transition">Close</button>
                </div>
            </div>`;
        document.body.innerHTML = printArea;
    }

    updateWizard();
</script>
</body>
</html>
