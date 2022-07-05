<template>
  <div class="column is-8-fullhd is-6-desktop is-6-tablet">
    <div class="trading-view">
      <div class="choose-chart is-flex is-justify-content-start is-align-items-center">
        <div class="is-flex">
          Chart
          <div v-for="(chart, index) in availableCharts" @click="changeIframeTo(chart.chartString)"
               v-bind:class="{ 'selected': selectedChart === chart.chartString, 'not-selected': selectedChart !== chart.chartString }"
               :key="index">
            {{ chart.label }}
          </div>
        </div>
      </div>
      <div class="token-info is-flex is-justify-content-start is-align-items-center">
        <div class="is-flex is-justify-content-space-evenly">
          Token Info - Pool {{ tokenData.feeTier }}
          <div class="data">TotalSupply: {{ tokenData.supply | intlFormat() }} {{ this.fromToken.symbol }} &nbsp;&nbsp;&nbsp;&nbsp;MarketCap: ${{ tokenData.marketCap | intlFormat() }} &nbsp;&nbsp;&nbsp;&nbsp;TxnTotal: {{ tokenData.txnsTotal | formatPrice(0) }}&nbsp;&nbsp;&nbsp;&nbsp;VolumeTotal: ${{ tokenData.volumeUSDtotal | intlFormat() }}&nbsp;&nbsp;&nbsp;&nbsp;Txn24hr: {{ tokenData.txnsToday | formatPrice(0) }}&nbsp;&nbsp;&nbsp;&nbsp;Volume24hr: ${{ tokenData.volumeUSDtoday | intlFormat() }}</div>
        </div>
      </div>
      <iframe v-if="tradingViewUrl !== null" :src="tradingViewUrl" :key="'iframe'+tradingViewUrl"></iframe>
    </div>
    <div class="columns">
      <orders :orders="orders" class="is-hidden-mobile"></orders>
    </div>
  </div>
</template>

<script>
import Orders from "./Orders";
import ApiClient from "../../utils/apiClient";

export default {
  name: "TradingView",
  components: {Orders},
  props: {
    orders: Array,
    tokenData: Object,
    fromToken: Object
  },
  watch: {
    fromToken: {
      deep: true,
      handler: async function () {
        await this.getTradingViewURL()
        await this.getAvailableCharts()
      }
    }
  },
  data() {
    return {
      selectedChart: null,
      tradingViewUrl: null,
      availableCharts: []
    }
  },
  methods: {
    async getTradingViewURL() {
      let chartString = (await new ApiClient().getChartString(this.fromToken.symbol))
      this.selectedChart = chartString
      this.$log.debug(chartString)
      this.tradingViewUrl = `https://www.tradingview.com/widgetembed/?frameElementId=tradingview_0edbc&interval=1D&range=12M&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&locale=en&withdateranges=1&symbol=${chartString}`
    },
    async getAvailableCharts() {
      this.availableCharts = []
      if (this.fromToken.symbol !== 'ETH' && this.fromToken.symbol !== 'WETH') try{
        const ethChart = await new ApiClient().getChartEth(this.fromToken.symbol)
        if (ethChart.toUpperCase() !== 'NONE') {
           const ethChartInverted = '1/' + ethChart
           this.availableCharts.push({label: 'ETH/'+this.fromToken.symbol, chartString: ethChart})
           this.availableCharts.push({label: this.fromToken.symbol+'/ETH', chartString: ethChartInverted})
        }
      } catch (e) {
        this.$log.debug(e)
      }
      if (this.fromToken.symbol !== 'USDT') try{
        const usdtChart = await new ApiClient().getChartUsdt(this.fromToken.symbol)
        if (usdtChart.toUpperCase() !== 'NONE') {
           const usdtChartInverted = '1/' + usdtChart
           this.availableCharts.push({label: 'USDT/'+this.fromToken.symbol, chartString: usdtChart})
           this.availableCharts.push({label: this.fromToken.symbol+'/USDT', chartString: usdtChartInverted})
        }
      } catch (e) {
        this.$log.debug(e)
      }
    },
    changeIframeTo(chartString) {
      this.selectedChart = chartString
      this.tradingViewUrl = `https://www.tradingview.com/widgetembed/?frameElementId=tradingview_0edbc&interval=1D&range=12M&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&locale=en&withdateranges=1&symbol=${chartString}`
    }
  }
}
</script>

<style scoped lang="scss">

@media screen and (max-width: 768px) {
  .trading-view {
    height: 465px !important;
  }
  iframe {
    height: 400px !important;
  }
}

.trading-view {
  overflow: hidden !important;
  height: 870px;

  iframe {
    width: 100%;
    height: 93%;
  }

  .choose-chart {
    height: 40px;
    border-bottom: 0;

    text-align: left;
    font-size: 18px;
    color: #26a69a;
    font-weight: 600;
    background-color: #282e41;
    padding: 6px 6px 6px 0px;
    border: 1px solid #262b3a;
	
    > div {
      margin-left: 10px;
    }

    .selected {
      font-size: 15px;
      color: #26a69a;
      font-weight: 600;
      margin-right: 0.7rem;
      margin-top: 0;
      min-width: fit-content;
      position: relative;
      left: 15px;
      top: 3px;
    }

    .not-selected {
      font-size: 15px;
      color: #838d9b;
      font-weight: 400;
      cursor: pointer;
      margin-right: 0.7rem;
      margin-top: 0;
      min-width: fit-content;
      position: relative;
      left: 15px;
      top: 3px;

      &:hover {
        filter: brightness(200%);
      }
    }
  }
  
  .token-info {
    height: 25px;
    font-size: 12px;
    border: 1px solid #363c4e;
    border-bottom: 0;
    color: #26a69a;
    text-align: left;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  
    > div {
      margin-left: 10px;
    }
    .data {
      font-weight: 400;
      color: #838d9b;
      margin-right: 0.5vw;
      margin-top: 0;
      min-width: fit-content;
      position: relative;
      left: 15px;
      &:hover {
        filter: brightness(120%);
      }
    }
  }
}

</style>