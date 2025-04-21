// URL da API para buscar as categorias
const apiCategoriasUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.CATEGORIAS}`;


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

// Função para limpar o select, mantendo apenas a primeira opção (placeholder)
function limparSelect(selectId) {
  const select = document.getElementById(selectId);
  while (select.options.length > 1) {
    select.remove(1); // Remove todas as opções, exceto a primeira
  }
}


