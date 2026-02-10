const API_BASE = '/api';

const app = {
    state: {
        currentArticleId: null,
    },

    init() {
        this.loadFeed();
    },

    async loadFeed() {
        try {
            const res = await fetch(`${API_BASE}/articles/feed?limit=20`);
            const data = await res.json();
            this.renderFeed(data.items);
            this.state.currentArticleId = null;
        } catch (e) {
            console.error(e);
        }
    },

    renderFeed(items) {
        const content = document.getElementById('content');
        if (items.length === 0) {
            content.innerHTML = '<div style="padding:40px;text-align:center;color:#666">No articles yet. Generate one!</div>';
            return;
        }

        content.innerHTML = `
            <div class="feed-list">
                ${items.map(item => `
                    <div class="article-card" onclick="app.loadArticle('${item.id}')">
                        <h2>${item.title}</h2>
                        <p>${item.previewText}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async loadArticle(id) {
        try {
            const res = await fetch(`${API_BASE}/articles/${id}`);
            const data = await res.json();
            this.renderArticle(data);
            this.state.currentArticleId = id;
        } catch (e) {
            console.error(e);
        }
    },

    renderArticle(article) {
        const content = document.getElementById('content');

        const tokensHtml = article.tokens.map((token, idx) => {
            const classes = ['token'];
            if (token.isTarget) classes.push('target');
            // If it's a particle or symbol, maybe style differently? optional.

            const data = encodeURIComponent(JSON.stringify(token));

            return `<span class="${classes.join(' ')}" onclick="app.showToken(this, '${data}')">${token.surface}</span>`;
        }).join('');

        content.innerHTML = `
            <div class="article-view">
                <h1 class="article-title">${article.title}</h1>
                <div class="article-body">${tokensHtml}</div>
            </div>
        `;

        window.scrollTo(0, 0);
    },

    showToken(el, dataStr) {
        const token = JSON.parse(decodeURIComponent(dataStr));

        document.querySelectorAll('.token.active').forEach(t => t.classList.remove('active'));
        el.classList.add('active');

        document.getElementById('popup-kanji').innerText = token.base;
        document.getElementById('popup-reading').innerText = token.reading || '';
        document.getElementById('popup-pos').innerText = token.pos || '';

        const meaningsHtml = token.meanings && token.meanings.length > 0
            ? token.meanings.map(m => `<li>${m}</li>`).join('')
            : '<li>(No definition found)</li>';

        document.getElementById('popup-meanings').innerHTML = `<ul>${meaningsHtml}</ul>`;

        const popup = document.getElementById('token-popup');
        popup.classList.remove('hidden');
        void popup.offsetWidth;
        popup.classList.add('visible');
    },

    closePopup() {
        const popup = document.getElementById('token-popup');
        popup.classList.remove('visible');
        setTimeout(() => {
            popup.classList.add('hidden');
            document.querySelectorAll('.token.active').forEach(t => t.classList.remove('active'));
        }, 300);
    },

    showGenerateModal() {
        document.getElementById('generate-modal').classList.remove('hidden');
    },

    closeGenerateModal() {
        document.getElementById('generate-modal').classList.add('hidden');
    },

    async submitGenerate() {
        const title = document.getElementById('gen-title').value;
        const text = document.getElementById('gen-text').value;

        if (!title || !text) return;

        try {
            const res = await fetch(`${API_BASE}/articles/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text })
            });

            if (res.ok) {
                this.closeGenerateModal();
                const data = await res.json();
                this.loadArticle(data.id);

                document.getElementById('gen-title').value = '';
                document.getElementById('gen-text').value = '';
            }
        } catch (e) {
            console.error(e);
            alert('Failed to generate article');
        }
    }
};

window.app = app;
app.init();
