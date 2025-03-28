document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const logo = document.querySelector('.logo');

    // Menu item click handler
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Simple bounce animation for logo on menu click
            logo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                logo.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Logo hover animation
    logo.addEventListener('mouseenter', () => {
        logo.style.transform = 'rotate(360deg)';
    });

    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'rotate(0deg)';
    });
});