const domReady = () => {
  document.querySelectorAll('.phones__bnt-open').forEach((el, i) => {
    el.addEventListener('click', () => {
      el.closest('.phones')
        .querySelector('.phones-list')
        .classList.toggle("phones-list--open");
    });
  });

  document.querySelectorAll('.catalog-left-menu__icon-has-children').forEach((el, i) => {
    el.addEventListener('click', () => {
      el.closest('.catalog-left-menu__item')
        .classList.toggle("catalog-left-menu__item--active");
    });
  });

  let mainSwiper = new Swiper('.main-slider__container', {
    speed: 400,
    spaceBetween: 100,
    pagination: {
      el: '.main-slider__pagination',
      type: 'bullets',
      clickable: true,
    },
  });
  let productsOfWeek = new Swiper('.products-of-week__container', {
    speed: 400,
    spaceBetween: 100,
    pagination: {
      el: '.products-of-week__pagination',
      type: 'bullets',
      clickable: true,
    },
    navigation: {
      prevEl: '.products-of-week__prev',
      nextEl: '.products-of-week__next',
    },
  });
};


if (document.readyState !== 'loading') {
  domReady();
} else {
  document.addEventListener('DOMContentLoaded', domReady);
}