async function updateFavoriteCount() {
    const token = localStorage.getItem('token');
    const countSpan = document.getElementById('favorite-count');
    if (!token) {
        countSpan.textContent = '0';
        return;
    }
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/favoritos/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar favoritos');
        const favoritos = await response.json();
        countSpan.textContent = favoritos.length;
    } catch (error) {
        countSpan.textContent = '0';
    }
}

// Atualiza ao carregar a página
document.addEventListener('DOMContentLoaded', updateFavoriteCount);

// Opcional: atualize o contador sempre que adicionar/remover favorito
// Basta chamar updateFavoriteCount() após essas ações.