const dropField = document.querySelector('.drop');
const fitTattooField = document.querySelector('.fit_tattoo');
fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
const exitFittingBtn = document.querySelector('.exit_fitting');
const clickToFitBanner = document.querySelector('.click_to_fit');
const dragImage = document.querySelector('.drag_image');
clickToFitBanner.style.setProperty('--N', 'hidden');
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

dropField.addEventListener('drop', onFilesDrop);

function onFilesDrop(event) {
  event.preventDefault();
  setPreview(event.dataTransfer.files[0]);
}

function setPreview(file) {
	const imageTypeRegExp = /^image\//;
	if (imageTypeRegExp.test(file.type)) {
		dropField.classList.remove('over');
		const img = document.createElement('img');
		img.src = URL.createObjectURL(file);
		img.addEventListener('load', event => {
			URL.revokeObjectURL(event.target.src);
		});
	dropField.innerText = '';
	dropField.appendChild(img);
	}
}

dragImage.addEventListener('mouseover', () => {
	dragImage.style.setProperty('--C', '#ffa500');
	clickToFitBanner.style.setProperty('--N', 'visible');
});
dragImage.addEventListener('mouseout', () => {
	const C = '#fafaf9';
	const N = 'none';
	dragImage.style.setProperty('--C', '#fafaf9');
	clickToFitBanner.style.setProperty('--N', 'hidden');
});

dragImage.addEventListener('click', () => {
	const img = dropField.querySelector('img');
	fitTattooImage.appendChild(img);
	const tattooToFit = document.querySelector('.img_choose');
	const tattooToFitCopy = tattooToFit.cloneNode();
	fitTattooTattoo.appendChild(tattooToFitCopy);
	fitTattooField.style.setProperty('--fitTattooVisible', 'visible');
});

exitFittingBtn.addEventListener('click', () => {
	dropField.innerText = 'drop your photo here';
	const img = fitTattooImage.querySelector('img');
	const tattoo = fitTattooTattoo.querySelector('img');
	fitTattooImage.removeChild(img);
	fitTattooTattoo.removeChild(tattoo);
	fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
});

previewImgs.forEach(img => {
	img.addEventListener('click', (event) => {
		const choosedImg = Array.from(previewImgs).find(el => el.classList.contains('img_choose'));
		if(choosedImg) {
			choosedImg.classList.remove('img_choose');
		}
		img.classList.toggle('img_choose', true);
	});
});