const safeSites = [
    'techcrunch.com',
    'thenextweb.com',
    'wired.com',
    'theverge.com',
    'bbc.co.uk',
    'bbc.com',
    'cnet.com',
    'nytimes.com',
    'medium.com',
    'github.com'
];

let showOnlySafe = false;

// Create Toggle Button
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Show Only Safe Articles';
toggleButton.className = 'mb-4 px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-lg hover:scale-105 transition';
document.querySelector('main').insertBefore(toggleButton, document.getElementById('articles'));

toggleButton.addEventListener('click', () => {
    showOnlySafe = !showOnlySafe;
    toggleButton.textContent = showOnlySafe ? 'Show All Articles' : 'Show Only Safe Articles';
    fetchAndDisplayArticles();
});

function isSafeSite(domain) {
    // Allow all GitHub Pages blogs
    if (domain.endsWith('github.io')) {
        return true;
    }

    // Allow all X (Twitter) posts
    if (domain === 'x.com' || domain === 'twitter.com') {
        return true;
    }

    // Allow only exact matches from safeSites list
    return safeSites.includes(domain);
}

function fetchAndDisplayArticles() {
    fetch('http://hn.algolia.com/api/v1/search_by_date?query=...')
        .then(response => response.json())
        .then(data => {
            const articlesDiv = document.getElementById('articles');
            articlesDiv.innerHTML = '';

            let ranking = 1;

            data.hits.forEach(article => {
                if (!article.url) return;

                const urlDomain = (new URL(article.url)).hostname.replace('www.', '');

                // Filter condition
                if (showOnlySafe && !isSafeSite(urlDomain)) {
                    return;
                }

                const articleElement = document.createElement('div');
                articleElement.className = 'bg-[#0a0a1f]/50 backdrop-blur-md p-5 rounded-xl mb-5 text-white hover:scale-105 hover:shadow-lg transition';

                articleElement.innerHTML = `
                    <div class="mb-2 text-gray-400 text-sm">#${ranking}</div>
                    <a href="${article.url}" target="_blank" class="text-xl font-bold mb-2 block hover:underline " style="font-family: Arial, sans-serif; ">
                        ${article.title}
                    </a>
                    <p class="text-gray-300">Author: ${article.author}</p>
                    <p class="text-gray-400 text-sm">Source: ${urlDomain}</p>
                `;

                articlesDiv.appendChild(articleElement);
                ranking++;
            });
        });
}

// Initial Load
fetchAndDisplayArticles();

