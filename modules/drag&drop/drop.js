const dropField = document.querySelector('.drop');
// const canvas = document.querySelector('.tattooFit');
// const ctx = canvas.getContext('2d');

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
		dropField.textContent = '';
		dropField.classList.remove('over');
		const img = document.createElement('img');
		img.width = 400;
		img.height = 400;
		
		
		img.src = URL.createObjectURL(file);
		
		

		img.addEventListener('load', event => {
			// const ctxImg = new Image();
			// ctx.drawImage(ctxImg, canvas.getBoundingClientRect.left, canvas.getBoundingClientRect.top, 1000, 700);
			// ctxImg.src = event.target.src;
			URL.revokeObjectURL(event.target.src);
		});
	dropField.appendChild(img);
	}
}

const clickToFitBanner = document.querySelector('.click_to_fit');
const dragImage = document.querySelector('.drag_image');
clickToFitBanner.style.setProperty('--N', 'none');

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

});

