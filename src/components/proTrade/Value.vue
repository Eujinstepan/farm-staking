<template>
  <div class="value box-border pl-2 pr-2">
    <div class="columns is-mobile mt-0 pt-0 pb-0 mb-0 container-top-border" v-bind:class="{ 'is-invisible': !labelEnabled  }">
      <div class="column trade-label pb-0 mb-3 ml-2 m-0">$ Value</div>
    </div>
    <div class="columns is-mobile pl-4 pr-4 mt-0">
      <div class="column trade-label mt-0 pt-0">
        <div class="is-flex is-justify-content-space-between input-container">
          <b-input @keydown.native="onNumberInputKeypress($event)" :placeholder="placeholder" v-model="price"></b-input>
          <div class="token-label"><a @click="setDollarPrice()">Set</a></div>
          <div class="token-label">$</div>
        </div>


        <div class="is-flex is-justify-content-space-between mt-1">
          <div class="pl-3 max-min-label">Current: ${{ mode === 1 ? fromTokenPrice : toTokenPrice }} per {{ mode === 1 ? fromToken.symbol : toToken.symbol }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import BlockchainHelper from "../../utils/blockchain";
import ApiClient from "../../utils/apiClient";
import _ from "lodash";
import BigNumber from "bignumber.js";
import store from "../../store";

export default {
  name: "Value",
  store,
  props: {
    labelEnabled: Boolean,
    fromToken: Object,
    mode: Number,
  },
  watch: {
    fromToken: {
      deep: true,
      handler: async function() {
        await this.init()
      }
    }
  },
  data () {
    return {
      toToken: {},
      fromTokenPrice: undefined,
      toTokenPrice: undefined,
      dollarValue: undefined,
      price: undefined,
      placeholder: undefined
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      if(this.fromToken && this.fromToken.address) {
        let list = await new BlockchainHelper().getTokensList()
        let toTokenAddress = await new BlockchainHelper().getProViewToToken(this.fromToken)
        if(toTokenAddress) {
          this.toToken = await list.filter((el) => {
            return el.address.toLowerCase() === toTokenAddress.toLowerCase()
          })[0]
          let prices = (await new ApiClient().getPricesUSD(this.fromToken.id))
          this.fromTokenPrice = _.get(prices, "0.current_price", 0);
          prices = (await new ApiClient().getPricesUSD(this.toToken.id))
          this.toTokenPrice = _.get(prices, "0.current_price", 0);
          if (this.mode === 1) {
            this.dollarValue = new BigNumber(this.fromTokenPrice).decimalPlaces(18).toString(10)
          } else {
            this.dollarValue = new BigNumber(this.toTokenPrice).decimalPlaces(18).toString(10)
          }
          this.placeholder = '$ per ' + (this.mode === 1 ? this.fromToken.symbol : this.toToken.symbol)
        }
        this.preSetValue()
      }
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
      if (!isNumber) {
        event.preventDefault();
      }
    },
    setDollarPrice() {
      let toSet
      if(this.mode === 1) {
        toSet = new BigNumber(this.toTokenPrice).dividedBy(this.price).decimalPlaces(6)
        if(toSet.isNaN() || !toSet.isFinite()) {
          toSet = 0;
        }
        this.$store.dispatch('setProViewBuyValue', toSet.toString(10))
        this.$store.dispatch('setProViewSellValue', new BigNumber(1).dividedBy(toSet).toString(10))
      } else {
        toSet = new BigNumber(this.fromTokenPrice).dividedBy(this.price).decimalPlaces(6)
        if(toSet.isNaN() || !toSet.isFinite()) {
          toSet = 0;
        }
        this.$store.dispatch('setProViewSellValue', toSet.toString(10))
        this.$store.dispatch('setProViewBuyValue', new BigNumber(1).dividedBy(toSet).toString(10))
      }
    },
    preSetValue() {
      if(this.mode === 1) {
        let offset = new BigNumber(this.dollarValue).multipliedBy(5).dividedBy(100)
        this.price = new BigNumber(this.dollarValue).minus(offset).toString(10)
      } else {
        let offset = new BigNumber(this.dollarValue).multipliedBy(5).dividedBy(100)
        this.price = new BigNumber(this.dollarValue).plus(offset).toString(10)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.value {
  height: 150px;
  .box-border {
    border: 1px solid #262b3a;
    background: #1f2330;
  }
  .trade-label {
    color: #26a69a;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    margin-top: 20px;
  }
  .input-container {
    background: #2c323f;
    border-radius: 10px;
  }
  .container-top-border {
    border-top: 1px solid #262b3a
  }
  .max-min-label {
    font-size: 15px;
    color: #626e7e;
    font-weight: 500;
    white-space: nowrap;
  }
  .token-label {
    color: white;
    position: relative;
    right: 10px;
    top: 8px;
    width: 30px;
    margin-left: 5px;

    a {
      color: #6495ed !important;
      font-size: 16px;
      text-decoration: underline;
      font-weight: 500;
    }
  }
}
</style>