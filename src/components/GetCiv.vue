<template>
  <div class="columns">
    <div class="column is-6 is-offset-3">
      <div class="card mt-6">
        <div class="card-content">
          <div class="content has-text-left">
            <img width="50" height="50" src="@/assets/CIV_logo-1.svg" alt="CIV Logo"/>
            <div id="prepare-checkout" v-if="elementsOptions.clientSecret === null">
              <h3>Get your $CIV today</h3>
              <p class="is-size-6">
                $ available:
                <span v-if="polygonAvailable === null || ethereumAvailable ===null">Loading ...</span>
                <span v-else>${{ ethereumAvailable }} max (Ethereum), ${{ polygonAvailable }} max (Polygon)</span>
              </p>
              <div id="form">
                <form ref="form" @submit.prevent="prepareCheckout()">
                  <b-field label="$ investment"
                           horizontal>
                    <b-input
                        v-model="amount"
                        icon="cash"
                        placeholder="100"
                        @keydown.native="onNumberInputKeypress($event)"
                    ></b-input>
                  </b-field>

                  <b-field label="Wallet address"
                           horizontal>
                    <b-input
                        v-model="address"
                        icon="wallet"
                        placeholder="0x..."
                        pattern="^0x[a-fA-F0-9]{40}$" minlength="42"
                    ></b-input>
                  </b-field>

                  <b-field label="Blockchain"
                           horizontal>
                    <b-radio v-model="network"
                             name="network"
                             @input="getTokenReceived()"
                             native-value="1">
                      Ethereum Mainnet
                    </b-radio>
                    <b-radio v-model="network"
                             name="network"
                             @input="getTokenReceived()"
                             native-value="137">
                      Polygon Matic
                    </b-radio>
                  </b-field>


                  <div class="mb-2 has-text-weight-bold has-text-info" v-if="loadingQuote">Quoting...</div>
                  <div class="mb-2 has-text-weight-bold has-text-success" v-else-if="civTokensToReceive > 0">{{civTokensToReceive}} CIV tokens (market estimate)</div>
                  <div class="mb-2 has-text-weight-bold has-text-danger" v-else-if="showGasError">! Not enough to pay ${{ gasFees }} gas fees (estimated)</div>
                  <div class="mb-2 has-text-weight-bold has-text-danger" v-else-if="showAmountError">$ value exceeds current availability</div>
                  <div class="mb-2 has-text-weight-bold has-text-info" v-else>Please fill the form to get your market quote</div>

                  <b-button native-type="submit" type="is-success"
                            :disabled="disableGetCivButton()">Get $CIV
                  </b-button>
                </form>

              </div>
            </div>

            <div id="order-summary" v-else-if="elementsOptions.clientSecret !== null">
              <h3 class="has-text-weight-bold">Your Order Summary</h3>
              <div>
                <strong>${{orderMetadata.dollarAmount}}</strong> investment for <strong>{{ orderMetadata.civTokens }}</strong> CIV tokens (market estimate)
              </div>
              <div>
                <strong>{{orderMetadata.chainName}}</strong> blockchain, wallet address:
              </div>
              <div class="has-text-weight-bold">{{orderMetadata.walletAddress}}</div>
              <div>Fees paid: <strong>${{ orderMetadata.stripeFee }}</strong> card + <strong>${{ orderMetadata.gasFee }}</strong> gas</div>
              <div>Tokens sent to your wallet automatically within 1 hour</div>
              <div>Terms of service: all payments final upon delivery of the tokens to your wallet, as proven by the relevant block explorer (Etherscan.io or Polygonscan.com)</div>

              <div class="mt-5">
                <stripe-element-payment
                    ref="paymentRef"
                    :test-mode="true"
                    :pk="publishableKey"
                    :elements-options="elementsOptions"
                    :confirm-params="confirmParams"
                    @loading="loadingPayment()"
                    @element-ready="elementReady()"
                    @error="onError()"
                />

                <div class="has-text-info has-text-weight-bold" v-if="!cardDetailsElementReady">Card details loading...</div>
                <b-button type="is-success" class="mt-4 mr-3" @click="pay()" v-if="cardDetailsElementReady">Invest now</b-button>
                <b-loading v-model="paymentLoading"></b-loading>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {StripeElementPayment} from '@vue-stripe/vue-stripe';
import ApiClient from "../utils/apiClient";

const debounce = 500

export default {
  name: "GetCiv",
  components: {
    StripeElementPayment,
  },
  watch: {
    amount: {
      deep: true,
      handler: function () {
        if (this.timeout)
          clearTimeout(this.timeout);

        this.timeout = setTimeout(async () => {
          await this.getTokenReceived()
        }, debounce)
      }
    }
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open()
    try {
      let rep = await new ApiClient().getMaxDollarSwappable(1)
      rep = Number(rep.maxDollarSwappable) * 0.95
      let res = await new ApiClient().getMaxDollarSwappable(137)
      res = Number(res.maxDollarSwappable) * 0.95
      this.ethereumAvailable = rep.toFixed(2)
      this.polygonAvailable = res.toFixed(2)
    } catch (ex) {
      this.$log.error(ex)
      this.$buefy.toast.open({
        duration: 5000,
        message: `We cannot calculate available amounts. Please try again later`,
        position: 'is-bottom',
        type: 'is-danger'
      })
    } finally {
      loadingComponent.close()
    }
  },
  data() {
    return {
      loading: true,
      publishableKey: process.env.VUE_APP_STRIPE_KEY,
      elementsOptions: {
        clientSecret: null,
        appearance: {
          theme: 'night',
          labels: 'floating'
        },
      },
      confirmParams: {
        return_url: process.env.VUE_APP_STRIPE_SUCCESS_URL
      },
      showAmountError: false,
      showGasError: false,
      gasFees: null,
      civTokensToReceive: null,
      loadingQuote: false,
      amount: null,
      address: null,
      network: 1,
      ethereumAvailable: null,
      polygonAvailable: null,
      orderMetadata: null,
      paymentLoading: false,
      cardDetailsElementReady: false,
    };
  },
  methods: {
    async prepareCheckout() {
      const amount = this.amount;
      const address = this.address;
      const network = this.network;
      await this.initializePayment({dollarAmount: amount, walletAddress: address, network: network.toString()});
    },
    async initializePayment(userInput) {
      const loadingComponent = this.$buefy.loading.open()
      try {
        const res = await new ApiClient().getPaymentClientSecret({userInput})
        this.orderMetadata = res.metadata
        this.elementsOptions.clientSecret = res.clientSecret
      } catch (ex) {
        this.$log.error(ex)
        this.$buefy.toast.open({
          duration: 5000,
          message: `Payment did not confirm. Please try again later`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
      }

    },
    reset() {
      this.amount = null
      this.address = null
      this.network = "ethereum"
    },
    onNumberInputKeypress(event) {
      let key = event.charCode || event.keyCode || 0;
      let isNumber =
          key === 8 ||
          key === 9 ||
          key === 13 ||
          key === 46 ||
          key === 110 ||
          key === 190 ||
          key === 37 ||
          key === 39 ||
          key === 188 ||
          (key >= 48 && key <= 57) ||
          (key >= 96 && key <= 105);
      if (!isNumber) {
        event.preventDefault();
      }
      setTimeout(() => {
        let re = new RegExp('^[0-9]*[.,]?[0-9]*$');
        if (this.amount && !re.test(this.amount)) {
          let output = this.amount.split('.');
          output = output.shift() + '.' + output.join('');
          this.amount = output
        }
        this.amount = this.amount.replace(',', '.')
      }, 10)
    },
    async pay() {
      this.$refs.paymentRef.submit()
    },
    goBack() {
      this.elementsOptions.clientSecret = null
      this.cardDetailsElementReady = false
    },
    disableGetCivButton() {
      return (this.civTokensToReceive === null || this.civTokensToReceive === 0) || this.address === null
    },
    loadingPayment() {
      this.paymentLoading = true
    },
    onError() {
      this.$nextTick(() => {
        this.paymentLoading = false
      })
    },
    elementReady() {
      this.cardDetailsElementReady = true
    },
    async getTokenReceived() {
      this.showAmountError = false
      this.showGasError = false
      this.gasFees = null
      this.civTokensToReceive = null
      let max = parseInt(this.network) === 1 ? parseFloat(this.ethereumAvailable) : parseFloat(this.polygonAvailable)
      if(this.amount >= max) {
        this.showAmountError = true
      } else if(this.amount <= 0) {
        return
      } else {
        this.loadingQuote = true
        let dollarAmount = this.amount * 0.97
        let req = await new ApiClient().getSwapDetails(dollarAmount, this.network)
        let gas = req.dollarSwapPrice
        req = req.toTokens
        req = Number(req)

        if (req > 0) {
          this.civTokensToReceive =  req.toFixed(3)
        } else {
          this.showGasError = true
          this.gasFees = gas.toFixed(2);
        }
      }
      this.loadingQuote = false
    }
  }
}
</script>

<style>
/*#header {*/
/*  display: none;*/
/*}*/

#stripe-payment-element-errors{
  margin-top: 10px;
  color: red;
  font-size: 20px;
  font-weight: 900;
}
</style>