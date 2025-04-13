document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('#search-input');
    const suggestionsBox = document.querySelector('#suggestions-box');
    let searchTimeout;

    const showSuggestions = (show) => {
        suggestionsBox.style.display = show ? 'block' : 'none';
    };

    const formatPrice = (price) => {
        return parseFloat(price).toFixed(2).replace('.', ',');
    };

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (!query) {
            showSuggestions(false);
            return;
        }

        showSuggestions(true);
        
        // Mostrar loading
        suggestionsBox.innerHTML = `
            <div class="suggestion-item">
                <div class="suggestion-info loading">
                    Carregando...
                </div>
            </div>
        `;

        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/buscar/?query=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Erro na pesquisa');
                
                const data = await response.json();
                
                suggestionsBox.innerHTML = data.length > 0 ? 
                    data.map(produto => `
                        <div class="suggestion-item">
                            <a href="/produto?id=${produto.id}">
                                ${produto.imagem_url ? 
                                    `<img src="${produto.imagem_url}" alt="${produto.nome}" class="suggestion-img">` : 
                                    '<div class="suggestion-img placeholder"></div>'}
                                <div class="suggestion-info">
                                    <p class="product-title">${produto.nome}</p>
                                    <p class="product-price">R$ ${formatPrice(produto.preco)}</p>
                                </div>  
                            </a>                                    
                        </div>
                    `).join('') :
                    '<div class="suggestion-item"><p>Nenhum produto encontrado.</p></div>';

            } catch (error) {
                console.error('Erro:', error);
                suggestionsBox.innerHTML = `
                    <div class="suggestion-item error">
                        Erro ao carregar resultados
                    </div>
                `;
            }
        }, 300);
    });

    // Fechar sugestões ao clicar fora
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
            showSuggestions(false);
        }
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') showSuggestions(false);
    });
});