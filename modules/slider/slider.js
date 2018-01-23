'use strict';
const sliderImg = document.querySelector('.snake img');
const nextBtn = document.querySelector('.nextPhoto');
const prevBtn = document.querySelector('.prevPhoto');
const imgPreview = document.querySelector('#imgPreview');
const widescreenBtn = document.querySelector('.widescreen');
const slider = document.querySelector('#slider');
const preview = document.querySelector('.preview');

nextBtn.addEventListener('click', slidePhoto);
prevBtn.addEventListener('click', slidePhoto);
widescreenBtn.addEventListener('click', showFullImg);
imgPreview.addEventListener('click', hideFullImg);
const imgArr = [
'modules/slider/slideshow/1.png', 
'modules/slider/slideshow/2.png', 
'modules/slider/slideshow/3.png', 
'modules/slider/slideshow/4.png', 
'modules/slider/slideshow/5.png', 
'modules/slider/slideshow/6.png', 
'modules/slider/slideshow/7.png', 
'modules/slider/slideshow/8.png', 
'modules/slider/slideshow/10.png',
'modules/slider/slideshow/11.png'
];

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
		nextImg? sliderImg.src = nextImg.src: sliderImg.src = firstImg.src;
	} else {
		prevImg? sliderImg.src = prevImg.src: sliderImg.src = lastImg.src;
	}
	chooseImg(sliderImg.src);
}

for (const imgSrc of imgArr) {
	const img = document.createElement('img');
	img.src = imgSrc;
	img.addEventListener('click', showPreview);
	preview.appendChild(img);
}
const previewImgs = document.querySelectorAll('.preview img');
Array.from(previewImgs)[0].classList.add('img_choose');


function showPreview(e) {
	e.preventDefault();
	sliderImg.src = e.target.src;
	chooseImg(e.target.src);
}

function chooseImg(src) {
	let img, choosedImg;
	 Array.from(previewImgs).forEach(el => {
		if (el.classList.contains('img_choose')) {
			choosedImg = el;
		}
		if (el.src == src) {
			img = el;
		}
	 });
	if (choosedImg && choosedImg != img) {
		choosedImg.classList.remove('img_choose');
	} 
	if (img.classList.contains('img_choose')) {
		return;
	}
	img.classList.add('img_choose');
}