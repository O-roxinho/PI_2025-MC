// comentario.js
async function loadReviews() {
    console.log('Carregando avaliações...');
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/avaliar/${productId}/`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar avaliações: ${response.status}`);
        }
        
        const reviews = await response.json();
        console.log('Avaliações carregadas:', reviews);
        await displayReviews(reviews);
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
}

async function displayReviews(reviews) {
    const container = document.getElementById('reviews-list');
    const token = localStorage.getItem('token');
    const userData = token ? await getUserIdFromToken() : null;
    
    console.log('Token:', token);
    console.log('Dados do usuário:', userData);
    console.log('Reviews:', reviews);
    
    container.innerHTML = reviews.map(review => {
        const canDelete = token && (review.usuario_id === userData?.id || userData?.is_staff);
        console.log(`Review ${review.id}:`, {
            usuario_id: review.usuario_id,
            user_data_id: userData?.id,
            is_staff: userData?.is_staff,
            can_delete: canDelete
        });
        
        return `
            <div class="review" id="review-${review.id}">
                <div class="infosAvaliacao">
                    <div class="comentario-container">
                        <p id="nomeAv">
                            <strong>${review.usuario}</strong>
                            <span id="starsAv">${'★'.repeat(review.nota)}</span>
                            <span id="dataAv">${new Date(review.data_avaliacao).toLocaleDateString()}</span>
                        </p>
                        <p id="comentAv">"${review.comentario}"</p>
                    </div>
                    ${canDelete ? 
                        `<button class="excluir-comentario" data-id="${review.id}" aria-label="Excluir comentário">
                            <i class="fa-solid fa-trash-can"></i>
                            <span class="tooltip">Excluir...</span>
                        </button>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('reviews-count').textContent = reviews.length;
    setupDeleteButtons();
}

// Função setupDeleteButtons atualizada
function setupDeleteButtons() {
    document.querySelectorAll('.excluir-comentario').forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            deleteReview(reviewId);
        });
    });
}
// Função para deletar avaliação atualizada
async function deleteReview(reviewId) {
    const token = localStorage.getItem('token');
    const userData = await getUserIdFromToken();
    
    if (!token || !userData) {
        alert('Você precisa estar logado para excluir uma avaliação');
        return;
    }

    const isAdmin = userData.is_staff;
    const confirmMessage = isAdmin ? 
        'Tem certeza que deseja excluir esta avaliação como administrador?' : 
        'Tem certeza que deseja excluir sua avaliação?';

    if (!confirm(confirmMessage)) return;

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOJA.COMENTARIOS}${reviewId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (response.ok) {
            document.getElementById(`review-${reviewId}`).remove();
            const reviewsCount = document.getElementById('reviews-count');
            reviewsCount.textContent = parseInt(reviewsCount.textContent) - 1;
            alert('Avaliação excluída com sucesso!');
        } else if (response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (response.status === 403) {
            alert('Você não tem permissão para excluir esta avaliação.');
        } else {
            throw new Error('Erro ao excluir avaliação');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir avaliação. Tente novamente.');
    }
}