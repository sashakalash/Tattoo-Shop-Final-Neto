const dropSection = document.querySelector('.drop_section');

const dropField = document.querySelector('.drop');
dropField.style.setProperty('--bgPosDrop', '0');

const dropPic = dropField.querySelector('.marker');
dropPic.style.setProperty('--dropPic', 'visible');

const fitTattooField = document.querySelector('.tattoo_fitting_room');
fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');

const dragImage = document.querySelector('.fit-tattoo');

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

// dropField.addEventListener('click', addImg);
dropField.addEventListener('drop', addImg);

function addImg(event) {
	event.preventDefault(); 
	const banner = event.target.querySelector('.box_banner');
	banner.style.visibility = 'hidden';
	dropPic.style.setProperty('--dropPic', 'hidden');
	setPreview(event.dataTransfer.files[0]);
}

function setPreview(file) {
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
	const imgDropped = dropField.querySelector('.droppedImg');
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


Array.from(previewImgs).forEach(img => {
	img.addEventListener('click', (event) => {
		const choosedImg = Array.from(previewImgs).find(el => el.classList.contains('img_choose'));
		if(choosedImg) {
			choosedImg.classList.remove('img_choose');
		}
		event.target.classList.add('img_choose');
	});
});