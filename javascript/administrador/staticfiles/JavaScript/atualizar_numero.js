// URL da API para atualizar o telefone 
const apiAtualizarTelefoneUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.TELEFONES}1/`; // Use o endpoint correto


// Função para exibir mensagens
function exibirMensagem(mensagem, tipo) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${tipo}`;
  messageDiv.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check' : 'exclamation'}-circle"></i> ${mensagem}`;

  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);

  // Adiciona a mensagem ao formulário
  const form = document.getElementById('numeros-form');
  form.appendChild(messageDiv);
}

// Função para atualizar o telefone
document.getElementById('numeros-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Coleta os dados do formulário
  const codigoPais = document.getElementById('codigo_pais').value;
  const telefone = document.getElementById('telefone').value;

  // Valida os dados
  if (!codigoPais || !telefone) {
    exibirMensagem('Por favor, preencha todos os campos.', 'error');
    return;
  }

  try {
    // Envia a requisição PUT para a API
    const response = await fetch(apiAtualizarTelefoneUrl, {
      method: 'PUT', // Use PUT para atualização
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Envia o token no cabeçalho
      },
      body: JSON.stringify({ codigo_pais: codigoPais, telefone: telefone }), // Converte os dados para JSON
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json(); // Captura a mensagem de erro da API
      throw new Error(errorData.mensagem || `Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    exibirMensagem('Telefone atualizado com sucesso!', 'success');

    // Limpa os campos do formulário (opcional)
    document.getElementById('codigo_pais').value = '';
    document.getElementById('telefone').value = '';
  } catch (error) {
    console.error('Erro:', error);
    exibirMensagem(error.message || 'Erro ao atualizar o telefone.', 'error');
  }
});