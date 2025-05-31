document.addEventListener('DOMContentLoaded', function() {
    const userContainer = document.getElementById('user-container');
    const userDropdown = document.getElementById('user-dropdown');
    const usuName = document.getElementById('usuName');

    // Função para atualizar o dropdown baseado no estado de login
    function updateUserDropdown() {
        const isLoggedIn = localStorage.getItem('token') !== null;
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const fullName = localStorage.getItem('fullName');
        const userName = localStorage.getItem('username');
        const userEmail = localStorage.getItem('userEmail');

        // Atualiza o nome do usuário
        if (isLoggedIn && userName) {
            usuName.textContent = userName;
        } else {
            usuName.textContent = 'Visitante';
        }

        // Limpa o dropdown atual
        userDropdown.innerHTML = '';

        verificarStatusUsuario()

        if (isLoggedIn) {
            // Usuário logado
            let dropdownHTML = `
                <div class="dropdown-header">
                    <div class="user-full-name">${fullName || userName}</div>
                    ${userEmail ? `<div class="user-email">${userEmail}</div>` : ''}
                </div>
                <div class="dropdown-content">
            `;
            
            verificarUsuario = localStorage.getItem("isAdmin")
            
            if (verificarUsuario) {
                dropdownHTML += `
                    <a href="/administrador/cadastrar">
                        <i class="fas fa-cog"></i>
                        Ir para Cadastro
                    </a>
                    <div class="dropdown-divider"></div>
                `;
            }

            dropdownHTML += `
                    <a href="/favoritos">
                    <i class="fa-solid fa-heart"></i>
                        Meus Favoritos
                    </a>
                    <a href="/pedidos">
                        <i class="fas fa-box"></i>
                        Meus Pedidos
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" id="logout-link">
                        <i class="fas fa-sign-out-alt"></i>
                        Sair
                    </a>
                </div>
            `;

            userDropdown.innerHTML = dropdownHTML;

            // Adiciona evento de logout
            const logoutLink = document.getElementById('logout-link');
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAdmin');
                    localStorage.removeItem('username');
                    localStorage.removeItem('fullName');
                    localStorage.removeItem('userEmail');
                    window.location.reload();
                });
            }
        } else {
            // Usuário não logado
            userDropdown.innerHTML = `
                <div class="dropdown-content">
                    <a href="../../login">
                        <i class="fas fa-sign-in-alt"></i>
                        Fazer Login
                    </a>
                    <a href="../../cadastro">
                        <i class="fas fa-user-plus"></i>
                        Criar Conta
                    </a>
                </div>
            `;
        }
    }
    
    // Atualiza o dropdown quando a página carrega
    updateUserDropdown();

    // Fecha o dropdown quando clicar fora dele
    document.addEventListener('click', function(e) {
        if (!userContainer.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });

    // Mostra o dropdown ao clicar no container do usuário
    userContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        const isDropdownVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isDropdownVisible ? 'none' : 'block';
    });
}); 


async function verificarStatusUsuario() {
    // Se não tiver token, redireciona para a página de login
    const token = localStorage.getItem('token');

    try {
        // Verifica se o usuário é superusuário
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USER_INFO}`, {
            headers: { 
                'Authorization': 'Token ' + token,
                'Content-Type': 'application/json'
            }
        });

        // Se a resposta não for OK (401, 403, etc.)
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();

        // Se não for superusuário, redireciona para a loja
        if (data.is_superuser) {
            localStorage.setItem("isAdmin", true)
            
        }
        else{
            localStorage.setItem("isAdmin", false)
           
        }
        
        // Se for superusuário, permanece na página atual
    } catch (error) {
        console.error('Erro ao verificar status do usuário:', error);
        // Em caso de erro, redireciona para o login

    }
}