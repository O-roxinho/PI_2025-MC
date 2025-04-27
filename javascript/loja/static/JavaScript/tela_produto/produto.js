// produto.js
const productId = new URLSearchParams(window.location.search).get('id');


async function loadProduct() {
    console.log('Carregando produto...');
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/produto/${productId}/`);
        if (!response.ok) throw new Error('Produto não encontrado');
        
        const produto = await response.json();
        displayProduct(produto);
        setupWhatsApp();
        checkAuth();
        checkFavoriteStatus();
        await loadReviews();
    } catch (error) {
        console.error('Erro ao carregar o produto:', error);
        alert('Erro ao carregar o produto');
    }
}

function displayProduct(produto) {
    document.getElementById('product-name').textContent = produto.nome;
    document.getElementById('product-price').textContent = `R$ ${parseFloat(produto.preco).toFixed(2)}`;
    document.getElementById('product-description').textContent = produto.descricao;
    
    const ratingContainer = document.getElementById('product-rating');
    ratingContainer.innerHTML = '★'.repeat(Math.round(produto.nota_media)) + 
                              '☆'.repeat(5 - Math.round(produto.nota_media));
    
    const imgContainer = document.getElementById('product-image');
    if (produto.imagem_url) {
        imgContainer.innerHTML = `<img src="${produto.imagem_url}" alt="${produto.nome}">`;
    }
}

function setupWhatsApp() {
    const whatsappButton = document.getElementById('whatsapp-button');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOJA.WHATSAPP}${productId}/`);
                const data = await response.json();
                window.open(data.url, '_blank');
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao abrir WhatsApp');
            }
        });
    }
}

// Funções de favoritos
async function checkFavoriteStatus(){
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/verificar/?produto_id=${productId}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) throw new Error('Erro ao verificar favorito');

        const data = await response.json();
        updateFavoriteButton(data.favorito);
    } catch (error) {
        console.error('Erro:', error);
    }
    }
    function updateFavoriteButton(isFavorite) {
        const button = document.getElementById('favorite-button');
        const icon = button.querySelector('i');
        
        if (isFavorite) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('active');
        }
    }
// Função para adicionar/remover dos favoritos
async function toggleFavorite() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname + window.location.search);
        return;
    }

    const button = document.getElementById('favorite-button');
    const isFavorite = button.classList.contains('active');

    try {
        if (isFavorite) {
            // Remover dos favoritos
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/remover_por_produto/?produto_id=${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) throw new Error('Erro ao remover dos favoritos');
        } else {
            // Adicionar aos favoritos
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    produto_id: productId
                })
            });

            if (!response.ok) throw new Error('Erro ao adicionar aos favoritos');
        }
        updateFavoriteCount()
        updateFavoriteButton(!isFavorite);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao atualizar favoritos');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!productId) {
        alert('Produto não encontrado');
        return;
    }
    document.getElementById('favorite-button').addEventListener('click', toggleFavorite);
    loadProduct();
    checkFavoriteStatus();
});