// carrinho.js
async function loadCart() {
    try {
        const authToken = localStorage.getItem('token');
        
        if (!authToken) {
            window.location.href = '/login?next=/carrinho';
            return;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.BASE}`, {
            headers: {
                'Authorization': `Token ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar carrinho');
        
        const cart = await response.json();
        renderCart(cart);
    } catch (error) {
        console.error('Erro:', error);
        if (error.message.includes('401')) {
            localStorage.removeItem('authToken');
            window.location.href = '/login?next=/carrinho';
        }
    }
}