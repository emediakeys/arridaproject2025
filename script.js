// ...existing code...
document.addEventListener('DOMContentLoaded', function () {
    // Sticky navbar on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 20) {
            navbar.classList.add('Sticky');
        } else {
            navbar.classList.remove('Sticky');
        }
    });

    // Mobile menu
    const navLinks = document.querySelectorAll(".menu .nav-link");
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menucloseButton = document.querySelector("#menu-close-button");

    menuOpenButton?.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-view");
    });

    menucloseButton?.addEventListener("click", () => menuOpenButton.click());

    navLinks.forEach(link => {
        link.addEventListener("click", () => menuOpenButton.click());
    });

    // Services data
    const services = [
        { id: `item-1`, icone: `fas fa-hand-holding-heart`, header: `Community Health Extension Workers (SCHEW)`, descrioption: `Community Health Extension Workers (CHEWs) are trained health professionals who provide basic preventive, promotive, and curative healthcare services at the community level.`},

        { id: `item-6`, icone: `fas fa-ambulance`, header: `Public Health`, descrioption: `A public health specialist is a professional dedicated to improving and protecting the health of entire communities and populations, rather than treating individual patients` },

        { id: `item-6`, icone: `fas fa-capsules`, header: `Pharmacy Technician`, descrioption: `A pharmacy technician is a healthcare professional who assists licensed pharmacists in dispensing medications, managing administrative tasks, and handling inventory under pharmacist supervision` },

        { id: `item-6`, icone: `fas fa-microscope`, header: `Medical Laboratory Technician`, descrioption: `A medical lab technician performs tests on patient samples like blood and tissue to help diagnose and treat diseases. ` },
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

    // Skills HTML (if you have a container for skills)
    // const skills = [
    //     { name: `HTML`, levelPercentage: `fifty-percent` },
    //     { name: `CSS`, levelPercentage: `thirty-percent` },
    //     { name: `JAVASCRIPT`, levelPercentage: `twenty-percent` },
    //     { name: `CORELDRAW`, levelPercentage: `sixty-percent` },
    //     { name: `PHOTOSHOP`, levelPercentage: `forty-percent` }
    // ];
    // let levelHTML = '';
    // skills.forEach((skill) => {
    //     levelHTML += `
    //     <div class="skill">
    //         <p>${skill.name}</p>
    //         <div class="level-container">
    //             <span class="${skill.levelPercentage}"></span>  
    //         </div>
    //     </div>
    //     `;
    // });
    // If you have a container for skills, set its innerHTML here

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
                <img src="images/${member.image}" alt="">
            </div>
            <h3 limit-text-to-2-lines>${member.name}</h3>
            <i>${member.post}</i>
        </div>
        `;
    });
    const teamContainer = document.querySelector('.js-team');
    if (teamContainer) teamContainer.innerHTML = teamHTML;

    // Gallery Lightbox (init inside DOMContentLoaded)
    (function initGallery() {
        const imgs = Array.from(document.querySelectorAll('.gallery-img'));
        if (!imgs.length) return;

        // Create overlay once
        let overlay = document.querySelector('.lightbox-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            overlay.innerHTML = `
                <div class="lightbox-content" role="dialog" aria-modal="true">
                  <button class="lightbox-close lightbox-btn" aria-label="Close">&times;</button>
                  <img class="lightbox-img" src="" alt="">
                  <div class="lightbox-controls">
                    <button class="lightbox-btn lightbox-prev" aria-label="Previous">&#10094;</button>
                    <button class="lightbox-btn lightbox-next" aria-label="Next">&#10095;</button>
                  </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const lightboxImg = overlay.querySelector('.lightbox-img');
        const btnClose = overlay.querySelector('.lightbox-close');
        const btnPrev = overlay.querySelector('.lightbox-prev');
        const btnNext = overlay.querySelector('.lightbox-next');

        let currentIndex = 0;

        function openAt(index) {
            currentIndex = (index + imgs.length) % imgs.length;
            const src = imgs[currentIndex].getAttribute('src') || imgs[currentIndex].dataset.src;
            const alt = imgs[currentIndex].getAttribute('alt') || '';
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            btnClose.focus();
        }

        function close() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        }

        function prev() { openAt(currentIndex - 1); }
        function next() { openAt(currentIndex + 1); }

        imgs.forEach((img, i) => {
            img.addEventListener('click', () => openAt(i));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') openAt(i);
            });
        });

        btnClose.addEventListener('click', close);
        btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
        btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });

        // Touch swipe
        let touchStartX = 0;
        overlay.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
        overlay.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) {
                if (dx > 0) prev(); else next();
            }
        }, { passive: true });
    })();
    // end gallery init

    // News share dropdown
    function closeAllShareMenus() {
        document.querySelectorAll('.share-dropdown').forEach(drop => drop.classList.remove('active'));
    }

    // Toggle dropdown when user clicks/taps the share button.
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeAllShareMenus();
            this.parentElement.classList.toggle('active');
        });
        btn.addEventListener('touchstart', function (e) {
            // prevent the synthetic click on some mobile browsers and stop propagation
            e.preventDefault();
            e.stopPropagation();
            closeAllShareMenus();
            this.parentElement.classList.toggle('active');
        }, { passive: false });
    });

    // Close menus only when tapping/clicking outside any .share-dropdown
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.share-dropdown')) closeAllShareMenus();
    });
    document.addEventListener('touchstart', function (e) {
        if (!e.target.closest('.share-dropdown')) closeAllShareMenus();
    });

    // Like button (persist likes in localStorage)
    // Assign stable data-id to each .news-card if not present
    document.querySelectorAll('.news-card').forEach((card, index) => {
        if (!card.dataset.id) card.dataset.id = `news-${index + 1}`;
    });

    const getLikeKey = (id) => `news_like_${id}`;

    document.querySelectorAll('.news-card').forEach(card => {
        const id = card.dataset.id;
        const btn = card.querySelector('.like-btn');
        const countSpan = card.querySelector('.like-count');
        if (!btn || !countSpan) return;

        // Initialize from storage
        const saved = localStorage.getItem(getLikeKey(id));
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (typeof state.count === 'number') countSpan.textContent = state.count;
                if (state.liked) btn.classList.add('liked');
            } catch (e) {
                // ignore parse errors
            }
        }

        const toggleLike = (e) => {
            if (e && e.type === 'touchstart') e.preventDefault();
            let count = parseInt(countSpan.textContent, 10) || 0;
            const liked = btn.classList.contains('liked');

            if (!liked) {
                count++;
                btn.classList.add('liked');
            } else {
                count--;
                btn.classList.remove('liked');
            }

            countSpan.textContent = count;
            localStorage.setItem(getLikeKey(id), JSON.stringify({ count, liked: !liked }));
        };

        btn.addEventListener('click', toggleLike);
        btn.addEventListener('touchstart', toggleLike);
    });

    // Share links
    document.querySelectorAll('.share-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const url = window.location.href;
            const titleEl = this.closest('.news-card')?.querySelector('.news-title');
            const title = titleEl ? titleEl.textContent : document.title;
            let shareUrl = '';
            switch (this.dataset.platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                    break;
            }
            window.open(shareUrl, '_blank');
        });
    });

    // Contact form handling with SweetAlert2
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('.submit');
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                // Simulate success (set to false for error demo)
                const success = true;

                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Message sent successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                        position: 'center',
                        customClass: {
                            popup: 'swal2-animate-scale'
                        }
                    });
                    contactForm.reset();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong. Please try again.',
                        showConfirmButton: false,
                        timer: 2000,
                        position: 'center',
                        customClass: {
                            popup: 'swal2-animate-scale'
                        }
                    });
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 1500);
        });
    }
});
 
// THEME TOGGLE LOGIC
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.innerHTML = `<i class="fas fa-moon"></i>`;
    }
  });
}

// Array of background images
const heroImages = [
  './images/DSC_3652.JPG',
  './images/IMG-20251121-WA0050.jpg',
  './images/DSC_3656.JPG'
];

let currentHeroIndex = 0;
const heroSection = document.getElementById('hero-section');

// Safely set initial image if element exists
if (heroSection) {
  heroSection.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
} 

// Function to change image
function changeHeroImage() {
  if (!heroSection) return;
  currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
  heroSection.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
}

// Ensure only one interval and use 5 seconds
setInterval(changeHeroImage, 5000);
