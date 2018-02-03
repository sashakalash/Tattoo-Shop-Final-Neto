'use strict';
const sliderImg = document.querySelector('.slider img');
const nextBtn = document.querySelector('.nextPhoto');
const prevBtn = document.querySelector('.prevPhoto');
const imgPreview = document.querySelector('#imgPreview');
const widescreenBtn = document.querySelector('.widescreen');
const slider = document.querySelector('.slider_block');
const preview = document.querySelector('.preview');

nextBtn.addEventListener('click', slidePhoto);
prevBtn.addEventListener('click', slidePhoto);
widescreenBtn.addEventListener('click', showFullImg);
imgPreview.addEventListener('click', hideFullImg);

const imgData = new XMLHttpRequest();
imgData.addEventListener('load', createPreviewImgBlock);
imgData.addEventListener('error', errorReqData);
imgData.open('GET', './data/img.json');
imgData.send();

let isFullSizeImg = true;
imgPreview.style.setProperty('--imgPreview', 'none');

function showFullImg(e) {
  const img = new Image();
  img.src = sliderImg.src;
  imgPreview.appendChild(img);
  imgPreview.style.setProperty('--imgPreview', 'block');
}

function hideFullImg() {
  const img = imgPreview.querySelector('img');
  imgPreview.removeChild(img);
  imgPreview.style.setProperty('--imgPreview', 'none');
}

function slidePhoto(event) {
  const currentImg = document.querySelector('.img_choose');
  const nextImg = currentImg.nextElementSibling;
  const prevImg = currentImg.previousElementSibling;
  const firstImg = previewBlock.firstChild;
  const lastImg = previewBlock.lastChild;
  if (event.target.classList.contains('nextPhoto')) {
    nextImg? sliderImg.src = nextImg.src.replace('minis', 'imgs'): sliderImg.src = firstImg.src.replace('minis', 'imgs');
  } else {
    prevImg? sliderImg.src = prevImg.src.replace('minis', 'imgs'): sliderImg.src = lastImg.src.replace('minis', 'imgs');
  }
  chooseImg(sliderImg.src.replace('imgs', 'minis'));
}

var tattooImg;
function createPreviewImgBlock() {
  if (imgData.responseText) {
    try {
      tattooImg = JSON.parse(imgData.responseText);
      if (Array.isArray(tattooImg.img)) {
        sliderImg.src = tattooImg.img[0];
      }
      tattooImg.minis.forEach(el => {
        const img = document.createElement('img');
        img.src = el;
        img.classList.add('previewImg');
        preview.appendChild(img);
      });
      if (preview.firstChild) {
        preview.firstChild.classList.add('img_choose');
      }
    } catch (e) {
      console.error(e.name, e.message);
    }
  }
}

function errorReqData(err) {
  console.log(err);
}

preview.addEventListener('click', showPreview);

function showPreview(e) {
  if (!e.target.classList.contains('previewImg')) {
    return;
  }
  e.preventDefault();
  sliderImg.src = e.target.src.replace('minis', 'imgs');
  chooseImg(e.target.src);
}

function chooseImg(imgSrc) {
  const previewImgs = preview.querySelectorAll('img');
  Array.from(previewImgs).forEach(el => {
    el.classList.remove('img_choose');
    if (el.src === imgSrc) {
      el.classList.add('img_choose');
    }
  });
}