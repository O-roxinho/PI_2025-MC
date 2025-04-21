document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN.REGISTER}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.username)
                alert("Cadastro realizado com sucesso!");
                window.location.href = "/"; // Redireciona para a loja
            } else {
                alert(data.mensagem);
            }
        })
        .catch(error => console.error("Erro ao cadastrar:", error));
    });
});

// Função para obter CSRF Token
function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        document.cookie.split(";").forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith("csrftoken=")) {
                cookieValue = cookie.substring("csrftoken=".length);
            }
        });
    }
    return cookieValue;
}







