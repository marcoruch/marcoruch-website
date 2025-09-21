/**
 * Main JavaScript file for Marco Ruch's portfolio website
 * Handles interactions, animations, and dynamic content
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██╗    ██╗███████╗██╗      ██████╗ ███╗   ███╗███████╗    ║
║    ██║    ██║██╔════╝██║     ██╔════╝ ████╗ ████║██╔════╝    ║
║    ██║ █╗ ██║█████╗  ██║     ██║  ███╗██╔████╔██║█████╗      ║
║    ██║███╗██║██╔══╝  ██║     ██║   ██║██║╚██╔╝██║██╔══╝      ║
║    ╚███╔███╔╝███████╗███████╗╚██████╔╝██║ ╚═╝ ██║███████╗    ║
║     ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝    ║
║                                                              ║
║                    Welcome to Marco Ruch's Portfolio!        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

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
    if (document.getElementById('current-year')) {
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
    
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
    const prevProjectBtn = document.querySelector('.prev-project');
    const nextProjectBtn = document.querySelector('.next-project');
    const projectLinksArr = Array.from(projectLinks);
    let currentProjectIndex = -1;
    
    if (!projectLinks.length || !modal) return;

    // Project data repository, keyed by data-project id
    const projectsData = {
        'dias-advisory-mandates': {
            title: 'DiAS - Digital Advisory Suite',
            intro: '<p>DiAS was Julius Baer\'s pioneering digital ecosystem for wealth management, which laid the foundation for modern advisory tools before being succeeded by the Wealth Navigator platform. I worked primarily on the Modular Offering Proposal component, enabling relationship managers to prepare detailed proposals for portfolio reallocations.</p>',
            sections: [
                {
                    title: 'Modular Offering Proposal',
                    body: '<p>The Modular Offering Proposal component was a key feature within DiAS that allowed relationship managers to prepare comprehensive reallocation proposals. It specifically focused on planning transitions from advisory to discretionary mandates, with the actual implementation handled through separate systems after client approval.</p>',
                    type: 'header'
                },
                {
                    title: 'My Contributions',
                    body: '<p>As a developer on the DiAS platform, I focused specifically on the Modular Offering Proposal functionality. My work included developing interfaces for mandate selection and comparison, designing proposal workflows for portfolio reallocations, and creating systems for generating client-facing PDF documents that clearly communicated recommended investment strategy changes.</p>',
                    type: 'header'
                },
                {
                    title: 'Key Features Developed',
                    body: '<ul><li><strong>Mandate Selection</strong>: Interactive tools for identifying suitable discretionary mandates based on client requirements and existing advisory portfolios</li><li><strong>Reallocation Planning</strong>: Visualization and planning of portfolio adjustments with clear before/after comparisons</li><li><strong>Comparative Analysis</strong>: Side-by-side comparison of advisory vs. discretionary investment strategies and their projected outcomes</li><li><strong>Proposal Documentation</strong>: Automated creation of professional, client-facing PDF proposals outlining recommended reallocations</li></ul>',
                    type: 'standard'
                },
                {
                    title: 'Technical Implementation',
                    body: '<p>The proposal system was built using a microfrontend architecture with Angular for the frontend and TypeScript, while the backend utilized .NET Core and C#. This architecture enabled seamless integration with client data sources and the Mandate Solution Designer for related proposals and product selection. The system incorporated complex data modeling to properly represent both advisory and discretionary mandate structures, with PDF generation implemented through a custom templating system that maintained brand consistency.</p>',
                    type: 'standard'
                },
                {
                    title: 'Integration Points',
                    body: '<ul><li><strong>Client Data</strong>: Microfrontend integration with client portfolio and profile information</li><li><strong>Mandate Solution Designer</strong>: Connected to MSD for accessing mandate definitions and available product offerings aswell as related proposals</li><li><strong>Rule Engine</strong>: Integration with rule engine for compliance checks</li></ul>',
                    type: 'standard'
                },
                {
                    title: 'Impact',
                    body: '<p>The Modular Offering Proposal component significantly streamlined the advisory-to-discretionary transition process, reducing the time needed to create personalized reallocation proposals. Relationship managers could clearly explain the benefits of transitioning to discretionary mandates, compare fee structures and investment approaches, and provide clients with comprehensive documentation to support informed decisions.</p>',
                    type: 'header'
                }
            ],
            technologies: ['Angular', 'TypeScript', 'Micro Frontends', '.NET Core', 'C#', 'Octopus', 'MSSQL'],
            images: [
                'assets/images/projects/dias_digital_advisory_suite.png'
            ],
            category: 'financial'
        },
        'wealth-navigator-platform': {
            title: 'WN - Wealth Navigator Platform',
            intro: '<p>The Wealth Navigator Platform is Julius Baer\'s modern digital ecosystem for wealth management, succeeding DiAS as the primary advisory tool. I worked on the Modular Offering Proposal component, which enables relationship managers to prepare detailed proposals for portfolio reallocations using microfrontend architecture.</p>',
            sections: [
                {
                    title: 'Modular Offering Proposal',
                    body: '<p>The Modular Offering Proposal component is a key feature within the Wealth Navigator platform that allows relationship managers to prepare comprehensive reallocation proposals. It focuses on planning transitions from advisory to discretionary mandates, with the actual implementation handled through separate systems after client approval.</p>',
                    type: 'header'
                },
                {
                    title: 'My Contributions',
                    body: '<p>As a developer on the Wealth Navigator platform, I focused specifically on the Modular Offering Proposal functionality. My work included developing interfaces for mandate selection and comparison, designing proposal workflows for portfolio reallocations, and creating systems for generating client-facing PDF documents that clearly communicated recommended investment strategy changes.</p>',
                    type: 'header'
                },
                {
                    title: 'Key Features Developed',
                    body: '<ul><li><strong>Mandate Selection</strong>: Interactive tools for identifying suitable discretionary mandates based on client requirements and existing advisory portfolios</li><li><strong>Reallocation Planning</strong>: Visualization and planning of portfolio adjustments with clear before/after comparisons</li><li><strong>Comparative Analysis</strong>: Side-by-side comparison of advisory vs. discretionary investment strategies and their projected outcomes</li><li><strong>Proposal Documentation</strong>: Automated creation of professional, client-facing PDF proposals outlining recommended reallocations</li></ul>',
                    type: 'standard'
                },
                {
                    title: 'Technical Implementation',
                    body: '<p>Built using Angular microfrontend architecture with TypeScript, the component integrates seamlessly with the broader Wealth Navigator ecosystem. The backend services are developed in C# with Entity Framework, ensuring robust data management and API integration for mandate data and client information.</p>',
                    type: 'standard'
                },
                {
                    title: 'Microfrontend Architecture',
                    body: '<p>The Modular Offering Proposal component leverages microfrontend architecture to provide modularity and reusability across different platforms. This approach allows the same component to be used in both DiAS and Wealth Navigator, ensuring consistency in user experience while maintaining independent deployment capabilities.</p>',
                    type: 'standard'
                }
            ],
            technologies: ['Angular', 'TypeScript', 'Micro Frontends', '.NET Core', 'C#', 'Octopus', 'MSSQL'],
            images: [
                'assets/images/projects/wealth_navigator_pixelated.webp'
            ],
            category: 'financial'
        },
        'baerhaviour-uba': {
            title: 'BaerHaviour – User Behaviour Analytics',
            intro: '<p>Capturing and interpreting user behaviour in Julius Baer\'s Wealth Navigator (WN) to enable data‑driven product development. This work combines a technical proof‑of‑concept (PoC) and a UX prototype to track, process, and visualise interaction data for actionable insights.</p>',
            sections: [
                {
                    title: 'Initial Situation',
                    body: '<p>WN automates compliance tasks and supports investment strategy creation for Relationship Managers and Advisors. Its predecessor (DiAS) increased productivity but lacked integrated tracking. Without behavioural data, teams could not reliably assess feature usage, pain points, or workflow efficiency across a globally distributed user base and a micro‑frontend architecture.</p>',
                    type: 'header'
                },
                {
                    title: 'Project Goal',
                    body: '<p>Design and implement BaerHaviour as a PoC and UX concept to provide product managers and stakeholders with actionable insights into how WN is used. Establish a foundation for capturing, processing and visualising behavioural data, focusing on two journeys: Modular Offering Proposal and New Advisory Session.</p>',
                    type: 'header'
                },
                {
                    title: 'Research Questions',
                    body: '<ul><li><strong>Data Collection</strong>: Which behaviour data points best indicate how well WN supports users, and how can they be captured?</li><li><strong>Processing & Structuring</strong>: How can captured data be validated, enriched and aggregated into actionable insights?</li><li><strong>Information Visualisation</strong>: How should the data be presented to support decision‑making?</li></ul>',
                    type: 'standard'
                },
                {
                    title: 'Solution Overview',
                    body: '<p>The solution consists of a framework‑agnostic tracking library, a backend processing pipeline and an Angular‑based analytics frontend, complemented by a Figma prototype that explores decision‑oriented visualisations (Dashboards, Session Metrics, Journey Metrics, Drilldowns, Session Timeline, and WN‑specific insights).</p>',
                    type: 'header'
                },
                {
                    title: 'Tracking Approach',
                    body: '<p>A custom npm package (<code>baer-haviour</code>) captures clicks, navigation, API performance, validation errors and custom events across Angular and React. The library supports scoped tagging, Shadow DOM and configuration‑driven extensibility, and sends data via the Beacon API to minimise performance impact.</p>',
                    type: 'standard'
                },
                {
                    title: 'Backend Processing Pipeline',
                    body: '<p>Events are validated and enriched, then aggregated into Sub‑Journeys and Composite Journeys using configurable patterns. Both raw and aggregated data are stored in a relational schema for traceability, and exposed via API endpoints. Aggregation is decoupled from real‑time operations for performance.</p>',
                    type: 'standard'
                },
                {
                    title: 'Frontend Architecture',
                    body: '<p>The Angular 18 frontend uses a modular, widget‑based dashboard architecture with lazy‑loaded routes and NgRx state management. Widgets can be grouped, extended and composed as new insights are added.</p>',
                    type: 'standard'
                },
                {
                    title: 'UX/UI Concept',
                    body: '<p>The Figma prototype aligns with the Julius Baer design system and emphasises usability: high‑level overviews, interactive visualisations, progressive disclosure, reusable layouts and clear navigation support fast decision‑making.</p>',
                    type: 'standard'
                },
                {
                    title: 'Outcomes & Validation',
                    body: '<p>Stakeholder validation with five participants confirmed practical relevance and usefulness. Metrics and visualisations were rated more helpful than previous ad‑hoc methods, enabling a shift from reactive to proactive identification of UX and workflow issues.</p>',
                    type: 'header'
                },
                {
                    title: 'Team',
                    body: `
                            <ul>
                                <li><strong>Students</strong>:
                                    <ul>
                                        <li>Larissa Martins Sequeira (BSc Computer Science, iCompetence)</li>
                                        <li>Marco Ruch (BSc Computer Science, Web Engineering)</li>
                                    </ul>
                                </li>
                                <li><strong>Advisors</strong>:
                                    <ul>
                                        <li>Prof. Martin Kropp</li>
                                        <li>Fabian Affolter</li>
                                    </ul>
                                </li>
                            </ul>`,
                    type: 'subtitle'
                }
            ],
            technologies: ['Angular', 'TypeScript', 'C#', 'Entity Framework', 'MSSQL'],
            images: [
                'assets/images/projects/baer_haviour_uba_analytics.png',
                'assets/images/projects/baer_haviour_uba_analytics/figma_journey_details.png',
                'assets/images/projects/baer_haviour_uba_analytics/figma_session_details.png',
                'assets/images/projects/baer_haviour_uba_analytics/figma_user_activity_table.png',
                'assets/images/projects/baer_haviour_uba_analytics/figma_user_details.png',
                'assets/images/projects/baer_haviour_uba_analytics/figma_wealth_navigator_insights.png',
                'assets/images/projects/baer_haviour_uba_analytics/proof_of_concept_actual_session_with_timeline.png',
                'assets/images/projects/baer_haviour_uba_analytics/proof_of_concept_application_dashboard.png',
                'assets/images/projects/baer_haviour_uba_analytics/proof_of_concept_application_session_metrics.png',
                'assets/images/projects/baer_haviour_uba_analytics/proof_of_concept_journey_metrics.png',
                'assets/images/projects/baer_haviour_uba_analytics/prrof_of_concept_drilldown_sessions.png'
            ],
            category: 'financial'
        },
        'discretionary-mandates-platform': {
            title: 'MSD - Mandate Solution Designer',
            intro: '<p>A comprehensive platform for creating and managing discretionary investment mandates for high-net-worth clients. The solution enables relationship managers and portfolio managers to craft personalized investment strategies while incorporating ESG preferences.</p>',
            sections: [
                {
                    title: 'Platform Overview',
                    body: '<p>MSD provides a powerful environment for financial professionals to design, link, and implement sophisticated investment strategies using various financial products. The platform offers comprehensive insights into the entire product catalogue, facilitating informed decision-making.</p>',
                    type: 'header'
                },
                {
                    title: 'Core Capabilities',
                    body: '<p>The platform supports strategy creation, product selection, ESG preference integration, performance monitoring, and analytical reporting. It streamlines mandate management workflows while ensuring compliance with regulatory requirements and client preferences.</p>',
                    type: 'standard'
                },
                {
                    title: 'My Contributions',
                    body: '<p>My work spanned the entire technology stack, including backend development, frontend implementation, database design, and microfrontend integration. I also took a leading role in design work across the frontend stack, ensuring a consistent and intuitive user experience.</p>',
                    type: 'header'
                },
                {
                    title: 'Technical Impact',
                    body: '<p>A significant achievement was optimizing a critical dashboard\'s performance, resulting in up to 95% speed improvement. This enhancement dramatically improved user experience and operational efficiency for financial advisors managing complex client portfolios.</p>',
                    type: 'standard'
                },
                {
                    title: 'Technologies',
                    body: '<p>The solution leverages a modern tech stack including React with TypeScript for the frontend, Java with Hibernate for the backend, Oracle databases for data storage, SCSS for styling, and the Zafire design system for consistent UI components.</p>',
                    type: 'subtitle'
                }
            ],
            technologies: ['React', 'TypeScript', 'Java', 'Hibernate', 'Oracle', 'SCSS', 'Zafire Design System'],
            images: [
                'assets/images/projects/msd_mandate_solution_designer_pixelated.webp'
            ],
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
    
    // Open modal function
    function openModal(projectData) {
        // Build modal body structure dynamically (title, intro, technologies, carousel, details)
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) return;

        // Clear body
        modalBody.innerHTML = '';

        // Title
        const titleEl = document.createElement('h3');
        titleEl.className = 'modal-title';
        titleEl.textContent = projectData.title || 'Project Details';
        modalBody.appendChild(titleEl);

        // Technologies
        if (projectData.technologies && projectData.technologies.length) {
            const techWrap = document.createElement('div');
            techWrap.className = 'modal-technologies tech-tags';
            projectData.technologies.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techWrap.appendChild(tag);
            });
            modalBody.appendChild(techWrap);
        }
        // Intro (short description shown above carousel). Keep class project-description for sharing hooks
        const introEl = document.createElement('div');
        introEl.className = 'modal-intro modal-description project-description';
        introEl.innerHTML = projectData.intro || projectData.description || '';
        modalBody.appendChild(introEl);


        // Carousel
        if (projectData.images && projectData.images.length) {
            const carousel = document.createElement('div');
            carousel.className = 'carousel';

            const track = document.createElement('div');
            track.className = 'carousel-track';

            projectData.images.forEach((src, index) => {
                const item = document.createElement('div');
                item.className = 'carousel-item';
                const img = document.createElement('img');
                img.src = src;
                img.alt = projectData.title + ' - slide ' + (index + 1);
                img.loading = 'lazy';
                item.appendChild(img);
                track.appendChild(item);
            });

            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-control prev';
            prevBtn.setAttribute('aria-label', 'Previous image');
            prevBtn.textContent = '‹';

            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-control next';
            nextBtn.setAttribute('aria-label', 'Next image');
            nextBtn.textContent = '›';

            const dots = document.createElement('div');
            dots.className = 'carousel-dots';
            projectData.images.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                dots.appendChild(dot);
            });

            carousel.appendChild(track);
            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
            carousel.appendChild(dots);
            modalBody.appendChild(carousel);

            // Carousel logic
            let current = 0;
            const total = projectData.images.length;

            const updateHeight = () => {
                const currentItem = track.children[current];
                if (!currentItem) return;
                const img = currentItem.querySelector('img');
                const width = carousel.clientWidth || currentItem.clientWidth;
                let contentHeight = currentItem.clientHeight;
                if (img && img.naturalWidth) {
                    const ratio = img.naturalHeight / img.naturalWidth;
                    if (ratio && width) {
                        contentHeight = Math.round(width * ratio);
                    }
                }
                // Reserve height only for the image track. Dots are absolutely positioned with padding in CSS
                carousel.style.height = `${contentHeight}px`;
            };

            const update = () => {
                track.style.transform = `translateX(-${current * 100}%)`;
                const allDots = dots.querySelectorAll('.carousel-dot');
                allDots.forEach((d, i) => d.classList.toggle('active', i === current));
                updateHeight();
            };
            prevBtn.addEventListener('click', () => { current = (current - 1 + total) % total; update(); });
            nextBtn.addEventListener('click', () => { current = (current + 1) % total; update(); });
            dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.addEventListener('click', () => { current = i; update(); });
            });

            // Adjust height when images load and on resize
            track.querySelectorAll('img').forEach(img => {
                if (img.complete) {
                    // already loaded
                } else {
                    img.addEventListener('load', updateHeight, { once: true });
                }
            });
            window.addEventListener('resize', updateHeight);

            update();
        }

        // Detailed sections (below carousel)
        if (projectData.sections && projectData.sections.length) {
            const sectionsWrap = document.createElement('div');
            sectionsWrap.className = 'modal-sections';

            projectData.sections.forEach(section => {
                const sectionBlock = document.createElement('section');
                
                // Apply section type as a class if specified
                if (section.type) {
                    sectionBlock.classList.add(`section-type-${section.type}`);
                }
                
                // Create header with consistent h4 tag but apply typography classes based on type
                const header = document.createElement('h4');
                header.textContent = section.title;
                
                // Apply typography classes based on section type
                if (section.type === 'header') {
                    header.classList.add('typography-section-header');
                } else if (section.type === 'subtitle') {
                    header.classList.add('typography-section-subtitle');
                } else {
                    header.classList.add('typography-section-standard');
                }
                
                const body = document.createElement('div');
                body.className = 'modal-section-body';
                if (section.type) {
                    body.classList.add(`body-type-${section.type}`);
                }
                body.innerHTML = section.body;
                
                sectionBlock.appendChild(header);
                sectionBlock.appendChild(body);
                sectionsWrap.appendChild(sectionBlock);
            });

            modalBody.appendChild(sectionsWrap);
        }

        // Optional links
        const navArea = modal.querySelector('.modal-navigation');
        if (navArea) {
            // leave existing prev/next buttons in place; optionally append demo/repo
            if (projectData.demoUrl || projectData.repoUrl) {
                const linksWrap = document.createElement('div');
                linksWrap.className = 'modal-links';
                if (projectData.demoUrl) {
                    const a = document.createElement('a');
                    a.href = projectData.demoUrl; a.target = '_blank';
                    a.className = 'btn btn-primary'; a.textContent = 'View Demo';
                    linksWrap.appendChild(a);
                }
                if (projectData.repoUrl) {
                    const a = document.createElement('a');
                    a.href = projectData.repoUrl; a.target = '_blank';
                    a.className = 'btn btn-secondary'; a.textContent = 'View Code';
                    linksWrap.appendChild(a);
                }
                navArea.prepend(linksWrap);
            }
        }

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        const focusable = modalContent.querySelector('button, a');
        if (focusable) focusable.focus();
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    
    // Helper to open modal by id
    function openModalWithId(projectId) {
        const projectData = projectsData[projectId] || {
            title: 'Project Details',
            description: 'No details available for this project.',
            technologies: [],
            image: ''
        };
        openModal(projectData);
    }

    // Add click event to project links
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            currentProjectIndex = projectLinksArr.indexOf(this);
            openModalWithId(projectId);
        });
    });
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking on backdrop (modal itself, not modal-content)
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Only close if clicking on the modal backdrop, not on the content
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prev/Next project navigation (wrap-around)
    function navigate(offset) {
        if (currentProjectIndex === -1) return;
        const total = projectLinksArr.length;
        currentProjectIndex = (currentProjectIndex + offset + total) % total;
        const nextId = projectLinksArr[currentProjectIndex].getAttribute('data-project');
        openModalWithId(nextId);
    }

    if (prevProjectBtn) {
        prevProjectBtn.addEventListener('click', () => navigate(-1));
    }
    if (nextProjectBtn) {
        nextProjectBtn.addEventListener('click', () => navigate(1));
    }
}

/**
 * Contact form functionality
 * Form validation and submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!contactForm || !sendBtn) return;
    
    // Enable the submit button immediately
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send Message';
    
    contactForm.addEventListener('submit', function(e) {
        // Get form data for validation
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();
        
        // Simple validation
        let valid = true;
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const errorMessage = group.querySelector('.error-message');
            
            if (!input.value.trim()) {
                valid = false;
                group.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'This field is required';
                }
            } else if (input.id === 'email' && !isValidEmail(email)) {
                valid = false;
                group.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = 'Please enter a valid email address';
                }
            } else {
                group.classList.remove('error');
                if (errorMessage) {
                    errorMessage.textContent = '';
                }
            }
        });
        
        if (!valid) {
            // Prevent submission if validation fails
            e.preventDefault();
        } else {
            // Show loading state and submit
            sendBtn.textContent = 'Sending...';
            sendBtn.disabled = true;
            
            // Form will submit normally without reCAPTCHA
        }
    });
    
    // Reset validation on input
    contactForm.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', function() {
            const group = this.closest('.form-group');
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
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
 * Scroll to Projects Section
 * Smoothly scrolls to the projects section when called
 */
function scrollToProjectsSection() {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
        const offsetTop = projectsSection.offsetTop;
        window.scrollTo({            
            top: offsetTop,
            behavior: 'smooth'
        });
    }
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
            scrollToProjectsSection();
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
