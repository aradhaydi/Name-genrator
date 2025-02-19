document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    feather.replace();

    // Elements
    const form = document.getElementById('generatorForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const results = document.getElementById('results');
    const namesList = document.getElementById('namesList');
    const favoritesList = document.getElementById('favoritesList');
    const copyToast = document.getElementById('copyToast');
    const categoryCards = document.querySelectorAll('.category-card');
    const sortSelect = document.getElementById('sortNames');

    // Bootstrap toast initialization
    const toast = new bootstrap.Toast(copyToast);

    // Font families for name preview
    const fontFamilies = [
        'Arial', 'Georgia', 'Verdana', 'Trebuchet MS', 
        'Impact', 'Courier New', 'Times New Roman'
    ];

    // Load favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    renderFavorites();

    // Category selection handler
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Sort names
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const names = Array.from(namesList.children);
            const direction = sortSelect.value;

            names.sort((a, b) => {
                const nameA = a.querySelector('.name-text').textContent;
                const nameB = b.querySelector('.name-text').textContent;
                return direction === 'asc' ? 
                    nameA.localeCompare(nameB) : 
                    nameB.localeCompare(nameA);
            });

            names.forEach(name => namesList.appendChild(name));
        });
    }

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const activeCategory = document.querySelector('.category-card.active');
        if (!activeCategory) {
            alert('Please select a category');
            return;
        }

        const category = activeCategory.dataset.category;
        const keywords = document.getElementById('keywords').value.trim()
            ? document.getElementById('keywords').value.trim().split(',')
            : [];
        const nameStyle = document.querySelector('input[name="nameStyle"]:checked').value;

        // Show loading state
        loadingIndicator.classList.remove('d-none');
        results.classList.add('d-none');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Generate names
        const generatedNames = generateNames(category, keywords, nameStyle);

        // Display results
        renderResults(generatedNames);

        // Hide loading state
        loadingIndicator.classList.add('d-none');
        results.classList.remove('d-none');

        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    function renderResults(names) {
        namesList.innerHTML = names.map(name => {
            const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
            return `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="name-text" style="font-family: ${randomFont}">${name}</span>
                    <div class="name-preview-fonts small text-muted ms-2 me-auto">
                        ${randomFont}
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-secondary copy-btn" data-name="${name}">
                            <i data-feather="copy"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary favorite-btn" data-name="${name}">
                            <i data-feather="star"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Re-initialize Feather icons
        feather.replace();

        // Add event listeners for copy and favorite buttons
        addButtonListeners();
    }

    function renderFavorites() {
        if (!favoritesList) return;

        favoritesList.innerHTML = favorites.length ? favorites.map(name => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span class="name-text">${name}</span>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary copy-btn" data-name="${name}">
                        <i data-feather="copy"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary remove-favorite-btn" data-name="${name}">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('') : '<div class="list-group-item text-center text-muted">No favorites yet</div>';

        feather.replace();
        addButtonListeners();
    }

    function addButtonListeners() {
        // Copy buttons with animation
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const name = btn.dataset.name;
                await navigator.clipboard.writeText(name);

                // Animate the copy icon
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'check');
                    feather.replace();
                    btn.classList.add('btn-success');

                    setTimeout(() => {
                        icon.setAttribute('data-feather', 'copy');
                        feather.replace();
                        btn.classList.remove('btn-success');
                    }, 1500);
                }

                toast.show();
            });
        });

        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                if (!favorites.includes(name)) {
                    favorites.push(name);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    renderFavorites();

                    // Animate the star
                    btn.classList.add('btn-warning');
                    setTimeout(() => btn.classList.remove('btn-warning'), 500);
                }
            });
        });

        // Remove favorite buttons
        document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                favorites = favorites.filter(f => f !== name);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                renderFavorites();
            });
        });
    }
});
