
const fitBlock = document.querySelector('.fit_tattoo');
let movedTattoo = null;
let shiftX = 0;
let shiftY = 0;
document.addEventListener('mousedown', event => {
	if (event.target.classList.contains('img_choose')) {
		movedTattoo = event.target;
		const bounds = event.target.getBoundingClientRect();
		shiftX = event.pageX - bounds.left - window.pageXOffset;
		shiftY = event.pageY - bounds.top - window.pageYOffset;
	} else {
		event.preventDefault();
	}
});

document.addEventListener('mousemove', event => {
	if (movedTattoo) {
		event.preventDefault();
		if (event.shiftKey) {
			movedTattoo.style.width = event.pageX / 2 + 'px';
			movedTattoo.style.height = event.pageY / 2 + 'px';
		} else {
			movedTattoo.style.left = event.pageX - shiftX + 'px';
			movedTattoo.style.top = event.pageY - shiftY + 'px';
		}
	} 
});

document.addEventListener('mouseup', event => {
	if (movedTattoo) {
		fitTattooImage.appendChild(movedTattoo);
		movedTattoo = null;
	}
});

const sendImgBtn = document.querySelector('.make_img');
sendImgBtn.addEventListener('click', sendImg);

function sendImg() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	fitTattooField.appendChild(canvas);
	const img1 = fitTattooField.querySelector('.imgToFit');
	const img2 = fitTattooField.querySelector('.img_choose');
	const tattooCoord = img2.getBoundingClientRect();
	canvas.width = img1.width;
	canvas.height = img1.height;
	ctx.drawImage(img1, 0, 0);
	ctx.drawImage(img2, tattooCoord.left, tattooCoord.top, img2.width, img2.height);
	const img = document.createElement('img');
	img.src = canvas.toDataURL();
	fitTattooField.appendChild(img);
}

const exitFittingBtn = document.querySelector('.exit_fitting');
exitFittingBtn.addEventListener('click', () => {
	const imgs = fitTattooImage.querySelectorAll('img');
	const tattoo = fitTattooTattoo.querySelector('img');
	if (tattoo) {
		fitTattooTattoo.removeChild(tattoo);
	}
	Array.from(imgs).forEach(img => {
		fitTattooImage.removeChild(img);
	});
	fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
	dropField.style.setProperty('--bgPosDrop', '0');
	photobooth.style.setProperty('--bgPosPhoto', '0');
	cameraWindow.style.setProperty('--videoVis', 'hidden');
});