document.addEventListener('DOMContentLoaded', function() {
    const favoritosContainer = document.getElementById('favoritos-container');
    const emptyFavorites = document.getElementById('empty-favorites');

    // Função para carregar os favoritos
    async function carregarFavoritos() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FAVORITOS.LISTAR}/`);
            if (!response.ok) {
                throw new Error('Erro ao carregar favoritos');
            }
            const favoritos = await response.json();
            console.log('Favoritos carregados:', favoritos); // Debug

            if (!Array.isArray(favoritos) || favoritos.length === 0) {
                console.log('Nenhum favorito encontrado'); // Debug
                favoritosContainer.style.display = 'none';
                emptyFavorites.style.display = 'block';
                return;
            }

            console.log('Renderizando favoritos...'); // Debug
            favoritosContainer.style.display = 'grid';
            emptyFavorites.style.display = 'none';
            renderizarFavoritos(favoritos);
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            favoritosContainer.style.display = 'none';
            emptyFavorites.style.display = 'block';
        }
    }

    // Função para renderizar os favoritos
    function renderizarFavoritos(favoritos) {
        // Limpa o container
        favoritosContainer.innerHTML = '';

        favoritos.forEach(favorito => {
            // Verifica se o favorito tem as propriedades necessárias
            if (!favorito || !favorito.produto) {
                console.error('Favorito inválido:', favorito);
                return;
            }

            const produto = favorito.produto;
            const card = document.createElement('div');
            card.className = 'favorito-card';
            
            card.innerHTML = `
                <button class="btn-remover" title="Remover dos favoritos">
                    <i class="fas fa-times"></i>
                </button>
                <img class="favorito-imagem" src="${produto.imagem_url || '../static/imagens_icons/no-image.png'}" 
                     alt="${produto.nome}">
                <h2 class="favorito-nome">${produto.nome}</h2>
                <p class="favorito-preco">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                <p class="favorito-parcelamento">2x R$ ${(parseFloat(produto.preco) / 2).toFixed(2)} sem juros</p>
                <p class="favorito-frete">*Frete grátis</p>
                <button class="btn-adicionar-carrinho">
                    <i class="fas fa-shopping-cart"></i>
                    Adicionar ao Carrinho
                </button>
            `;

            // Adiciona os event listeners
            const btnRemover = card.querySelector('.btn-remover');
            btnRemover.addEventListener('click', () => removerFavorito(favorito.id));

            const btnAdicionarCarrinho = card.querySelector('.btn-adicionar-carrinho');
            btnAdicionarCarrinho.addEventListener('click', () => adicionarAoCarrinho(produto));

            favoritosContainer.appendChild(card);
        });

        // Se não houver favoritos após a renderização, mostra a mensagem de vazio
        if (favoritosContainer.children.length === 0) {
            favoritosContainer.style.display = 'none';
            emptyFavorites.style.display = 'block';
        }
    }

    // Função para remover um favorito
    async function removerFavorito(id) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FAVORITOS.REMOVER}/${id}/`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao remover favorito');
            }
            
            // Atualiza o contador de favoritos
            const contadorFavoritos = document.getElementById('favorite-count');
            const numeroAtual = parseInt(contadorFavoritos.textContent);
            contadorFavoritos.textContent = Math.max(0, numeroAtual - 1);

            // Recarrega os favoritos
            carregarFavoritos();
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
    }

    // Função para adicionar ao carrinho
    async function adicionarAoCarrinho(produto) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.ADICIONAR}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    produto_id: produto.id,
                    quantidade: 1
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar ao carrinho');
            }

            // Atualiza o contador do carrinho
            const contadorCarrinho = document.getElementById('cart-count');
            const numeroAtual = parseInt(contadorCarrinho.textContent);
            contadorCarrinho.textContent = numeroAtual + 1;

            // Feedback visual
            const btn = event.target.closest('.btn-adicionar-carrinho');
            btn.textContent = 'Adicionado!';
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho';
                btn.style.backgroundColor = '';
            }, 2000);
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
        }
    }

    // Carrega os favoritos quando a página é carregada
    carregarFavoritos();
}); 