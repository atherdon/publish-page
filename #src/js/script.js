function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	}
});

const modalLinks = document.querySelectorAll('.modal-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); // for fixed objects

const timeout = 800;

let unlock = true;

if (modalLinks.length > 0) {
	for (let index = 0; index < modalLinks.length; index++) {
		const modalLink = modalLinks[index];
		modalLink.addEventListener('click', function (e) {
			const modalName = modalLink.getAttribute('href').replace('#', '');
			const currentModal = document.getElementById(modalName);
			modalOpen(currentModal);
			e.preventDefault();
		});
	}
}

const modalCloseIcon = document.querySelectorAll('.modal-close');
if (modalCloseIcon.length > 0) {
	for (let index = 0; index < modalCloseIcon.length; index++) {
		const el = modalCloseIcon[index];
		el.addEventListener('click', function (e) {
			modalClose(el.closest('.modal'));
			e.preventDefault();
		});
	}
}

function modalOpen(currentModal) {
	if (currentModal && unlock) {
		const modalActive = document.querySelector('.modal.open');
		if (modalActive) {
			modalClose(modalActive, false);
		} else {
			bodyLock();
		}
		currentModal.classList.add('open');
		currentModal.addEventListener('click', function (e) {
			if (!e.target.closest('.modal__wrapper')) {
				modalClose(e.target.closest('.modal'));
			}
		});
	}
}

function modalClose(modalActive, doUnlock = true) {
	if (unlock) {
		modalActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; lockPadding.length < 0; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unLock = false;

	setTimeout(function () {
		unlock = true;
	}, timeout)
}

function bodyUnLock() {
	setTimeout(function () {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const modalActive = document.querySelector('.modal.open');
		modalClose(modalActive);
	}
});


function insertData() {

	var insertData = "";

	for (i = 0; i < data.length; i++) {
	
		//console.log(data[i].link);

		insertData += `
		<div class="gallery__item">
		<a href="${data[i].link}">
			<div class="gallery__item-content">
				<img src="${data[i].image}" alt="" loading="lazy">
				<div class="gallery__item-text">
					<p class="caption">${data[i].title}</p>
					<p class="author">${data[i].author}</p>
				</div>
			</div>
		</a>
	</div>`	
	}
	
	$('.gallery__wrapper').html(insertData);
}



jQuery(function ($) {
	$(document).ready(function () {

		$('#sec-community').on('click', function(e){
			var destination = $(".sec-community").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});

		$('#slider-submitting').on('click', function(e){
			var destination = $(".slider-submitting").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});

		$('#slider-press').on('click', function(e){
			var destination = $(".slider-press").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});

		$('#join').on('click', function(e){
			var destination = $(".join").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});

		$('#gallery').on('click', function(e){
			var destination = $(".gallery").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});

		$('#leaders').on('click', function(e){
			var destination = $(".leaders").offset().top - $('.header').outerHeight();
			e.preventDefault();
			$('.burger').removeClass('burger-active');
			$('.menu').removeClass('menu__open');
			$('.header__wrapper').removeClass('header__wrapper-green');
			$('html, body').animate({ scrollTop: destination }, 1000); // Скорость прокрутки
		});





		$('.arrow-up').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			var winHeight = $(document).height();
			var step = 12;
			var timeToScroll = winHeight / step;
			$('html, body').stop().animate({
				scrollTop: 0
			}, timeToScroll);
		});


		$('.burger__menu').on('click', function (e) {
			e.preventDefault();
			$('.burger').toggleClass('burger-active');
			$('.menu').toggleClass('menu__open');
			$('.header__wrapper').toggleClass('header__wrapper-green');
		});

		$('.menu__btn-close').on('click', function(e) {
			e.preventDefault();
			$('.menu').removeClass('menu__open');
			$('.burger').removeClass('burger-active');
		});


		$('.slider-submit').slick({
			infinite: false,
			arrows: false,
			variableWidth: true,
			slidesToScroll: 1
		});

		$('.slider-press__list').slick({
			arrows: false,
			infinite: false,
			slidesToScroll: 3,
			rows: 3,
			variableWidth: true,

		});


		if (typeof data !== 'undefined' && data) {
			insertData();

			var titlePage = $('title').html() + ' --- ' + pageTitle; 

			$('title').html(titlePage);
		}
		


	});
});




