//---------------------botão-------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('.product-grid');

    carousels.forEach(carousel => {
        const leftButton = carousel.nextElementSibling; // Botão da esquerda
        const rightButton = leftButton.nextElementSibling; // Botão da direita

        updateButtonVisibility(carousel, leftButton, rightButton);

        // Adiciona um evento de rolagem para o carrossel
        carousel.addEventListener('scroll', () => {
            updateButtonVisibility(carousel, leftButton, rightButton);
        });

        // Adiciona uma verificação inicial quando a página é carregada
        updateButtonVisibility(carousel, leftButton, rightButton);
    });

    function updateButtonVisibility(carousel, leftButton, rightButton) {
        const scrollLeft = carousel.scrollLeft;
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;

        // Verifica se o carrossel é rolável
        if (scrollWidth <= clientWidth) {
            leftButton.style.display = 'none'; // Oculta ambos os botões se não houver rolagem
            rightButton.style.display = 'none';
            return;
        }

        // Verifica se estamos no início ou no fim do carrossel
        if (scrollLeft === 0) {
            leftButton.style.display = 'none'; // Oculta o botão da esquerda
            rightButton.style.display = 'block'; // Mostra o botão da direita
        } else if (scrollLeft + clientWidth >= scrollWidth) {
            leftButton.style.display = 'block'; // Mostra o botão da esquerda
            rightButton.style.display = 'none'; // Oculta o botão da direita
        } else {
            leftButton.style.display = 'block'; // Mostra ambos os botões
            rightButton.style.display = 'block';
        }
    }
});

//------------------scroll suave do carousel
function scrollCarousel(id, distance) {
    const carousel = document.getElementById('carousel-' + id);
    let start = carousel.scrollLeft;
    let startTime = null;

    const duration = 600; // duração em milissegundos para uma rolagem mais suave

    function animationScroll(time) {
        if (!startTime) startTime = time;
        const timeElapsed = time - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeInOutQuad = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        carousel.scrollLeft = start + distance * easeInOutQuad;

        if (progress < 1) requestAnimationFrame(animationScroll);
    }

    requestAnimationFrame(animationScroll);
}

