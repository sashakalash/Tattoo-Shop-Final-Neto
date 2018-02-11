const dropSection = document.querySelector('.drop_section');

const dropField = document.querySelector('.drop');

const dropPic = dropField.querySelector('.marker');
dropPic.style.setProperty('--dropPic', 'visible');

const fitTattooField = document.querySelector('.tattoo_fitting_room');
fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');

const dragImage = document.querySelector('.fit-tattoo');

const fitTattooImage = fitTattooField.querySelector('.fit_tattoo_image');
const fitTattooTattoo = fitTattooField.querySelector('.fit_tattoo_tattoo');

const fileInputBtn = document.querySelector('#fileInput');
fileInputBtn.addEventListener('change', fileDroped);

const aboutText = document.querySelector('.text');
aboutText.style.setProperty('--textAboutColor', '#2f2d2d');

const previewBlock = document.querySelector('.preview');
previewBlock.style.setProperty('--previewBorder', '#ffffff');

const dropBanner = dropField.querySelector('.box_banner');
dropBanner.style.setProperty('--dropBannerColor', '#eee4e4');
dropBanner.style.setProperty('--dropBannerVis', 'visible');

const photo = dropSection.querySelector('.make-photo');
const makePhotoBanner = photo.querySelector('.box_banner');
makePhotoBanner.style.setProperty('--photoBanner', '#eee4e4');

dropField.addEventListener('click', () => {
  fileInputBtn.click();
});

function fileDroped(event) {
  if (!event.target) {
    return;
  }
  const droppedImg = dropField.querySelector('.droppedImg');
  if (droppedImg) {
    dropField.removeChild(droppedImg);
  }
  setPreview(event.target.files[0]);
}

dropField.addEventListener('dragover', event => {
  event.preventDefault();
  event.target.classList.add('over');
});

dropField.addEventListener('dragleave', event => {
  event.target.classList.remove('over');
});

dropField.addEventListener('drop', addImg);

function addImg(event) {
  event.preventDefault(); 
  setPreview(event.dataTransfer.files[0]);
}

function setPreview(file) {
  if (!file) {
    return;
  }
  dropBanner.style.setProperty('--dropBannerVis', 'hidden');
  dropPic.style.setProperty('--dropPic', 'hidden');
  const imageTypeRegExp = /^image\//;
  if (imageTypeRegExp.test(file.type)) {
    dropField.classList.remove('over');
    const img = document.createElement('img');
    img.classList.add('droppedImg');
    img.src = URL.createObjectURL(file);
    img.addEventListener('load', event => {
      URL.revokeObjectURL(event.target.src);
    });
    dropField.appendChild(img);
  }
}

dropSection.addEventListener('mouseover', (event) => {
  if (!event.target.classList.contains('box')) {
    event.target.parentElement.classList.add('over');
  } else {
    event.target.classList.add('over');
  }
});

dropSection.addEventListener('mouseout', (event) => {
  if (!event.target.classList.contains('box')) {
    event.target.parentElement.classList.remove('over');
  } else {
    event.target.classList.remove('over');
  }
});

dragImage.addEventListener('click', () => {
  const tattooToFit = document.querySelector('.current_slide img');
  const tattooToFitCopy = tattooToFit.cloneNode();
  tattooToFitCopy.classList.add('tattoo_to_fit');
  tattooToFit.style.setProperty('--border', 'none');
  tattooToFitCopy.unselectable = 'on';
  const imgDropped = dropField.querySelector('.droppedImg');
  const imgPhoto = photobooth.querySelector('canvas');
  if (!(imgDropped || imgPhoto.classList.contains('true'))) {
    fitWithoutChooseTattooErr();
    return;
  }
  if (imgDropped) {
    fitTattooImage.appendChild(imgDropped);
  } else if (imgPhoto) {
    const img = new Image();
    img.src = imgPhoto.toDataURL();
    img.classList.add('droppedImg');
    fitTattooImage.appendChild(img);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fitTattooTattoo.appendChild(tattooToFitCopy);
  fitTattooField.style.setProperty('--fitTattooVisible', 'visible');
  fittingMessageAnimation();
});

function fitWithoutChooseTattooErr() {
  dropBanner.style.setProperty('--dropBannerColor', '#db6363');
  makePhotoBanner.style.setProperty('--photoBanner', '#db6363');
  setTimeout(() => {
    dropBanner.style.setProperty('--dropBannerColor', '#eee4e4');
    makePhotoBanner.style.setProperty('--photoBanner', '#eee4e4');
  }, 1000);
}