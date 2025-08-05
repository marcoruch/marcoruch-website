/**
 * Social sharing functionality for Marco Ruch's portfolio
 * Handles sharing content to various social platforms
 */

document.addEventListener('DOMContentLoaded', function() {
    initSocialSharing();
});

function initSocialSharing() {
    // Setup project modal sharing buttons
    const modal = document.getElementById('projectModal');
    if (modal) {
        const shareButtons = modal.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get project details from modal
                const projectTitle = modal.querySelector('h3') ? modal.querySelector('h3').textContent : 'Marco Ruch Project';
                const projectDesc = modal.querySelector('.project-description') ? 
                    modal.querySelector('.project-description').textContent : 
                    'Check out this project by Marco Ruch, C# and Angular Developer';
                
                // Current URL + hash for the specific project
                const projectUrl = window.location.href;
                
                // Handle different sharing platforms
                if (button.classList.contains('share-linkedin')) {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}`, '_blank');
                } else if (button.classList.contains('share-twitter')) {
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(projectTitle + ' - ' + projectDesc)}`, '_blank');
                } else if (button.classList.contains('share-facebook')) {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`, '_blank');
                } else if (button.classList.contains('share-email')) {
                    window.location.href = `mailto:?subject=${encodeURIComponent(projectTitle)}&body=${encodeURIComponent(projectDesc + '\n\n' + projectUrl)}`;
                }
            });
        });
    }

    // Setup profile sharing buttons in contact section
    const contactShareButtons = document.querySelectorAll('.contact-info .share-buttons .share-btn');
    contactShareButtons.forEach(button => {
        // These already have appropriate hrefs set in the HTML
    });
}
