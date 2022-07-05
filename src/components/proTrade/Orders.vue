<template>
  <div class="column is-12 order-book">
    <div class="columns is-gapless orders box-border mb-0">

      <div class="column is-12 padding-bottom pt-0 mt-0 table-dark">

        <div class="block-title ml-0 mb-3 mt-0">Your Orders</div>
        <b-table :data="orders" :sticky-header="true">
          <b-table-column field="dateOpened" label="Time" v-slot="props">
            {{ props.row['dateOpened'] }}
          </b-table-column>

          <b-table-column field="status" label="Status" v-slot="props">
            {{ props.row['status'] }}
          </b-table-column>

          <b-table-column field="tokenSymbol0" label="From" v-slot="props">
            {{ props.row['amount0'] }} {{ props.row['tokenSymbol0'] }}
          </b-table-column>

          <b-table-column field="tokenSymbol1" label="To" v-slot="props">
            <div class="absolute">
              <div class="arrow">
                ⮞
              </div>
            </div>
            {{ props.row['amount1'] }} {{ props.row['tokenSymbol1'] }}
          </b-table-column>

          <b-table-column field="targetPrice" label="Price" v-slot="props">
            {{ props.row['targetPrice'] }}
            <span class="trade-performance-info-icon" @click="selectedTrade = props.row;tradePerformanceModalOpen = true">
              <b-icon icon="information-outline" :custom-size="'fa-2x'"></b-icon>
            </span>
          </b-table-column>

          <b-table-column field="tradeType" label="Type" v-slot="props">
            {{ props.row['tradeType'] }}
          </b-table-column>

          <b-table-column field="action" label="Action" v-slot="props">
            <div class="status-tag status-tag-button" v-if="props.row.status === 'Open'" @click="onSubmitOrOpenClick(props.row)">
              <a>
                Close
              </a>
            </div>
          </b-table-column>
        </b-table>
      </div>
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

    <trade-performance-modal
        :trade="selectedTrade"
        :is-component-modal-active="tradePerformanceModalOpen"
        @close="tradePerformanceModalOpen = false"></trade-performance-modal>
  </div>
</template>

<script>
import BlockchainHelper from "../../utils/blockchain";
import TradeActionConfirmationModal from "../../components/TradeActionConfirmationModal";
import TradePerformanceModal from "../TradePerformanceModal";
import store from "../../store";
import {ethers} from "ethers";

export default {
  name: "Orders",
  store,
  components: {TradeActionConfirmationModal, TradePerformanceModal},
  props: {
    orders: Array
  },
  data() {
    return {
      tradePerformanceModalOpen: false,
      disableButtons: true,
      actionType: 'Cancel',
      confirmationModal: false,
      confirmationContent: '',
      confirmationTitle: 'Confirmation',
      selectedTrade: undefined
    }
  },
  methods: {
    onSubmitOrOpenClick(trade) {
      this.disableButtons = false
      this.actionType = 'Cancel';
      this.confirmationModal = true;
      this.confirmationContent='Are you sure you want to cancel this order before it is executed?';
      this.selectedTrade = trade
    },
    async onSubmitAction() {
      this.confirmationContent = 'Request in progress...'
      this.confirmationModal = true
      this.disableButtons = true
      if (this.selectedTrade === undefined) {
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
          let address = await new BlockchainHelper().getAddress()
          this.$log.debug('cancelling ' + this.selectedTrade.orderId)
          let estimatedGas = await limitManager.closePos(this.selectedTrade.orderId).estimateGas({from: address})
          this.$log.debug(`Estimated gas: ${estimatedGas}`)
          await limitManager.closePos(this.selectedTrade.orderId)
          this.confirmationContent = 'Your request submitted successfully'
        } catch (e) {
          this.$log.error(e)
          if (e.code === 4001) {
            this.confirmationContent = 'You rejected the transaction'
          } else {
            this.confirmationContent = 'An error occurred, please try again'
          }
        } finally {
          this.$emit('updateOrders')
        }
      }
      this.selectedTrade = undefined
    }
  }
}
</script>

<style lang="scss">
.orders {
  overflow: hidden !important;

  &.box-border {
    border: 1px solid #262b3a;
    background: #1f2330;
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
      margin-top: 2px;
    }
  }

  .trade-performance-info-icon {
    position: relative;
    top: 0px;
    left: -4px;

    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  }

  @media screen and (max-width: 769px) {
    .table-dark {
      height: 100% !important;
    }
  }

  .table-dark {

    height: 309.5px;

    table {
      background: transparent !important;
      color: white;
      padding: 0 !important;
      font-size: 14px;
      margin-left: 20px;
      overflow-x: hidden !important;
      overflow-y: scroll !important;
    }

    th {
      color: #626e7e;
      font-size: 14px;
      padding: 0 !important;
      background: #1f2330 !important;
    }

    td, th {
      border: none !important;
      text-align: left;
      padding: 0 !important;
      padding-bottom: 8px !important;

      a {
        text-decoration: underline;
        font-style: italic;
      }
    }

    .b-table .table-wrapper.has-sticky-header {
      height: 255px;
      //min-height:400px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .b-table .table-wrapper.has-mobile-cards tr {
      background: transparent !important;
      margin-right: 30px;
    }

    .absolute {
      position: absolute;
    }
    .arrow {
      position: relative;
      left:-15px;
    }

    @media screen and (max-width: 769px) {
      .arrow {
        display: none;
      }
    }
  }

  @media screen and (min-height: 501px) {
    .b-table .table-wrapper.has-sticky-header {
      height: calc(100vh - 780px);
    }
  }
}

</style>