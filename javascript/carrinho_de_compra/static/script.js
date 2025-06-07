document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('token');
        
        if (!authToken) {
            window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
            return;
        }
    
        loadCart()
        async function loadCart() {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.BASE}`, {
                    headers: {
                        'Authorization': `Token ${authToken}`
                    }
                });
                
                if (response.status === 401) {
                    throw new Error('Não autorizado');
                }
                
                if (!response.ok) {
                    throw new Error('Erro ao carregar carrinho');
                }
                
                const cart = await response.json();
                
                
                renderCart(cart)
            } catch (error) {
                console.error('Erro:', error);
                if (error.message.includes('Não autorizado')) {
                    localStorage.removeItem('authToken');
                    window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
                } 
            }
        }

    // Elementos do DOM
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.querySelector('.total-price');
    const finalPriceElement = document.querySelector('.final-price');

    // Função para renderizar o carrinho
    function renderCart(cart) {
        // Limpa o carrinho
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'flex';
            cartCount.textContent = '0';
            totalPriceElement.textContent = 'R$ 0,00';
            finalPriceElement.textContent = 'R$ 0,00';
            return;
        }

        // Esconde a mensagem de carrinho vazio
        emptyCartMessage.style.display = 'none';

        // Adiciona cada item ao carrinho
        cart.itens.forEach(item => {
            
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.produto.imagem_url}" alt="${item.produto.nome}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.produto.nome}</h4>
                    <p class="cart-item-price">R$ ${parseFloat(item.produto.preco).toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" onclick="removeToCart(${item.produto.id})">-</button>
                        <span class="quantity">${item.quantidade}</span>
                        <button class="quantity-btn plus" onclick="addToCart(${item.produto.id})">+</button>
                        <button class="remove-item" onclick="removeItem(${item.id})">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Calcula totais
        updateTotals(cart);
    }

    // Função para atualizar os totais
    function updateTotals(cart) {
        const subtotal = cart.itens.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
        totalPriceElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        finalPriceElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }

    //função para REDUZIR A QUANTIDADE
window.removeToCart = async function (productId) {

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
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.REDUZIR_QUANTIDADE}`, {
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
            loadCart()
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
        
        // Função para adicionar produto ao carrinho
window.addToCart = async function (productId) {
    
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
            loadCart()
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
        window.removeItem = async function(itemId) {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARRINHO.ITEMS}${itemId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${authToken}`
                    }
                });
                
                if (response.ok) {
                    loadCart();
                } else {
                    throw new Error('Falha ao remover item');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert(error.message);
            }
        };
    
       
        
    });

    // Tema dark/light (opcional)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // Código do botão WhatsApp
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async function() {
            // Criar modal de confirmação
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Deseja limpar o carrinho após enviar?</h3>
                    <div class="modal-buttons">
                        <button class="btn-sim">Limpar</button>
                        <button class="btn-nao">Não</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Estilizar o modal
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: rgba(83, 83, 83, 0.5);
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                }
                .modal-buttons {
                    margin-top: 20px;
                }
                .modal-buttons button {
                    margin: 0 10px;
                    padding: 8px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-sim {
                    background: #25D366;
                    color: white;
                }
                .btn-nao {
                    background: #666;
                    color: white;
                }
            `;

            //  #ec821a black white ndad
            document.head.appendChild(style);

            // Função para enviar para o WhatsApp
            const enviarParaWhatsApp = async (limparCarrinho) => {
                try {
                    const response = await fetch(`${API_CONFIG.BASE_URL}/carrinho/api/carrinho/whatsapp/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ limpar_carrinho: limparCarrinho })
                    });

                    const data = await response.json();
                    window.open(data.url, '_blank');
                } catch (error) {
                    console.error('Erro ao enviar para o WhatsApp:', error);
                    alert('Erro ao enviar para o WhatsApp. Tente novamente.');
                }
            };

            // Adicionar eventos aos botões
            modal.querySelector('.btn-sim').addEventListener('click', () => {
                modal.remove();
                enviarParaWhatsApp(true);
            });

            modal.querySelector('.btn-nao').addEventListener('click', () => {
                modal.remove();
                enviarParaWhatsApp(false);
            });
        });
    }



