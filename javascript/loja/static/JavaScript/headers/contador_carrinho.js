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

updateCartCounter();