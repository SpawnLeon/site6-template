'use strict';

import Vue from 'vue';

Vue.component('v-select', {
  props: ['options', 'value', 'select', 'hardness'],
  template: `
<div class="card-option-item-wrapper" :disabled="isDisabled" :class="">
    <div 
        class="catalog-card__option card-option" 
        :class="{'card-option--open':isItemOpen === true, 'card-option--has-hardness': hardness, 'card-option--not-title': !select.NAME}">
        <div class="card-option__title" @click="onFocus" v-if="select.NAME">
            {{select.NAME}}
            <div class="tooltip card-option__tooltip" v-if="select.HINT_FORMATTED"  v-on:click="showInformation(select.HINT_FORMATTED)">?</div>
            
        </div>
        <div class="card-option__inner" @click="onFocus">
            <div class="card-option__value">
                <div class="card-option-item__image" v-if="selectedItem && selectedItem.PREVIEW_IMAGE">
                    <img :src="selectedItem.PREVIEW_IMAGE" alt="">
                </div>
                <div class="card-option-item__title" v-if="selectedItem">
                    {{selectedItem.NAME}} 
                    <span class="card-option-item__price" v-if="selectedItem.PRICE  && !hardness">{{selectedItem.PRICE | formatPrice}}</span>  
                </div>
            </div>

            <ul
                    ref="dropdown"
                    v-show="toggled"
                    v-if="options"
                    class="card-option__list list--clear">
                <li

                        v-for="(item,index) in options"
                        :class="{'card-option__item card-option-item':true,'card-option-item--selected':index === pointer}"
                        @mousedown="handleItemClick(item)"
                        @mouseover="pointer = index">
                    <div class="card-option-item__image" v-if="item && item.PREVIEW_IMAGE">
                        <img :src="item.PREVIEW_IMAGE" alt="" class="tooltip-color" :data-tooltip-content="'#detail-colors-list-item-' + select.VAR_NAME + item.ORIGINAL_ID">
                        <div class="tooltip_templates card-option-item__tooltip" hidden>
                            <div :id="'detail-colors-list-item-' + select.VAR_NAME + item.ORIGINAL_ID" style="min-width: 600px; min-height: 610px;">
                                <img v-lazy="item.FULL_IMAGE" class="img-fluid">
                            </div> 
                        </div>
                    </div>
                    <div class="card-option-item__title">
                        {{item.NAME}} 
                        <span  class="card-option-item__price" v-if="item.PRICE && !hardness">{{item.PRICE | formatPrice}}</span>     
                    </div>
                </li>

            </ul>
        </div>
        
    </div>
    <div v-if="select.VAR_NAME === 'PROP_BED_BOX' && selectedItem.TYPE != 924" class="card-option-item__qty qty-widget">
            <button v-on:click="qtyWidgetAction('minus')" type="button" class="qty-widget__btn qty-widget__minus btn--clear">
                <svg width="11" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H1.929" stroke="#767676" stroke-width="2" stroke-linecap="round"></path>
                </svg>
            </button>
            <input type="text" class="qty-widget__count" v-model="selectedItemCount" readonly>
            <button v-on:click="qtyWidgetAction('plus')" type="button" class="qty-widget__btn qty-widget__plus btn--clear">
                <svg width="11" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.904 4.932l-3.39.033m0 0l.032-3.419m-.033 3.42L1.93 5m3.584-.035L5.48 8.521"
                          stroke="#767676" stroke-width="2" stroke-linecap="round"></path>
                </svg>
            </button>
        </div>
        <div class="hardness-wrapper" v-if="hardness" v-html="hardness"></div>
</div>
  `,
  data() {
    return {
      toggled: false,
      pointer: null,
      isItemOpen: false,
      selectedItem: {},
      selectedItemCount: 0,
      isDisabled: false,
      maxItemCount: null,
    };
  },
  methods: {
    handleItemClick: function(item) {
      let boxComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'PROP_BED_BOX';
        }
      });
      let bedComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'ID';
        }
      });
      let gradeComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'PROP_BED_GRADE';
        }
      });

      this.selectedItem = item;
      if (!this.isDisabled) {
        this.toggled = !this.toggled;
        this.isItemOpen = !this.isItemOpen;
      }

      if (typeof boxComponent[0] !== 'undefined') {
        if (typeof item.TYPE !== 'undefined') {
          //if selected grade  lift then disable boxes
          if (item.TYPE === '1302') {
            boxComponent[0].selectedItem = boxComponent[0].select.ITEMS.box_924;
            boxComponent[0].isDisabled = true;
          } else {
            boxComponent[0].isDisabled = false;
          }
        }

        this.setMaxBoxesCount();
      }

      this.setParams();
    },
    showInformation: function(content) {
      this.$parent.popupInformation = true;
      this.$parent.popupInformationContent = content;
    },
    onFocus: function() {
      if (!this.isDisabled) {
        this.toggled = !this.toggled;
        this.isItemOpen = !this.isItemOpen;
      }
    },
    setParams: function() {
      const item = this.selectedItem;
      switch (this.select.VAR_NAME) {
        case 'PROP_BED_BOX':
          if (this.selectedItem.TYPE === '924') {
            this.selectedItemCount = 0;
          } else {
            if (this.selectedItemCount < 1) {
              this.selectedItemCount = 1;
            }
          }
          this.$set(
            this.$parent.params,
            this.select.VAR_NAME,
            item.ITEMS[this.selectedItemCount].ID,
          );
          break;
        case 'PROP_BED_GRADE':
          const currentBedSizeID = this.$parent.params.ID;
          const currentBedInfo = this.$parent.optionSelects
            .filter((el) => el['VAR_NAME'] === 'ID')
            .pop()
            .ITEMS.filter((el) => el.ID === currentBedSizeID)
            .pop();
          const bedXmlID = currentBedInfo.XML_ID;
          this.$set(
            this.$parent.params,
            this.select.VAR_NAME,
            item.ITEMS[bedXmlID],
          );
          break;
        default:
          this.$set(this.$parent.params, this.select.VAR_NAME, item.ID);
      }
    },
    qtyWidgetAction: function(action) {
      let newCount = this.selectedItemCount;

      switch (action) {
        case 'minus':
          newCount =
            this.selectedItemCount - 1 > 0 ? (this.selectedItemCount -= 1) : 1;
          break;
        case 'plus':
          newCount =
            this.selectedItemCount + 1 > this.maxItemCount
              ? this.maxItemCount
              : (this.selectedItemCount += 1);
          break;
      }
      this.selectedItemCount = newCount;
    },
    setMaxBoxesCount: function() {
      let boxComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'PROP_BED_BOX';
        }
      });
      let bedComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'ID';
        }
      });
      let gradeComponent = this.$parent.$children.filter((el) => {
        if (typeof el.select !== 'undefined') {
          return el.select.VAR_NAME === 'PROP_BED_GRADE';
        }
      });
      if (
        typeof boxComponent[0] !== 'undefined' &&
        typeof bedComponent[0] !== 'undefined'
      ) {
        const sizesHaveOnlyTwoBoxes = ['Ho18IsCj', 'i6HDSbqj', 'xoBplZnY'];
        if (
          sizesHaveOnlyTwoBoxes.includes(bedComponent[0].selectedItem.XML_ID)
        ) {
          boxComponent[0].maxItemCount = 2;
          boxComponent[0].selectedItemCount = 2;
        } else {
          boxComponent[0].maxItemCount = Object.keys(
            boxComponent[0].selectedItem.ITEMS,
          ).length;
        }
      }
    },
  },
  mounted() {},
  created() {
    //TODO: select default option
    for (const prop in this.select.ITEMS) {
      this.selectedItem = this.select.ITEMS[prop];
      break;
    }
    this.setMaxBoxesCount();
    this.setParams();
  },
  watch: {
    selectedItemCount: function() {
      this.setParams();
    },
  },
  filters: {
    formatPrice: (value) => {
      if (String(value).includes('%')) {
        return value;
      }
      let val = (value / 1).toFixed(0).replace('.', ',');
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
    },
  },
});

Vue.component('v-checkbox-product-option', {
  props: ['option'],
  template: `
   <div class="mattress-add-options__item">
      <label class="custom-checkbox">
          <input 
                  v-on:change="mattressAddChecked"
                  v-model="checked"
                  type="checkbox" class="custom-checkbox__field">
            <span class="custom-checkbox__label">
            <span>{{option.NAME}} <span v-if="option.CURRENT && option.CURRENT.PRICE > 0">(+{{option.CURRENT.PRICE}} ₽)</span></span>
            <span v-if="option.HELP"
                   :title="option.HELP"
                   class="mattress_help tooltip">?</span>
            </span>
      </label>
  </div>
  `,
  data() {
    return {
      checked: false,
      selectedItem: {},
    };
  },
  methods: {
    mattressAddChecked: function(item) {
      this.setParams();
    },
    setParams: function() {
      const currentBedSizeID = this.$parent.params.ID;
      const currentBedInfo = this.$parent.optionSelects
        .filter((el) => el['VAR_NAME'] === 'ID')
        .pop()
        .ITEMS.filter((el) => el.ID === currentBedSizeID)
        .pop();
      const bedXmlID = currentBedInfo.XML_ID;
      let needValue = null;
      if (typeof bedXmlID !== undefined) {
        this.option.CURRENT = this.option.ITEMS[bedXmlID];
        if (this.checked === true) {
          needValue = this.option.CURRENT.ID;
        }
        this.$set(this.$parent.params, this.option.VAR_NAME, needValue);
      }
    },
  },
  mounted() {
    this.setParams();
  },
  watch: {},
});
