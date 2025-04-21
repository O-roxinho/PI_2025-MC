let apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PRODUTOS}`;

mostrar()
// Função para buscar
async function GETProdutos() {
    try {
      const response = await fetch(apiUrl, {
              method: "GET",
              headers: {
                  "Authorization": `Token ${token}`,
                  "Content-Type": "application/json"
              }
              });
              // Verifica se a resposta foi bem-sucedida
              if (!response.ok) {
                  throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
              }
  
             const result = await response.json();
              
              return result
  
      } catch (error) {
        console.error("Erro ao buscar os posts:", error);
      }
  }

  //exibir os dados da API
  async function mostrar()
  {
    const tbody = document.getElementById('lista-produtos');
    tbody.innerHTML = ''; // Limpa o conteúdo atual
      produtos =  await GETProdutos()
      produtos.forEach(produto => {
              const row = document.createElement('tr');

              // Coluna Nome
              const nome = document.createElement('td');
              nome.textContent = produto.nome;
              row.appendChild(nome);

              // Coluna Descrição
              const descricao = document.createElement('td');
              descricao.textContent = produto.descricao;
              row.appendChild(descricao);

              // Coluna Preço
              const preco = document.createElement('td');
              preco.textContent = `R$ ${produto.preco}`;
              row.appendChild(preco);

              // Coluna Imagem
              const imagem = document.createElement('td');
              if (produto.imagem) {
                const img = document.createElement('img');
                img.src = produto.imagem;
                img.alt = produto.nome;
                img.classList.add('img-thumbnail');
                imagem.appendChild(img);
              } else {
                imagem.innerHTML = '<span class="text-muted">Sem imagem</span>';
              }
              row.appendChild(imagem);

              // Coluna Categoria
              const categoria = document.createElement('td');
              categoria.textContent = produto.categoria;
              console.log(produto.categoria)
              row.appendChild(categoria);

              // Coluna Estoque
              const estoque = document.createElement('td');
              estoque.textContent = produto.estoque;
              row.appendChild(estoque);

              // Coluna Excluir
              const excluir = document.createElement('td');
              const btnExcluir = document.createElement('button');
              btnExcluir.classList.add('btn', 'btn-outline-danger');
              btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i> Excluir';
              btnExcluir.onclick = () => excluirProduto(produto.id);
              excluir.appendChild(btnExcluir);
              row.appendChild(excluir);

              // Coluna Atualizar
              const atualizar = document.createElement('td');
              const btnAtualizar = document.createElement('button');
              btnAtualizar.classList.add('btn', 'btn-outline-warning');
              btnAtualizar.innerHTML = '<i class="fas fa-edit"></i> Atualizar';
              btnAtualizar.onclick = () => atualizarProduto(produto.id);
              atualizar.appendChild(btnAtualizar);
              row.appendChild(atualizar);

              // Adiciona a linha à tabela
              tbody.appendChild(row);
              });
            
                
      
  }

  // Função para excluir um produto
  async function excluirProduto(id) {
    try {
      const response = await fetch(`${apiUrl}${id}/`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Token ${token}`
      }
        
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }
      alert('Produto excluído com sucesso!');
      mostrar(); // Recarrega a lista de produtos
    } catch (error) {
      console.error('Erro:', error);
    }
  }


  // Função para atualizar um produto (redireciona para uma página de edição)
function atualizarProduto(id) {
    window.location.href = `/administrador/atualizar?id=${id}`;
  }