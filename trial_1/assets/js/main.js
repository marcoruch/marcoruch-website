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
    initLoadMoreProjects(); // Add load more projects functionality
    
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Force animate all elements immediately and again after a delay to ensure visibility
    forceAnimateAll();
    setTimeout(forceAnimateAll, 500);
});

/**
 * Force all animatable elements to show regardless of scroll position
 * This ensures content is visible even if scroll animations fail
 */
function forceAnimateAll() {
    // First, add animate class to parent containers
    const containerElements = document.querySelectorAll('.section-title, .section-intro, .skill-category, .experience-card, .education-card, .project-card, .about-image, .about-text, .contact-form-container, .contact-info');
    containerElements.forEach(element => {
        element.classList.add('animate');
    });

    // Then also add it to specific child elements that might need their own animations
    const childElements = document.querySelectorAll('.about-text p, .about-text blockquote, .about-text ul, .about-attributes li');
    childElements.forEach(element => {
        element.classList.add('animate');
    });
}

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
    // Select all elements that need animation
    const animatedElements = document.querySelectorAll('.section-title, .section-intro, .skill-category, .experience-card, .education-card, .project-card, .about-image, .about-text, .about-text p, .about-text blockquote, .about-text ul, .about-attributes li, .contact-form-container, .contact-info');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Stop observing after animation is triggered
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Lower threshold to trigger sooner
        rootMargin: '0px 0px -30px 0px' // Adjusted to trigger animations earlier
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
    const projectsGrid = document.querySelector('.projects-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Calculate the height of a single project card for reference if needed
    const singleCardHeight = projects.length > 0 ? projects[0].offsetHeight : 0;
    
    if (!filterButtons.length || !projects.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projects.forEach(project => {
                if (filter === 'all') {
                    // When showing all, respect the load more setting
                    if (loadMoreBtn && loadMoreBtn.textContent === 'Load More Projects') {
                        // If we're in "show limited" mode, only show the first 6
                        const index = Array.from(projects).indexOf(project);
                        if (index < 6) {
                            project.style.display = 'block';
                            setTimeout(() => {
                                project.classList.remove('hidden');
                            }, 10);
                        } else {
                            project.classList.add('hidden');
                            setTimeout(() => {
                                project.style.display = 'none';
                            }, 300);
                        }
                    } else {
                        // Show all if load more was clicked
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.classList.remove('hidden');
                        }, 10);
                    }
                } else {
                    const projectCategory = project.getAttribute('data-category');
                    
                    if (projectCategory === filter) {
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
            
            // Calculate visible projects count
            const visibleProjects = [...projects].filter(project => 
                !project.classList.contains('hidden') && 
                window.getComputedStyle(project).display !== 'none'
            );
            
            // Show/hide load more button based on filter
            if (filter !== 'all') {
                // Hide load more button when filtering by category
                if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            } else {
                // Show load more button when showing all projects
                if (loadMoreBtn) loadMoreBtn.style.display = 'block';
            }
            
            // Handle few cards without setting fixed height
            if (projectsGrid) {
                if (visibleProjects.length < 4) {
                    // Add a class to prevent cards from stretching
                    projectsGrid.classList.add('few-cards');
                } else {
                    projectsGrid.classList.remove('few-cards');
                }
            }
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
            
            const projectId = this.getAttribute('data-project');
            
            // Project data 
            const projectsData = {
                'advisory-mandates': {
                    title: 'Advisory Mandates Platform',
                    description: '<p>A comprehensive platform for financial advisors to manage client portfolios, investment strategies, and reporting.</p><p>This solution helps financial advisors create personalized investment strategies for their clients, track performance, and generate detailed reports.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'Entity Framework', 'MSSQL'],
                    category: 'financial'
                },
                'discretionary-mandates': {
                    title: 'Discretionary Mandates Platform',
                    description: '<p>A specialized system for managing discretionary investment mandates for high-net-worth clients.</p><p>This platform allows portfolio managers to implement investment strategies across multiple client accounts, perform rebalancing, and monitor performance against benchmarks.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'Entity Framework', 'MSSQL'],
                    category: 'financial'
                },
                'financial-instruments': {
                    title: 'Financial Instruments Data',
                    description: '<p>A data management system for financial instruments, providing real-time market data, analytics, and historical performance.</p><p>This solution centralizes information about various financial products, including stocks, bonds, derivatives, and alternative investments.</p>',
                    technologies: ['React', 'TypeScript', 'C#', 'MSSQL'],
                    category: 'financial'
                },
                'tech-talent': {
                    title: 'Tech Talent Recruiting Platform',
                    description: '<p>A specialized recruiting platform connecting technology companies with qualified IT professionals.</p><p>This solution streamlines the hiring process for technical roles through skills assessment, automated screening, and interview scheduling.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'MSSQL', 'Node.js'],
                    category: 'people'
                },
                'legal-protection': {
                    title: 'Legal Protection Administration',
                    description: '<p>A comprehensive system for managing legal protection insurance policies, claims, and case tracking.</p><p>This platform helps insurance providers streamline case management, document processing, and communication with legal professionals.</p>',
                    technologies: ['C#', 'Entity Framework', 'MSSQL', 'ASP.NET MVC'],
                    category: 'insurance'
                },
                'crm-accounting': {
                    title: 'CRM / Accounting Platform',
                    description: '<p>An integrated CRM and accounting solution for insurance companies, providing a unified view of customer relationships and financial data.</p><p>This system combines customer management with financial tracking to optimize business operations and reporting.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'Entity Framework', 'MSSQL'],
                    category: 'insurance'
                },
                'printer-logistics': {
                    title: 'Printer Logistics',
                    description: '<p>A specialized logistics management system for printer distribution, tracking, and maintenance.</p><p>This solution helps organizations manage their printer fleet, schedule maintenance, and optimize distribution based on usage patterns.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'MSSQL'],
                    category: 'other'
                },
                'auto-logistics': {
                    title: 'Automobile Logistics Tracking',
                    description: '<p>A comprehensive system for tracking automobile movement through the supply chain, from factory to dealership.</p><p>This platform provides real-time visibility into vehicle location, transportation status, and delivery timelines.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'MSSQL'],
                    category: 'automotive'
                },
                'fleet-management': {
                    title: 'Car Fleet Management',
                    description: '<p>A complete fleet management solution for organizations with vehicle fleets, including maintenance scheduling, driver assignment, and cost tracking.</p><p>This system helps optimize fleet operations, reduce maintenance costs, and extend vehicle lifespan.</p>',
                    technologies: ['C#', 'ASP.NET MVC', 'JavaScript', 'MSSQL'],
                    category: 'automotive'
                },
                'car-order-tracking': {
                    title: 'Car Order Tracking',
                    description: '<p>A specialized system for tracking custom vehicle orders from placement to delivery.</p><p>This platform provides customers and dealerships with real-time updates on vehicle production status, shipping information, and delivery estimates.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'MSSQL'],
                    category: 'automotive'
                },
                'civil-engineering': {
                    title: 'Civil Engineering Administration',
                    description: '<p>A comprehensive project management system for civil engineering firms, including project tracking, resource allocation, and document management.</p><p>This solution streamlines administrative processes for engineering projects, from proposal to completion.</p>',
                    technologies: ['C#', 'ASP.NET MVC', 'JavaScript', 'MSSQL'],
                    category: 'other'
                },
                'ticket-membership': {
                    title: 'Ticket Membership Platform',
                    description: '<p>A specialized platform for managing event ticket sales, memberships, and loyalty programs.</p><p>This system helps venues and event organizers optimize ticket sales, manage customer relationships, and implement effective loyalty programs.</p>',
                    technologies: ['Angular', 'TypeScript', 'C#', 'MSSQL'],
                    category: 'ecommerce'
                }
            };
            
            const projectData = projectsData[projectId] || {
                title: 'Project Details',
                description: 'No details available for this project.',
                technologies: [],
                image: ''
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

/**
 * Load More Projects functionality
 * Initially shows only 6 projects, then allows loading all on button click
 */
function initLoadMoreProjects() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const projects = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    const projectsPerPage = 6; // Number of projects to show initially
    let allProjectsVisible = false;
    
    if (!loadMoreBtn || !projects.length) return;
    
    // Initially hide projects beyond the initial count
    function hideExtraProjects() {
        // First, make all projects visible (needed if switching from filtered view)
        projects.forEach((project, index) => {
            project.classList.remove('hidden');
            project.style.display = 'block';
        });
        
        // Then hide projects beyond the initial count
        projects.forEach((project, index) => {
            if (index >= projectsPerPage) {
                project.classList.add('hidden');
                setTimeout(() => {
                    project.style.display = 'none';
                }, 300);
            }
        });
        
        allProjectsVisible = false;
        loadMoreBtn.textContent = 'Load More Projects';
        loadMoreBtn.style.display = 'block';
    }
    
    // Function to show all projects
    function showAllProjects() {
        projects.forEach(project => {
            project.style.display = 'block';
            setTimeout(() => {
                project.classList.remove('hidden');
            }, 10);
        });
        
        allProjectsVisible = true;
        loadMoreBtn.textContent = 'Show Less';
    }
    
    // Initialize by hiding extra projects
    hideExtraProjects();
    
    // Load more button click handler
    loadMoreBtn.addEventListener('click', () => {
        if (allProjectsVisible) {
            hideExtraProjects();
        } else {
            showAllProjects();
        }
        
        // Update grid classes for responsive behavior
        if (projectsGrid) {
            const visibleProjects = [...projects].filter(project => 
                !project.classList.contains('hidden') && 
                window.getComputedStyle(project).display !== 'none'
            );
            
            if (visibleProjects.length < 4) {
                projectsGrid.classList.add('few-cards');
            } else {
                projectsGrid.classList.remove('few-cards');
            }
        }
    });
    
    // Update project filters to show all projects when a filter is applied
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // When a filter is clicked, show all projects (not just first 6)
            // but only for the filtered category
            if (button.getAttribute('data-filter') !== 'all') {
                allProjectsVisible = true;
                // Hide "Load More" button when filters are active
                loadMoreBtn.style.display = 'none';
            } else if (!allProjectsVisible) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = 'Load More Projects';
            } else {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = 'Show Less';
            }
        });
    });
    
    // Apply initial limit on page load
    hideExtraProjects();
}
