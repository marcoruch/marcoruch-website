/**
 * Main JavaScript file for Marco Ruch's portfolio website
 * Handles interactions, animations, and dynamic content
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initProjectFilters();
    initProjectModals();
    initContactForm();
    initBackToTop();
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

/**
 * Navigation functionality
 * - Smooth scrolling
 * - Active state on scroll
 * - Mobile menu toggle
 */
function initNavigation() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
}

/**
 * Scroll-triggered animations
 * Uses Intersection Observer to trigger animations as elements come into view
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: stop observing after animation is triggered
                // animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust when animation triggers relative to viewport
    });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

/**
 * Project filtering functionality
 * Filters projects based on technology/category
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projects.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projects.forEach(project => {
                if (filter === 'all') {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.classList.remove('hidden');
                    }, 10);
                } else {
                    const projectTechnologies = project.getAttribute('data-technologies').split(',');
                    
                    if (projectTechnologies.includes(filter)) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.classList.remove('hidden');
                        }, 10);
                    } else {
                        project.classList.add('hidden');
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300); // Match transition duration
                    }
                }
            });
        });
    });
}

/**
 * Project modal functionality
 * Opens a modal with detailed project information
 */
function initProjectModals() {
    const projectLinks = document.querySelectorAll('.view-project');
    const modal = document.querySelector('.project-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!projectLinks.length || !modal) return;
    
    // Open modal function
    function openModal(projectData) {
        // Populate modal with project data
        const modalTitle = modalContent.querySelector('.modal-title');
        const modalDescription = modalContent.querySelector('.modal-description');
        const modalImage = modalContent.querySelector('.modal-image');
        const modalTechnologies = modalContent.querySelector('.modal-technologies');
        const modalLinks = modalContent.querySelector('.modal-navigation');
        
        if (modalTitle) modalTitle.textContent = projectData.title;
        if (modalDescription) modalDescription.innerHTML = projectData.description;
        if (modalImage) modalImage.src = projectData.image;
        
        // Add technologies
        if (modalTechnologies) {
            modalTechnologies.innerHTML = '';
            if (projectData.technologies && projectData.technologies.length) {
                projectData.technologies.forEach(tech => {
                    const techTag = document.createElement('span');
                    techTag.classList.add('tech-tag');
                    techTag.textContent = tech;
                    modalTechnologies.appendChild(techTag);
                });
            }
        }
        
        // Add links (demo, repository, etc.)
        if (modalLinks) {
            modalLinks.innerHTML = '';
            
            if (projectData.demoUrl) {
                const demoLink = document.createElement('a');
                demoLink.classList.add('btn', 'btn-primary');
                demoLink.href = projectData.demoUrl;
                demoLink.target = '_blank';
                demoLink.textContent = 'View Demo';
                modalLinks.appendChild(demoLink);
            }
            
            if (projectData.repoUrl) {
                const repoLink = document.createElement('a');
                repoLink.classList.add('btn', 'btn-secondary');
                repoLink.href = projectData.repoUrl;
                repoLink.target = '_blank';
                repoLink.textContent = 'View Code';
                modalLinks.appendChild(repoLink);
            }
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Add focus trap for accessibility
        modalContent.querySelector('button, a').focus();
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    // Add click event to project links
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get project data
            const projectCard = this.closest('.project-card');
            const projectData = {
                title: projectCard.querySelector('.project-title').textContent,
                description: projectCard.getAttribute('data-description'),
                image: projectCard.querySelector('.project-image').src,
                technologies: projectCard.getAttribute('data-technologies').split(','),
                demoUrl: projectCard.getAttribute('data-demo-url'),
                repoUrl: projectCard.getAttribute('data-repo-url')
            };
            
            openModal(projectData);
        });
    });
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Contact form functionality
 * Form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        
        // Simple validation
        let valid = true;
        const formFields = contactForm.querySelectorAll('.form-field');
        
        formFields.forEach(field => {
            const input = field.querySelector('input, textarea');
            const errorMessage = field.querySelector('.error-message');
            
            if (!input.value.trim()) {
                valid = false;
                field.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'This field is required';
                }
            } else if (input.id === 'email' && !isValidEmail(email)) {
                valid = false;
                field.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter a valid email address';
                }
            } else {
                field.classList.remove('error');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });
        
        if (valid) {
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            contactForm.classList.add('form-success');
            contactForm.innerHTML = `
                <div class="form-success-message">
                    <h3>Thank you for your message!</h3>
                    <p>I'll get back to you as soon as possible.</p>
                </div>
            `;
        }
    });
    
    // Reset validation on input
    contactForm.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
        input.addEventListener('input', function() {
            const field = this.closest('.form-field');
            field.classList.remove('error');
            const errorMessage = field.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
