<template>
  <div class="column is-2-fullhd is-3-desktop is-3-tablet recent-trades">
    <div class="columns is-gapless pb-0 mb-0 box-border">
      <div class="column is-12 box-border padding-bottom">
        <!--Recent Trades-->
        <div class="block-title">Recent Swaps at {{ feeTier | feeTierFormat }}</div>
        <div class="columns table-data is-mobile">
          <div class="column header ml-4 pl-3 is-one-quarter has-text-left nowrap">$price</div>
          <div class="column header pr-6 is-one-quarter has-text-right nowrap">$value</div>
          <div class="column header ml-0 pl-0 is-one-quarter has-text-left nowrap">Wallet</div>
          <div class="column header pl-1 has-text-left nowrap">Time</div>
        </div>
        <div>
          <div class="columns is-mobile order-book-row" v-for="(swap, index) in swaps" :key="index" @click="openTransaction(swap)">
            <div class="column ml-4 pl-3 is-one-quarter  order-book-danger pt-0 pb-1 has-text-left nowrap" v-if="getAmount(swap) < 0" :id="index" :title="getPrice(swap)">
              {{ getPrice(swap) | intlFormat() }} 
            </div>
            <div class="column ml-4 pl-3 is-one-quarter order-book-success pt-0 pb-1 has-text-left nowrap" v-else :id="index"  :title="getPrice(swap)">
              {{ getPrice(swap) | intlFormat() }}
            </div>
            <div class="column is-one-quarter order-book-info pr-5 pt-0 pb-1 has-text-right nowrap"  :title="swap.amountUSD | formatPrice(6)">
              {{ swap.amountUSD | intlFormat() }}
            </div>
            <div class="column ml-0 pl-0 pt-0 pb-1 is-one-quarter order-book-info has-text-left nowrap"  :title="getOrigin(swap)">
			{{ getOrigin(swap) }}
            </div>
            <div class="column order-book-info pl-1 pt-0 pb-1 has-text-left is-relative nowrap" :title="swap.timestamp | dateFormatFromDatestamp">
              <!--            <div style="position: absolute; background-color: #ef535040; height: 15px; width: 200px; left: -95px"></div>-->
              {{ swap.timestamp | dateFormatFromTimestamp }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-gapless fixed-height">
      <div class="column is-12">
        <swap :mode="2" class="is-hidden-mobile" :rate="rate" :pool="pool"></swap>
        <value :mode="2" :from-token="fromToken" class="is-hidden-mobile" :label-enabled="false"></value>
        <change-token @update="updatePage" class="is-hidden-mobile"></change-token>
      </div>
    </div>
  </div>
</template>

<script>
import Swap from "./Swap";
import Value from "./Value";
import ChangeToken from "./ChangeToken";
import BlockchainHelper from "../../utils/blockchain";
export default {
  name: "RecentTrades",
  props: {
    swaps: Array,
    fromToken: {},
    pool: undefined,
    feeTier: undefined,
    rate: null
  },
  data(){
    return {
      toToken: {}
    }
  },
  components: {ChangeToken, Value, Swap},
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
  methods: {
    updatePage() {
      this.$emit('update')
    },
    openTransaction(swap){
      window.open('https://etherscan.io/tx/'+swap.transactionID, '_blank')
    },
    getPrice(swap) {
      if(this.fromToken) {
        if(this.fromToken.address < this.toToken.address) {
          return swap.price0USD
        } else {
          return swap.price1USD
        }
      }
    },
    getAmount(swap) {
      if(this.fromToken) {
        if(this.fromToken.address < this.toToken.address) {
          return swap.amount1
        } else {
          return swap.amount0
        }
      }
    },
    getOrigin(swap) {
      return swap.origin
    },
  }
}
</script>

<style scoped lang="scss">

@media screen and (min-width: 700px) {
  .recent-trades {
    height: 620px !important;
  }
}
.recent-trades {

  @media screen and (min-width: 700px) {
    .fixed-height {
      height: 460px;
    }
  }

  &>div{
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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

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

  .box-border {
    border: 1px solid #262b3a;
    background: #1f2330;
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
    white-space: nowrap;
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
  }

  .order-book-success {
    color: #26a69a;
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .order-book-row{
    height: 23.5px;
    cursor: pointer;
    &:hover {
      filter: brightness(90%);
    }
  }

  .time-padding {
    padding-right: 30px;
  }

  .nowrap {
    white-space: nowrap;
  }
}
</style>