document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login?next=/favoritos';
        return;
    }

    loadFavoritos();
});

async function loadFavoritos() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar favoritos');

        const favoritos = await response.json();
        displayFavoritos(favoritos);
    } catch (error) {
        console.error('Erro:', error);
        showEmptyState();
    }
}

function displayFavoritos(favoritos) {
    const container = document.getElementById('favoritos-container');
    
    if (favoritos.length === 0) {
        showEmptyState();
        return;
    }

    container.innerHTML = favoritos.map(favorito => `
        <div class="favorito-card">
            <a href="/produto?id=${favorito.produto.id}">
                <img src="${favorito.produto.imagem_url || '/static/imagens_icons/no-image.png'}" 
                     alt="${favorito.produto.nome}">
            </a>
            <h3>${favorito.produto.nome}</h3>
            <p class="price">R$ ${parseFloat(favorito.produto.preco).toFixed(2)}</p>
            <div class="actions">
                <button class="remove-favorite" onclick="removeFavorito(${favorito.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="add-to-cart" onclick="addToCart(${favorito.produto.id})">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

function showEmptyState() {
    const container = document.getElementById('favoritos-container');
    container.innerHTML = `
        <div class="empty-favorites">
            <i class="fas fa-heart-broken"></i>
            <h2>Nenhum favorito encontrado</h2>
            <p>Adicione produtos aos seus favoritos para vê-los aqui!</p>
        </div>
    `;
}

async function removeFavorito(favoritoId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/${favoritoId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao remover favorito');

        loadFavoritos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao remover favorito');
    }
}

async function addToCart(produtoId) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/carrinho/adicionar/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                produto_id: produtoId,
                quantidade: 1
            })
        });

        if (!response.ok) throw new Error('Erro ao adicionar ao carrinho');

        alert('Produto adicionado ao carrinho!');
        updateCartCount();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar ao carrinho');
    }
} 