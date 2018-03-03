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

const imgData = new XMLHttpRequest();
imgData.addEventListener('load', createPreviewImgBlock);
imgData.addEventListener('error', errorReqData);
imgData.open('GET', './data/img.json');
imgData.send();

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
  // const nextSlide = currentSlide.nextElementSibling;
  // const prevSlide = currentSlide.previousElementSibling;
  // const firstSlide = slider.firstChild;
  // const lastSlide = slider.lastChild;
  currentSlide.classList.remove('current_slide');
  currentImg.classList.remove('img_choose');

  if (event.target.classList.contains('nextPhoto')) {
    if (nextImg) {
      // nextSlide.classList.add('current_slide');
      nextImg.classList.add('img_choose');
      sliderImg.src = nextImg.dataset.imgSrc;
    } else {
      // firstSlide.classList.add('current_slide');
      firstImg.classList.add('img_choose');
      sliderImg.src = firstImg.dataset.imgSrc;
    }
  } else {
    if (prevImg) {
      // prevSlide.classList.add('current_slide');
      prevImg.classList.add('img_choose');
      sliderImg.src = prevImg.dataset.imgSrc;
    } else {
      // lastSlide.classList.add('current_slide');
      lastImg.classList.add('img_choose');
      sliderImg.src = lastImg.dataset.imgSrc;
    }
  }
}

function createPreviewImgBlock(evt) {
  if (imgData.responseText) {
    try {
      const tattooImg = JSON.parse(evt.responseText);
      // tattooImg.img.forEach((el, index) => {
      //   const imgBlock = document.createElement('li');
      //   const img = document.createElement('img');
      //   img.src = el;
      //   img.dataset.number = index;
      //   imgBlock.appendChild(img);
      //   slider.appendChild(imgBlock);
      // });
      // slider.firstChild.classList.add('current_slide');
      tattooImg.minis.forEach((el, index) => {
        const img = document.createElement('img');
        img.src = el;
        img.dataset.imgSrc = tattooImg.img[index];
        img.classList.add('previewImg');
        preview.appendChild(img);
      });
      preview.firstChild.classList.add('img_choose');
      const img = slider.querySelector('img');
      img.src = tattooImg.img[0];
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
  // const index = event.target.dataset.number;
  chooseImg(event.target);
}

function chooseImg(previewImg) {
  const currentPreviewImg = preview.querySelector('.img_choose');
  currentPreviewImg.classList.remove('img_choose');
  // const currentSliderImg = slider.querySelector('.current_slide');
  // currentSliderImg.classList.remove('current_slide');
  // const choosedPreviewImg = preview.querySelector(`[data-number=${index}]`);
  previewImg.classList.add('img_choose');
  sliderImg.src = previewImg.dataset.imgSrc;
  // const choosedSliderImg = slider.querySelector(`[data-number=${index}]`);
  // choosedSliderImg.classList.add('current_slide');
}