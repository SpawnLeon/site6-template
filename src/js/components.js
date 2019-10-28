"use strict";

import Vue from 'vue';

Vue.component('v-select', {
  props: ['options', 'label', 'value', 'select'],
  template: `
  <div class="catalog-card__option card-option" :class="{'card-option--open':isItemOpen === true}">
        <div class="card-option__title" @click="onFocus">
            {{label}}
        </div>       
        <div class="card-option__inner" @click="onFocus">
             <div class="card-option__value">
                  <div class="card-option-item__image" v-if="mutableValue && mutableValue.PREVIEW_IMAGE">
                    <img :src="mutableValue.PREVIEW_IMAGE" alt="">
                  </div>
                  <div class="card-option-item__title" v-if="mutableValue">
                      {{mutableValue.NAME}}
                  </div>
              </div>

          <ul
                  ref="dropdown"
                  v-show="toggled"
                  v-if="options"
                  class="card-option__list list--clear">
              <li 
                
                    v-for="(item,index) in options" :class="{'card-option__item card-option-item':true,'card-option-item--selected':index === pointer}"
                  @mousedown="handleItemClick(item)"
                  @mouseover="pointer = index">
                  <div class="card-option-item__image" v-if="item && item.PREVIEW_IMAGE">
                    <img :src="item.PREVIEW_IMAGE" alt="">
                  </div>
                  <div class="card-option-item__title">
                      {{item.NAME}}
                  </div>
              </li>

          </ul>
        </div>

</div>`,
  data() {
    return {
      toggled: false,
      mutableValue: null,
      pointer: null,
      isItemOpen: false
    }
  },
  methods: {
    handleItemClick: function (item) {
      this.mutableValue = item;
      this.toggled = !this.toggled;
      this.isItemOpen = !this.isItemOpen;
      this.$parent.params[this.select.VAR_NAME] = item[this.select.VAR_NAME];

      this.$parent.getPrice()

    },
    onFocus: function () {
      this.toggled = !this.toggled;
      this.isItemOpen = !this.isItemOpen;

    },

  },
  mounted() {
    //TODO: select default option
    for (const prop in this.options) {
      this.mutableValue = this.options[prop];
      break;
    }
  }

});