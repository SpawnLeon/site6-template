"use strict";

import Vue from 'vue';

Vue.component('v-select', {
  props: ['options', 'label', 'value'],
  template: `
  <div class="catalog-card__option card-option">
    <div class="card-option__inner">
        <div class="card-option__selected" @click="onFocus">
            {{label}}
        </div>
        <p class="control has-icon has-icon-right">
            <input ref="selected" @keyup="filterSelect($event)" @focus="onFocus" v-model="mutableValue" type="text"
                   class="form-control"
                   @keydown.up.prevent="onKeyUp"
                   @blur="onBlur"
                   @keydown.down.prevent="onKeyDown" @keydown.enter.prevent="onKeyEnter">
        </p>
        <ul
                ref="dropdown"
                v-show="toggled"
                v-if="options"
                class="card-option__list list--clear">
            <li v-for="(item,index) in filterList" :class="{'card-option__item card-option-item':true,_selected:index === pointer}"
                @mousedown="handleItemClick(item)"
                @mouseover="pointer = index">
                <div class="card-option-item__image">
                  <img :src="item.PREVIEW_IMAGE" alt="">
                </div>
                <div class="card-option-item__title">
                    {{item.NAME}}
                </div>
            </li>

        </ul>

    </div>
</div>
  `,
  data() {
    return {
      selected: null,
      toggled: false,
      filterList: [],
      mutableValue: null,
      mutableOptions: [],
      pointer: 0
    }
  },
  methods: {
    filterSelect: function (key) {
      if (!this.toggled) this.toggled = !this.toggled;
      let oldArr = this.options;
      if (this.mutableValue && this.mutableValue.length <= 0)
        this.filterList = this.mutableOptions;
      else if (key.key.length == 1 || key.key == 'Backspace') {
        oldArr = oldArr.filter(item => {
          if (item.toLowerCase().includes(this.mutableValue.toLowerCase()))
            return true;
        });
        this.filterList = oldArr;
        //console.log('type', this.filterList)
      }
      // if (key.key == 'Enter')
      //     this.toggled = !this.toggled;
      this.$emit('input', this.mutableValue);
    },
    handleItemClick: function (item) {
      this.mutableValue = item;
      this.$emit('input', item);
      this.toggled = !this.toggled;
    },
    onFocus: function () {
      this.$refs.dropdown.scrollTop = 0;
      this.toggled = !this.toggled;
    },
    onBlur: function () {
      this.toggled = false;
    },
    onKeyUp: function () {
      if (this.pointer > 0) this.pointer--;
      if (this.maybeAdjustScroll) {
        this.maybeAdjustScroll()
      }
    },
    onKeyDown: function () {
      if (this.pointer < this.options.length && this.filterList.length) this.pointer++;
      if (this.pointer == this.options.length) this.pointer = 0;
      if (this.maybeAdjustScroll) {
        this.maybeAdjustScroll()
      }
    },
    onKeyEnter: function () {
      //console.log(this.filterList.length> 0);
      if (this.filterList.length > 0)
        this.handleItemClick(this.filterList[this.pointer])
      this.$refs.selected.blur();
      this.$emit('input', this.mutableValue);
      this.toggled = false;
    },
    maybeAdjustScroll() {
      let pixelsToPointerTop = this.pixelsToPointerTop()
      let pixelsToPointerBottom = this.pixelsToPointerBottom()
      //console.log(pixelsToPointerTop,pixelsToPointerBottom);
      if (pixelsToPointerTop <= this.viewport().top) {
        return this.scrollTo(pixelsToPointerTop)
      } else if (pixelsToPointerBottom >= this.viewport().bottom) {
        return this.scrollTo(this.viewport().top + this.pointerHeight())
      }
    },

    pixelsToPointerTop() {
      let pixelsToPointerTop = 0
      if (this.$refs.dropdown && this.$refs.dropdown.children) {
        for (let i = 0; i < this.pointer; i++) {
          pixelsToPointerTop += this.$refs.dropdown.children[i].offsetHeight
        }
      }
      return pixelsToPointerTop
    },

    pixelsToPointerBottom() {
      return this.pixelsToPointerTop() + this.pointerHeight()
    },

    pointerHeight() {
      let element = this.$refs.dropdown ? this.$refs.dropdown.children[this.pointer] : false
      return element ? element.offsetHeight : 0
    },

    viewport() {
      return {
        top: this.$refs.dropdown ? this.$refs.dropdown.scrollTop : 0,
        bottom: this.$refs.dropdown ? this.$refs.dropdown.offsetHeight + this.$refs.dropdown.scrollTop : 0
      }
    },
    scrollTo(position) {
      //console.log(position);
      return this.$refs.dropdown ? this.$refs.dropdown.scrollTop = position : null
    },

  },
  mounted() {
    this.filterList = this.options;
  },
  watch: {
    value(val) {
      this.mutableValue = val
    },
    options(val) {
      this.mutableOptions = val
    },
    pointer() {
      this.maybeAdjustScroll()
    }

  }
});