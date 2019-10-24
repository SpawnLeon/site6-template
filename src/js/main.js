"use strict";
import Swiper from 'swiper';
import Vue from 'vue';


const domReady = () => {
  document.querySelectorAll('.qty-widget').forEach((el) => {
    el.querySelectorAll('.qty-widget__btn').forEach((el) => {
      el.addEventListener('click', () => {
        let field = el.closest('.qty-widget').querySelector('.qty-widget__count');
        const currentCount = parseInt(field.value);
        let newCount = currentCount;
        const action = el.getAttribute('data-action');
        switch (action) {
          case 'minus':
            newCount = currentCount - 1;
            break;
          case 'plus':
            newCount = currentCount + 1;
            break;
        }
        field.value = newCount;
        field.onchange(field);
      });
    });


    let field = el.querySelector('.qty-widget__count');
    field.onchange = (field) => {
      let currentCount = parseInt(field.value);
      if (currentCount < 1) {
        currentCount = 1;
      }
      field.value = currentCount;

      // fetch('/ajax/basket.php', {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     'action': 'setQuantity',
      //     'id': '23446',
      //     'productId': '4484',
      //     'quantity': currentCount,
      //     'rz_ajax': 'y'
      //   })
      //
      // })
      //   .then(response => response.json())
      //   .then(response => {
      //     smallCartObject.refreshCart();
      //   });
    };


  });


  document.querySelectorAll('.phones__bnt-open').forEach((el) => {
    el.addEventListener('click', () => {
      el.closest('.phones')
        .querySelector('.phones-list')
        .classList.toggle('phones-list--open');
    });
  });


  document.querySelectorAll('.header__search-btn').forEach((el) => {
    el.addEventListener('click', () => {
      el.closest('.search-block')
        .querySelector('.search-block__form')
        .classList.toggle('search-block__form--open');
    });
  });

  document.querySelectorAll('.burger-menu').forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.toggle('burger-menu__item--active');
    });
  });

  document.querySelectorAll('.header__basket-icon, .basket-block__close').forEach((el) => {
    el.addEventListener('click', () => {
      const basketBlock = document.querySelector('.basket-block');
      if (basketBlock) {
        basketBlock.classList.toggle('basket-block--show');
      }

    });
  });


  document.querySelectorAll('.shops__tab').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.shops__tab').forEach((el) => {
        el.classList.remove('shops__tab--active');

      });
      document.querySelectorAll('.shops__tab-content').forEach((el) => {
        el.classList.remove('shops__tab-content--active');
      });
      el.classList.add('shops__tab--active');
      const tabTarget = el.getAttribute('data-tab-target');
      document.querySelector(`[data-tab="${tabTarget}"]`).classList.add('shops__tab-content--active');
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

  //TODO: make materials tabs
  // document.querySelectorAll('.materials-item__more').forEach((el) => {
  //   el.addEventListener('click', () => {
  //     el.classList.toggle('materials-item__more--open')
  //
  //     el.closest('.phones')
  //       .querySelector('.phones-list')
  //       .classList.toggle('phones-list--open');
  //   });
  // });

  if (document.getElementById('js__catalog-card-app') !== null) {
    let detailCardVueAppParams = {};

    detailCardVueAppParams.price = 48000;
    detailCardVueAppParams.oldPrice = 80100;
    detailCardVueAppParams.selected = null;
    detailCardVueAppParams.selected1 = null;
    detailCardVueAppParams.selected2 = null;
    detailCardVueAppParams.selected3 = null;
    detailCardVueAppParams.list = ['TEST1', 'TEST2', 'TEST3', 'TEST4', 'TEST5', 'TEST6', 'TEST7', 'TEST8', 'TEST9'];
    const app = new Vue({
      el: '#js__catalog-card-app',
      props: ['options', 'label', 'value'],
      data: {
        ...detailCardVueAppParams,
      },
      mounted: () => {
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
      },
      methods: {
        formatPrice(value) {
          let val = (value / 1).toFixed(0).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }
      }
    });
  }


// register modal component
  let modalTemplate = Vue.component('modal', {
    template: '#js__vue-app-forms-modal-template'
  });
  if (document.getElementById('js__vue-app-forms-modal') !== null) {
// start app
    let formPopupApp = new Vue({
      el: '#js__vue-app-forms-modal',
      data: {
        showModal: false,
        modalBody: ''
      }

    });

    document.querySelectorAll('[data-popup-form-id]').forEach((el) => {
      el.addEventListener('click', () => {
        const popupFormID = el.getAttribute('data-popup-form-id');

        let ajaxUrl = '/ajax/form.php?form_id=' + popupFormID;
        (() => {
          fetch(ajaxUrl, {
            method: 'POST',
            //mode: 'cors', // no-cors, cors, *same-origin
          })
            .then(response => response.text())
            .then((strData) => {
              const pattern = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
              const match = pattern.exec(strData);
              formPopupApp.modalBody = strData;
              setTimeout(() => eval(match[1]), 500);


            });
          formPopupApp.showModal = true;
        })(popupFormID);
      });
    });
  }


};


if (document.readyState !== 'loading') {
  domReady();
} else {
  document.addEventListener('DOMContentLoaded', domReady);
}