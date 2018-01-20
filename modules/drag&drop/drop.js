const dropSection = document.querySelector('.drop_section');

const dropField = document.querySelector('.drop');

const dropPic = dropField.querySelector('.marker');
dropPic.style.setProperty('--dropPic', 'visible');

const fitTattooField = document.querySelector('.tattoo_fitting_room');
fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');

const dragImage = document.querySelector('.fit-tattoo');

const previewImgs = document.querySelectorAll('.preview img');
const fitTattooImage = fitTattooField.querySelector('.fit_tattoo_image');
const fitTattooTattoo = fitTattooField.querySelector('.fit_tattoo_tattoo');

const banner = document.querySelector('.box_banner');

const fileInputBtn = document.querySelector('#fileInput');
fileInputBtn.addEventListener('change', fileDroped);

const fittingMessage = document.querySelector('.fitting_message');
fittingMessage.style.setProperty('--fittingMessage', 'hidden');

const aboutText = document.querySelector('.text');
aboutText.style.setProperty('--textAboutColor', '#2f2d2d');

const previewBlock = document.querySelector('.preview');
previewBlock.style.setProperty('--previewBorder', '#ffffff');

dropField.addEventListener('click', () => {
	fileInputBtn.click();
});

function fileDroped(event) {
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
	banner.style.visibility = 'hidden';
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
	const tattooToFit = document.querySelector('.img_choose');
	const tattooToFitCopy = tattooToFit.cloneNode();
	const imgDropped = dropField.querySelector('.droppedImg');
	const imgPhoto = photobooth.querySelector('canvas');
	if (!tattooToFit) {
		fitWithoutChooseTattooErr();
		return;
	}
	if (imgDropped) {
		imgDropped.classList.add('imgToFit');
		fitTattooImage.appendChild(imgDropped);
	} else if (imgPhoto) {
		imgPhoto.classList.add('imgToFit');
		fitTattooImage.appendChild(imgPhoto);
	}
	fitTattooTattoo.appendChild(tattooToFitCopy);
	fitTattooField.style.setProperty('--fitTattooVisible', 'visible');
	fittingMessage.style.setProperty('--fittingMessage', 'visible');
});


Array.from(previewImgs).forEach(img => {
	img.addEventListener('click', (event) => {
		const choosedImg = Array.from(previewImgs).find(el => el.classList.contains('img_choose'));
		if(choosedImg) {
			choosedImg.classList.remove('img_choose');
		}
		if (event.target.classList.contains('img_choose')) {
			return;
		}
		event.target.classList.add('img_choose');
	});
});

function fitWithoutChooseTattooErr() {
	aboutText.style.setProperty('--textAboutColor', '#db6363');
	previewBlock.style.setProperty('--previewBorder', '#db6363');
	setTimeout(() => {
		aboutText.style.setProperty('--textAboutColor', '#2f2d2d');
		previewBlock.style.setProperty('--previewBorder', '#ffffff');
	}, 2000);
}