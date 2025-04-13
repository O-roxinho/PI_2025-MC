let apiUrl = `${urlport}administrador/api/produtos/`;

document.getElementById('enviar_cadastro_produto').addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Cria um objeto FormData para enviar arquivos
  const formData = new FormData();
  formData.append('nome', document.getElementById('nome').value);
  formData.append('descricao', document.getElementById('descricao').value);
  formData.append('preco', parseFloat(document.getElementById('preco').value));
  formData.append('categoria', 9); // Temporariamente fixo (substitua pelo valor correto)
  formData.append('estoque', parseInt(document.getElementById('estoque').value));

  // Adiciona a imagem ao FormData, se existir
  const imagemInput = document.getElementById('imagem');
  if (imagemInput.files.length > 0) {
    formData.append('imagem', imagemInput.files[0]);
  }

  try {
    // Envia a requisição POST para a API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da API:', data);

    // Exibe uma mensagem de sucesso
    document.getElementById('message success-produto').textContent = 'Produto cadastrado com sucesso!';
  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('message success-produto').textContent = 'Erro ao cadastrar o produto.';
  }
});
