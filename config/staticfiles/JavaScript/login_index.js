const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

const inputs = document.querySelectorAll('input[required]');

inputs.forEach((input) => {
  input.addEventListener('invalid', (event) => {
    event.preventDefault();
    const errorMessage = input.closest('form').querySelector('.error-message');
    errorMessage.style.display = 'block';
  });

  input.addEventListener('input', () => {
    const form = input.closest('form');
    const errorMessage = form.querySelector('.error-message');
    if (Array.from(form.elements).every(input => input.validity.valid)) {
      errorMessage.style.display = 'none';
    }
  });
});

