<template>
  <div class="column is-2-fullhd is-3-desktop is-3-tablet order-book">
    <div class="columns is-gapless pb-0 mb-0 box-border">
      <div class="column is-12 padding-bottom pb-0 mb-0">
        <div class="block-title is-flex is-justify-content-space-between">
          <div class="text-ellipsis">DeFi Order Book</div>
          <div class="order-book-dropdown is-relative">
            <span @click="togglePercentageDropdown()">
              {{ selectedPercentage }}%
              <b-icon icon="chevron-down" style="position: relative;top:5px;"></b-icon>
            </span>
            <div class="dropdown-content pr-4" v-if="percentageDropdownActive">
              <div class="drop-title"><i>Price interval</i></div>
              <div @click="setPercentage(1)" v-bind:class="{ active: selectedPercentage === 1 }">1%</div>
              <div @click="setPercentage(2)" v-bind:class="{ active: selectedPercentage === 2 }">2%</div>
              <div @click="setPercentage(3)" v-bind:class="{ active: selectedPercentage === 3 }">3%</div>
              <div @click="setPercentage(5)" v-bind:class="{ active: selectedPercentage === 5 }">5%</div>
              <div @click="setPercentage(9)" v-bind:class="{ active: selectedPercentage === 9 }">9%</div>
            </div>
          </div>
        </div>

        <div class="columns table-data is-mobile">
          <div class="column ml-4 header is-one-quarter has-text-left nowrap">{{ getMidPrice(midOfOrderBook.token0Symbol, midOfOrderBook.token1Symbol) }}/{{ getMidPrice(midOfOrderBook.token1Symbol, midOfOrderBook.token0Symbol) }}</div>
          <div class="column pr-2 header is-one-third has-text-right nowrap">$price</div>
          <div class="column pr-4 header has-text-right nowrap">$value</div>
        </div>

        <div>
          <div style="min-height: 240px">
            <!--RED ORDER BOOK / TOP HALF / ASKS -->
            <div style="position: relative">
              <div class="progress-bar ask" style="" v-for="(order, index) in topOfOrderBook" :key="index" v-bind:style="{ top: index * 23.5 + 'px', width: getProgressBarWidth(order) }"></div>
            </div>
            <div class="columns is-mobile order-book-row" v-for="(order, index) in topOfOrderBook" :key="index" @click="setTokenPrice(order)">
              <div class="column ml-4 is-one-quarter order-book-danger pt-0 has-text-left" :title="getPriceTokens(order) | formatPrice(6)" :id="index">{{ getPriceTokens(order) | intlFormat() }}</div>
              <div class="column pr-2 is-one-third order-book-info pt-0 has-text-right" :title="getPrice(order) | formatPrice(6)">{{ getPrice(order) | intlFormat() }}</div>
              <div class="column pr-4 order-book-info pt-0 has-text-right is-relative " :title="order.usdValue | formatPrice(6)">
                {{ order.usdValue | intlFormat()}}
              </div>
            </div>
          </div>

          <!--MORE ORDER BOOK / MIDDLE / CURRENT -->
          <div class="columns is-mobile mt-1 mb-5 ml-0 mr-0 more-block">
            <div class="column ml-4 is-one-quarter order-book-info is-size-6 pt-0 pb-1 pl-0 has-text-left" :title="getMidPrice(midOfOrderBook.token0Price, midOfOrderBook.token1Price) | formatPrice(6)">
              {{getMidPrice(midOfOrderBook.token0Price, midOfOrderBook.token1Price) | intlFormat()}}
            </div>
            <div class="column is-one-third order-book-info-dark is-size-6 pt-0 pb-1 pl-0 pr-2 mr-0 has-text-right" :title="getMidValue(midOfOrderBook.price0USD, midOfOrderBook.price1USD) | formatPrice(6)">
              {{getMidValue(midOfOrderBook.price0USD, midOfOrderBook.price1USD) | intlFormat()}}
            </div>
            <div
                class="column order-book-info-dark is-size-6 pt-0 pb-5 pl-0 pr-4 has-text-right is-relative more-button" title="More">
              <!--            <div style="position: absolute; background-color: #ef535040; height: 15px; width: 200px; left: -95px"></div>-->
              <a :href="getPoolUrl()" target="_blank">More</a>
            </div>
          </div>

          <!--GREEN ORDER BOOK / BOTTOM HALF / BIDS -->
          <div>
            <div style="position: relative">
              <div class="progress-bar bid" v-for="(order, index) in bottomOfOrderBook" :key="index" v-bind:style="{ top: index * 23.5 + 'px', width: getProgressBarWidth(order) }"></div>
            </div>
            <div class="columns is-mobile order-book-row" v-for="(order, index) in bottomOfOrderBook" :key="index" @click="setTokenPrice(order)">
              <div class="column ml-4 is-one-quarter order-book-success pt-0 pb-1 has-text-left" :id="index" :title="getPriceTokens(order) | formatPrice(6)">{{ getPriceTokens(order) | intlFormat() }}</div>
              <div class="column is-one-third order-book-info pr-2 pt-0 pb-1 has-text-right" :title="getPrice(order) | formatPrice(6)">{{ getPrice(order) | intlFormat() }}</div>
              <div class="column order-book-info pr-4 pt-0 pb-1 has-text-right is-relative " :title="order.usdValue | formatPrice(6)">
                {{ order.usdValue | intlFormat()}}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    <div class="columns is-gapless fixed-height">
      <div class="column is-12">
        <swap :mode="1" :pool="pool" :rate="rate" class="is-hidden-mobile"></swap>
        <value :mode="1" :from-token="fromToken" class="is-hidden-mobile" :label-enabled="true"></value>
        <div class="box-border empty-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Swap from "./Swap";
import Value from "./Value";
import BlockchainHelper from "../../utils/blockchain";
import BigNumber from "bignumber.js";
export default {
  name: "OrderBook",
  props: {
    topOfOrderBook: Array,
    bottomOfOrderBook: Array,
    fromToken: Object,
    midOfOrderBook: Object,
    pool: undefined,
    rate: undefined
  },
  components: {Value, Swap},
  watch: {
    fromToken: {
      deep: true,
      handler: async function (val) {
        let list = await new BlockchainHelper().getTokensList()
        let toTokenAddress = await new BlockchainHelper().getProViewToToken(val)
        this.toToken = list.filter((el) => {
          return el.address.toLowerCase() === toTokenAddress.toLowerCase()
        })[0]
      }
    }
  },
  data() {
    return {
      percentageDropdownActive: false,
      selectedPercentage: 1,
      toToken: {}
    }
  },
  methods: {
    togglePercentageDropdown() {
      this.percentageDropdownActive = !this.percentageDropdownActive
    },
    setPercentage(value) {
      this.selectedPercentage = value
      this.togglePercentageDropdown()
      this.$emit('update-gap-percent', value)
    },
    getPoolUrl() {
      if(this.pool){
        return 'https://info.uniswap.org/#/pools/' + this.pool
      }
      return '#'
    },
    getPrice(order) {
      if(this.fromToken && this.fromToken.address && this.toToken && this.toToken.address) {
        if (this.fromToken.address < this.toToken.address) {
          return order.price0USD
        } else {
          return order.price1USD
        }
      }
    },
    getPriceTokens(order) {
      if(this.fromToken && this.fromToken.address && this.toToken && this.toToken.address) {
        if (this.fromToken.address > this.toToken.address || (this.fromToken.address.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && this.toToken.address.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7')) {
          return order.priceTarget
        } else {
          return order.invertedPriceTarget
        }
      }
    },
    getMidPrice(left, right) {
      if(this.fromToken && this.fromToken.address && this.toToken && this.toToken.address) {
        //eth/usdt wants the opposite direction
        if (this.fromToken.address > this.toToken.address || (this.fromToken.address.toLowerCase() === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' && this.toToken.address.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7')) {
          return right
        } else {
          return left
        }
      }
    },
    getMidValue(left, right) {
      if(this.fromToken && this.fromToken.address && this.toToken && this.toToken.address) {
        if (this.fromToken.address > this.toToken.address) {
          return right
        } else {
          return left
        }
      }
    },
    setTokenPrice(order){
      const price = this.getPriceTokens(order)
      if(this.fromToken.address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
          this.$store.dispatch('setProViewSellValue', price.toString(10))
          this.$store.dispatch('setProViewBuyValue', new BigNumber(1).dividedBy(price).toString(10))
      } else {
          this.$store.dispatch('setProViewBuyValue', price.toString(10))
          this.$store.dispatch('setProViewSellValue', new BigNumber(1).dividedBy(price).toString(10))
      }
    },
    getProgressBarWidth(order) {
      let maxWidth = 8
      if(window.innerWidth < 769) {
        maxWidth = 20
      }
      return maxWidth - ((maxWidth * (100 - order.sharePercent)) / 100) + 'vw';
    }
  }
}
</script>

<style scoped lang="scss">
@media screen and (min-width: 700px) {
  .order-book {
    height: 620px !important;
  }
}
.order-book {
  @media screen and (min-width: 700px) {
    .fixed-height {
      height: 460px;
    }
  }

  & > div {
    height: 100%;
  }

  .block-title {
    text-align: left;
    font-size: 18px;
    color: #26a69a;
    font-weight: 600;
    background-color: #282e41;
    padding: 6px 6px 6px 15px;
    border: 1px solid #262b3a;

    &.light {
      color: #00fcde;
      background-color: unset;
      border: none;
    }

    .order-book-dropdown {
      font-size: 15px;
      color: white;
      font-weight: 400;
      cursor: pointer;
      margin-right: 0.5vw;
      margin-top: 0;
      min-width: fit-content;
      position: relative;
      top: -3px
    }
  }

  .box-border {
    border: 1px solid #262b3a;
    background: #1f2330;
  }

  .empty-box {
    height: 51px;
    border-right: none;
  }

  .padding-bottom {
    padding-bottom: 0.75rem !important;
  }

  .table-data {
    margin-top: 10px;

    .header {
      color: #95a0af;
      font-weight: 500;
      font-size: 14px;
    }
  }

  .order-book-danger {
    color: #ef5350;
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-book-info {
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-book-info-dark {
    color: #96a1af;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-book-success {
    color: #26a69a;
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .order-book-row{
    height: 23.5px;
    &:hover {
      cursor: pointer;
    }
  }

  .more-block {
    border-top: 1px solid #262b3a;
    border-bottom: 1px solid #262b3a;
    height: 25px;

    .more-button {
      right: -10px;
      color: #8d358b !important;
    }
  }

  .dropdown-content {
    background-color: #1f2330;
    border-radius: 10px;
    height: 180px;
    position: absolute;
    width: 140px;
    top: 35px;
    left: -20px;
    z-index: 9999;
    border: 1px solid #2f3548;
    text-align: right;

    div {
      padding-left: 20px;
      line-height: 22px;
    }

    div:first-child {
      padding-top: 10px;
    }

    .drop-title {
      text-align: left;
      padding-bottom: 8px;
    }

    .active {
      color: #26a69a;
      font-weight: 400;
    }
  }

  .text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .nowrap {
    white-space: nowrap;
  }

  .progress-bar {
    position: absolute;
    height: 18px;
    right: 0;
  }
  .ask {
    background-color: #ef535040;
  }
  .bid {
    background-color: #26a69a40;;
  }
}
</style>