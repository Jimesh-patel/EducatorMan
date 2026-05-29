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
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Trigger initially on page load


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
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

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


    // --- SMOOTH SCROLLING FOR NAV LINKS ---
    // Handles clicking links and scrolling to target with offset adjustment for sticky navbar
    const allLinks = document.querySelectorAll('a[href^="#"]');

    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
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
                    
                    // Specific sub-animation inside results section: trigger metric filling
                    if (entry.target.classList.contains('results-info')) {
                        triggerProgressBars();
                    }
                    
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
        triggerProgressBars();
    }


    // --- RESULTS PROGRESS BAR ANIMATION ---
    function triggerProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = `${targetWidth}%`;
        });
    }


    // --- ANIMATED COUNTERS ---
    // Smooth count-up utility using requestAnimationFrame for 60fps performance
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in milliseconds
        let startTime = null;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease-out cubic calculation for professional progressive slowdown
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easedProgress * target);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = target.toLocaleString(); // Exact finish
            }
        };

        window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statNumbers.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25
        });

        statsObserver.observe(statsSection);
    } else {
        // Fallback
        statNumbers.forEach(num => {
            num.textContent = num.getAttribute('data-target');
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
            const studentName = document.getElementById('student-name').value;
            const parentName = document.getElementById('parent-name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const course = document.getElementById('course-select').value;
            const message = document.getElementById('message').value;

            // Submit Button loading feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
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

    if (courseSelect) {
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

});
