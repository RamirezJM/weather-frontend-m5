
/* script que valida el formulario */

const form = document.querySelector('.needs-validation');

form.addEventListener('submit', ev => {
  ev.preventDefault();

  if (!form.checkValidity()) {
    ev.stopPropagation();
    form.classList.add('was-validated');
    return
  } else {
    alert('Formulario enviado. Pronto nos comunicaremos contigo.');
    form.classList.remove('was-validated');
    form.reset();
  }
});