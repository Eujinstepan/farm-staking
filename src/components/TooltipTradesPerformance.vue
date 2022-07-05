<template>
  <b-tooltip class="tooltip-trades-performance" :position="getPosition()" multilined>
    <b-icon icon="information-outline" ></b-icon>
    <template v-slot:content v-if="trade">
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">ID</div>
        <div class="column is-8 has-text-right p-0">{{ trade.orderId }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Date opened</div>
        <div class="column is-8 has-text-right p-0">{{ trade.dateOpenedDay }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0"></div>
        <div class="column is-8 has-text-right p-0">{{ trade.dateOpenedTime }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Elapsed</div>
        <div class="column is-8 has-text-right p-0">{{ trade.elapsed }}</div>
      </div>
      <div class="column is-full has-text-left header" style="border-bottom: 1px solid rgb(44, 47, 54)">
        Current Balance
      </div>
      <div class="columns is-mobile">
        <div class="column is-7 has-text-left p-0">{{ trade.tokenName0 }}</div>
        <div class="column is-5 has-text-right p-0">{{ trade.currentAmount0 }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-7 has-text-left p-0">{{ trade.tokenName1 }}</div>
        <div class="column is-5 has-text-right p-0">{{ trade.currentAmount1 }}</div>
      </div>
      <div class="column is-full has-text-left header" style="border-bottom: 1px solid rgb(44, 47, 54)">
        Prices: {{ trade.pairName }}
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Target</div>
        <div class="column is-8 has-text-right p-0">{{ trade.targetPrice }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Current</div>
        <div class="column is-8 has-text-right p-0">{{ trade.actualPrice }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Initial</div>
        <div class="column is-8 has-text-right p-0">{{ trade.initialPrice }}</div>
      </div>
      <div class="column is-full has-text-left header" style="border-bottom: 1px solid rgb(44, 47, 54)">
        Prices: {{ trade.pairInverted }}
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Target</div>
        <div class="column is-8 has-text-right p-0">{{ trade.invertedPrice }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Current</div>
        <div class="column is-8 has-text-right p-0">{{ trade.actualInverted }}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4 has-text-left p-0">Initial</div>
        <div class="column is-8 has-text-right p-0">{{ trade.initialInverted }}</div>
      </div>
    </template>
  </b-tooltip>
</template>


<script>
import BigNumber from "bignumber.js";

export default {
  name: "TooltipTradesPerformance",
  props: ['trade'],
  components: {},
  methods: {
    getPosition() {
      if (window.innerWidth <= 760) {
        return 'is-top';
      } else {
        return 'is-right';
      }
    },
    getCurrentBalanceForToken0(trade) {
      const power = new BigNumber(10).pow(parseInt(trade.token0Decimals))
      let fullNumber = new BigNumber(trade.currentAmount0).dividedBy(power).decimalPlaces(parseInt(trade.token0Decimals))
      if(fullNumber.isNaN() || !fullNumber.isFinite()) {
        fullNumber = 0;
      }
      try {
        const match = fullNumber.toString(10).match(/^-?\d+(?:\.\d{0,6})?/)
        if(match !== null && match.length > 0){
          return match[0]
        }
        return 0
      } catch (e) {
        this.$log.error(e)
        return 'N/A'
      }
    },
    getCurrentBalanceForToken1(trade) {
      const power = new BigNumber(10).pow(parseInt(trade.token1Decimals))
      let fullNumber = new BigNumber(trade.currentAmount1).dividedBy(power).decimalPlaces(parseInt(trade.token1Decimals))
      if(fullNumber.isNaN() || !fullNumber.isFinite()) {
        fullNumber = 0;
      }
      try {
        const match = fullNumber.toString(10).match(/^-?\d+(?:\.\d{0,6})?/)
        if(match !== null && match.length > 0){
          return match[0]
        }
        return 0
      } catch (e) {
        this.$log.error(e)
        return 'N/A'
      }
    }
  }
}
</script>

<style lang="scss">
.tooltip-trades-performance {
  &.b-tooltip {
    top: 5px;
    left: 2px;

    .tooltip-content {
      max-width: 450px !important;
      min-width: 290px !important;
      padding: 30px !important;
      background: rgb(25, 27, 31) !important;

      .note {
        font-size: 14px !important;
      }
    }

    .mdi-information-outline {
      &::before {
        color: gray !important;
      }
      &:hover::before {
        color: white !important;
      }
    }

    .header {
      margin-bottom: 15px;
      padding-bottom: 5px;
    }

    div {
      color: white !important;
      font-weight: 500 !important;
      font-size: 16px !important;
      padding: 2px;
    }
  }
}
</style>
