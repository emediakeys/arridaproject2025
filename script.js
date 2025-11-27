document.addEventListener('DOMContentLoaded', function () {

    // =========================================================
    // 1. STICKY NAV AND MOBILE MENU
    // =========================================================

    // Sticky navbar on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        // The sticky effect relies on the CSS position: sticky applied to .navbar
        // We will add a class for an additional visual effect like a subtle border/shadow change
        if (window.scrollY > 50) {
            // NOTE: You need to add CSS for the '.navbar.sticky-shadow' class.
            navbar.classList.add('sticky-shadow');
        } else {
            navbar.classList.remove('sticky-shadow');
        }
        // Run function to update active link on scroll
        updateActiveNavLink();
    });

    // Mobile menu toggling (REFINED to use '.menu.active' class)
    const navMenu = document.querySelector('.navbar .menu');
    const navLinks = document.querySelectorAll(".menu .nav-link");
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menucloseButton = document.querySelector("#menu-close-button");

    const toggleMobileMenu = () => {
        // We toggle the 'active' class on the menu container, not the body
        navMenu.classList.toggle("active");
    };

    menuOpenButton?.addEventListener("click", toggleMobileMenu);
    menucloseButton?.addEventListener("click", toggleMobileMenu);

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Only close if the menu is currently open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Active Nav Link on Scroll Logic (Kept as is - requires .active-link CSS)
    function updateActiveNavLink() {
        let current = '';
        // Select all sections with an ID, excluding the 'hero-section' until we scroll past it
        const sections = document.querySelectorAll('main section[id]');

        sections.forEach(section => {
            // Offset for fixed navbar (80px is standard navbar height)
            const sectionTop = section.offsetTop - 80;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            // Check if the link's href contains the current section ID
            if (link.getAttribute('href')?.includes(current)) {
                link.classList.add('active-link');
            }
        });
    }
    // Initialize active link on page load
    updateActiveNavLink();


    // =========================================================
    // 2. DARK MODE TOGGLE (INTEGRATED)
    // =========================================================
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        // Ensure the icon is correct when page loads in dark mode
        if (themeToggle) themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");

            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
            } else {
                localStorage.setItem("theme", "light");
                themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
            }
        });
    }


    // =========================================================
    // 3. DATA RENDERING (Services & Team - KEPT AS IS)
    // =========================================================

    // Services data (courses)
    const services = [
        { id: `item-1`, icone: `fas fa-hand-holding-heart`, header: `Community Health Extension Workers (SCHEW)`, descrioption: `CHEWs are trained health professionals who provide basic preventive, promotive, and curative healthcare services at the community level.` },
        { id: `item-2`, icone: `fas fa-ambulance`, header: `Public Health`, descrioption: `A public health specialist is dedicated to improving and protecting the health of entire communities and populations, rather than treating individual patients.` },
        { id: `item-3`, icone: `fas fa-capsules`, header: `Pharmacy Technician`, descrioption: `A pharmacy technician assists licensed pharmacists in dispensing medications, managing administrative tasks, and handling inventory under supervision.` },
        { id: `item-4`, icone: `fas fa-microscope`, header: `Medical Laboratory Technician`, descrioption: `A medical lab technician performs tests on patient samples like blood and tissue to help diagnose and treat diseases.` },
    ];
    let innerHTML = '';
    services.forEach((service) => {
        innerHTML += `
        <li class="item ${service.id}">
            <i class="${service.icone}"></i>
            <h4>${service.header}</h4>
            <p>${service.descrioption}</p>
        </li>
        `;
    });
    const menuContainer = document.querySelector(".js-menu");
    if (menuContainer) menuContainer.innerHTML = innerHTML;

    // Team HTML
    const myTeam = [
        { image: `IMG-20251121-WA0093.jpg`, name: `Nura Nasiru`, post: `HOD Public Health` },
        { image: `Pharmacist David Joel.jpg`, name: `Pharmacist David Joel`, post: `HOD Pharmacy` },
        { image: `IMG-20251122-WA0036.jpg`, name: `Demmile Stephanie`, post: `Lecturer` },
        { image: `IMG-20251121-WA0063.jpg`, name: `Vivian Odiali`, post: `Provost` },
        { image: `IMG-20251121-WA0067.jpg`, name: `Suleiman Shaibu`, post: `Registrar` },
    ];
    let teamHTML = '';
    myTeam.forEach((member) => {
        teamHTML += `
        <div class="team-member">
            <div class="image-wrapper">
                <img src="images/${member.image}" alt="Team Member: ${member.name}">
            </div>
            <h3>${member.name}</h3>
            <i>${member.post}</i>
        </div>
        `;
    });
    const teamContainer = document.querySelector('.js-team');
    if (teamContainer) teamContainer.innerHTML = teamHTML;


    // =========================================================
    // 4. CONTACT FORM SUBMISSION (KEPT AS IS)
    // =========================================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                const success = true; // Replace with actual AJAX/fetch call

                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Message sent successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                        position: 'center',
                        customClass: { popup: 'swal2-animate-scale' }
                    });
                    contactForm.reset();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong. Please try again.',
                        showConfirmButton: false,
                        timer: 2000,
                        position: 'center',
                        customClass: { popup: 'swal2-animate-scale' }
                    });
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 1500);
        });
    }
    // =========================================================
    // 5. NEWS LIKES & SHARES (FUNCTIONAL IMPLEMENTATION)
    // =========================================================
    document.querySelectorAll('.news-card').forEach(card => {
        const likeButton = card.querySelector('.like-btn');
        const likeCountSpan = card.querySelector('.like-count');
        const shareButton = card.querySelector('.share-btn');
        const shareMenu = card.querySelector('.share-menu');

        // 1. Like Button Logic (Uses SweetAlert2)
        let likes = 0; // Initialize a local count for demonstration

        // Check if the card has a like button before adding the listener
        if (likeButton) {
            likeButton.addEventListener('click', () => {
                likes++;
                likeCountSpan.textContent = likes;

                // Show a nice confirmation using SweetAlert2
                Swal.fire({
                    title: 'Liked!',
                    text: 'Thank you for reading and your support!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        }

        // 2. Share Dropdown Visibility Toggle
        if (shareButton) {
            // Toggle the visibility of the share menu on button click
            shareButton.addEventListener('click', () => {
                shareMenu.classList.toggle('visible');
            });
        }

        // 3. Dynamic Share Link Generation and Click Handler
        card.querySelectorAll('.share-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.getAttribute('data-platform');
                const pageUrl = encodeURIComponent(window.location.href);
                const newsTitle = encodeURIComponent(card.querySelector('.news-title').textContent);
                let shareUrl = '';

                switch (platform) {
                    case 'facebook':
                        // Facebook requires URL and HASH (optional)
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                        break;
                    case 'twitter': // Now X
                        // X requires text and URL
                        shareUrl = `https://twitter.com/intent/tweet?text=${newsTitle}&url=${pageUrl}`;
                        break;
                    case 'whatsapp':
                        // WhatsApp uses text parameter for message content
                        shareUrl = `https://api.whatsapp.com/send?text=${newsTitle}%20-%20${pageUrl}`;
                        break;
                    default:
                        return;
                }

                if (shareUrl) {
                    // Open the share link in a new, small pop-up window
                    window.open(shareUrl, 'ShareWindow', 'width=600,height=400,scrollbars=yes,resizable=yes');
                }
            });
        });

        // Hide the share menu if user clicks outside of the dropdown
        document.addEventListener('click', (e) => {
            if (!card.contains(e.target) && shareMenu.classList.contains('visible')) {
                shareMenu.classList.remove('visible');
            }
        });
    });
    // =========================================================
    // 5. GALLERY LIGHTBOX, NEWS LIKES & SHARES (KEPT AS IS)
    // =========================================================

    // NOTE: You must ensure the full logic for the following functions is present below this line,
    // including the full 'initGallery' function and all news interaction logic.

    // Placeholder for your existing Gallery Lightbox function (initGallery).
    // =========================================================
    // 5. GALLERY LIGHTBOX (FUNCTIONAL IMPLEMENTATION)
    // =========================================================

    (function initGallery() {
        // Select all images inside the gallery grid
        const galleryItems = document.querySelectorAll('.gallery-grid .gallery-img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const closeButton = document.querySelector('.lightbox-close');

        if (!galleryItems.length) return; // Exit if no images found

        // Function to open the lightbox
        function openLightbox(event) {
            // Get the source (src) of the clicked image
            const imgSrc = event.target.getAttribute('src');
            const imgAlt = event.target.getAttribute('alt');

            // Set the modal image source
            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgAlt);

            // Add the 'active' class to show the modal
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        // Function to close the lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Attach click listener to every gallery image
        galleryItems.forEach(item => {
            item.addEventListener('click', openLightbox);
        });

        // Attach close listener to the close button
        closeButton.addEventListener('click', closeLightbox);

        // Close when clicking anywhere on the background (the modal div)
        lightbox.addEventListener('click', function (e) {
            // Only close if the click target is the modal itself, not the image or content div
            if (e.target.classList.contains('lightbox-modal')) {
                closeLightbox();
            }
        });

        // Close with the ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    })();
    // Placeholder for your existing News Interactions logic.
    // ... News Share Dropdown logic 
    // ... News Like button logic 
    // ... Share links logic 

});

// =========================================================
// 6. HERO IMAGE SLIDER (KEPT AS IS - Outside DOMContentLoaded)
// =========================================================
const heroImages = [
    './images/DSC_3652.JPG',
    './images/IMG-20251121-WA0050.jpg',
    './images/DSC_3656.JPG'
];

let currentHeroIndex = 0;
const heroSection = document.getElementById('hero-section');
const imagePreloader = new Image();

// Set initial image and style
if (heroSection) {
    heroSection.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
    // NOTE: For a smooth transition, the 'transition' property must be in your CSS.
    // E.g., .hero-section { transition: background-image 1s ease-in-out; }
}

function changeHeroImage() {
    if (!heroSection) return;

    const nextHeroIndex = (currentHeroIndex + 1) % heroImages.length;
    const nextImageUrl = heroImages[nextHeroIndex];

    imagePreloader.src = nextImageUrl;

    imagePreloader.onload = () => {
        heroSection.style.backgroundImage = `url('${nextImageUrl}')`;
        currentHeroIndex = nextHeroIndex;
    };
    if (imagePreloader.complete) {
        imagePreloader.onload();
    }
}

// Start the continuous image change
setInterval(changeHeroImage, 5000);
