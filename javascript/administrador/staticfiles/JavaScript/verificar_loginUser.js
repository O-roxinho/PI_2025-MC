document.addEventListener("DOMContentLoaded", function() {
    verificarStatusUsuario();
});

async function verificarStatusUsuario() {

    // Se não tiver token, redireciona para a página de login
    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        // Verifica se o usuário é superusuário
        const response = await fetch(`${urlport}/administrador/api/user-info/`, {
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
        if (!data.is_superuser) {
            window.location.href = '/';
        }
        
        // Se for superusuário, permanece na página atual
    } catch (error) {
        console.error('Erro ao verificar status do usuário:', error);
        // Em caso de erro, redireciona para o login
        window.location.href = '/login';
    }
}