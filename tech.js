const safeSites = [
    'techcrunch.com',
    'thenextweb.com',
    'wired.com',
    'theverge.com',
    'bbc.com',
    'bbc.co.uk',
    'cnet.com',
    'nytimes.com',
    'medium.com',
    'github.com'
];

let showOnlySafe = false;

// Safe Articles Toggle
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Show Only Safe Articles';
toggleButton.className =
    'mb-4 px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-lg hover:scale-105 transition';

document
    .querySelector('main')
    .insertBefore(toggleButton, document.getElementById('articles'));

toggleButton.addEventListener('click', () => {
    showOnlySafe = !showOnlySafe;

    toggleButton.textContent = showOnlySafe
        ? 'Show All Articles'
        : 'Show Only Safe Articles';

    fetchAndDisplayArticles();
});

function isSafeSite(domain) {
    if (domain.endsWith('github.io')) return true;
    if (domain === 'x.com' || domain === 'twitter.com') return true;

    return safeSites.includes(domain);
}

async function fetchAndDisplayArticles() {

    const articlesDiv = document.getElementById('articles');

    articlesDiv.innerHTML = `
        <div class="text-center text-gray-400 py-10">
            Loading articles...
        </div>
    `;

    try {

        const sortType =
            document.getElementById('sort-filter')?.value || 'date';

        const timeFilter =
            document.getElementById('time-filter')?.value || 'all';

        const now = Math.floor(Date.now() / 1000);

        let numericFilter = '';

        switch (timeFilter) {
            case '24h':
                numericFilter =
                    `&numericFilters=created_at_i>${now - 86400}`;
                break;

            case '7d':
                numericFilter =
                    `&numericFilters=created_at_i>${now - 604800}`;
                break;

            case '30d':
                numericFilter =
                    `&numericFilters=created_at_i>${now - 2592000}`;
                break;

            default:
                numericFilter = '';
        }

        let apiUrl;

        if (sortType === 'points') {
            apiUrl =
                `https://hn.algolia.com/api/v1/search?tags=story${numericFilter}`;
        } else {
            apiUrl =
                `https://hn.algolia.com/api/v1/search_by_date?tags=story${numericFilter}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        let articles = data.hits.filter(article =>
            article.title &&
            article.url
        );

        // Safe Site Filter
        if (showOnlySafe) {

            articles = articles.filter(article => {

                try {

                    const domain =
                        new URL(article.url)
                            .hostname
                            .replace('www.', '');

                    return isSafeSite(domain);

                } catch {
                    return false;
                }
            });
        }

        // Sort

        if (sortType === 'points') {

            articles.sort(
                (a, b) =>
                    (b.points || 0) -
                    (a.points || 0)
            );

        } else {

            articles.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            );
        }

        articlesDiv.innerHTML = '';

        if (articles.length === 0) {

            articlesDiv.innerHTML = `
                <div class="text-center text-gray-400 py-10">
                    No articles found.
                </div>
            `;

            return;
        }

        articles.slice(0, 50).forEach((article, index) => {

            let domain = 'Unknown';

            try {
                domain = new URL(article.url)
                    .hostname
                    .replace('www.', '');
            } catch {}

            const articleElement =
                document.createElement('div');

            articleElement.className =
                'bg-[#0a0a1f]/50 backdrop-blur-md p-5 rounded-xl mb-5 text-white hover:scale-[1.02] hover:shadow-lg transition';

            articleElement.innerHTML = `
                <div class="flex justify-between items-center mb-2 text-sm text-gray-400">
                    <span>#${index + 1}</span>
                    <span>${article.points || 0} points</span>
                </div>

                <a href="${article.url}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="text-xl font-bold mb-2 block hover:underline">
                    ${article.title}
                </a>

                <p class="text-gray-300">
                    Author: ${article.author || 'Unknown'}
                </p>

                <p class="text-gray-400 text-sm">
                    Source: ${domain}
                </p>

                <p class="text-gray-500 text-xs mt-1">
                    ${new Date(article.created_at)
                .toLocaleString()}
                </p>
            `;

            articlesDiv.appendChild(articleElement);
        });

    } catch (error) {

        console.error(error);

        articlesDiv.innerHTML = `
            <div class="text-center text-red-400 py-10">
                Failed to load articles.
            </div>
        `;
    }
}

// Filter Events
document
    .getElementById('sort-filter')
    ?.addEventListener('change',
        fetchAndDisplayArticles);

document
    .getElementById('time-filter')
    ?.addEventListener('change',
        fetchAndDisplayArticles);

// Initial Load
fetchAndDisplayArticles();