let file = null;
const dropField = document.querySelector('.drop');
document.addEventListener('dragstart', event => {
    file = event.target;
  });

document.addEventListener('dragover', event => {
    if (event.target.classList.contains('drop')) {
      event.preventDefault();
      event.target.classList.add('over');
    }
  });

  document.addEventListener('dragleave', event => {
    if (event.target.classList.contains('drop')) {
      event.target.classList.remove('over');
    }
  });

  document.addEventListener('dragstop', event => {
    file = event.target;
    dropField.appendChild(file);
    console.log(file)
  });