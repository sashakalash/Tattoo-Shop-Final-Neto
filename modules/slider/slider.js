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
'modules/slider/slideshow/2Wt0lq9Amcs 2.jpg', 
'modules/slider/slideshow/8gjLIDva9G4.jpg',
'modules/slider/slideshow/HjCkJJCHfVM.jpg',
'modules/slider/slideshow/IMG_2341.JPG.jpeg',
'modules/slider/slideshow/sOnS_fpaxVE.jpg'
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
