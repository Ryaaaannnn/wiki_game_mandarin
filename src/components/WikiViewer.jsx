import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

const WikiViewer = ({ content, onNavigate }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Scroll to top when content changes
        window.scrollTo(0, 0);

        const handleClick = (e) => {
            // Find the closest anchor tag
            const link = e.target.closest('a');
            if (!link) return;

            // Check if it is inside our container
            if (!container.contains(link)) return;

            e.preventDefault();

            const href = link.getAttribute('href');

            // Handle internal wiki links: /wiki/Article_Title or ./Article_Title
            // Wikipedia mobile view might be slightly different.
            // Usually it's /wiki/Title

            if (href) {
                let articleTitle = null;

                // Absolute zh.wikipedia.org/wiki/...
                if (href.includes('zh.wikipedia.org/wiki/')) {
                    articleTitle = href.split('/wiki/').pop();
                }
                // Relative /wiki/... or ./...
                else if (href.startsWith('/wiki/')) {
                    articleTitle = href.replace('/wiki/', '');
                } else if (href.startsWith('./')) {
                    articleTitle = href.replace('./', '');
                }

                if (articleTitle) {
                    try {
                        const decodedTitle = decodeURIComponent(articleTitle.split('#')[0]);
                        onNavigate(decodedTitle);
                    } catch (err) {
                        console.error("Failed to decode title", articleTitle, err);
                    }
                }
            } else if (href && href.startsWith('#')) {
                // Internal anchor, allow? Or ignore?
                // For now ignore or let valid scrolling happen if easy.
                // But strict wikiracing might filter these.
            } else {
                // External link - ignore
                console.log("External or invalid link clicked:", href);
            }
        };

        container.addEventListener('click', handleClick);

        return () => {
            container.removeEventListener('click', handleClick);
        };
    }, [content, onNavigate]);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-white text-slate-900 rounded-lg shadow-xl overflow-hidden min-h-screen">
            <div
                ref={containerRef}
                className="prose prose-slate max-w-none wiki-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
};

export default WikiViewer;
