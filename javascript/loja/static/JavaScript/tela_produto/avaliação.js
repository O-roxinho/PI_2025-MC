// avaliacao.js
async function getUserIdFromToken() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/usuario-atual/`, {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Função checkAuth atualizada
function checkAuth() {
    const token = localStorage.getItem('token');
    const reviewForm = document.getElementById('review-form');
    const authMessage = document.getElementById('auth-message');
    const loginLink = document.getElementById('login-link');

    if (token) {
        if (reviewForm) reviewForm.style.display = 'block';
        if (authMessage) authMessage.style.display = 'none';
        setupRatingStars();
    } else {
        if (token) localStorage.removeItem('token');
        if (reviewForm) reviewForm.style.display = 'none';
        if (authMessage) authMessage.style.display = 'block';
    }
    if (loginLink) {
        const nextUrl = encodeURIComponent(window.location.pathname + window.location.search);
        loginLink.href = `/login?next=${nextUrl}`;
    }
}

// Configuração do sistema de estrelas
function setupRatingStars() {
    const container = document.getElementById('star-rating');
    if (!container) return;

    container.innerHTML = Array(5).fill().map((_, i) => 
        `<span class="star" data-rating="${i + 1}">☆</span>`
    ).join('');
    
    const stars = container.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            for (let i = 0; i <= index; i++) {
                stars[i].textContent = '★';
            }
            for (let i = index + 1; i < stars.length; i++) {
                stars[i].textContent = '☆';
            }
        });

        star.addEventListener('mouseout', () => {
            stars.forEach((s, i) => {
                s.textContent = s.classList.contains('selected') ? '★' : '☆';
            });
        });

        star.addEventListener('click', () => {
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('selected');
                stars[i].textContent = '★';
            }
        });
    });
}
// Função submitReview atualizada
async function submitReview() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para avaliar');
        return;
    }

    const reviewText = document.getElementById('review-text').value;
    const rating = document.querySelectorAll('.star.selected').length;

    if (rating === 0) {
        alert('Por favor, selecione uma classificação');
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/avaliar/${productId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                nota: rating,
                comentario: reviewText
            })
        });

        if (response.ok) {
            loadReviews();
            document.getElementById('review-text').value = '';
            document.querySelectorAll('.star').forEach(star => {
                star.classList.remove('selected');
                star.textContent = '☆';
            });
            alert('Avaliação enviada com sucesso!');
        } else if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else {
            throw new Error('Erro ao enviar avaliação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar avaliação. Tente novamente.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-review');
    if (submitButton) submitButton.addEventListener('click', submitReview);
    checkAuth();
});