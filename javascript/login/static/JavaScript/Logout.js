document.addEventListener("DOMContentLoaded", function () {
    // Remove o token do localStorage ao carregar a página
    localStorage.removeItem("token");
    localStorage.removeItem("username")

    // Faz logout no servidor
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN.LOGOUT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            
        }
    })
    .then(response => response.json())
    .then(data => console.log("Logout:", data.mensagem))
    .catch(error => console.error("Erro ao deslogar:", error));
});