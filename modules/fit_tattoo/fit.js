const fitBlock = document.querySelector('.fit_tattoo');


let movedTattoo = null;
let shiftX = 0;
let shiftY = 0;
document.addEventListener('mousedown', event => {
  if (event.target.classList.contains('img_choose')) {
      movedTattoo = event.target;
      const bounds = event.target.getBoundingClientRect();
      shiftX = event.pageX - bounds.left - window.pageXOffset;
      shiftY = event.pageY - bounds.top - window.pageYOffset;
  } else {
      event.preventDefault();
  }
});

document.addEventListener('mousemove', event => {
    if (movedTattoo) {
        event.preventDefault();
        movedTattoo.style.left = event.pageX - shiftX + 'px';
        movedTattoo.style.top = event.pageY - shiftY + 'px';
  } });

document.addEventListener('mouseup', event => {
    fitTattooImage.appendChild(movedTattoo);
    movedTattoo = null;
});