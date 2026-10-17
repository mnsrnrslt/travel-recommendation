document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const searchInput = document.getElementById('conditionInput');
    const resultsContainer = document.getElementById('results');

    if (btnSearch) {
        btnSearch.addEventListener('click', performSearch);
    }

    if (btnClear) {
        btnClear.addEventListener('click', clearSearch);
    }

    function clearSearch() {
        if (searchInput) searchInput.value = '';
        if (resultsContainer) resultsContainer.innerHTML = '';
    }

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            resultsContainer.innerHTML = '<p class="error-msg">Please enter a search keyword.</p>';
            return;
        }

        fetch('travel_recommendation.json')
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = '';
                let results = [];

                if (query.includes('beach')) {
                    results = data.beaches;
                } else if (query.includes('temple')) {
                    results = data.temples;
                } else if (query.includes('country') || query.includes('countries')) {
                    data.countries.forEach(country => {
                        results.push(...country.cities);
                    });
                } else {
                    // Search by specific name
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(query)) {
                            results.push(...country.cities);
                        } else {
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(query)) {
                                    results.push(city);
                                }
                            });
                        }
                    });

                    data.temples.forEach(temple => {
                        if (temple.name.toLowerCase().includes(query)) {
                            results.push(temple);
                        }
                    });

                    data.beaches.forEach(beach => {
                        if (beach.name.toLowerCase().includes(query)) {
                            results.push(beach);
                        }
                    });
                }

                displayResults(results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsContainer.innerHTML = '<p class="error-msg">Error loading recommendations.</p>';
            });
    }

    function displayResults(results) {
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No results found for your search.</p>';
            return;
        }

        results.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="visit-btn">Visit</button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});