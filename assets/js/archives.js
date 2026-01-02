// archives.js - Combined search and tag filtering for Archives page

(function() {
    'use strict';

    // State
    let allPages = [];
    let fuse = null;
    let selectedTags = new Set();

    // DOM Elements (initialized after DOM ready)
    let searchInput, tagContainer, resultsContainer, countDisplay, clearBtn;

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        // Get DOM elements
        searchInput = document.getElementById('archive-search');
        tagContainer = document.getElementById('archive-tags');
        resultsContainer = document.getElementById('archive-results');
        countDisplay = document.getElementById('archive-count');
        clearBtn = document.getElementById('archive-clear');

        if (!resultsContainer) return;

        try {
            // Fetch and parse index
            const response = await fetch('/index.json');
            allPages = await response.json();

            // Sort by date (newest first)
            allPages.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Initialize Fuse.js
            fuse = new Fuse(allPages, {
                keys: ['title', 'summary', 'content', 'tags'],
                threshold: 0.4,
                ignoreLocation: true,
                includeScore: true
            });

            // Render initial state
            renderResults(allPages);

            // Setup event listeners
            if (searchInput) {
                searchInput.addEventListener('input', handleFilterChange);
            }
            if (tagContainer) {
                tagContainer.addEventListener('click', handleTagClick);
            }
            if (clearBtn) {
                clearBtn.addEventListener('click', clearFilters);
            }

        } catch (error) {
            console.error('Failed to initialize archives:', error);
            resultsContainer.innerHTML = '<p class="archive-no-results">Error loading content.</p>';
        }
    }

    function handleTagClick(e) {
        const tagButton = e.target.closest('.archive-tag-btn');
        if (!tagButton) return;

        const tag = tagButton.dataset.tag;

        if (selectedTags.has(tag)) {
            selectedTags.delete(tag);
            tagButton.classList.remove('active');
            tagButton.setAttribute('aria-pressed', 'false');
        } else {
            selectedTags.add(tag);
            tagButton.classList.add('active');
            tagButton.setAttribute('aria-pressed', 'true');
        }

        updateClearButton();
        handleFilterChange();
    }

    function clearFilters() {
        // Clear search
        if (searchInput) {
            searchInput.value = '';
        }

        // Clear tags
        selectedTags.clear();
        document.querySelectorAll('.archive-tag-btn.active').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        updateClearButton();
        renderResults(allPages);
    }

    function updateClearButton() {
        if (!clearBtn) return;

        const hasFilters = selectedTags.size > 0 || (searchInput && searchInput.value.trim());
        clearBtn.style.display = hasFilters ? 'inline-block' : 'none';
    }

    function handleFilterChange() {
        const query = searchInput ? searchInput.value.trim() : '';
        let results = [];

        // Step 1: Apply search if query exists
        if (query) {
            results = fuse.search(query).map(r => r.item);
        } else {
            results = [...allPages];
        }

        // Step 2: Apply tag filter if tags selected (AND logic, case-insensitive)
        if (selectedTags.size > 0) {
            results = results.filter(page => {
                if (!page.tags || page.tags.length === 0) return false;
                const pageTags = page.tags.map(t => t.toLowerCase());
                return [...selectedTags].every(tag =>
                    pageTags.includes(tag.toLowerCase())
                );
            });
        }

        updateClearButton();
        renderResults(results);
    }

    function renderResults(pages) {
        // Update count
        if (countDisplay) {
            countDisplay.textContent = `${pages.length} ${pages.length === 1 ? 'post' : 'posts'}`;
        }

        if (pages.length === 0) {
            resultsContainer.innerHTML = '<p class="archive-no-results">No posts found matching your criteria.</p>';
            return;
        }

        // Build HTML
        const html = pages.map(page => `
            <div class="archive-entry" data-tags="${(page.tags || []).join(',')}">
                <div class="archive-entry-header">
                    <h3 class="archive-entry-title">
                        <a href="${page.permalink}">${escapeHtml(page.title)}</a>
                    </h3>
                    <span class="archive-entry-date">${page.dateFormatted}</span>
                </div>
                ${page.tags && page.tags.length > 0 ? `
                <div class="archive-entry-tags">
                    ${page.tags.map(tag => `<span class="archive-entry-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
                ` : ''}
            </div>
        `).join('');

        resultsContainer.innerHTML = html;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
