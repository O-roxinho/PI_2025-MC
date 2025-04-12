document.getElementById("signInForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch("http://127.0.0.1:8000/administrador/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.user.username)    
            if (data.user.is_superuser) {
                window.location.href = "../../administrador/cadastrar";
            } else {
                window.location.href = "/";
            }
        } else {
            document.getElementById("status-message").textContent = 
                data.mensagem || "Erro ao fazer login.";
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        document.getElementById("status-message").textContent = 
            "Erro de conexão com o servidor.";
    }
});

// Função simplificada para pegar o token CSRF
function getCSRFToken() {
    const cookie = document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
}