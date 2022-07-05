<template>
  <div>
    <div class="trades-performance">

      <trades-performance-mobile :trades="trades" class="is-hidden-tablet"
                                 @onSubmitAction="onSubmitAction"
                                 @onSubmitOrOpenClick="onSubmitOrOpenClick"
                                 @onPartFilledClick="onPartFilledClick"
      ></trades-performance-mobile>
      <trades-performance-tablet :trades="trades" class="is-hidden-mobile"
                                 @onSubmitAction="onSubmitAction"
                                 @onSubmitOrOpenClick="onSubmitOrOpenClick"
                                 @onPartFilledClick="onPartFilledClick"
      ></trades-performance-tablet>
    </div>

    <trade-action-confirmation-modal
        :type="actionType"
        :is-component-modal-active="confirmationModal"
        :title="confirmationTitle"
        :notification-content="confirmationContent"
        :disable-buttons="disableButtons"
        @onSubmitAction="onSubmitAction"
        @close="confirmationModal = false"
    >
    </trade-action-confirmation-modal>
  </div>
</template>

<script>


import TradesPerformanceMobile from "@/components/TradesPerformanceMobile";
import TradesPerformanceTablet from "@/components/TradesPerformanceTablet";
import ApiClient from "../utils/apiClient";
import store from '../store/index'
import TradeActionConfirmationModal from "../components/TradeActionConfirmationModal";
import BlockchainHelper from "../utils/blockchain";
import {ethers} from "ethers";

export default {
  name: 'TradesPerformance',
  store,
  components: {TradeActionConfirmationModal, TradesPerformanceTablet, TradesPerformanceMobile},
  data: () => {
    return {
      trades: undefined,
      actionType: "",
      confirmationModal: false,
      confirmationTitle: 'Confirmation',
      confirmationContent: null,
      disableButtons: false,
      selectedTrade: undefined
    }
  },
  watch: {
    '$store.state.chainId': async function () {
        await this.updateTrades()
    }
  },
  mounted: async function() {
   await this.updateTrades()
  },
  methods: {
    async onSubmitAction() {
      let index = undefined
      this.confirmationContent = 'Request in progress...'
      this.confirmationModal = true
      this.disableButtons = true
      if(this.selectedTrade === undefined) {
        this.confirmationContent = 'This is only an Example transaction and therefore cannot be withdrawn. Please submit a CivTrade to be able to withdraw funds'
      } else {
        try {
          const blockChainHelper = new BlockchainHelper()
          this.$log.debug('Trade version is: ' + this.selectedTrade.version)
          let limitManager 
          if (this.selectedTrade.version === 1) {
            limitManager = await new ethers.Contract(await blockChainHelper.getManagerAddress(), await blockChainHelper.getAbi(), store.state.signer);
          } else if (this.selectedTrade.version === 2) {
            limitManager = await new ethers.Contract(await blockChainHelper.getManagerAddressV2(), await blockChainHelper.getAbiV2(), store.state.signer);
          } else {          
            throw ('Unsupported version')
          }
          this.$log.debug('cancelling '+this.selectedTrade.orderId)
          let estimatedGas = await store.state.provider.getFeeData().gasPrice
          this.$log.debug(`Estimated gas: ${estimatedGas}`)
          await limitManager.closePos(this.selectedTrade.orderId)
          this.confirmationContent = 'Your request submitted successfully'
          /** This is bad but node is async and have delay to update the order we just closed! **/
          index = this.trades.findIndex(el => {
            return el.orderId === this.selectedTrade.orderId
          })
        } catch(e) {
          this.$log.error(e)
          if(e.code === 4001) {
            this.confirmationContent = 'You rejected the transaction'
          } else {
            this.confirmationContent = 'An error occurred, please try again'
          }
        } finally {
          await this.updateTrades()
          if (Number.isInteger(index)) {
            this.trades[index].status = 'Closed'
          }
        }
      }
      this.selectedTrade = undefined
    },
    onSubmitOrOpenClick(trade) {
      this.disableButtons = false
      this.actionType = 'Cancel';
      this.confirmationModal = true;
      this.confirmationContent='Are you sure you want to close this order and withdraw its current balance of tokens, before it is auto-filled?';
      this.selectedTrade = trade
    },
    onPartFilledClick(trade) {
      this.disableButtons = false
      this.actionType = 'Pre-close';
      this.confirmationModal = true;
      this.confirmationContent='Are you sure you want to pre-close this part-filled order?'
      this.selectedTrade = trade
    },
    async updateTrades() {
      const loadingComponent = this.$buefy.loading.open()
      try{
        let address = await new BlockchainHelper().getAddress()
        if(address === null) {
          await this.$router.push('/')
        } else {
          this.trades = await new ApiClient().getTrades(address)
          this.$log.debug('Trades for :'+address)
          this.$log.debug(this.trades)
        }
      } catch (e) {
        this.$log.error(e)
        this.$buefy.toast.open({
          duration: 5000,
          message: `Your request failed, please try again`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
      }
    }
  }
}
</script>

<style scoped>
  .trades-performance {
    margin-top: 100px;
  }
</style>

