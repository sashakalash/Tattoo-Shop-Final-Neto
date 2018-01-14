const dropSection = document.querySelector('.drop_section');

const dropField = document.querySelector('.drop');
dropField.style.setProperty('--bgPosDrop', '0');
const fitTattooField = document.querySelector('.fit_tattoo');
fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');

const dragImage = document.querySelector('.drag_image');

Array.from(document.querySelectorAll('.banner'))
	.forEach(el => {
		el.style.setProperty('--bannerVis', 'hidden');
	});


const previewImgs = document.querySelectorAll('.preview img');
const fitTattooImage = fitTattooField.querySelector('.fit_tattoo_image');
const fitTattooTattoo = fitTattooField.querySelector('.fit_tattoo_tattoo');


dropField.addEventListener('dragover', event => {
  event.preventDefault();
  event.target.classList.add('over');
});

dropField.addEventListener('dragleave', event => {
  event.target.classList.remove('over');
});

dropField.addEventListener('drop', (event) => {
	event.preventDefault();
	setPreview(event.dataTransfer.files[0]);
	dropField.style.setProperty('--bgPosDrop', '300px');
});

function setPreview(file) {
	const imageTypeRegExp = /^image\//;
	if (imageTypeRegExp.test(file.type)) {
		dropField.classList.remove('over');
		const img = document.createElement('img');
		img.src = URL.createObjectURL(file);
		img.addEventListener('load', event => {
			URL.revokeObjectURL(event.target.src);
		});
	dropField.appendChild(img);
	}
}

dropSection.addEventListener('mouseover', (event) => {
	const banner = event.target.querySelector('.banner');
	if (banner) {
		banner.style.setProperty('--bannerVis', 'visible');
		if (event.target.tagName === 'video') {
			event.target.parentElement.classList.add('over');
		}
		event.target.classList.add('over');
	}
});

dropSection.addEventListener('mouseout', (event) => {
	const banner = event.target.querySelector('.banner');
	if (banner) {
		banner.style.setProperty('--bannerVis', 'hidden');
		if (event.target.tagName === 'video') {
			event.target.parentElement.classList.remove('over');
		}
		event.target.classList.remove('over');
	}
});

dragImage.addEventListener('click', () => {
	const imgDropped = dropField.querySelector('img');
	const imgPhoto = photobooth.querySelector('canvas');
	if (imgDropped) {
		imgDropped.classList.add('imgToFit');
		fitTattooImage.appendChild(imgDropped);
	} else if (imgPhoto) {
		imgPhoto.classList.add('imgToFit');
		fitTattooImage.appendChild(imgPhoto);
	}
	const tattooToFit = document.querySelector('.img_choose');
	const tattooToFitCopy = tattooToFit.cloneNode();
	fitTattooTattoo.appendChild(tattooToFitCopy);
	fitTattooField.style.setProperty('--fitTattooVisible', 'visible');
});


previewImgs.forEach(img => {
	img.addEventListener('click', (event) => {
		const choosedImg = Array.from(previewImgs).find(el => el.classList.contains('img_choose'));
		if(choosedImg) {
			choosedImg.classList.remove('img_choose');
		}
		img.classList.add('img_choose');
	});
});