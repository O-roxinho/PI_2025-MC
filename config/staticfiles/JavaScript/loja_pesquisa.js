document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('#search-input');
    const suggestionsBox = document.querySelector('#suggestions-box');

    searchInput.addEventListener('input', function() {
        const query = searchInput.value;

        if (query.length > 0) {
            // Faz a requisição para o servidor com o termo digitado
            fetch(`/ajax/sugestoes/?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    // Limpa as sugestões anteriores
                    suggestionsBox.innerHTML = '';

                    // Mostra as novas sugestões
                    if (data.length > 0) {
                        data.forEach(produto => {
                            const suggestionItem = `
                                <div class="suggestion-item">
                                    <a href="/produto/${produto.id}">
                                        <img src="${produto.imagem_url}" alt="${produto.nome}"  class="suggestion-img">
                                        <div class="suggestion-info">
                                            <p>${produto.nome}</p>
                                            <p><strong>R$ ${produto.preco}</strong></p>
                                        </div>  
                                    </a>                                    
                                </div>
                            `;
                            suggestionsBox.innerHTML += suggestionItem;
                        });
                    } else {
                        suggestionsBox.innerHTML = '<p>Nenhum produto encontrado.</p>';
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar produtos:', error);
                });
        } else {
            suggestionsBox.innerHTML = '';  // Limpa as sugestões se o input estiver vazio
        }
    });
    document.addEventListener('click', function(event) {
        // Verifica se o clique foi fora do campo de pesquisa e da caixa de sugestões
        if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.innerHTML = '';  // Limpa a caixa de sugestões
        }
    });
});