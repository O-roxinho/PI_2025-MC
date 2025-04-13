// URLs da API
const apiAdicionarCategoriaUrl = `${urlport}administrador/api/adicionar_categoria/`;
const apiRemoverCategoriaUrl = `${urlport}administrador/api/remover_categoria/`;


// Função para exibir mensagens
function exibirMensagem(mensagem, tipo) {
  const messageDiv = document.getElementById('message_categoria');
  messageDiv.textContent = mensagem;
  messageDiv.className = `message ${tipo}`;
  
}

// Função para adicionar categoria
document.getElementById('btn_adicionar_categoria').addEventListener('click', async () => {
  const nomeCategoria = document.getElementById('add_categoria').value;

  if (!nomeCategoria) {
    exibirMensagem('Por favor, insira o nome da categoria.', 'error');
    return;
  }

  try {
    const response = await fetch(apiAdicionarCategoriaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ nome: nomeCategoria }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      exibirMensagem('${response.statusText}', 'error')
    }

    const data = await response.json();
    exibirMensagem('Categoria adicionada com sucesso!', 'success');

    // Atualiza a lista de categorias no <select>
    carregarCategorias();
  } catch (error) {
    console.error('Erro:', error);
    if (error.message == "Erro na requisição: 400 Bad Request")
    {
      exibirMensagem("Esta categoria já existe.", 'error')
      return
    }
    exibirMensagem('Erro ao adicionar a categoria.', 'error');
  }
});

// Função para remover categoria
document.getElementById('btn_remover_categoria').addEventListener('click', async () => {
  const nomeCategoria = document.getElementById('remover_categoria').value;

  if (!nomeCategoria) {
    exibirMensagem('Por favor, insira o nome da categoria.', 'error');
    return;
  }

  try {
    const response = await fetch(apiRemoverCategoriaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ nome: nomeCategoria }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    exibirMensagem('Categoria removida com sucesso!', 'success');

    // Atualiza a lista de categorias no <select>
    carregarCategorias();
  } catch (error) {
    console.error('Erro:', error);
    if (error.message == "Erro na requisição: 404 Not Found")
      {
        exibirMensagem("Esta categoria não existe.", 'error')
        return
      }
    exibirMensagem('Erro ao remover a categoria.', 'error');
  }
});

