/* ==========================================================================
   BRIGHT FUTURE ACADEMY - INTERACTIVE CORE ENGINE
   Author: Antigravity AI
   Features: Mobile Menu, Scroll Reveal, Count-Up Stats, Active Link Tracking, Smooth Scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STICKY HEADER SHADOW ON SCROLL ---
    const header = document.getElementById('header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    if (header) {
        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll(); // Trigger initially on page load
    }

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Prevent body scroll when mobile navigation is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        if (menuToggle) menuToggle.classList.remove('open');
        if (navMenu) navMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking a navigation link or clicking outside the menu
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (event) => {
            const isClickInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- SMOOTH SCROLLING FOR NAV LINKS ---
    // Handles clicking links and scrolling to target with offset adjustment for sticky navbar
    const allLinks = document.querySelectorAll('a[href^="#"]');

    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement && header) {
                e.preventDefault();
                closeMenu(); // Close mobile navigation if open
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // Subtract header height for proper alignment, plus an additional micro spacing of 10px
                window.scrollTo({
                    top: targetPosition - headerHeight - 10,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- SCROLL REVEAL ANIMATION SYSTEM ---
    // Highly efficient Intersection Observer tracking content blocks
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.12, // Element is 12% visible in viewport
            rootMargin: '0px 0px -40px 0px' // Slightly trigger before appearing fully
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }


    // --- ACTIVE NAVBAR LINK TRACKING ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    
    if ('IntersectionObserver' in window) {
        const navObserverOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px', // Evaluates when section covers center part of viewport
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, navObserverOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }


    // --- CONTACT FORM HANDLER ---
    const contactForm = document.getElementById('consultation-form');
    const formSuccessMsg = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values (Mock submission behavior)
            const studentName = document.getElementById('student-name') ? document.getElementById('student-name').value : '';
            const parentName = document.getElementById('parent-name') ? document.getElementById('parent-name').value : '';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const course = document.getElementById('course-select') ? document.getElementById('course-select').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';

            // Submit Button loading feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting Details...';
            submitBtn.style.opacity = '0.7';

            // Send data to FormSubmit via AJAX (fetch)
            const formData = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.opacity = '';

                    // Log form details (for demo/developer verification)
                    console.log('--- Bright Future Academy Form Entry ---');
                    console.log(`Student: ${studentName}`);
                    console.log(`Parent: ${parentName}`);
                    console.log(`Contact: ${phone} | ${email}`);
                    console.log(`Course Choice: ${course}`);
                    console.log(`Query Notes: ${message}`);
                    console.log('----------------------------------------');

                    // Smoothly trigger and display visual confirmation banner
                    if (formSuccessMsg) {
                        formSuccessMsg.style.display = 'flex';
                        formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        
                        // Clear input controls
                        contactForm.reset();

                        // Clear success message automatically after 6 seconds
                        setTimeout(() => {
                            formSuccessMsg.style.transition = 'opacity 0.5s ease';
                            formSuccessMsg.style.opacity = '0';
                            setTimeout(() => {
                                formSuccessMsg.style.display = 'none';
                                formSuccessMsg.style.opacity = '1';
                            }, 500);
                        }, 6000);
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                submitBtn.style.opacity = '';
                alert('There was a problem submitting your inquiry. Please try calling us directly.');
            });
        });
    }

    const courseSelect = document.getElementById("course-select");
    const streamGroup = document.getElementById("stream-group");
    const streamSelect = document.getElementById("stream-select");

    if (courseSelect && streamGroup && streamSelect) {
        courseSelect.addEventListener("change", function () {
            if (this.value === "11th" || this.value === "12th") {
                streamGroup.style.display = "block";
                streamSelect.required = true;
            } else {
                streamGroup.style.display = "none";
                streamSelect.required = false;
                streamSelect.value = "";
            }
        });
    }

    // --- CURRICULUM ACCORDION ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (header) {
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all items
                accordionItems.forEach(acc => {
                    acc.classList.remove('active');
                    const accHeader = acc.querySelector('.accordion-header');
                    if(accHeader) accHeader.setAttribute('aria-expanded', 'false');
                    const accContent = acc.querySelector('.accordion-content');
                    if(accContent) accContent.style.maxHeight = null;
                });
                
                // If it wasn't open, open it
                if (!isOpen) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    const content = item.querySelector('.accordion-content');
                    if(content) content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // --- MODALS ---
    const modalOverlay = document.getElementById('modal-overlay');
    const demoModal = document.getElementById('demo-modal');
    const eligibilityModal = document.getElementById('eligibility-modal');

    const demoBtns = document.querySelectorAll('.btn-demo-modal');
    const eligibilityBtns = document.querySelectorAll('.btn-eligibility-modal');
    
    const closeBtns = document.querySelectorAll('.modal-close');

    function openModal(modal) {
        if (!modalOverlay || !modal) return;
        modalOverlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        
        // Hide success messages on close
        const demoSuccess = document.getElementById('demo-success');
        if(demoSuccess) demoSuccess.style.display = 'none';
        const eligSuccess = document.getElementById('eligibility-success');
        if(eligSuccess) eligSuccess.style.display = 'none';
    }

    demoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(demoModal);
        });
    });

    eligibilityBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(eligibilityModal);
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if(modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Form Submissions
    const demoForm = document.getElementById('demo-form');
    if(demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('demo-success').style.display = 'block';
            demoForm.reset();
        });
    }

    const eligibilityForm = document.getElementById('eligibility-form');
    if(eligibilityForm) {
        eligibilityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('eligibility-success').style.display = 'block';
            eligibilityForm.reset();
        });
    }

    // --- REVIEW FORM ---
    const reviewForm = document.getElementById('review-form');
    if(reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const reviewSuccess = document.getElementById('review-success');
            if(reviewSuccess) {
                reviewSuccess.style.display = 'flex';
                setTimeout(() => {
                    reviewSuccess.style.transition = 'opacity 0.5s ease';
                    reviewSuccess.style.opacity = '0';
                    setTimeout(() => {
                        reviewSuccess.style.display = 'none';
                        reviewSuccess.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
            reviewForm.reset();
        });
    }

});
