<template>
    <b-modal v-model="modalActive" :can-cancel="['x']">
      <div class="trade-info-modal">
        <button
            type="button"
            class="delete"
            @click="$emit('close')"/>
        <div class="trade-info-modal has-text-light">
          <div class="is-size-5">CivTrade ID {{mergedTrade.orderId}}v{{mergedTrade.version}} Balance</div>
          <hr class="has-background-dark mt-0 mb-2"/>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pb-0">
              {{mergedTrade.tokenSymbol0}} ({{mergedTrade.tokenName0}})
            </div>
            <div class="column is-half has-text-right pb-0">
              {{mergedTrade.currentAmount0}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              {{mergedTrade.tokenSymbol1}} ({{mergedTrade.tokenName1}})
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.currentAmount1}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              Min % fees earned 
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.feePercent}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0">
              % of CivTrade filled 
            </div>
            <div class="column is-half has-text-right pt-0">
              {{mergedTrade.percentFilled}}
            </div>
          </div>

          <div class="is-size-5">Price of {{ mergedTrade.pairName}}</div>
          <hr class="has-background-dark mt-0 mb-2"/>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pb-0">
              Target
            </div>
            <div class="column is-half has-text-right pb-0">
              {{mergedTrade.targetPrice}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              Current
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.actualPrice}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0">
              Initial
            </div>
            <div class="column is-half has-text-right pt-0">
              {{mergedTrade.initialPrice}}
            </div>
          </div>


          <div class="is-size-5">Price of {{ mergedTrade.pairInverted}}</div>
          <hr class="has-background-dark mt-0 mb-2"/>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pb-0">
              Target
            </div>
            <div class="column is-half has-text-right pb-0">
              {{mergedTrade.invertedPrice}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              Current
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.actualInverted}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0">
              Initial
            </div>
            <div class="column is-half has-text-right pt-0">
              {{mergedTrade.initialInverted}}
            </div>
          </div>


          <div class="is-size-5">CivTrade Opened</div>
          <hr class="has-background-dark mt-0 mb-2"/>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pb-0">
              Type
            </div>
            <div class="column is-half has-text-right pb-0">
              {{mergedTrade.tradeType}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              On
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.dateOpenedDay}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0 pb-0">
              At
            </div>
            <div class="column is-half has-text-right pt-0 pb-0">
              {{mergedTrade.dateOpenedTime}}
            </div>
          </div>
          <div class="columns pl-4 is-mobile">
            <div class="column is-half pt-0">
              Duration
            </div>
            <div class="column is-half has-text-right pt-0">
              {{mergedTrade.elapsed}}
            </div>
          </div>
        </div>
      </div>
    </b-modal>
</template>


<script>
import BigNumber from "bignumber.js";
import BlockchainHelper from "../utils/blockchain";
import ApiClient from "../utils/apiClient";

export default {
  name: "TradePerformanceModal",
  props: ['trade', 'isComponentModalActive'],
  components: {},
  watch: {
    isComponentModalActive: {
      handler: async function () {
        if (!this.isComponentModalActive) {
          this.$emit("close");
        } else {
          if(this.trade.example === undefined) {
            const loadingComponent = this.$buefy.loading.open()
            try{
              const wallet = await new BlockchainHelper().getAddress()
              const tradeBalance = await new ApiClient().getTradeBalance(wallet, this.trade.orderId, this.trade.version)
              this.mergedTrade = {...this.trade, ...tradeBalance}
              this.$log.debug(tradeBalance)
              this.$log.debug(this.mergedTrade)
            } catch (e) {
              this.isApproved = false;
              this.$log.error(e)
              this.$buefy.toast.open({
                duration: 5000,
                message: `An error occurred while parsing trade info. Please try again later`,
                position: 'is-bottom',
                type: 'is-danger'
              })
            } finally {
              loadingComponent.close()
            }
          } else {
            this.mergedTrade = this.trade
          }
        }
        this.modalActive = this.isComponentModalActive
      },
    },
  },
  data() {
    return {
      modalActive: false,
      mergedTrade: {}
    }
  },
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
.trade-info-modal {
    background-color: $dark;
    max-width: 530px;
    width: 90%;
    border-radius: 10px;
    margin: auto;
    padding: 15px 10px;
    text-align: left;
    position: relative;

  .delete {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 100;
  }

  .tooltip-icon {
    position: relative;
    top: 2px;
    left: 5px;
    &:hover {
      cursor: pointer;
    }

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
