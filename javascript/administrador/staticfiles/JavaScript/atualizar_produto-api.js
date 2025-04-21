// URL da API para buscar as categorias
const apiCategoriasUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS}`;

// Captura o ID da URL
const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id'); // Obtém o valor do parâmetro 'id'
// URL da API para buscar o produto
const apiUrls = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PRODUTOS}${produtoId}/`;

// Função para carregar as categorias
async function carregarCategorias() {
  try {
    limparSelect('categoria');
    // Faz a requisição GET para a API
    const response = await fetch(apiCategoriasUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    // Converte a resposta para JSON
    const categorias = await response.json();

    // Preenche o <select> com as categorias
    const selectCategoria = document.getElementById('categoria');
    categorias.forEach((categoria) => {
      const option = document.createElement('option');
      option.value = categoria.id; // Usa o ID da categoria como valor
      option.textContent = categoria.nome; // Exibe o nome da categoria
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

// Chama a função para carregar as categorias quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarCategorias);

if (!produtoId) {
    alert('ID do produto não encontrado na URL.');
    window.location.href = "/"; // Redireciona para a lista de produtos
  }

// Função para buscar os dados do produto
async function carregarProduto() {
  try {
    const response = await fetch(apiUrls    , {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`, // Envia o token no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const produto = await response.json();
    preencherFormulario(produto); // Preenche o formulário com os dados do produto
  } catch (error) {
    console.error('Erro ao carregar o produto:', error);
    alert('Erro ao carregar os dados do produto.');
  }
}

// Função para preencher o formulário com os dados do produto
function preencherFormulario(produto) {
  document.getElementById('nome').value = produto.nome;
  document.getElementById('descricao').value = produto.descricao;
  document.getElementById('preco').value = produto.preco;
  document.getElementById('categoria').value = produto.categoria;
  document.getElementById('estoque').value = produto.estoque;

  // Preenche o nome da imagem (se existir)
  if (produto.imagem) {
    document.getElementById('file-name').textContent = produto.imagem.split('/').pop(); // Pega apenas o nome do arquivo
  }
}

// Carrega os dados do produto quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarProduto);

// Função para atualizar o produto
document.getElementById('enviar_cadastro_produto').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    // Coleta os dados do formulário
    const formData = {
      nome: document.getElementById('nome').value,
      descricao: document.getElementById('descricao').value,
      preco: parseFloat(document.getElementById('preco').value),
      categoria: document.getElementById('categoria').value,
      estoque: parseInt(document.getElementById('estoque').value),
    };
  
    // Adiciona a imagem ao FormData, se existir
    const imagemInput = document.getElementById('imagem');
    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }
    if (imagemInput.files.length > 0) {
      formDataObj.append('imagem', imagemInput.files[0]);
    }
  
    try {
      // Envia a requisição PUT para a API
      const response = await fetch(apiUrls, {
        method: 'PUT', // Use PUT para atualização
        headers: {
          'Authorization': `Token ${token}`, // Envia o token no cabeçalho
        },
        body: formDataObj, // Usa FormData para enviar os dados
      });
  
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json(); // Captura a mensagem de erro da API
        throw new Error(errorData.mensagem || `Erro na requisição: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      window.location.href = "/administrador/cadastrar"; // Redireciona para a lista de produtos
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar o produto.');
    }
  });

// Função para limpar o select, mantendo apenas a primeira opção (placeholder)
function limparSelect(selectId) {
  const select = document.getElementById(selectId);
  while (select.options.length > 1) {
    select.remove(1); // Remove todas as opções, exceto a primeira
  }
}