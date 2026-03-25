document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if(navLinks.classList.contains('active')) {
                    mobileToggle.click();
                }
            }
        });
    });

    // 4. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 5. Animated Stat Counters
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimatedCounters = false;
    
    function animateCountersOnScroll() {
        if(hasAnimatedCounters) return;
        
        let onScreen = false;
        counters.forEach(counter => {
            if(counter.getBoundingClientRect().top < window.innerHeight) {
                onScreen = true;
            }
        });
        
        if(!onScreen) return;
        hasAnimatedCounters = true;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const speed = 200;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            counter.innerText = '0';
            updateCount();
        });
    }
    
    if(counters.length > 0) {
        window.addEventListener('scroll', animateCountersOnScroll);
        animateCountersOnScroll();
    }

    // 6. Contact Form Validation and Logic
    const form = document.getElementById('booking-form');
    if(form) {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if(serviceParam) {
            const select = document.getElementById('service');
            if(select) select.value = serviceParam;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const inputs = form.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                const group = input.closest('.form-group');
                if(!input.value.trim()) {
                    group.classList.add('error');
                    isValid = false;
                } else {
                    group.classList.remove('error');
                }
            });

            const emailInput = document.getElementById('email');
            if(emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const group = emailInput.closest('.form-group');
                if(!emailRegex.test(emailInput.value)) {
                    group.classList.add('error');
                    group.querySelector('.error-message').textContent = 'Please enter a valid email';
                    isValid = false;
                } else {
                    group.classList.remove('error');
                }
            }

            if(!isValid) return;

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            // TODO: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS details
            // Ensure your EmailJS template expects variables matching your form's input "name" attributes:
            // {{name}}, {{email}}, {{phone}}, {{service}}, {{message}}
            if (typeof emailjs !== 'undefined') {
                emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
                    .then(() => {
                        btn.textContent = 'Message Sent Successfully!';
                        btn.style.backgroundColor = '#28a745';
                        btn.style.color = '#fff';
                        btn.style.opacity = '1';
                        
                        form.reset();
                        
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                        }, 3000);
                    }, (error) => {
                        console.error('EmailJS Error:', error);
                        btn.textContent = 'Failed to Send. Check Console.';
                        btn.style.backgroundColor = '#dc3545';
                        btn.style.color = '#fff';
                        btn.style.opacity = '1';
                        
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                        }, 3000);
                    });
            } else {
                console.warn('EmailJS SDK not found. Simulating submission.');
                setTimeout(() => {
                    btn.textContent = 'Message Sent Successfully! (Simulated)';
                    btn.style.backgroundColor = '#28a745';
                    btn.style.color = '#fff';
                    btn.style.opacity = '1';
                    
                    form.reset();
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 3000);
                }, 1000);
            }
        });

        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if(group) {
                    group.classList.remove('error');
                    const errorMsg = group.querySelector('.error-message');
                    if(errorMsg && input.type === 'email') errorMsg.textContent = 'This field is required';
                }
            });
        });
    }
});
