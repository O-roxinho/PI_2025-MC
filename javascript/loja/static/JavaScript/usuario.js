document.addEventListener('DOMContentLoaded', async () => {
    const usernameElement = document.getElementById('usuName')
    
    let usertoken = localStorage.getItem("token")
    let username = localStorage.getItem("username")

    if (usertoken){
        if (username)
        {
            usernameElement.innerHTML = username
            return
        }
    }
    return usernameElement.innerHTML = "não conectado"

});