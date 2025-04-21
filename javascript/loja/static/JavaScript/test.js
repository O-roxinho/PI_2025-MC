// Função para adicionar produto ao carrinho
async function addToCart(productId) {
    // Verifica se productId é válido
    if (!productId || isNaN(productId)) {
        console.error('ID do produto inválido');
        alert('Erro: ID do produto inválido');
        return;
    }

    const authToken = localStorage.getItem('token');
    
    if (!authToken) {
        // Redireciona para login mantendo a página atual como "next"
        const nextUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?next=${nextUrl}`;
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
            },
            body: JSON.stringify({
                produto_id: parseInt(productId) // Garante que é um número
            })
        });

        if (response.ok) {
            showCartNotification();
            await updateCartCounter(); // Aguarda a atualização do contador
        } else if (response.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('token');
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        } else if (response.status === 404) {
            throw new Error('Produto não encontrado');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || 'Erro ao adicionar ao carrinho');
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        
    }
}

// Função para mostrar notificação
function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    
    // Verifica se o elemento existe
    if (!notification) {
        console.error('Elemento de notificação não encontrado');
        return;
    }
    
    notification.style.display = 'block';
    
    // Reset da animação
    notification.style.animation = 'none';
    void notification.offsetWidth; // Trigger reflow
    notification.style.animation = 'slideIn 0.5s, fadeOut 0.5s 2.5s';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Função para atualizar o contador do carrinho
async function updateCartCounter() {
    const authToken = localStorage.getItem('token');
    const cartCounter = document.getElementById('cart-count');
    
    if (!authToken || !cartCounter) {
        // Se não houver token ou elemento do contador, define como 0
        cartCounter.textContent = '0';
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.BASE}`, {
            headers: {
                'Authorization': `Token ${authToken}`
            }
        });
        
        if (response.ok) {
            const cart = await response.json();
            cartCounter.textContent = cart.itens?.length || 0;
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            cartCounter.textContent = '0';
        } else {
            throw new Error('Erro ao obter carrinho');
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
        cartCounter.textContent = '0';
    }
}   
// Event Listener para o botão
// Event Listener melhorado para o botão
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se o productId está disponível no escopo global
    if (typeof productId === 'undefined') {
        console.error('productId não definido');
        return;
    }

    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async () => {
            // Adiciona feedback visual durante o carregamento
            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ADICIONANDO...';
            
            await addToCart(productId);
            
            // Restaura o botão após a operação
            addToCartBtn.disabled = false;
            addToCartBtn.innerHTML = '<img src="/static/imagens_icons/cart-add.png" alt="Adicionar ao Carrinho"> ADICIONAR AO CARRINHO';
        });
    }

    // Atualiza o contador quando a página carrega
    updateCartCounter();
});


