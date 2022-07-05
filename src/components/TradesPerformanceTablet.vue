<template>
  <div>
    <h1>
      Your CivTrades
      <b-tooltip :label="'It may take few minutes before the blockchain will show your new positions here'" position="is-bottom" class="title-tooltip">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
    </h1>
    <div class="list">
      <div class="trades-table">

        <div class="row row-style" v-for="(trade, idx) in trades" v-bind:key="idx">
          <div class="col bordered">
            <div class="row">
              <div class="crypto-tag">
                <span class="amount" v-if="!isNaN(parseFloat(trade.amount0))">{{ trade.amount0 }}</span>
                <span class="amount" v-else>?</span>
                <img :src="getImage(trade.tokenSymbol0)" :alt="trade.tokenSymbol0">
                {{ trade.tokenSymbol0 }}
              </div>
            </div>
            <div class="row">
              <b-icon icon="chevron-right" size="is-large" type="is-light" class="flex-icon"></b-icon>
            </div>
            <div class="row">
              <div class="crypto-tag">
                <span class="amount" v-if="!isNaN(parseFloat(trade.amount1))">{{ trade.amount1 }}</span>
                <span class="amount" v-else>?</span>
                <img :src="getImage(trade.tokenSymbol1)" :alt="trade.tokenSymbol1">
                {{ trade.tokenSymbol1 }}
              </div>
            </div>
            <span class="trade-performance-info-icon" @click="selectedTrade = trade;tradePerformanceModalOpen = true">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 50 50">
                <image width="50" height="50" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACMElEQVRIib2Wu2uUQRTFf5soKgaJVoqyRBA3KoJpBEkjBDQP2OB/IGhna6cGrO3FwsJASKpYiCIRBDHINgGX4AMr4yLYROIjG98cGTifXNbdTdZNvDAw33fPnDN3Zu6dyUliFTsCjACHgALQBSwDr4CXwF3gRVOKJNKgnZL0QGuzGePrctWLpBO4CZwN/x4BD4EK8AHoBvLAAHAy4G4B54FfzSLpljQX5j4h6WiTaLF/IoyZM88fTAR3SiobWJU0sgp5bUv4FY8vm+8vkXEDVtYw+2ZRZULjtSL9IdzBfxTI2lDg6o8iJf+calMga1PmK2UihaCcXyeRfOAsdABFH7QnPqL4GF5rkl57fMwngW11/BXzJSsmkT5/3A+grcAO50xmu0P/CnDOWf8F2ALsqhHK+PqSSI8/XgdADvgGJP80cMclZMxRFF1aZoHjwDP7LwSOjK8nrd+81240rOm0pIqknH2XJJ1xv0vSpKRZSTslfbV/wP5j5hj19/wmzyjZ9jCLT8ASkPw/gNvAW/cT/p2Xc8lLdQN477GpoJYD33IiWQBOAPuDyF7ggPubgX3Ad/cxNtvLEvAYeAN8BmYCJtlCh1WTDQWR68BFF7oxb/AicNn+dLKuun/ae/LT+7NYw/c0rV3vBudJ73/L+PWuXYONahehClfbrMLVRlWYOvfJcIsCw0Gg4X3CRt2Mrd7xKRc+tnvHx9bKayXhWnqt1Fr27joMHKzz7roHPG84GvgNfW8f3QDXdzUAAAAASUVORK5CYII="/>
              </svg>
            </span>
          </div>
          <div class="col">
            <div class="status-tag pending status-tag-text">
              {{trade.status}}
            </div>
            <div class="pending">
              <trades-info-tooltip :trade="trade" :type="'status'"></trades-info-tooltip>
            </div>
            <div class="status-tag status-tag-button" v-if="trade.status === 'Open'" @click="onSubmitOrOpenClick(trade)">
              Close
            </div>
            <div class="pending">
              <trades-info-tooltip :trade="trade" :type="'action'"></trades-info-tooltip>
            </div>
          </div>
        </div>

        <div class="row row-style" v-if="trades !== undefined && trades.length === 0">
          <div class="col bordered">
            <div class="row">
              <div class="crypto-tag">
                30,000
                <img src="../assets/eth-logo.png" alt="Ethereum">
                EXAMPLE
              </div>
            </div>
            <div class="row">
              <b-icon icon="chevron-right" size="is-large" type="is-light" class="flex-icon"></b-icon>
            </div>
            <div class="row">
              <div class="crypto-tag">
                340,000
                <img src="../assets/civ-txt-small.png" alt="CIV">
                CIV
              </div>
            </div>
            <span class="trade-performance-info-icon" @click="selectedTrade = exampleTrade;tradePerformanceModalOpen = true">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 50 50">
                <image width="50" height="50" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACMElEQVRIib2Wu2uUQRTFf5soKgaJVoqyRBA3KoJpBEkjBDQP2OB/IGhna6cGrO3FwsJASKpYiCIRBDHINgGX4AMr4yLYROIjG98cGTifXNbdTdZNvDAw33fPnDN3Zu6dyUliFTsCjACHgALQBSwDr4CXwF3gRVOKJNKgnZL0QGuzGePrctWLpBO4CZwN/x4BD4EK8AHoBvLAAHAy4G4B54FfzSLpljQX5j4h6WiTaLF/IoyZM88fTAR3SiobWJU0sgp5bUv4FY8vm+8vkXEDVtYw+2ZRZULjtSL9IdzBfxTI2lDg6o8iJf+calMga1PmK2UihaCcXyeRfOAsdABFH7QnPqL4GF5rkl57fMwngW11/BXzJSsmkT5/3A+grcAO50xmu0P/CnDOWf8F2ALsqhHK+PqSSI8/XgdADvgGJP80cMclZMxRFF1aZoHjwDP7LwSOjK8nrd+81240rOm0pIqknH2XJJ1xv0vSpKRZSTslfbV/wP5j5hj19/wmzyjZ9jCLT8ASkPw/gNvAW/cT/p2Xc8lLdQN477GpoJYD33IiWQBOAPuDyF7ggPubgX3Ad/cxNtvLEvAYeAN8BmYCJtlCh1WTDQWR68BFF7oxb/AicNn+dLKuun/ae/LT+7NYw/c0rV3vBudJ73/L+PWuXYONahehClfbrMLVRlWYOvfJcIsCw0Gg4X3CRt2Mrd7xKRc+tnvHx9bKayXhWnqt1Fr27joMHKzz7roHPG84GvgNfW8f3QDXdzUAAAAASUVORK5CYII="/>
              </svg>
            </span>
          </div>
          <div class="col">
            <div class="status-tag pending status-tag-text">
              Filled
            </div>
            <div class="pending">
              <trades-info-tooltip :trade="exampleTrade" :type="'status'"></trades-info-tooltip>
            </div>
            <div class="status-tag status-tag-button" @click="onSubmitAction()">
              Withdraw
            </div>
            <b-tooltip label="This will complete your order">
              <b-icon icon="information"></b-icon>
            </b-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="your-trades" v-if="trades !== undefined">
      Enter
      <router-link :to="{name: 'Trade'}">New CivTrade</router-link>
    </div>
    <trade-performance-modal
        :trade="selectedTrade"
        :is-component-modal-active="tradePerformanceModalOpen"
        @close="tradePerformanceModalOpen = false"></trade-performance-modal>
  </div>
</template>


<script>
import TradesInfoTooltip from "./TradesInfoTooltip";
import TradePerformanceModal from "./TradePerformanceModal";

export default {
  components: {TradePerformanceModal, TradesInfoTooltip },
  name: 'TradesPerformanceTablet',
  props: ['trades'],
  data() {
    return {
      selectedTrade: [],
      tradePerformanceModalOpen: false,
      exampleTrade: {
        example:true,
        orderId:18809, pairName: 'EXAMPLE per CIV' ,
        pairInverted: 'CIV per EXAMPLE', amount0: 30000, amount1: 340000,
        tokenName0: 'EXAMPLE', tokenName1:'Civilization',
        status: 'Filled', currentAmount1: '0', token0Decimals:18,
        token1Decimals:18, currentAmount0: 100, dateOpenedDay: '18 DEC 2021',
        dateOpenedTime: '22:27:48 UTC', elapsed: '22 days, 10h:41m,25s',
        actualPrice: 1.09,
        initialPrice: 1.11,
        targetPrice: 1.22,
        invertedPrice: 0.25,
        actualInverted: 0.19,
        initialInverted: 0.20,
        percentFilled: '30%'
      }
    }
  },
  methods: {
    onSubmitAction() {
      this.$emit("onSubmitAction", this.type);
    },
    getImage(symbol) {
      let token = [];
      let list = JSON.parse(localStorage.getItem('allTokensList'))
      if(list) {
        token = list.filter(token => token.symbol.toLowerCase() === symbol.toLowerCase());
      }
      return token[0] !== undefined ? token[0].logoURI : 'data:image/png;base64,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'
    },
    onSubmitOrOpenClick(trade) {
      this.$emit("onSubmitOrOpenClick", trade);
    },
    onPartFilledClick(trade) {
      this.$emit("onPartFilledClick", trade);
    }
  }
}
</script>

<style scoped lang="scss">

.trade-performance-info-icon {
  position: relative;
  top: 3px;
  left: 5px;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}

h1 {
  font-weight: 900;
  font-size: 22px;
  line-height: 55px;
  color: $white;
}

.list {
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 22px;
  line-height: 22px;
  color: $white;
  font-weight: 500;
  text-align: center;
}

.row-style {
  border-radius: 20px;
  border: solid 1px transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px #2c323f inset;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success, $purple);;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: $white;
  padding: 10px;
  margin: 20px 50px;

  .bordered {
    border-right: 1px solid $success-1;
  }
}

.status-tag-text {
  width: fit-content !important;
  margin-right: 5px !important;
  padding-right: 0 !important;
  margin-top: 6px !important;
  white-space: nowrap !important;
  padding-top: 18px !important;
}

.status-tag-button {
  margin-left: 5vw !important;

  &:hover {
    background: $dark !important;
  }
}

.status-tag {
  width: 80%;
  border-radius: 20px;
  font-weight: 500;
  font-size: 20px;
  line-height: 17px;
  padding: 15px;
  color: $white;
  background: $black;
  border: 1px solid #462564;
  margin: 10px;
  cursor: pointer;

  &:hover {
    background: transparent;
  }
}

.pending {
  background: transparent;
  border-color: transparent;
  cursor: default;
  padding-top: 2px;
}

.crypto-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: 35px;
  font-weight: 500;
  border-radius: 22px;
  font-size: 20px;
  line-height: 20px;

  img {
    margin-right: 10px;
    width: 21px;
    height: 21px;
  }

  .amount {
    padding-right:5px;
  }
}

.label {
  color: #C1C1C1;
}

.m-value {
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
}

.status-tag-mobile {
  width: 195px;
  margin: auto
}

.your-trades {
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: $white;

  a {
    color: rgba(0, 252, 222, 0.6) !important;
  }
}
.trades-table {
  min-width: 760px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  header, .row {
    display: flex;
  }

  .col {
    flex: 1;
    align-items: center;
    justify-content: center;
    display: flex;
  }
}
</style>

<style lang="scss">
.trades-table {
  .flex-icon i {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.title-tooltip {
  position:relative;
  top:3px;
}
</style>
