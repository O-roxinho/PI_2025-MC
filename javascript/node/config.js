// Configurações da API
const API_CONFIG = {
    // URLs base
    BASE_URL: 'http://127.0.0.1:8000',
    
    // Portas
    PORT: 8000,
    NODE_PORT: 8080,
    
    // Endpoints da API
    ENDPOINTS: {
        // Administrador
        ADMIN: {
            PRODUTOS: '/administrador/api/produtos/',
            CATEGORIAS: '/administrador/api/categorias/',
            ADICIONAR_CATEGORIA: '/administrador/api/adicionar_categoria/',
            REMOVER_CATEGORIA: '/administrador/api/remover_categoria/',
            TELEFONES: '/administrador/api/telefones/',
            USER_INFO: '/administrador/api/user-info/'
        },
        
        // Loja
        LOJA: {
            MAIN: '/api/main/',
            CATEGORIA: '/api/categoria/',
            BUSCAR: '/api/buscar/',
            WHATSAPP: '/api/whatsapp/',
            COMENTARIOS: '/api/comentarios/'
        },
        
        // Carrinho
        CARRINHO: {
            BASE: '/carrinho/api/carrinho/',
            REDUZIR_QUANTIDADE: '/carrinho/api/Reduzir_quantidade/',
            ITEMS:  '/carrinho/api/carrinho/itens/'
        },

        // Login
        LOGIN: {
            BASE: '/administrador/login/',
            REGISTER: '/administrador/api/register/',
            LOGOUT: '/administrador/api/logout/'
        },

        FAVORITOS:{
            LISTAR: '/api/favoritos/',
            REMOVER: '/api/favoritos/'
        }
    }
};

// Exporta a configuração
module.exports = API_CONFIG; 