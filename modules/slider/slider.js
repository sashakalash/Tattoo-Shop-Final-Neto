'use strict';
const slider = document.querySelector('.slider');
const sliderImg = slider.querySelector('img');
const nextBtn = document.querySelector('.nextPhoto');
const prevBtn = document.querySelector('.prevPhoto');
const imgWideScreenBlock = document.querySelector('.imgPreview');
const imgWideScreen = imgWideScreenBlock.querySelector('img');
const widescreenBtn = document.querySelector('.widescreen');
const preview = document.querySelector('.preview');

nextBtn.addEventListener('click', slidePhoto);
prevBtn.addEventListener('click', slidePhoto);
widescreenBtn.addEventListener('click', showFullImg);
imgWideScreen.addEventListener('click', hideFullImg);

// const imgData = new XMLHttpRequest();
// imgData.addEventListener('load', createPreviewImgBlock);
// imgData.addEventListener('error', errorReqData);
// imgData.open('GET', '/data/img.json');
// imgData.send();

fetch('/data/img.json')
.then(res => res.json())
.then(res => createPreviewImgBlock(res))
.catch(err => errorReqData(err))

let isFullSizeImg = true;
imgWideScreenBlock.style.setProperty('--imgPreview', 'none');

function showFullImg() {
  imgWideScreen.src = document.querySelector('.current_slide img').src;
  imgWideScreenBlock.style.setProperty('--imgPreview', 'block');
}

function hideFullImg() {
  imgWideScreenBlock.style.setProperty('--imgPreview', 'none');
}

function slidePhoto(event) {
  let currentImg = document.querySelector('.img_choose');
  const nextImg = currentImg.nextElementSibling;
  const prevImg = currentImg.previousElementSibling;
  const firstImg = preview.firstChild;
  const lastImg = preview.lastChild;

  let currentSlide = document.querySelector('.current_slide');
  currentSlide.classList.remove('current_slide');
  currentImg.classList.remove('img_choose');

  if (event.target.classList.contains('nextPhoto')) {
    if (nextImg) {
      nextImg.classList.add('img_choose');
      sliderImg.src = nextImg.dataset.imgSrc;
    } else {
      firstImg.classList.add('img_choose');
      sliderImg.src = firstImg.dataset.imgSrc;
    }
  } else {
    if (prevImg) {
      prevImg.classList.add('img_choose');
      sliderImg.src = prevImg.dataset.imgSrc;
    } else {
      lastImg.classList.add('img_choose');
      sliderImg.src = lastImg.dataset.imgSrc;
    }
  }
}

function createPreviewImgBlock(data) {
  if (data) {
    try {
      data.minis.forEach((el, index) => {
        const img = document.createElement('img');
        img.src = el;
        img.dataset.imgSrc = data.img[index];
        img.classList.add('previewImg');
        preview.appendChild(img);
      });
      preview.firstChild.classList.add('img_choose');
      const img = slider.querySelector('img');
      img.src = data.img[0];
      img.classList.add('current_slide');
    } catch (e) {
      console.error(e.name, e.message);
    }
  }
}

function errorReqData(err) {
  console.log(err);
}

preview.addEventListener('click', showPreview);

function showPreview(event) {
  if (!event.target.classList.contains('img_choose')) {
    return;
  }
  event.preventDefault();
  chooseImg(event.target);
}

function chooseImg(previewImg) {
  const currentPreviewImg = preview.querySelector('.img_choose');
  currentPreviewImg.classList.remove('img_choose');
  previewImg.classList.add('img_choose');
  sliderImg.src = previewImg.dataset.imgSrc;
}