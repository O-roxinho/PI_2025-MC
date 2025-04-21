// Função para embaralhar array (deve vir antes de ser usada)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener('DOMContentLoaded', async () => {
    const mainContainer = document.querySelector('main .row');
   
    if (!mainContainer) {
        console.error('Elemento main .row não encontrado');
        return;
    }

    try {
        // 1. Corrigir URL da API e capturar a resposta completa
        const categoriasResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOJA.MAIN}`);
        if (!categoriasResponse.ok) throw new Error('Erro ao carregar categorias');
        
        // 2. Capturar todos os dados da resposta
        const data = await categoriasResponse.json();
        const categorias = data.categorias;

        // 3. Limpar container antes de adicionar conteúdo
        mainContainer.innerHTML = '';

        for (const categoria of categorias) {
            // 4. Corrigir URL da API de categoria
            const produtosResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOJA.CATEGORIA}${encodeURIComponent(categoria.nome)}/`);
            
            if (!produtosResponse.ok) continue;
            
            const produtos = await produtosResponse.json();
            const produtosEmbaralhados = shuffleArray(produtos).slice(0, 10);

            // 5. Corrigir template string
            const categoriaHTML = `
                <section class="col-12 mb-5 categoria-section categoria-${categoria.id} categoria-${categoria.nome}">
                    <div class="container caixa">
                        <h1 class="text-left">${categoria.nome}</h1>

                        ${produtos.length > 5 ? `
                            <a href="/administrador/categoria/${categoria.nome}" id="btn_ver">
                                Ver Mais
                            </a>
                        ` : ''}

                        <div class="position-relative">
                            <div class="product-grid d-flex flex-row overflow-auto" id="carousel-${categoria.id}">
                                ${produtosEmbaralhados.map(produto => `
                                    <div class="product-card p-3 mx-2 col-6 col-md-4 col-lg-3">
                                        <a href="/produto?id=${produto.id}">
                                            ${produto.imagem_url ? `
                                                <img src="${produto.imagem_url}" class="img-fluid" alt="${produto.nome}">
                                            ` : '<p>sem imagem</p>'}
                                        </a>
                                        <h2 id="prdName">${produto.nome}</h2>
                                        <p class="price">R$ ${Number(produto.preco).toFixed(2)}</p>
                                        <p class="installment">2x R$${(produto.preco/2).toFixed(2)} sem juros</p>
                                        <p class="free-shipping">*Frete grátis</p>
                                        <p>ㅤㅤㅤㅤㅤㅤㅤ</p>
                                    </div>
                                `).join('')}
                            </div>

                            <button class="carousel-btn left" onclick="scrollCarousel('${categoria.id}', -400)">&#10094;</button>
                            <button class="carousel-btn right" onclick="scrollCarousel('${categoria.id}', 400)">&#10095;</button>
                        </div>
                    </div>
                </section> <br>
            `;

            mainContainer.insertAdjacentHTML('beforeend', categoriaHTML);
        }

    } catch (error) {
        console.error('Erro:', error);
        mainContainer.innerHTML = `
            <div class="alert alert-danger">
                Erro ao carregar os produtos: ${error.message}
            </div>
        `;
    }
});
