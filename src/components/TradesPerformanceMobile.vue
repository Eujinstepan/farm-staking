<template>
  <div>
    <div class="list">
      <div class="columns is-mobile mb-0 pb-0">
        <div class="column is-four-fifths mb-0 pb-0">
          <p>Your CivTrades
            <b-tooltip position="is-bottom" class="title-tooltip">
              <template v-slot:content>
                It may take few minutes <br/>before the blockchain will show <br/>your new positions here
              </template>
              <b-icon icon="information"></b-icon>
            </b-tooltip>
          </p>
        </div>
      </div>
      <div class="columns mt-0 mb-0">
        <div class="column is-half-fullhd is-offset-one-quarter-fullhd is-half-widescreen is-offset-one-quarter-widescreen mt-0 pt-0" v-for="(trade, idx) in trades" v-bind:key="idx">
          <div class="row-style">
            <div class="column is-3-desktop">
              <div class="label">Price</div>
              <div class="m-value">
                <span v-if="!isNaN(parseFloat(trade.amount0))">{{ trade.amount0 }}</span>
                <span v-else>?</span>
                <img :src="getImage(trade.tokenSymbol0)" :alt="trade.tokenSymbol0">
                &nbsp; {{ trade.tokenSymbol0 }}
              </div>
            </div>
            <div class="column is-3-desktop p-0 c-arrow-down">
              <b-icon icon="chevron-down" size="is-small" type="is-light" class="flex-icon"></b-icon>
            </div>
            <div class="column is-3-desktop">
              <div class="label">Output</div>
              <div class="m-value">
                <span v-if="!isNaN(parseFloat(trade.amount1))">{{ trade.amount1 }}</span>
                <span v-else>?</span>
                <img :src="getImage(trade.tokenSymbol1)" :alt="trade.tokenSymbol1">
                &nbsp; {{ trade.tokenSymbol1 }}
              </div>
            </div>
            <div class="column is-3-desktop">
              <div class="trade-performance-info-icon" @click="selectedTrade = trade;tradePerformanceModalOpen = true">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 50 50">
                  <image width="50" height="50" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACMElEQVRIib2Wu2uUQRTFf5soKgaJVoqyRBA3KoJpBEkjBDQP2OB/IGhna6cGrO3FwsJASKpYiCIRBDHINgGX4AMr4yLYROIjG98cGTifXNbdTdZNvDAw33fPnDN3Zu6dyUliFTsCjACHgALQBSwDr4CXwF3gRVOKJNKgnZL0QGuzGePrctWLpBO4CZwN/x4BD4EK8AHoBvLAAHAy4G4B54FfzSLpljQX5j4h6WiTaLF/IoyZM88fTAR3SiobWJU0sgp5bUv4FY8vm+8vkXEDVtYw+2ZRZULjtSL9IdzBfxTI2lDg6o8iJf+calMga1PmK2UihaCcXyeRfOAsdABFH7QnPqL4GF5rkl57fMwngW11/BXzJSsmkT5/3A+grcAO50xmu0P/CnDOWf8F2ALsqhHK+PqSSI8/XgdADvgGJP80cMclZMxRFF1aZoHjwDP7LwSOjK8nrd+81240rOm0pIqknH2XJJ1xv0vSpKRZSTslfbV/wP5j5hj19/wmzyjZ9jCLT8ASkPw/gNvAW/cT/p2Xc8lLdQN477GpoJYD33IiWQBOAPuDyF7ggPubgX3Ad/cxNtvLEvAYeAN8BmYCJtlCh1WTDQWR68BFF7oxb/AicNn+dLKuun/ae/LT+7NYw/c0rV3vBudJ73/L+PWuXYONahehClfbrMLVRlWYOvfJcIsCw0Gg4X3CRt2Mrd7xKRc+tnvHx9bKayXhWnqt1Fr27joMHKzz7roHPG84GvgNfW8f3QDXdzUAAAAASUVORK5CYII="/>
                </svg>
              </div>
            </div>
            <div class="column is-3-desktop">
              <div class="status-tag status-tag-mobile pending">
                <div>
                  {{trade.status}}
                </div>
                <div class="mt-2"><trades-info-tooltip :trade="trade" :type="'status'"></trades-info-tooltip></div>
              </div>
              <div class="columns is-mobile" v-if="trade.status === 'Open' || trade.status === 'Filled'">
                <div class="column is-8-mobile">
                  <div class="status-tag status-tag-mobile mt-2" v-if="trade.status === 'Open'" @click="onSubmitOrOpenClick(trade)">Close</div>
                </div>
                <div class="column is-4-mobile">
                  <div class="status-tag status-tag-mobile pending mt-2">
                    <trades-info-tooltip :trade="trade" :type="'action'"></trades-info-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="trades !== undefined && trades.length === 0" class="column is-half-fullhd is-offset-one-quarter-fullhd is-half-widescreen is-offset-one-quarter-widescreen mt-0 pt-0">
        <div class="row-style">
          <div class="column is-3-desktop">
            <div class="label">Price</div>
            <div class="m-value">
              30,000
              <img src="../assets/eth-logo.png" alt="Ethereum">
              &nbsp;EXAMPLE
            </div>
          </div>
          <div class="column is-3-desktop p-0 c-arrow-down">
            <b-icon icon="chevron-down" size="is-small" type="is-light" class="flex-icon"></b-icon>
          </div>
          <div class="column is-3-desktop">
            <div class="label">Output</div>
            <div class="m-value">
              340,000
              <img src="../assets/civ-txt-small.png" alt="CIV">
              &nbsp;CIV
            </div>
          </div>
          <div class="column is-3-desktop">
            <div class="trade-performance-info-icon" @click="selectedTrade = exampleTrade;tradePerformanceModalOpen = true">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 50 50">
                <image width="50" height="50" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACMElEQVRIib2Wu2uUQRTFf5soKgaJVoqyRBA3KoJpBEkjBDQP2OB/IGhna6cGrO3FwsJASKpYiCIRBDHINgGX4AMr4yLYROIjG98cGTifXNbdTdZNvDAw33fPnDN3Zu6dyUliFTsCjACHgALQBSwDr4CXwF3gRVOKJNKgnZL0QGuzGePrctWLpBO4CZwN/x4BD4EK8AHoBvLAAHAy4G4B54FfzSLpljQX5j4h6WiTaLF/IoyZM88fTAR3SiobWJU0sgp5bUv4FY8vm+8vkXEDVtYw+2ZRZULjtSL9IdzBfxTI2lDg6o8iJf+calMga1PmK2UihaCcXyeRfOAsdABFH7QnPqL4GF5rkl57fMwngW11/BXzJSsmkT5/3A+grcAO50xmu0P/CnDOWf8F2ALsqhHK+PqSSI8/XgdADvgGJP80cMclZMxRFF1aZoHjwDP7LwSOjK8nrd+81240rOm0pIqknH2XJJ1xv0vSpKRZSTslfbV/wP5j5hj19/wmzyjZ9jCLT8ASkPw/gNvAW/cT/p2Xc8lLdQN477GpoJYD33IiWQBOAPuDyF7ggPubgX3Ad/cxNtvLEvAYeAN8BmYCJtlCh1WTDQWR68BFF7oxb/AicNn+dLKuun/ae/LT+7NYw/c0rV3vBudJ73/L+PWuXYONahehClfbrMLVRlWYOvfJcIsCw0Gg4X3CRt2Mrd7xKRc+tnvHx9bKayXhWnqt1Fr27joMHKzz7roHPG84GvgNfW8f3QDXdzUAAAAASUVORK5CYII="/>
              </svg>
            </div>
          </div>
          <div class="column is-3-desktop">
            <div class="status-tag status-tag-mobile pending">Filled</div>
            <div class="columns is-mobile">
              <div class="column is-8-mobile">
                <div class="status-tag status-tag-mobile mt-2" @click="onSubmitAction()">Withdraw</div>
              </div>
              <div class="column is-4-mobile">
                <div class="status-tag status-tag-mobile pending mt-2">
                  <b-tooltip label="This will complete your order" position="is-left">
                    <b-icon icon="information"></b-icon>
                  </b-tooltip>
                </div>
              </div>
            </div>
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
  name: 'TradesPerformanceMobile',
  components: {TradesInfoTooltip, TradePerformanceModal },
  props: ['trades'],
  data() {
    return {
      selectedTrade: [],
      tradePerformanceModalOpen: false,
      exampleTrade: {
        example: true,
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
      if(list){
        token = list.filter(token => token.symbol.toLowerCase() === symbol.toLowerCase());
      }
      return token[0] !== undefined ? token[0].logoURI : 'data:image/png;base64,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'
    },
    onSubmitOrOpenClick(trade) {
      this.$emit("onSubmitOrOpenClick", trade);
    },
    onPartFilledClick(trade) {
      this.$emit("onPartFilledClick", trade);
    },
  },
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
  font-weight: 500;
  font-size: 45px;
  line-height: 55px;
  color: $white;
}

hr {
  width: 365px;
  margin: 20px auto auto auto;
  border: 1px solid $success-1;
}

.list {
  font-size: 18px;
  line-height: 22px;
  color: $white;
  font-weight: 500;
  text-align: center;
  background: $dark;
  border-radius: 31px;
  margin: 30px;

  p {
    text-align: left;
    color: $white;
    padding: 20px 20px 6px 35px;
    font-weight: 900;
    font-size: 22px;
    line-height: 24px;
  }
}

.c-arrow-down {
  position: relative;
  top: 2px;
}

.cog-icon {
  margin-top: 20px;
  cursor: pointer;
  margin-right: 30px;
}

.row-style {
  border-radius: 20px;
  border: solid 2px transparent;
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success, $purple);;
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  color: $white;
  color: $white;
  padding: 10px;
  margin: 10px 20px;

  .bordered {
    border-right: 1px solid $success;
  }
}

.status-tag {
  width: 100%;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  padding: 15px;
  color: $white;
  background: $dark;
  border: 1px solid #462564;
  cursor: pointer;
}

.crypto-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 35px;
  background: $black;
  border-radius: 22px;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
}

img {
  margin-left: 10px;
  width: 21px;
  height: 21px;
}

.label {
  color: #C1C1C1;
  margin: 0;
  padding: 0;
}

.m-value {
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
  }
}

.status-tag-mobile {
  width: 100%;
  margin: auto;
  font-size: 16px;
  background: $black;

  &:hover {
    background: $dark;
  }

  &.pending {
    background: transparent;
    border-color: transparent;
    cursor: default;
  }
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

.title-tooltip {
  position:relative;
  top:3px;
}
</style>
