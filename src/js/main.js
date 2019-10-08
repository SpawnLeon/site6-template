import Swiper from 'swiper';


const domReady = () => {
  document.querySelectorAll('.phones__bnt-open').forEach((el) => {
    el.addEventListener('click', () => {
      el.closest('.phones')
        .querySelector('.phones-list')
        .classList.toggle('phones-list--open');
    });
  });

  document.querySelectorAll('.card-tabs__tab-name').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.card-tabs__tab-name').forEach((el) => {
        el.classList.remove('card-tabs__tab-name--active');
      });
      document.querySelectorAll('.card-tabs__tab').forEach((el) => {
        el.classList.remove('card-tabs__tab--active');
      });
      el.classList.add('card-tabs__tab-name--active');
      const tabTarget = el.getAttribute('data-tab-target');

      document.querySelector(`[data-tab="${tabTarget}"]`).classList.add('card-tabs__tab--active');

    });
  });


  document.querySelectorAll('.catalog-left-menu__icon-has-children').forEach((el) => {
    el.addEventListener('click', () => {
      el.closest('.catalog-left-menu__item')
        .classList.toggle("catalog-left-menu__item--active");
    });
  });

  new Swiper('.main-slider__container', {
    speed: 400,
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


  $('[data-fancybox="card-main-images"]').fancybox({
    thumbs: {
      autoStart: true,
    },
  });
  $('.card-thumb-images__item--all-images-btn').click(() => {
    $.fancybox.open(
      $('[data-fancybox="card-main-images"]'),
      {
        thumbs: {
          autoStart: true,
        }
      }
    );
  });
  $('.tooltip').tooltipster({
    theme: 'tooltipster-noir',
    maxWidth: 320,
    delay: 100,
  });
  // const app = new Vue({
  //   el: '#js__catalog-card-app',
  //   data: {
  //     ...detailCardVueAppParams,
  //   },
  //   methods: {
  //     formatPrice(value) {
  //       let val = (value / 1).toFixed(0).replace('.', ',')
  //       return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  //     }
  //   }
  // });
};


if (document.readyState !== 'loading') {
  domReady();
} else {
  document.addEventListener('DOMContentLoaded', domReady);
}