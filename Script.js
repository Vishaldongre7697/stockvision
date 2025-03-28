document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const pageContainer = document.getElementById('page-container');

    // Load page on menu item click
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');

            const page = event.target.dataset.page;
            loadPage(page);
        });
    });

    // Function to load page content
    function loadPage(page) {
        let pageFile = `pages/${page}.html`;
        if (page === 'AlgoTrade') {
            pageFile = `pages/Predictions.html`; // AlgoTrade is the same as prediction
        }

        fetch(pageFile)
            .then(response => response.text())
            .then(html => {
                pageContainer.innerHTML = html;

                // Load page-specific JavaScript if it exists
                const pageScript = `js/${page}.js`;
                if (page === 'AlgoTrade') {
                    pageScript = `js/Predictions.js`;
                }
                loadPageScript(pageScript);
            })
            .catch(error => {
                console.error(`Error loading ${page}:`, error);
                pageContainer.innerHTML = `<p>Error loading page.</p>`;
            });
    }

    function loadPageScript(scriptSrc) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onerror = () => {
            console.log(`Script ${scriptSrc} not found.`);
        };
        document.body.appendChild(script);
    }

    // Load the initial page (e.g., Home)
    loadPage('Home');
});