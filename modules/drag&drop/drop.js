const dropField = document.querySelector('.drop');
const fitTattooField = document.querySelector('.fit_tattoo');
fitTattooField.style.setProperty('--fitTattooDisp', 'none');
const exitFittingBtn = document.querySelector('.exit_fitting');
const clickToFitBanner = document.querySelector('.click_to_fit');
const dragImage = document.querySelector('.drag_image');
clickToFitBanner.style.setProperty('--N', 'none');
const previewImgs = document.querySelectorAll('.preview img');


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
	clickToFitBanner.style.setProperty('--N', 'block');
});
dragImage.addEventListener('mouseout', () => {
	const C = '#fafaf9';
	const N = 'none';
	dragImage.style.setProperty('--C', '#fafaf9');
	clickToFitBanner.style.setProperty('--N', 'none');
});

dragImage.addEventListener('click', () => {
	const img = dropField.querySelector('img');
	fitTattooField.appendChild(img);
	const tattooToFit = document.querySelector('.img_choose');
	const tattooToFitCopy = tattooToFit.cloneNode();
	fitTattooField.appendChild(tattooToFitCopy);
	fitTattooField.style.setProperty('--fitTattooDisp', 'block');
});

exitFittingBtn.addEventListener('click', () => {
	dropField.innerText = 'drop your photo here';
	const imgs = fitTattooField.querySelectorAll('img');
	Array.from(imgs).forEach(img => fitTattooField.removeChild(img));
	fitTattooField.style.setProperty('--fitTattooDisp', 'none');
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