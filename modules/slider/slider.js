'use strict';
const sliderImg = document.querySelector('.snake img');
const nextBtn = document.querySelector('.nextPhoto');
const prevBtn = document.querySelector('.prevPhoto');
const imgPreview = document.querySelector('#imgPreview');
const widescreenBtn = document.querySelector('.widescreen');
const slider = document.querySelector('#slider');
nextBtn.addEventListener('click', nextPhoto);
prevBtn.addEventListener('click', prevPhoto);
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


let step = 0;
function nextPhoto() {
	step < imgArr.length - 1? step++: step = 0;
	sliderImg.src = imgArr[step];
}
function prevPhoto() {
	step > 0? step--: step = imgArr.length - 1;
	sliderImg.src = imgArr[step];
}

const preview = document.querySelector('.preview');

for (const imgSrc of imgArr) {
	const img = document.createElement('img');
	img.src = imgSrc;
	img.addEventListener('click', showPreview);
	preview.appendChild(img);
}

function showPreview(e) {
	e.preventDefault();
	sliderImg.src = e.target.src;
}
