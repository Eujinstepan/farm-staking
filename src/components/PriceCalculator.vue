<template>
  <b-modal v-model="isComponentModalActive">
    <div class="price-calculator-modal">
      <div class="columns is-mobile">
        <div class="column is-four-fifths">
          <p>$ Value calculator</p>
        </div>
        <div class="column cog-icon">
          <button
              type="button"
              class="delete"
              @click="closeModal()"/>
        </div>
      </div>

      <div class="boxed">
        <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
          <div>Target $ Value of {{mode === 1 ? fromToken.symbol : toToken.symbol}}</div>
          <div>
            <div class="token-value">
              <b-input
                  @input="onPriceChange"
                  @keydown.native="onNumberInputKeypress($event)"
                  v-model="value"
                  placeholder="0.0"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  :inputmode="'decimal'"
              ></b-input>
            </div>
          </div>
        </div>

        <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
          <div></div>
          <div class="usd-value" v-if="mode===1">
            Current (min): ${{ dollarValue }}
          </div>
          <div class="usd-value" v-if="mode===2">
            Current (max): ${{ dollarValue }}
          </div>
        </div>
      </div>

      <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center m-5 is-white">
        <template v-if="mode===1">
          <div>{{ toToken.symbol }} per {{ fromToken.symbol }}</div>
          <div>{{ fromTokenToToTokenRate }} <span @click="set(fromTokenToToTokenRate)" class="set-button">Set</span></div>
        </template>

        <template v-if="mode===2">
          <div>{{ fromToken.symbol }} per {{ toToken.symbol }}</div>
          <div>{{ fromTokenToToTokenRate }} <span @click="set(fromTokenToToTokenRate, true)" class="set-button">Set</span></div>
        </template>
      </div>

      <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center m-5 is-white">
        <template v-if="mode===1">
          <div>{{ fromToken.symbol }} per {{ toToken.symbol }}</div>
          <div>{{ toTokenToFromTokenRate }} <span @click="set(toTokenToFromTokenRate, true)" class="set-button">Set</span></div>
        </template>

        <template v-if="mode===2">
          <div>{{ toToken.symbol }} per {{ fromToken.symbol }}</div>
          <div>{{ toTokenToFromTokenRate }} <span @click="set(toTokenToFromTokenRate)" class="set-button">Set</span></div>
        </template>
      </div>

      <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center m-5 is-white">
        <div class="is-flex-grow-1">
          Calculated at constant {{mode === 1 ? toToken.symbol : fromToken.symbol}} value in $.<br/>
          You can also try a different
          <span class="set-button" v-if="mode === 1" @click="setCalculationMode(2)">$ value of {{toToken.symbol}}</span>
          <span class="set-button" v-else @click="setCalculationMode(1)">$ value of {{fromToken.symbol}}</span>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import BigNumber from "bignumber.js";

export default {
  name: "PriceCalculator",
  watch: {
    isComponentModalActive: {
      handler: function () {
        if (!this.isComponentModalActive) {
          this.value = undefined
          this.closeModal()
        }
        if(this.isComponentModalActive) {
          this.preSetValue()
        }
      },
    },
    value: {
      handler: function () {
        this.calculateAll()
      },
    },
    mode: {
      handler: function () {
        this.calculateAll()
      },
    }
  },
  data() {
    return {
      value: null,
      fromTokenToToTokenRate: 0,
      toTokenToFromTokenRate: 0,
    }
  },
  props: {
    isComponentModalActive: {
      type: Boolean,
      default: false,
    },
    fromToken: {
      type: Object,
      default: () => {}
    },
    toToken:  {
      type: Object,
      default: () => {}
    },
    fromTokenPrice:  {
      type: Number,
      default: null
    },
    toTokenPrice:  {
      type: Number,
      default: null
    },
    mode: {
      type: Number,
      default: 1
    },
    dollarValue: {
      type: String,
      default: '0'
    }
  },
  methods: {
    onPriceChange: function (){
      setTimeout(() => {
        let re =  new RegExp('^[0-9]*[.,]?[0-9]*$');
        if(this.value && !re.test(this.value)) {
          let output =  this.value.split('.');
          output = output.shift() + '.' + output.join('');
          this.value = output
        }
        this.value = this.value.replace(',', '.')
      }, 10)
    },
    onNumberInputKeypress(event) {
      let key = event.charCode || event.keyCode || 0;
      let isNumber =
          key === 8 ||
          key === 9 ||
          key === 13 ||
          key === 46 ||
          key === 110 ||
          key === 190 ||
          key === 37 ||
          key === 39 ||
          key === 188 ||
          (key >= 48 && key <= 57) ||
          (key >= 96 && key <= 105);
      if(!isNumber) {
        event.preventDefault();
      }
    },
    set(price, inverted = false) {
      this.$emit('set', price, inverted);
      this.closeModal()
    },
    calculateAll() {
      let from, to;
      if (this.mode === 1) {
        from = new BigNumber(this.value).dividedBy(this.toTokenPrice).decimalPlaces(6)
        to = new BigNumber(this.toTokenPrice).dividedBy(this.value).decimalPlaces(6)
        if(from.isNaN() || !from.isFinite()) {
          from = 0;
        }
        if(to.isNaN() || !to.isFinite()) {
          to = 0;
        }
      } else {
        from = new BigNumber(this.value).dividedBy(this.fromTokenPrice).decimalPlaces(6)
        to = new BigNumber(this.fromTokenPrice).dividedBy(this.value).decimalPlaces(6)
        if(from.isNaN() || !from.isFinite()) {
          from = 0;
        }
        if(to.isNaN() || !to.isFinite()) {
          to = 0;
        }
      }

      this.fromTokenToToTokenRate = from.toString(10)
      this.toTokenToFromTokenRate = to.toString(10)
    },
    setCalculationMode(mode) {
      this.$emit('onInvert', mode);
    },
    closeModal() {
      this.value = null
      this.$emit('close')
    },
    preSetValue() {
      if(this.mode === 1) {
        const offset = new BigNumber(this.dollarValue).multipliedBy(5).dividedBy(100)
        this.value = new BigNumber(this.dollarValue).plus(offset).toString(10)
      } else {
        const offset = new BigNumber(this.dollarValue).multipliedBy(5).dividedBy(100)
        this.value = new BigNumber(this.dollarValue).minus(offset).toString(10)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .price-calculator-modal {
    background-color: $dark;
    max-width: 470px;
    width: 90%;
    padding: 20px;
    margin: 20px auto 30px auto;
    border-radius: 31px;

    p {
      text-align: left;
      color: $white;
      padding: 20px 20px 10px 35px;
      font-weight: 900;
      font-size: 20px;
      line-height: 24px;
    }

    .token-value {
      line-height: 54px;
      width: 160px;
    }

    .boxed {
      max-width: 440px;
      width: 90%;
      font-weight: 500;
      font-size: 22px;
      line-height: 21px;
      padding: 10px;
      border-radius: 30px;
      margin: 5px auto;
      color: #ffffff;
      border: solid 1px transparent;
      background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(
              101deg, #12ab9e, #8d358b);
      background-origin: border-box;
      background-clip: content-box, border-box;
      box-shadow: 2px 1000px 1px #2c323f inset;
    }


    .cog-icon {
      margin-top:20px;
      cursor: pointer;
    }

    .is-white {
      color: white
    }

    .set-button {
      color: cornflowerblue;
      cursor: pointer;
      margin-right: 5px;
    }
  }

  @media screen and (max-width: 801px) {
    .price-calculator-modal {
      .boxed {
        width: 100%;
      }
    }
  }

  .usd-value {
    font-weight: 400;
    font-size: 15px;
    color: #c1c1c1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

</style>
