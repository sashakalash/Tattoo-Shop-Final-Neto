'use strict';
const sliderImg = document.querySelector('.currentPhoto');
const nextBtn = document.querySelector('.nextPhoto');
const prevBtn = document.querySelector('.prevPhoto');
const imgPreview = document.querySelector('#imgPreview');
const slider = document.querySelector('#slider');
nextBtn.addEventListener('click', nextPhoto);
prevBtn.addEventListener('click', prevPhoto);
// sliderImg.addEventListener('click', showFullImg);
const imgArr = [
'modules/slider/slideshow/1.png', 
'modules/slider/slideshow/2.png', 
'modules/slider/slideshow/3.png', 
'modules/slider/slideshow/4.png', 
'modules/slider/slideshow/5.png', 
'modules/slider/slideshow/6.png', 
'modules/slider/slideshow/7.png', 
'modules/slider/slideshow/8.png', 
'modules/slider/slideshow/9.png', 
'modules/slider/slideshow/10.png'
];

// function showFullImg(e) {
// 	imgPreview.style.backgroundImage = `url("${e.target.src}")`;
// 	imgPreview.classList.toggle('hidden');
// 	slider.classList.toggle('hidden');
// }

let step = 0;
const len = imgArr.length;
function nextPhoto() {
	step + 1 === len? step = 0: step++;
	sliderImg.src = imgArr[step];
}
function prevPhoto() {
	step - 1 < 0? step = len - 1: step--;
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
