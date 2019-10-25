import Swiper from "swiper";

export default () => {
  new Swiper('.main-slider__container', {
    speed: 400,
    autoplay: {
      delay: 3000,
    },
    spaceBetween: 100,
    pagination: {
      el: '.main-slider__pagination',
      type: 'bullets',
      clickable: true,
    },
  });
  new Swiper('.products-of-week__container', {
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


  new Swiper('.card-additional-products__container', {
    speed: 400,
    autoplay: {
      delay: 3000,
    },
    spaceBetween: 0,
    slidesPerView: 4,
    slidesPerGroup: 4,
    pagination: {
      el: '.card-additional-products__pager',
      type: 'bullets',
      clickable: true,
    },
  });
}