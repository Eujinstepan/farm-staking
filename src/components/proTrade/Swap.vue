<template>
  <div class="swap box-border">
    <div class="columns is-gapless trade-label mb-0 mt-2 block-label">{{ mode === 1 ? 'Buy' : 'Sell' }} {{
        fromToken.symbol
      }}
    </div>
    <div class="columns is-gapless type-label ml-0 mb-0 mt-0 block-label is-mobile">
      <div class="column is-2 has-text-left selected">Limit</div>
      <div class="column is-2 has-text-left not-selected" @click="openMainView(mode,fromToken.symbol,toToken.symbol, 2)">Market</div>
      <div class="column is-2 has-text-left not-selected" @click="openMainView(mode,fromToken.symbol,toToken.symbol, 3)">Cheaper</div>
    </div>
    <div class="columns is-gapless is-mobile pl-5 pr-5 mt-3">
      <div class="column trade-label mt-0 pt-0 input-wrapper">
        <div style="width: 92%; margin: 10px auto 10px;" v-if="isConnected()">
          <b-field>
            <b-slider v-model="balancePercentage" :min="0" :max="100" :tooltip="true" :format="'percent'"
                      :rounded="true" :bigger-slider-focus="true" @change="onBalancePercentageChange">
              <b-slider-tick :value="0"></b-slider-tick>
              <b-slider-tick :value="25"></b-slider-tick>
              <b-slider-tick :value="50"></b-slider-tick>
              <b-slider-tick :value="75"></b-slider-tick>
              <b-slider-tick :value="100"></b-slider-tick>
            </b-slider>
          </b-field>
        </div>

        <div class="is-flex is-justify-content-space-between mt-1">
          <div class="pl-3 max-min-label">
            Balance: {{ balance | formatPrice(6) }} {{ mode === 1 ? toToken.symbol : fromToken.symbol }}
          </div>

        </div>
        <div class="is-flex is-justify-content-space-between input-container">
          <b-input class="full-width" @keydown.native="onNumberInputKeypress($event)"
                   v-model="amount"
                   :placeholder="'Amount'"></b-input>
          <div class="token-label">{{ mode === 1 ? toToken.symbol : fromToken.symbol }}</div>
        </div>

        <div class="is-flex is-justify-content-space-between mt-1 input-container">
          <b-input class="full-width" @keydown.native="onNumberInputKeypress($event)"
                   v-model="price"
                   :placeholder="'Price'"></b-input>
          <div class="token-label">{{ mode === 1 ? fromToken.symbol : toToken.symbol }}</div>
        </div>

        <div class="is-flex is-justify-content-space-between mt-1">
          <div class="pl-3 max-min-label" v-if="mode === 1">Current (min): {{ calculateMax() | formatPrice(6) }}
            {{ fromToken.symbol }}
          </div>
          <div class="pl-4 max-min-label" v-else>Current (min): {{ calculateMin() | formatPrice(6) }} {{
              toToken.symbol
            }}
          </div>
        </div>

        <div class="is-flex is-justify-content-space-between mt-1 input-container">
          <b-input class="full-width" @keydown.native="onNumberInputKeypress($event)"
                   v-model="total"
                   readonly="true"
                   :placeholder="'Total'"></b-input>
          <div class="input-token-label">{{ mode === 1 ? fromToken.symbol : toToken.symbol }}</div>
        </div>

        <div class="is-flex is-justify-content-space-between mt-1">
          <div class="full-width">
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-if="!isConnected()"
                    @click="connectWallet()">Connect wallet
            </button>
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-else-if="noAmountChosen"
                    :disabled="noAmountChosen">Set input amount
            </button>
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-else-if="showPriceError"
                    :disabled="showPriceError">Choose a higher price
            </button>
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-else-if="balanceExceeded"
                    :disabled="balanceExceeded"
                    @click="trade()">Add {{ mode === 1 ? toToken.symbol : fromToken.symbol }} balance
            </button>
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-else-if="!isApproved"
                    @click="requestApproval()">Approve
              {{ mode === 1 ? toToken.symbol : fromToken.symbol }}
            </button>
            <button v-bind:class="{'buy-button': mode === 1, 'sell-button': mode === 2}" v-else-if="isApproved"
                    @click="trade()">{{ mode === 1 ? 'Buy' : 'Sell' }}
              {{ fromToken.symbol }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlockchainHelper from "../../utils/blockchain";
import BigNumber from "bignumber.js";
import ApiClient from "../../utils/apiClient";
import {openNewPosition} from "../../utils/openNewPositions";
import store from "../../store";
import {Ierc20Abi} from "../../constants/ierc20abi";
import {ethers} from "ethers";

export default {
  name: "Swap",
  store,
  props: {
    mode: Number,
    pool: undefined,
    setPriceFromValue: Number,
    rate: undefined
  },
  data() {
    return {
      balance: 0,
      fromToken: {
        symbol: null
      },
      toToken: {
        symbol: null
      },
      amount: undefined,
      price: undefined,
      total: undefined,
      isApproved: false,
      balanceExceeded: false,
      showPriceError: true,
      noAmountChosen: true,
      balancePercentage: 25
    }
  },
  watch: {
    '$route.params.fromAddress': {
      deep: true,
      handler: function () {
        this.init()
      },
    },
    '$store.state.proViewBuyValue': {
      deep: true,
      handler: function () {
        if (this.mode === 1) {
          this.price = this.$store.state.proViewBuyValue
        }
      },
    },
    '$store.state.proViewSellValue': {
      deep: true,
      handler: function () {
        if (this.mode === 2) {
          this.price = this.$store.state.proViewSellValue
        }
      },
    },
    amount() {
      const total = new BigNumber(this.amount).multipliedBy(this.price)
      if (!total.isNaN() && total.isFinite()) {
        this.total = total.toString(10)
      } else {
        this.total = null
      }

      this.balanceExceeded = this.amount > this.balance;
      this.noAmountChosen = this.amount === undefined || this.amount <= 0;

      setTimeout(() => {
        let re = new RegExp('^[0-9]*[.,]?[0-9]*$');
        if (this.amount && !re.test(this.amount)) {
          let output = this.amount.split('.');
          output = output.shift() + '.' + output.join('');
          this.amount = output
        }
        this.amount = this.amount.replace(',', '.')
      }, 10)

      this.updatePercentFromFromTokenValue(this.amount)
    },
    price() {
      const total = new BigNumber(this.amount).multipliedBy(this.price)
      if (!total.isNaN() && total.isFinite()) {
        this.total = total.toString(10)
      } else {
        this.total = null
      }
      let poolAndOffset
      if (this.mode === 1) {
        poolAndOffset = new BigNumber(this.calculateMax()).plus(this.calculateMinimumRateOffset())
        this.showPriceError = this.rate !== undefined && new BigNumber(this.price).comparedTo(poolAndOffset) === -1
      } else {
        const poolAndOffset = new BigNumber(this.calculateMin()).plus(this.calculateMinimumRateOffset())
        this.showPriceError = this.rate !== undefined && new BigNumber(this.price).comparedTo(poolAndOffset) !== 1
      }
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      const fromAddress = this.$route.params.fromAddress
      let list = await new BlockchainHelper().getTokensList()
      this.fromToken = list.filter((el) => {
        return el.address.toLowerCase() === fromAddress.toLowerCase()
      })[0]

      let toTokenAddress = await new BlockchainHelper().getProViewToToken(this.fromToken)
      this.toToken = list.filter((el) => {
        return el.address.toLowerCase() === toTokenAddress.toLowerCase()
      })[0]

      if (this.mode === 1) {
        setTimeout(async () => {
          this.balance = await new BlockchainHelper().getTokenBalance(this.toToken)
          this.preSetTargetPrice()
          this.onBalancePercentageChange(25)
        }, 1000)
      } else {
        setTimeout(async () => {
          this.balance = await new BlockchainHelper().getTokenBalance(this.fromToken)
          this.preSetTargetPrice()
          this.onBalancePercentageChange(25)
        }, 1000)
      }
      await this.checkIfAlreadyApproved()
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
    },
    async trade() {
      const loadingComponent = this.$buefy.loading.open()
      const blockChainHelper = new BlockchainHelper()
      const chainId = await blockChainHelper.getChainId()
      // noinspection ExceptionCaughtLocallyJS
      try {
        let address = await blockChainHelper.getAddress()
        let nativeToken = blockChainHelper.getNativeToken(chainId)
        let isNativeFlag, txnValueNative
        if (this.mode === 1) {
          isNativeFlag = this.toToken.symbol === nativeToken
          txnValueNative = (this.toToken.symbol === nativeToken) ? new BigNumber(this.amount).shiftedBy(18).toString(10) : 0
        } else {
          isNativeFlag = this.fromToken.symbol === nativeToken
          txnValueNative = (this.fromToken.symbol === nativeToken) ? new BigNumber(this.amount).shiftedBy(18).toString(10) : 0
        }

        //native tokens assumed to have 18 decimals by default, works surely for mainnet and polygon

        let fromAddress = this.fromToken.address
        let toAddress = this.toToken.address
        let poolAddress = this.pool
        let response
        if (this.mode === 1) {
          response = await new ApiClient().evaluateLimitTrade(poolAddress, toAddress, fromAddress, this.amount, this.price, chainId)
        } else {
          response = await new ApiClient().evaluateLimitTrade(poolAddress, fromAddress, toAddress, this.amount, this.price, chainId)
        }

        let userSentTokenTwo = Number(response.data.amount1) > 0
        let minTick = response.data.tickLower
        let maxTick = response.data.tickUpper
        let liquidityAmount = new BigNumber(response.data.liquidity).toString(10)


        this.$log.debug(`Amount: ${this.amount}`);
        this.$log.debug(`Price: ${this.price}`);
        this.$log.debug(`From address: ${fromAddress}`);

        let civManager = await new ethers.Contract(await blockChainHelper.getManagerAddressV2(), await blockChainHelper.getAbiV2(), store.state.signer);
        this.$log.debug(`${isNativeFlag} ${userSentTokenTwo} ${poolAddress} ${minTick} ${maxTick} ${liquidityAmount}`)
        let estimatedGas = await store.state.provider.getFeeData().gasPrice
        this.$log.debug(`Estimated gas web3: ${estimatedGas}`);

        let sendRelayed = false
        let message, txnTotal

        this.$log.debug('Send relayed is: ' + sendRelayed)
        let receipt = await openNewPosition(
            sendRelayed,
            civManager,
            poolAddress,
            userSentTokenTwo,
            isNativeFlag,
            txnValueNative,
            minTick,
            maxTick,
            new BigNumber(liquidityAmount).toString(10),
            estimatedGas,
            message,
            txnTotal
        )
        this.$log.debug('Receipt', receipt)
        let linkRoot = blockChainHelper.getExplorerLink(chainId)
        //the next row will fail if the receipt does not have a transactionHash, correctly triggering the try/catch
        this.etherscanLink = linkRoot + receipt.transactionHash
        const isSubscribedResponse = (await new ApiClient().isSubscribedEmail(address)).data
        this.subscribedEmail = isSubscribedResponse.email ? isSubscribedResponse.email : undefined
        this.swapPlaced = true;
      } catch (ex) {
        this.$log.error(ex)
        this.$buefy.toast.open({
          duration: 5000,
          message: `Wallet did not confirm, blockchain unresponsive, or market prices changed. Please try again later`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
        this.balance = await new BlockchainHelper().getTokenBalance(this.toToken)
      }
    },
    async requestApproval() {
      const loadingComponent = this.$buefy.loading.open()
      try {
        if (this.mode === 1) {
          await this.approve(this.toToken.address)
        } else {
          await this.approve(this.fromToken.address)
        }
        this.isApproved = true;
        // This approve for max amount like in uniswap is needed only first time a customer trade that token with us
      } catch (e) {
        this.isApproved = false;
        this.$log.error(e)
        this.$buefy.toast.open({
          duration: 5000,
          message: `Wallet did not Approve, or blockchain unresponsive. Please try again later`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
      }
    },
    async approve(token) {
      let vue = this
      await new ethers.Contract(token, Ierc20Abi, store.state.signer)
          .approve(await new BlockchainHelper().getManagerAddressV2(), "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").then(function (receipt) {
            vue.$log.debug(receipt)
          })
    },
    async checkIfAlreadyApproved() {
      let chainId = await new BlockchainHelper().getChainId()
      let toApproveToken = this.mode === 1 ? this.toToken : this.fromToken
      if (toApproveToken.symbol !== undefined) {
        let nativeToken = new BlockchainHelper().getNativeToken(chainId)
        if (toApproveToken.symbol === nativeToken) {
          this.isApproved = true
          return true
        } else if (this.isConnected()) {
          try {
            this.$log.debug("Checking Approve")
            let allowance = await this.getTokenAllowance(toApproveToken.address)
            let shouldAskAllowance = allowance <= 0
            this.isApproved = !shouldAskAllowance
            return !shouldAskAllowance
          } catch (e) {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Wallet did not Approve, or blockchain unresponsive. Please try again later`,
              position: 'is-bottom',
              type: 'is-danger'
            })
            this.$log.error(e)
          }
        }
      } else {
        this.$log.debug('From token is missing, skipping check of approval')
      }
    },
    async getTokenAllowance(token) {
      let address = await new BlockchainHelper().getAddress()
      let tokenContract = await new ethers.Contract(token, Ierc20Abi, store.state.signer);
      return await tokenContract
          .allowance(address, await new BlockchainHelper().getManagerAddressV2())
    },
    calculateMin() {
      let price = new BigNumber(this.rate).decimalPlaces(6)
      if (price.isNaN() || !price.isFinite()) {
        return 0
      }
      return price.toString(10)
    },
    calculateMax() {
      let price = new BigNumber(1).dividedBy(this.rate).decimalPlaces(6)
      if (price.isNaN() || !price.isFinite()) {
        return 0
      }
      return price.toString(10)
    },
    isConnected() {
      return store.state.readableSelectedAddress
    },
    calculateMinimumRateOffset() {
      const offsetPercentage = 0.2
      if (this.mode === 1) {
        const rate = new BigNumber(1).dividedBy(this.rate)
        let offset = new BigNumber(rate).multipliedBy(offsetPercentage).decimalPlaces(18)
        offset = new BigNumber(offset).dividedBy(100).decimalPlaces(18)
        return offset
      } else {
        let offset = new BigNumber(this.rate).multipliedBy(offsetPercentage).decimalPlaces(18)
        offset = new BigNumber(offset).dividedBy(100).decimalPlaces(18)
        return offset
      }
    },
    async connectWallet() {
      await new BlockchainHelper().connectWallet();
    },
    onBalancePercentageChange(percent) {
      if (this.balance > 0) {
        const value = new BigNumber(this.balance).multipliedBy(percent).dividedBy(100).decimalPlaces(18).toString()
        this.$log.debug(`Set fromTokenValue ${value} from percentage`)
        this.amount = value
      } else {
        this.amount = "0"
      }
    },
    updatePercentFromFromTokenValue(amount) {
      const percentage = new BigNumber(amount).dividedBy(this.balance).multipliedBy(100).decimalPlaces(18).toNumber()
      this.$log.debug(`Set balance percentage from fromTokenValue ${percentage}`)
      this.balancePercentage = percentage
    },
    openMainView(mode, token1, token2, type) {
      if (mode === 1) {
        window.open(`/prefill-trade/${token2}/${token1}/0/${type}`, '_blank')
      } else {
        window.open(`/prefill-trade/${token1}/${token2}/0/${type}`, '_blank')
      }
    },
    preSetTargetPrice() {
      if (this.mode === 1) {
        const max = this.calculateMax()
        if (max) {
          const offset = new BigNumber(max).multipliedBy(5).dividedBy(100)
          this.price = new BigNumber(max).plus(offset).toString(10)
        }
      } else {
        const min = this.calculateMin()
        if (min) {
          const offset = new BigNumber(min).multipliedBy(5).dividedBy(100)
          this.price = new BigNumber(min).plus(offset).toString(10)
        }
      }

    },
  },
}
</script>

<style scoped lang="scss">
.swap {
  height: 360px;

  .set-max {
    cursor: pointer;

    &:hover {
      filter: brightness(150%);
    }
  }

  .box-border {
    background: #1f2330;
  }

  .block-label {
    margin-left: 15px;
  }

  @media screen and (max-width: 700px) {
    .block-label {
      margin-top: 0 !important;
      border-top: 1px solid #262b3a;
      margin-left: 15px;
    }
  }

  .trade-label {
    color: #26a69a;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    margin-top: 20px;
  }

  .type-label {

    .selected {
      font-size: 15px;
      color: #26a69a;
      font-weight: 600;
      margin-right: 0.5vw;
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
      margin-right: 0.5vw;
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

  @media screen and (max-width: 1777px) and (min-width: 1409px) {
    .input-wrapper {
      max-width: 14vw;
    }
  }

  @media screen and (max-width: 1180px) and (min-width: 770px) {
    .input-wrapper {
      max-width: 21vw;
    }
  }

  .full-width {
    width: 100%;
  }

  .input-container {
    background: #2c323f;
    border-radius: 10px;
  }

  .token-label {
    color: white;
    position: relative;
    right: 10px;
    top: 8px;
    width: 100px;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;

    a {
      color: #6495ed !important;
      font-size: 16px;
      text-decoration: underline;
      font-weight: 500;
    }
  }

  .input-token-label {
    color: white;
    position: relative;
    right: 10px;
    top: 8px;
  }

  .container-top-border {
    border-top: 1px solid #262b3a
  }

  .max-min-label {
    font-size: 15px;
    color: #626e7e;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .buy-button {
    font-family: "Poppins", sans-serif !important;
    width: 100%;
    height: 50px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    background: #26a69a;


    &:hover {
      filter: brightness(120%);
    }
  }

  .sell-button {
    font-family: "Poppins", sans-serif !important;
    width: 100%;
    height: 50px;
    cursor: pointer;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    background: #ef5350;

    &:hover {
      filter: brightness(120%);
    }
  }

  .price-error {
    color: #f14668 !important;
    font-size: 14px !important;
    padding: 0 !important;
    font-weight: normal !important;
  }

}
</style>