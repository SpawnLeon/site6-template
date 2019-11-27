"use strict";
import Vue from "vue";
import axios from "axios";
import sliders from "./sliders";
import VueLazyload from "vue-lazyload";
import toTopBtn from "./components/v-to-top-btn.vue";

Vue.use(VueLazyload);
Vue.use(toTopBtn);

const domReady = () => {
  sliders();
  let formPopupApp = new Vue({
    el: "#js__vue-app-forms-modal",
    data() {
      return {
        showModal: false,
        modalBody: ""
      };
    }
  });

  new Vue({
    el: "#js__toTopBtn",
    render(h) {
      return h(toTopBtn);
    }
  });

  let handleOutsideClick;
  Vue.directive("closable", {
    bind(el, binding, vnode) {
      handleOutsideClick = e => {
        e.stopPropagation();
        const { handler, exclude } = binding.value;
        let clickedOnExcludedEl = false;
        if (typeof exclude !== "undefined") {
          exclude.forEach(refName => {
            if (!clickedOnExcludedEl) {
              const excludedEl = vnode.context.$refs[refName];
              clickedOnExcludedEl = excludedEl.contains(e.target);
            }
          });
        }

        if (!el.contains(e.target) && !clickedOnExcludedEl) {
          vnode.context[handler](e.target);
        }
      };
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    },

    unbind() {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    }
  });

  $(document).on("click", "#smallCartObject .qty-widget__btn", function() {
    const el = this;
    let field = el.closest(".qty-widget").querySelector(".qty-widget__count");
    const currentCount = parseInt(field.value);
    let newCount = currentCount;
    const action = el.getAttribute("data-action");
    switch (action) {
      case "minus":
        newCount = currentCount - 1 > 0 ? currentCount - 1 : 1;
        break;
      case "plus":
        newCount = currentCount + 1;
        break;
    }
    field.value = newCount;
    const productID = field.getAttribute("data-id");
    if (typeof productID !== "undefined") {
      axios
        .post("/ajax/product.php", {
          ID: productID,
          quantity: newCount,
          method: "changeCount"
        })
        .then(response => {
          smallCartObject.refreshCart();
        });
    }
  });

  document.querySelectorAll(".header__search-btn").forEach(el => {
    el.addEventListener("click", () => {
      el.closest(".search-block")
        .querySelector(".search-block__form")
        .classList.toggle("search-block__form--open");
    });
  });

  document.querySelectorAll(".burger-menu").forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("burger-menu--active");
    });
  });

  document.querySelectorAll(".js__burger-menu--catalog-menu").forEach(el => {
    el.addEventListener("click", () => {
      const menu = document.querySelector(".catalog-left__content");
      showMenuWithOverlay(menu);
    });
  });

  document.querySelectorAll(".js__burger-menu--main-menu").forEach(el => {
    el.addEventListener("click", () => {
      const menu = document.querySelector(".mobile-main-menu");

      if (menu.classList.contains("show")) {
        hideMenuWithOverlay(menu);
      } else {
        showMenuWithOverlay(menu);
        document.body.classList.add("has-overlay-main-menu");
      }
    });
  });

  const showMenuWithOverlay = menu => {
    menu.classList.toggle("show");
    const catalogMenuOverlay = document.createElement("div");
    catalogMenuOverlay.classList.add("menu-overlay");
    catalogMenuOverlay.addEventListener("click", () => {
      hideMenuWithOverlay(menu);
    });
    document.body.appendChild(catalogMenuOverlay);
    document.body.classList.add("has-overlay-menu");
  };

  const hideMenuWithOverlay = menu => {
    document.querySelectorAll(".menu-overlay").forEach(el => el.remove());
    menu.classList.remove("show");
    document.querySelectorAll(".burger-menu").forEach(el => {
      el.classList.remove("burger-menu--active");
      document.body.classList.remove("has-overlay-menu");
      document.body.classList.remove("has-overlay-main-menu");
    });
  };

  if (window.innerWidth < 769) {
    document
      .querySelectorAll(".main-menu__item--has-children > .main-menu__link")
      .forEach(el => {
        el.addEventListener("click", event => {
          let menuItem = el.closest(".main-menu__item");
          if (!menuItem.classList.contains("main-menu__item--open")) {
            menuItem.classList.add("main-menu__item--open");
            event.preventDefault();
          }
        });
      });
  }

  document.querySelectorAll(".shops__tab").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".shops__tab").forEach(el => {
        el.classList.remove("shops__tab--active");
      });
      document.querySelectorAll(".shops__tab-content").forEach(el => {
        el.classList.remove("shops__tab-content--active");
      });
      el.classList.add("shops__tab--active");
      const tabTarget = el.getAttribute("data-tab-target");
      document
        .querySelector(`[data-tab="${tabTarget}"]`)
        .classList.add("shops__tab-content--active");
    });
  });

  document
    .querySelectorAll(".catalog-left-menu__icon-has-children")
    .forEach(el => {
      el.addEventListener("click", () => {
        el.closest(".catalog-left-menu__item").classList.toggle(
          "catalog-left-menu__item--active"
        );
      });
    });

  document.querySelectorAll(".materials-item__more").forEach(el => {
    el.addEventListener("click", () => {
      el.classList.toggle("materials-item__more--open");

      el.closest(".materials-item")
        .querySelector(".materials-item__inner")
        .classList.toggle("materials-item__inner--open");
    });
  });

  if (document.getElementById("js__catalog-card-app") !== null) {
    const catalogCardApp = new Vue({
      el: "#js__catalog-card-app",
      data() {
        return {
          ...catalogCardAppParams,
          reviews: [],
          reviewsIsLastPage: false,
          reviewsNumPage: 2,
          selectYourSizeForm: false,
          selectedSize: null,
          boxinfo: false
        };
      },
      watch: {
        params: {
          immediate: true,
          deep: true,
          handler(newValue, oldValue) {
            this.$children.map(el => {
              el.setParams();
            });
            this.getPrice();
          }
        }
      },
      filters: {
        formatPrice: value => {
          let val = (value / 1).toFixed(0).replace(".", ",");
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
        }
      },
      methods: {
        hideProductOptions: function(elementTarget) {
          this.$children.forEach(el => {
            if (
              typeof el.toggled !== "undefined" &&
              !el.$el.contains(elementTarget)
            ) {
              el.toggled = false;
              el.isItemOpen = false;
            }
          });
        },

        selectYourSizeFormToggle() {
          this.selectYourSizeForm = !this.selectYourSizeForm;
        },
        getReviews(productID) {
          axios
            .post(
              "/local/templates/mebel/components/bitrix/catalog.element/detail/reviews_ajax.php",
              {
                PRODUCT_ID: productID,
                NUM_PAGE: this.reviewsNumPage
              }
            )
            .then(response => {
              this.reviewsNumPage += 1;
              const data = response.data;
              this.reviewsIsLastPage = data["IS_LAST_PAGE"];
              this.reviews.push(...data["REVIEWS"]);
            });
        },

        addToFavorite() {
          axios
            .post("/ajax/product.php", {
              qty: 1,
              params: Object.assign({}, this.params),
              method: "addFavorite"
            })
            .then(response => {
              const data = response.data;
              document.querySelector(
                ".block-user__item--favorite .block-user__counter"
              ).innerHTML = data.COUNT;
              this.isAddFavorite = data.IS_ADD_FAVORITE;
            });
        },
        addToCart() {
          axios
            .post("/ajax/product.php", {
              qty: 1,
              params: Object.assign({}, this.params),
              method: "addItem"
            })
            .then(response => {
              smallCartObject.refreshCart();
            });
        },
        getPrice() {
          axios
            .post("/ajax/product.php", {
              qty: 1,
              params: Object.assign({}, this.params),
              method: "getPrice"
            })
            .then(response => {
              const data = response.data;
              if (data) {
                this.price = data.VALUE;
                this.oldPrice = data.OLD_VALUE;
              }
            });
        }
      },
      mounted: function() {
        document.querySelectorAll(".card-tabs__tab-name").forEach(el => {
          el.addEventListener("click", () => {
            document.querySelectorAll(".card-tabs__tab-name").forEach(el => {
              el.classList.remove("card-tabs__tab-name--active");
            });
            document.querySelectorAll(".card-tabs__tab").forEach(el => {
              el.classList.remove("card-tabs__tab--active");
            });
            el.classList.add("card-tabs__tab-name--active");
            const tabTarget = el.getAttribute("data-tab-target");
            document
              .querySelector(`[data-tab="${tabTarget}"]`)
              .classList.add("card-tabs__tab--active");
          });
        });

        $('[data-fancybox="card-main-images"]').fancybox({
          loop: true,
          thumbs: {
            autoStart: true
          }
        });
        $(".card-thumb-images__item--all-images-btn").click(() => {
          $.fancybox.open($('[data-fancybox="card-main-images"]'), {
            loop: true,
            thumbs: {
              autoStart: true
            }
          });
        });
        $(".tooltip").tooltipster({
          theme: "tooltipster-shadow",
          maxWidth: 320,
          delay: 100,
          side: "left"
        });
        $(".tooltip-color").tooltipster({
          theme: "tooltipster-shadow",
          side: "left",
          maxWidth: 600,
          height: 600,
          arrow: false,
          distance: {
            left: 50
          }
        });

        //fix for bitrix ajax
        let paramsViewed = new URLSearchParams();
        paramsViewed.append("AJAX", "Y");
        paramsViewed.append("SITE_ID", this.params.SITE_ID);
        paramsViewed.append("PRODUCT_ID", this.params.PRODUCT_ID);
        paramsViewed.append("PARENT_ID", this.params.PRODUCT_ID);

        axios({
          url: "/bitrix/components/bitrix/catalog.element/ajax.php",
          method: "post",
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: paramsViewed
        }).then(response => {
          axios
            .post("/ajax/product.php", {
              method: "getViewedCount"
            })
            .then(response => {
              const data = response.data;
              if (data) {
                document.querySelector(
                  ".block-user__item--visited .block-user__counter"
                ).innerHTML = data.VIEWED_COUNT;
              }
            });
        });
      }
    });
  }

  // register modal component
  let modalTemplate = Vue.component("modal", {
    template: "#js__vue-app-forms-modal-template"
  });
  if (document.getElementById("js__vue-app-forms-modal") !== null) {
    document.querySelectorAll("[data-popup-form-id]").forEach(el => {
      el.addEventListener("click", () => {
        const popupFormID = el.getAttribute("data-popup-form-id");
        const custom_hidden = el.getAttribute("data-popup-form-hidden");

        (() => {
          fetch("/ajax/form.php", {
            method: "POST",
            body: JSON.stringify({
              form_id: popupFormID,
              custom_hidden: custom_hidden
            })
            //mode: 'cors', // no-cors, cors, *same-origin
          })
            .then(response => response.text())
            .then(strData => {
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
  $(".tooltip--sticker").tooltipster({
    theme: "tooltipster-shadow",
    maxWidth: 320,
    delay: 0,
    side: "top"
  });
};

if (document.readyState !== "loading") {
  domReady();
} else {
  document.addEventListener("DOMContentLoaded", domReady);
}
