<template>
  <div class="pro-trade">
    <div class="columns is-gapless mb-0">
      <trading-view :from-token="fromToken" :orders="orders" :token-data="tokenData"></trading-view>
      <swap :mode="1" :pool="pool" :rate="rate" class="is-hidden-tablet mt-3"></swap>
      <value :mode="1" :from-token="fromToken" class="is-hidden-tablet" :label-enabled="true"></value>
      <swap :mode="2" :pool="pool" :rate="rate" class="is-hidden-tablet"></swap>
      <value :mode="2" :from-token="fromToken" class="is-hidden-tablet" :label-enabled="true"></value>
      <change-token @update="updatePage" class="is-hidden-tablet"></change-token>
      <orders :orders="orders" @update-orders="updateOrders" class="is-hidden-tablet"></orders>
      <order-book @update-gap-percent="updateGapPercent" :top-of-order-book="topOfOrderBook" :bottom-of-order-book="bottomOfOrderBook" :mid-of-order-book="midOfOrderBook" :pool="pool" :from-token="fromToken" :rate="rate"></order-book>
      <recent-trades @update="updatePage" :swaps="swaps" :from-token="fromToken" :pool="pool" :feeTier="feeTier" :rate="rate"></recent-trades>
    </div>
  </div>
</template>

<script>
import TradingView from "../components/proTrade/TradingView";
import OrderBook from "../components/proTrade/OrderBook";
import RecentTrades from "../components/proTrade/RecentTrades";
import Swap from "../components/proTrade/Swap";
import Value from "../components/proTrade/Value";
import Orders from "../components/proTrade/Orders";
import ApiClient from "../utils/apiClient";
import BlockchainHelper from "../utils/blockchain";
import ChangeToken from "../components/proTrade/ChangeToken";

const REQUESTS = 3
const INTERVAL = 60000

export default {
  name: "ProTrade",
  components: {ChangeToken, Orders, Value, Swap, RecentTrades, OrderBook, TradingView},
  data() {
    return {
      orders: [],
      pool: null,
      rate: null,
      feeTier: null,
      topOfOrderBook: [],
      bottomOfOrderBook: [],
      midOfOrderBook: {},
      tokenData: {},
      swaps: [],
      fromToken: {},
      gapPercent: 0.01
    }
  },
  async mounted() {
    await this.getFromToken()
    this.loadingComponent = this.$buefy.loading.open()
    this.requests = REQUESTS
    this.chainId = await new BlockchainHelper().getChainId()
    this.address = await new BlockchainHelper().getAddress()
    await this.init()
    // this.loadingComponent.close()
    this.interval = setInterval(async () => {
      await this.init()
    }, INTERVAL)
  },
  destroyed() {
    clearTimeout(this.interval)
  },
  methods: {
    getOrders() {
      new ApiClient().getTrades(this.address).then((response) => {
        this.orders = response
        this.requests--
        if (this.requests === 0) {
          this.loadingComponent.close()
        }
      }, this.handleError)
    },
    async getPool() {
      let tokensList = await new BlockchainHelper().getProVIewTokensList()
      const tokenInfo = tokensList.filter((el) => {
        return el.address === this.fromToken.address && el.pool !== undefined
      })[0]
      this.pool = tokenInfo.pool
      this.feeTier = tokenInfo.feeTier
    },
    getMidOfOrderBook() {
      new ApiClient().getMidOfOrderBook(this.pool, this.chainId).then((response) => {
        this.midOfOrderBook = response.data
        this.requests--
        if (this.requests === 0) {
          this.loadingComponent.close()
        }
      }, (error) => {
        this.$log.error(error)
        this.requests--
        if (this.requests === 0) {
          this.loadingComponent.close()
        }
      })
    },
    getSwaps() {
      new ApiClient().getSwaps(this.pool, this.chainId).then((response) => {
        this.swaps = response.data
        this.requests--
        if (this.requests === 0) {
          this.loadingComponent.close()
        }
      }, this.handleError)
    },
    getTokenData() {
      new ApiClient().getTokenInfoFull(this.$route.params.fromAddress, this.pool, this.chainId).then((response) => {
        this.tokenData = response.data
      }, (error) => {
        this.$log.error(error)
      })
    },
    async init() {
      try {
        await this.getPool()
        const toTokenAddress = await new BlockchainHelper().getProViewToToken(this.fromToken)
        this.rate = (await new ApiClient().getPool(this.fromToken.address, toTokenAddress, await new BlockchainHelper().getChainId())).data.rate
        this.getMidOfOrderBook()
        this.getSwaps()
        this.getOrders()
        this.getTokenData()
        await this.getTopAndBottomOfOrderBook()
      } catch (ex) {
        this.$log.error(ex)
        this.loadingComponent.close()
        this.$buefy.toast.open({
          duration: 5000,
          message: `An error occurred, please try again`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },
    handleError(error) {
      this.$log.error(error)
      this.requests = 0
      this.$buefy.toast.open({
        duration: 5000,
        message: `An error occurred, please try again`,
        position: 'is-bottom',
        type: 'is-danger'
      })
      this.loadingComponent.close()
    },
    updateGapPercent(value) {
      this.gapPercent = value / 100
      this.loadingComponent = this.$buefy.loading.open()
      this.requests = 1
      this.getTopAndBottomOfOrderBook()
    },
    async updatePage() {
      this.loadingComponent = this.$buefy.loading.open()
      this.requests = REQUESTS
      await this.getFromToken()
      await this.init()
    },
    async getFromToken() {
      const fromAddress = this.$route.params.fromAddress
      this.fromToken = (await new BlockchainHelper().getTokensList()).filter((el) => {
        return el.address === fromAddress
      })
      this.fromToken = this.fromToken[0]
    },
    async updateOrders(){
      await this.getOrders()
    },
    async getTopAndBottomOfOrderBook() {
      let topOfOrderBookResponse = await new ApiClient().getTopOfOrderBook(this.pool, this.gapPercent, this.chainId)
      let bottomOfOrderBookResponse = await new ApiClient().getBottomOfOrderBook(this.pool, this.gapPercent, this.chainId)

      if (this.fromToken.address <= '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        this.bottomOfOrderBook = bottomOfOrderBookResponse.data
      } else {
        this.topOfOrderBook = bottomOfOrderBookResponse.data.reverse()
      }
      if (this.fromToken.address <= '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
        this.topOfOrderBook = topOfOrderBookResponse.data.reverse()
      } else {
        this.bottomOfOrderBook = topOfOrderBookResponse.data
      }

      this.requests--
      if (this.requests === 0) {
        this.loadingComponent.close()
      }

      try {
//reduce the bar size by cutting out half of the min bar, and only scaling up to 80%
        let maxTop = Math.max.apply(Math, this.topOfOrderBook.map(element => element.usdValue));
        let maxBottom = Math.max.apply(Math, this.bottomOfOrderBook.map(element => element.usdValue));
        let max = Math.max(maxTop, maxBottom)
        let minTop = Math.min.apply(Math, this.topOfOrderBook.map(element => element.usdValue));
        let minBottom = Math.min.apply(Math, this.bottomOfOrderBook.map(element => element.usdValue));
        let min = Math.min(minTop, minBottom) / 2 
        this.topOfOrderBook.forEach(element => {
          element.sharePercent = ((element.usdValue - min) / max) * 80
        })

        this.bottomOfOrderBook.forEach(element => {
          element.sharePercent = ((element.usdValue - min) / max) * 80
        })
      } catch (e) {
        this.$log.error(e)
      }

    }
  }
}
</script>

<style scoped lang="scss">
.pro-trade {
  font-family: "Poppins", sans-serif;
  margin-top: 0;

  .z-index-high {
    z-index: 9999;
  }

  .box-border {
    background: #1f2330;
  }

  .border-top {
    border-top: 1px solid #262b3a;
  }

  .border-left {
    border-left: 1px solid #262b3a;
  }

  .trade-label {
    color: #26a69a;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    margin-top: 20px;
  }
}


</style>

<style lang="scss">
.pro-trade {
  .select select, .taginput .taginput-container.is-focusable, .textarea, .input {
    background: #2c323f;
    border: none;
    border-radius: 10px;
    color: white;
    width: 100%;
    margin-top: 2px;

    &:focus {
      border: none !important;
      box-shadow: none !important;
    }

    &::placeholder {
      font-size: 16px;
      font-weight: 500;
      font-family: "Poppins", sans-serif;
    }
  }
}
</style>
