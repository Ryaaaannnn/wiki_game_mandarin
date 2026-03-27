import axios from 'axios';

const API_ENDPOINT = 'https://zh.wikipedia.org/w/api.php';

// Helper to sanitize and process HTML content
const processContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove elements we don't want (references, edit sections, etc.)
    const selectorsToRemove = [
        '.mw-editsection',
        '.reference',
        '.reflist',
        '.mw-empty-elt',
        '#catlinks',
        '.portal',
        '.navbox',
        'style',
        'script',
        '.mw-jump-link',
    ];

    selectorsToRemove.forEach((selector) => {
        doc.querySelectorAll(selector).forEach((el) => el.remove());
    });

    const baseUrl = 'https://zh.wikipedia.org';

    // Helper to fix URLs
    const fixUrl = (url) => {
        if (!url) return url;
        if (url.startsWith('//')) return 'https:' + url;
        if (url.startsWith('/')) return baseUrl + url;
        return url;
    };

    // Fix images (src and srcset)
    doc.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        const srcset = img.getAttribute('srcset');

        if (src) img.setAttribute('src', fixUrl(src));

        if (srcset) {
            const fixedSrcset = srcset.split(',').map(part => {
                const [url, size] = part.trim().split(/\s+/);
                return `${fixUrl(url)} ${size || ''}`.trim();
            }).join(', ');
            img.setAttribute('srcset', fixedSrcset);
        }

        // Set dimensions to prevent layout shift if available
        if (img.getAttribute('width')) img.style.width = img.getAttribute('width') + 'px';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block'; // Prevent inline spacing issues
    });

    // Fix links
    doc.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (href) a.setAttribute('href', fixUrl(href));

        // Remove link titles that might contain HTML
        a.removeAttribute('title');
    });

    return doc.body.innerHTML;
};

export const fetchRandomArticles = async (count = 2) => {
    try {
        const response = await axios.get(API_ENDPOINT, {
            params: {
                action: 'query',
                list: 'random',
                rnnamespace: 0, // Main namespace
                rnlimit: count,
                format: 'json',
                origin: '*',
            },
        });

        return response.data.query.random.map((article) => ({
            id: article.id,
            title: article.title,
        }));
    } catch (error) {
        console.error('Error fetching random articles:', error);
        throw error;
    }
};

export const fetchArticle = async (title) => {
    try {
        const response = await axios.get(API_ENDPOINT, {
            params: {
                action: 'parse',
                page: title,
                format: 'json',
                origin: '*',
                redirects: true, // Follow redirects
                prop: 'text|displaytitle',
                mobileformat: 1, // Cleaner HTML
            },
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        const { text, displaytitle } = response.data.parse;
        return {
            title: response.data.parse.title, // Normalized title
            displayTitle: displaytitle,
            content: processContent(text['*']),
        };

    } catch (error) {
        console.error('Error fetching article:', error);
        throw error;
    }
};

export const searchArticles = async (query) => {
    try {
        const response = await axios.get(API_ENDPOINT, {
            params: {
                action: 'opensearch',
                search: query,
                limit: 5,
                namespace: 0,
                format: 'json',
                origin: '*'
            }
        });
        // opensearch returns [query, titles, descriptions, urls]
        return response.data[1];
    } catch (error) {
        console.error('Error searching articles:', error);
        return [];
    }
}
