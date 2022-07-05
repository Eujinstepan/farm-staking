<template>
  <div class="trade">
    <div class="has-text-light has-text-weight-bold" style="margin-top: 30px;">
      <b-message type="is-danger" has-icon style="width: 50%; margin: 20px auto" v-if="supportedNetworkError">
        The blockchain currently selected in your wallet is not supported
      </b-message>
    </div>
    <confirmation-modal
        :is-component-modal-active="swapPlaced"
        @close="onClose"
        title="Confirmation"
        notification-title="Transaction sent"
        :notification-sub-title="notificationSubtitle"
        :notification-content="notificationContent"
        :notification-disabled-content="notificationDisabledContent"
        :etherscan-link="etherscanLink"
        :subscribed-email="subscribedEmail"
    />
    <div class="limit-trade">
      <div class="columns is-mobile mb-0">
        <div class="column is-four-fifths pb-0">
          <p>CivTrade</p>
        </div>
      </div>
      <div style="width: 85%; margin: 10px auto 10px;" v-if="isConnected()">
        <b-field>
          <b-slider v-model="balancePercentage" :min="0" :max="100" :tooltip="true" :format="'percent'" :rounded="true" :bigger-slider-focus="true" @change="onBalancePercentageChange">
             <b-slider-tick :value="0"></b-slider-tick>
             <b-slider-tick :value="25"></b-slider-tick>
             <b-slider-tick :value="50"></b-slider-tick>
             <b-slider-tick :value="75"></b-slider-tick>
             <b-slider-tick :value="100"></b-slider-tick>
          </b-slider>
        </b-field>
      </div>

      <div class="options">
        <ul class="options-list">
          <li>
            <div class="is-clearfix"></div>
            <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
              <div class="token">
                <div
                    class="select-token"
                    v-if="fromToken.symbol"
                    @click="fromTokenListModalOpen = !fromTokenListModalOpen"
                >
                  <img :src="fromToken.logoURI" :alt="fromToken.name"/>
                  <p class="c-symbol">{{ fromToken.symbol }}</p>
                  <b-icon icon="chevron-down" size="is-small"></b-icon>
                </div>
                <div
                    class="select-token"
                    v-else
                    @click="fromTokenListModalOpen = !fromTokenListModalOpen"
                >
                  <p>Select a token</p>
                  <b-icon icon="chevron-down" size="is-small"></b-icon>
                </div>
              </div>
              <div class="select-token-side-buttons">
                <a class="go-to-pro-view" @click="goToProView(fromToken.address)" v-if="proTradeFromVisible">PRO</a>
              </div>
              <div class="token-value">
                <b-input
                    @input="onFromTokenChange"
                    @keydown.native="onNumberInputKeypress($event)"
                    v-model="fromTokenValue"
                    placeholder="0.0"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    :inputmode="'decimal'"
                ></b-input>
              </div>
            </div>
            <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
              <div class="balance"
                   v-bind:class="[fromToken.symbol ? '' : ' is-invisible']">
                <span v-if="$store.state.readableSelectedAddress">
                   <span>Balance: {{ $store.state.fromTokenAvailableAmount | formatPrice(6) }} {{ fromToken.symbol }}</span>
                   <span
                       class="max-button"
                       v-if="$store.state.fromTokenAvailableAmount > 0"
                       @click="fromTokenValue = $store.state.fromTokenAvailableAmount;onFromTokenChange()"> (Max)</span>
                 </span>
              </div>
              <div class="dollar-value-div">
                <b-tooltip :label="calculateDollarPrice().toString()" :active="calculateDollarPrice() > 100000000000000"
                           position="is-bottom">
                  <div class="note usd-value" v-if="fromTokenValue > 0">
                    ~$ {{ calculateDollarPrice() | formatPrice }}
                  </div>
                </b-tooltip>
                <span v-if="toToken.symbol && fromToken.symbol"
                      @click="priceCalculatorMode =1;priceCalculatorModalOpen = !priceCalculatorModalOpen">
                  <span class="set-dollar-value-button">(Set $)</span>
                </span>
              </div>
            </div>
          </li>
          <div @click="swapToken($store)">
            <b-icon
                class="c-icon"
                icon="arrow-down"
                type="is-primary"
                size="is-small"
            >
            </b-icon>
          </div>
          <li class="to-token">
            <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
              <div class="token">
                <div
                    class="select-token"
                    v-if="toToken.symbol"
                    @click="toTokenListModalOpen = !toTokenListModalOpen"
                >
                  <img :src="toToken.logoURI" :alt="toToken.name"/>
                  <p class="c-symbol">{{ toToken.symbol }}</p>
                  <b-icon icon="chevron-down" size="is-small"></b-icon>
                </div>
                <div
                    class="select-token"
                    v-else
                    @click="toTokenListModalOpen = !toTokenListModalOpen"
                >
                  <p>Select a token</p>
                  <b-icon icon="chevron-down" size="is-small"></b-icon>
                </div>
              </div>
              <div class="select-token-side-buttons">
                <a class="go-to-pro-view" @click="goToProView(toToken.address)" v-if="proTradeToVisible">PRO</a>
              </div>
              <div class="token-value fixed-width-250">
                <div class="input-padding" v-if="toToken.symbol && !inverted">{{ calculateTargetPrice() }}</div>
                <div class="input-padding" v-else-if="toToken.symbol && inverted">{{ calculateInvertedPrice() }}</div>
                <div class="input-padding" v-else>0.0</div>
              </div>
            </div>
            <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center">
              <div class="balance"
                   v-bind:class="[toToken.symbol ? '' : ' is-invisible']">
                <span v-if="$store.state.readableSelectedAddress">
                  Balance: {{ $store.state.toTokenAvailableAmount | formatPrice(6) }} {{ toToken.symbol }}
                </span>
              </div>
              <div class="dollar-value-div">
                <b-tooltip :label="calculateDollarPrice().toString()" :active="calculateDollarPrice() > 100000000000000"
                           position="is-bottom">
                  <div class="is-align-content-flex-end">
                    <div class="note usd-value" v-if="toToken.symbol && fromTokenValue > 0">~$
                      {{ calculateDollarPrice() | formatPrice }}
                    </div>
                  </div>
                </b-tooltip>
                <span v-if="toToken.symbol && fromToken.symbol"
                      @click="priceCalculatorMode = 2;priceCalculatorModalOpen = !priceCalculatorModalOpen">
                  <span class="set-dollar-value-button">(Set $)</span>
                </span>
              </div>
            </div>
          </li>
          <li class="is-flex is-justify-content-center without-background" v-if="showOrderTypeSwitch()">
            <b-field>
              <span style="font-size: 18px;margin-right: 10px;">Target/Limit</span>
              <b-switch size="is-small" v-model="orderTypeSwitch" @input="onOrderTypeSwitchChange()"></b-switch>
              <span style="font-size: 18px;margin-left:5px;">Market/Instant</span>
            </b-field>
          </li>
          <li>
            <div class="is-flex is-justify-content-flex-end is-flex-grow-1 is-align-items-center">
              <div class="note note-big" v-if="fromToken.symbol && toToken.symbol">
                <span>
                  <span>Change</span>
                  <span @click="setPriceOffset(1)" class="invert">
                    +1%
                  </span>
                  <span @click="setPriceOffset(10)" class="invert">
                    +10%
                  </span>
                  <span @click="setPriceOffset(-1)" class="invert">
                    -1%
                  </span>
                  <span @click="setPriceOffset(-10)" class="invert">
                    -10%
                  </span>
                </span>
              </div>
            </div>
            <div class="is-flex is-justify-content-space-between is-flex-grow-1 is-align-items-center ">
              <div class="target-price-label">Target Price</div>
              <div class="token-value">
                <b-input
                    @input="onTargetPriceChange"
                    @keydown.native="onNumberInputKeypress($event)"
                    v-model="targetPriceValue"
                    placeholder="0.0"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    :inputmode="'decimal'"
                    :disabled="orderTypeSwitch"
                    v-if="orderTypeSwitch === false"
                ></b-input>
                <div style="padding-top: 20px;padding-bottom:20px" v-else>Market</div>
              </div>
            </div>
            <div class="is-flex is-justify-content-flex-end is-flex-grow-1 is-align-items-center"
                 v-if="showPriceError && !inverted">
              <p class="price-error">Please choose a higher price</p>
            </div>
            <div class="is-flex is-justify-content-flex-end is-flex-grow-1 is-align-items-center"
                 v-if="showPriceError && inverted">
              <p class="price-error">Please choose a lower price</p>
            </div>
            <div class="is-flex is-justify-content-flex-end is-flex-grow-1 is-align-items-center">
              <div class="note" v-if="fromToken.symbol && toToken.symbol">
                <span>
                  <span v-if="inverted === false">
                    {{ toToken.symbol }} per {{ fromToken.symbol }}
                  </span>
                  <span v-else>{{ fromToken.symbol }} per {{ toToken.symbol }}</span>
                  <span @click="onInvertClick()" class="invert">
                    (Invert)
                  </span>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="trade-info" v-if="$store.state.currentNetwork.text === 'Ethereum' && minimumRate && !orderTypeSwitch">
        <div class="is-pulled-left">
          <tooltip-token></tooltip-token>
        </div>
        <div class="is-pulled-right price-pair">
          <span>Current (min): {{ calculateMin() | formatPrice(6) }} {{ toToken.symbol }} per {{
              fromToken.symbol
            }}</span>
        </div>
        <div class="is-pulled-right price-pair">
          <span>Current (max): {{ calculateMax() | formatPrice(6) }} {{ fromToken.symbol }} per {{
              toToken.symbol
            }}</span>
        </div>
        <div class="is-clearfix"></div>
        <div class="mt-2 has-text-left is-size-6"
             v-if="show0ApiInfo()">
          <b-tooltip
              :label="'This estimate is based on the current price quotes provided by the 0x API service'">
            <b-icon icon="information-outline" size="is-small"></b-icon>
            <template v-slot:content>
              <div>This estimate is based on the current price quotes provided by the 0x API service
              </div>
            </template>
          </b-tooltip>
          You receive {{ guaranteedPricePercentage | formatPrice(2) }}% more {{ toToken.symbol }} than the
          {{ guaranteedTargetQuantity | formatPrice(6) }} from a traditional swap
        </div>
      </div>

      <div class="trade-info" v-else-if="minimumRate && !orderTypeSwitch">
        <div class="is-pulled-left">
          <tooltip-token></tooltip-token>
        </div>
        <div class="is-pulled-right price-pair">
          <span>Current (min): {{ calculateMin() | formatPrice(6) }} {{
              toToken.symbol
            }} per {{ fromToken.symbol }}</span>
        </div>
        <div class="is-pulled-right price-pair">
          <span>Current (max): {{ calculateMax() | formatPrice(6) }} {{ fromToken.symbol }} per {{
              toToken.symbol
            }}</span>
        </div>
        <div class="is-clearfix"></div>
        <div class="mt-2 has-text-left is-size-6"
             v-if="guaranteedTargetQuantity && guaranteedPricePercentage && guaranteedPricePercentage !== 'NaN'">
          <b-tooltip
              :label="'This estimate is based on the current price quotes provided by the 0x API service'">
            <b-icon icon="information-outline" size="is-small"></b-icon>
            <template v-slot:content>
              <div>This estimate is based on the current price quotes provided by the 0x API service
              </div>
            </template>
          </b-tooltip>
          You receive {{ guaranteedPricePercentage | formatPrice(2) }}% more {{ toToken.symbol }} than the
          {{ guaranteedTargetQuantity | formatPrice(6) }} from a traditional swap
        </div>
      </div>

      <div>
        <button class="approve-button" @click="requestApproval()" v-if="!noLiquidityPool && !isApproved">
          <img class="approve-icon" :src="fromToken.logoURI" :alt="fromToken.name"/> Allow CivTrade to use your
          {{ fromToken.symbol }}
        </button>
      </div>

      <div class="is-flex is-justify-content-center without-background has-text-light mb-2 mt-2"
           v-if="showTargetTypeSwitch()">
        <b-field>
          <span style="font-size: 18px;margin-left:8px;margin-right: 10px;font-weight: 500">Faster</span>
          <b-switch :disabled="!showGasTypeSwitch()" size="is-small" v-model="gasTypeSwitch"></b-switch>
          <span style="font-size: 18px;margin-left:5px;font-weight: 500">
            Cheaper
            <b-tooltip :position="'is-left'" v-if="minGasToDisplayUser">
               <b-icon class="gas-type-info" icon="information-outline" size="is-small"></b-icon>
               <template v-slot:content>
                 Trade type available <br/>when {{ nativeToken }} input is at least {{ minGasToDisplayUser }}
               </template>
            </b-tooltip>

          </span>
        </b-field>
      </div>

      <div>
        <button class="trade-button" v-if="!$store.state.readableSelectedAddress" @click="showWeb3Modal()">
          Connect wallet
        </button>
        <button class="trade-button-disabled" v-else-if="fromTokenValue === 0 || fromTokenValue === null" disabled>
          Enter an amount
        </button>
        <button class="trade-button-disabled"
                v-else-if="parseFloat(fromTokenValue) > parseFloat($store.state.fromTokenAvailableAmount)" disabled>
          Add {{ fromToken.symbol }} balance
        </button>
        <button class="trade-button-disabled"
                v-else-if="(fromTokenValue !== 0 && fromTokenValue !== null) && toToken['name'] === undefined" disabled>
          Select a token
        </button>
        <button class="trade-button-disabled" v-else-if="targetPriceValue === 0 || targetPriceValue === null" disabled>
          Enter a price
        </button>
        <button class="trade-button-disabled" style="font-size: 18px" v-else-if="checkingLiquidity">
          Loading...
        </button>
        <button class="trade-button-disabled" v-else-if="noLiquidityPool && orderTypeSwitch === false">
          Choose liquid pair/ try later
        </button>
        <button class="trade-button-disabled"
                v-else-if="!isApproved || (noLiquidityPool && orderTypeSwitch === false) || showPriceError || supportedNetworkError" disabled>
          Check the input
        </button>
        <div v-else-if="orderTypeSwitch === true && isApproved">
          <div class="is is-flex is-justify-content-center">
            <b-field style="width: 300px;color:white">
              <template v-slot:default>
                Max slippage {{ slippage }}%
                <b-slider v-model="slippage" :min="0.1" :max="20" :step="0.1"></b-slider>
              </template>
            </b-field>
          </div>
          <button v-bind:class="[tradeInProgress ? ' trade-button-disabled font-25' : ' trade-button']"
                  @click="performTrade" :disabled="tradeInProgress">
            {{ tradeInProgress ? 'Trade in progress' : 'CivTrade' }}
          </button>
        </div>
        <button v-bind:class="[tradeInProgress ? ' trade-button-disabled font-25' : ' trade-button']"
                @click="performTrade" :disabled="tradeInProgress" v-else-if="!noLiquidityPool && isApproved">
          {{ tradeInProgress ? 'Trade in progress' : 'CivTrade' }}
        </button>
      </div>

    </div>

    <div class="note-bottom-icon is-hidden-tablet is-hidden-mobile">
      <b-icon icon="information-outline" size="is-large"></b-icon>
    </div>

    <div class="trades-performance" v-if="$store.state.readableSelectedAddress">
      View
      <router-link :to="{ name: 'TradesPerformance' }">Your CivTrades</router-link>
    </div>
    <token-list-modal
        :all-tokens="allTokens"
        :from-token="fromToken"
        :to-token="toToken"
        :is-component-modal-active="fromTokenListModalOpen"
        @selected="fromTokenSelected"
        @close="fromTokenListModalOpen = false"
    />
    <token-list-modal
        :all-tokens="allTokens"
        :is-component-modal-active="toTokenListModalOpen"
        :from-token="fromToken"
        :to-token="toToken"
        @selected="toTokenSelected"
        @close="toTokenListModalOpen = false"
    />
    <price-calculator
        :is-component-modal-active="priceCalculatorModalOpen"
        :from-token="fromToken"
        :from-token-price="fromTokenPrice"
        :to-token-price="toTokenPrice"
        :to-token="toToken"
        :mode="priceCalculatorMode"
        :dollar-value="getDollarValue()"
        @close="priceCalculatorModalOpen = false"
        @set="setTargetPrice"
        @onInvert="setCalculationMode"
    />
  </div>
</template>

<script>
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import TooltipToken from "@/components/TooltipToken";
import TokenListModal from "@/components/TokenListModal.vue";
import PriceCalculator from "../components/PriceCalculator";
import ApiClient from '../utils/apiClient.js'
import store from '../store/index'
import BigNumber from "bignumber.js";
import {Ierc20Abi} from "../constants/ierc20abi";
import BlockchainHelper from "../utils/blockchain";
import TradeHelper from "../utils/trade";
import {openNewPosition} from '../utils/openNewPositions.js';
import {ethers} from "ethers";
//import { ethers } from 'ethers';

const debounce = 250

export default {
  name: "Trade",
  store,
  components: {
    PriceCalculator,
    TooltipToken,
    ConfirmationModal,
    TokenListModal
  },
  data: () => {
    return {
      swapPlaced: false,
      fromTokenValue: null,
      targetValue: null,
      fromTokenListModalOpen: false,
      toTokenListModalOpen: false,
      priceCalculatorModalOpen: false,
      priceCalculatorMode: 1,
      inverted: false,
      fromToken: {},
      toToken: {},
      fromTokenPrice: 1,
      toTokenPrice: 1,
      targetPriceValue: null,
      allTokens: [],
      notificationSubtitle: '',
      notificationContent: '',
      notificationDisabledContent: '',
      noLiquidityPool: true,
      isApproved: true,
      etherscanLink: '#',
      minimumRate: undefined,
      minMinimumRate: undefined,
      maxMinimumRate: undefined,
      poolContract: undefined,
      showPriceError: false,
      checkingLiquidity: false,
      supportedNetworkError: false,
      guaranteedTargetQuantity: null,
      guaranteedPricePercentage: null,
      subscribedEmail: null,
      orderTypeSwitch: false,
      gasTypeSwitch: false,
      nativeToken: '',
      toTokenMarketValue: null,
      minGasToDisplayUser: undefined,
      canBeRelayed: false,
      slippage: 0.5,
      tradeInProgress: false,
      proTradeFromVisible: false,
      proTradeToVisible: false,
      balancePercentage: 25
    };
  },
  created: async function () {
    await this.getTokensList()
    await this.updatePrices()
    await this.calculateMinGasDisplayToUser()
    await this.handlePrefill()
    await this.handlePrefillTrade()
    this.onBalancePercentageChange(25)
    await store.dispatch('setSelectedFromToken', this.fromToken)
    await store.dispatch('setSelectedToToken', this.toToken)
  },

  watch: {
    '$store.state.selectedFromToken': {
      deep: true,
      handler: async function () {
        this.fromToken = store.state.selectedFromToken
      }
    },
    '$store.state.selectedToToken': {
      deep: true,
      handler: async function () {
        this.toToken = store.state.selectedToToken
      },
    },
    '$store.state.chainId': {
      deep: true,
      handler: async function () {
        if (store.state.readableSelectedAddress) {
          const chainId = await new BlockchainHelper().getChainId()
          this.supportedNetworkError = (chainId !== 1 && chainId !== 42 && chainId !== 4 && chainId !== 137
              && chainId !== 80001
          )
        } else {
          this.supportedNetworkError = false
        }
      },
    },
    fromToken: {
      deep: true,
      handler: async function () {
        this.minimumRate = undefined
        this.minMinimumRate = undefined
        this.maxMinimumRate = undefined
        this.targetPriceValue = undefined
        await this.onOrderTypeSwitchChange()
        await this.updateFromTokenBalance()
        await this.updatePrices()
        await this.showProTradeIcon(0)
        this.preSetTargetPrice()
        this.onBalancePercentageChange(25)
        await store.dispatch('setSelectedFromToken', this.fromToken)
      }
    },
    toToken: {
      deep: true,
      handler: async function () {
        this.minimumRate = undefined
        this.minMinimumRate = undefined
        this.maxMinimumRate = undefined
        await this.onOrderTypeSwitchChange()
        await this.updateToTokenBalance()
        await this.updatePrices()
        await this.calculateMinGasDisplayToUser()
        await this.showProTradeIcon(1)
        this.preSetTargetPrice()
        await store.dispatch('setSelectedToToken', this.toToken)
      }
    },
    targetPriceValue: {
      deep: true,
      handler: async function () {
        if (this.timeout)
          clearTimeout(this.timeout);

        this.timeout = setTimeout(async () => {
          this.validateTargetPrice()
          await this.updatePrices()
          await this.calculateMinGasDisplayToUser()
        }, debounce)
      }
    },
    minimumRate: function () {
      if (this.timeout)
        clearTimeout(this.timeout);

      this.timeout = setTimeout(async () => {
        this.validateTargetPrice()
      }, debounce)

    },
    '$store.state.currentNetwork': async function (newValue, oldValue) {
      if (oldValue.text !== undefined) {
        this.toToken = {}
      }
      await this.updateFromTokenBalance()
      await this.updateToTokenBalance()
      await this.getTokensList()
      await this.handlePrefill()
      await this.handlePrefillTrade()
    },
    canBeRelayed: {
      deep: true,
      handler: async function (value) {
        if(this.gasTypeSwitch === true) {
          this.gasTypeSwitch = value
        }
      }
    },
    fromTokenValue: {
      deep: true,
      handler: function (amount) {
        if (this.timeout)
          clearTimeout(this.timeout);
        this.timeout = setTimeout(async () => {
          this.updatePercentFromFromTokenValue(amount)
          this.calculateTargetPrice()
          await this.calculateToTokenMarketValue()
        }, debounce)
      }
    },
    orderTypeSwitch: {
      deep: true,
      handler: async function() {
        await this.calculateToTokenMarketValue()
      }
    }
  },
  methods: {
    isConnected() {
      return store.state.readableSelectedAddress
    },
    onFromTokenChange: async function () {
      if (this.timeout)
        clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        await this.checkIfAlreadyApproved()
        await this.updatePrices()
        await this.calculateMinGasDisplayToUser()
      }, debounce)
      setTimeout(() => {
        let re = new RegExp('^[0-9]*[.,]?[0-9]*$');
        if (this.fromTokenValue && !re.test(this.fromTokenValue)) {
          let output = this.fromTokenValue.split('.');
          output = output.shift() + '.' + output.join('');
          this.fromTokenValue = output
        }
        this.fromTokenValue = this.fromTokenValue.replace(',', '.')
      }, 10)
    },
    async handlePrefill() {
      /** PREFILL FROM ROUTE (URL) **/
      if (this.$route.params.fromToken !== undefined) {
        let token = this.allTokens.filter(token => token.symbol.toLowerCase() === this.$route.params.fromToken.toLowerCase());
        if (token.length > 0) {
          this.fromToken = token[0];
        }
      } else { /** ELSE SET DEFAULT CHAIN TOKEN ON FROM **/
        this.fromToken = await new BlockchainHelper().getNativeTokenObject()
      }
      if (this.$route.params.toToken !== undefined) {
        let token = this.allTokens.filter(token => token.symbol.toLowerCase() === this.$route.params.toToken.toLowerCase());
        if (token.length > 0) {
          this.toToken = token[0];
        }
      }
      if (this.$route.params.targetPrice !== undefined) {
        setTimeout(() => {
          this.targetPriceValue = new BigNumber(this.$route.params.targetPrice).decimalPlaces(18).toNumber()
        }, 500);
      }
      /** END PREFILL FROM ROUTE (URL) **/
    },
    async handlePrefillTrade() {
      /** PREFILL-TRADE FROM ROUTE (URL) **/
      if (this.$route.params.fromToken !== undefined) {
        let token = this.allTokens.filter(token => token.symbol.toLowerCase() === this.$route.params.fromToken.toLowerCase());
        if (token.length > 0) {
          this.fromToken = token[0];
        }
      } else { /** ELSE SET DEFAULT CHAIN TOKEN ON FROM **/
        this.fromToken = await new BlockchainHelper().getNativeTokenObject()
      }
      if (this.$route.params.toToken !== undefined) {
        let token = this.allTokens.filter(token => token.symbol.toLowerCase() === this.$route.params.toToken.toLowerCase());
        if (token.length > 0) {
          this.toToken = token[0];
        }
      }
      if (this.$route.params.targetPrice !== undefined) {
        setTimeout(() => {
          this.targetPriceValue = new BigNumber(this.$route.params.targetPrice).decimalPlaces(18).toNumber()
        }, 500);
      }
      if (this.$route.params.tradeType !== undefined) {
          //1=default=target
         if(this.$route.params.tradeType === '2') {
           //2=market
           this.orderTypeSwitch = true
           await this.onOrderTypeSwitchChange()
         } else if(this.$route.params.tradeType === '3') {
           if(this.showGasTypeSwitch()) {
             this.gasTypeSwitch = true
           }
         }
      }
      //3=cheaper (tbd)
      /** END PREFILL-TRADE FROM ROUTE (URL) **/
    },
    onTargetPriceChange: function () {
      setTimeout(() => {
        let re = new RegExp('^[0-9]*[.,]?[0-9]*$');
        if (this.targetPriceValue && !re.test(this.targetPriceValue)) {
          let output = this.targetPriceValue.split('.');
          output = output.shift() + '.' + output.join('');
          this.targetPriceValue = output
          this.$nextTick()
        }
        this.targetPriceValue = this.targetPriceValue.replace(',', '.')
      }, 10)
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
    onClose: function () {
      this.swapPlaced = false;
    },
    fromTokenSelected: function (token) {
      this.fromToken = token;
      this.fromTokenListModalOpen = false;
    },
    toTokenSelected: function (token) {
      this.toToken = token;
      this.toTokenListModalOpen = false;
    },
    setTargetPrice: function (price, inverted) {
      this.targetPriceValue = new BigNumber(price).toNumber()
      this.inverted = inverted;
    },
    setCalculationMode: function (mode) {
      this.priceCalculatorMode = mode
    },
    swapToken: async function () {
      this.guaranteedTargetQuantity = undefined
      let token = JSON.parse(JSON.stringify(this.fromToken));
      this.fromToken = JSON.parse(JSON.stringify(this.toToken));
      this.fromTokenValue = this.calculateTargetPrice()
      let targetPrice = new BigNumber(1).dividedBy(this.targetPriceValue).decimalPlaces(18)
      if (targetPrice.isNaN() || !targetPrice.isFinite()) {
        targetPrice = new BigNumber(0)
      }
      this.targetPriceValue = targetPrice.toNumber()
      this.toToken = JSON.parse(JSON.stringify(token))
      await this.checkIfAlreadyApproved()
      await this.updatePrices()
    },
    showWeb3Modal: async function () {
      await new BlockchainHelper().connectWallet();
      await this.updateFromTokenBalance()
      await this.updateToTokenBalance()
    },
    performTrade: async function () {
      this.tradeInProgress = true
      const chainId = await new BlockchainHelper().getChainId()

      this.$log.debug("Checking " + this.targetPriceValue + " - with minimum rate " + this.minimumRate)
      const blockChainHelper = new BlockchainHelper()
      this.validateTargetPrice()
      if (!this.showPriceError) {
        let targetPrice = this.inverted ? new BigNumber(1).dividedBy(this.targetPriceValue).decimalPlaces(6) : new BigNumber(this.targetPriceValue);
        if (targetPrice.isNaN() || !targetPrice.isFinite()) {
          targetPrice = new BigNumber(0)
        }
        if (!(await this.checkIfAlreadyApproved())) {
          await this.requestApproval()
        } else {
          if (this.orderTypeSwitch === false) {
            const loadingComponent = this.$buefy.loading.open()
            // noinspection ExceptionCaughtLocallyJS
            try {
              let address = await blockChainHelper.getAddress()
              let nativeToken = blockChainHelper.getNativeToken(chainId)
              let isNativeFlag = (this.fromToken.symbol === nativeToken || this.toToken.symbol === nativeToken)
              let txnValueNative = (this.fromToken.symbol === nativeToken) ? new BigNumber(this.fromTokenValue).shiftedBy(18).toString(10) : 0
              //native tokens assumed to have 18 decimals by default, works surely for mainnet and polygon

              let fromAddress = this.fromToken.address
              let toAddress = this.toToken.address
              let poolAddress = this.poolContract
              this.$log.debug('Eval Direct trade: ' + poolAddress, fromAddress, toAddress, this.fromTokenValue, targetPrice.toString(10), chainId)
              const response = await new ApiClient().evaluateLimitTrade(poolAddress, fromAddress, toAddress, this.fromTokenValue, targetPrice, chainId)
              let userSentTokenTwo = Number(response.data.amount1) > 0
              let minTick = response.data.tickLower
              let maxTick = response.data.tickUpper
              let liquidityAmount = new BigNumber(response.data.liquidity).toString(10)

              this.$log.debug(`Amount: ${ this.fromTokenValue}`);
              this.$log.debug(`Price: ${ targetPrice}`);

              let civManager = await new BlockchainHelper().getCivManager()
              this.$log.debug(`${isNativeFlag} ${userSentTokenTwo} ${poolAddress} ${minTick} ${maxTick} ${liquidityAmount} ${txnValueNative}`);
              let estimatedGas = await store.state.provider.getFeeData().gasPrice

              this.$log.debug(`Estimated gas web3: ${estimatedGas}`);
              let gasPrice = await new BlockchainHelper().getGasPrice()
              let gasValue = new BigNumber(gasPrice).multipliedBy(estimatedGas).multipliedBy(1.2)
              let minGas = new BigNumber(gasValue).multipliedBy(20)
              let canBeRelayed = isNativeFlag && (Number(txnValueNative) > Number(minGas))

              if (this.gasTypeSwitch === true && !canBeRelayed) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Cannot be relayed')
              }

              let sendRelayed = (this.gasTypeSwitch === true && canBeRelayed)
              let message, txnTotal, targetQ

              if (sendRelayed && canBeRelayed) {
                targetQ = new BigNumber(this.fromTokenValue).multipliedBy(targetPrice).decimalPlaces(9).toNumber()
                message = 'Trade ' + this.fromTokenValue + ' ' + this.fromToken.symbol + ' for ' + targetQ + ' ' + this.toToken.symbol + ' at a price of ' + targetPrice + ' ' + this.toToken.symbol + ' per ' + this.fromToken.symbol + ', zero gas cost to sign this and confirm your approval'
                txnTotal = txnValueNative
                txnValueNative -= gasValue
                let newBaseAmount = new BigNumber(txnValueNative).shiftedBy(-18).toString(10)
//                let newTargetAmount = new BigNumber(targetQ).shiftedBy(this.toToken.decimals).toString(10)
//                let newPrice = new BigNumber(newTargetAmount).dividedBy(txnValueNative).toString(10)
//                BUG!
                let newPrice = new BigNumber(this.fromTokenValue).multipliedBy(targetPrice).dividedBy(newBaseAmount).toString(10)
                //this.$log.debug(txnTotal, txnValueNative, newBaseAmount, targetQ, newTargetAmount)
                const responseRelayed = await new ApiClient().evaluateLimitTrade(poolAddress, fromAddress, toAddress, newBaseAmount, newPrice, chainId)
                this.$log.debug('Eval Relayed trade: ' + poolAddress, fromAddress, toAddress, newBaseAmount, newPrice, chainId)
                //this.$log.debug(responseRelayed.data)
                minTick = responseRelayed.data.tickLower
                maxTick = responseRelayed.data.tickUpper
                liquidityAmount = new BigNumber(responseRelayed.data.liquidity).toString(10)
              }
              this.$log.debug('Send relayed is: ' + sendRelayed)
              this.$log.debug(`send 2 ${isNativeFlag} ${userSentTokenTwo} ${poolAddress} ${minTick} ${maxTick} ${liquidityAmount} ${txnValueNative} ${message}`);
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
              await this.updateFromTokenBalance()
              await this.updateToTokenBalance()
            }
          } else {
            try {
              let nativeToken = blockChainHelper.getNativeToken(chainId)
              let txnValueNative = (this.fromToken.symbol === nativeToken) ? new BigNumber(this.fromTokenValue).shiftedBy(18).toString(10) : 0
              await store.state.provider.estimateGas({value: txnValueNative})
              let address = await blockChainHelper.getAddress()
              let swapAmount = new BigNumber(this.fromTokenValue).shiftedBy(this.fromToken.decimals).toString(10)
              this.$log.debug("Swap params", await this.getInchFromAddress(), await this.getInchToAddress(), swapAmount, this.slippage, address, chainId)
              let swapTxn = await new ApiClient().swapTokens(await this.getInchFromAddress(), await this.getInchToAddress(), swapAmount, this.slippage, address, chainId)
              swapTxn = swapTxn.data
              this.$log.debug("Swap txn: ", swapTxn)
              if (swapTxn) {
                swapTxn.tx.gasLimit = ethers.utils.hexlify(parseInt(swapTxn.tx.gas))
                swapTxn.tx.gasPrice = ethers.utils.hexlify(parseInt(swapTxn.tx.gasPrice))
                swapTxn.tx.value = ethers.BigNumber.from(swapTxn.tx.value).toHexString()
                delete swapTxn.tx.gas
                this.$log.debug("Swap txn", swapTxn.tx)
                const transaction = await store.state.signer.sendTransaction(swapTxn.tx)
                this.$log.debug("Swap 1inch completed", transaction)
              }
            } catch (err) {
              this.$log.error(err)
            }
          }
        }
      }
      this.tradeInProgress = false
    },
    async isEthereumNetworkSelected() {
      return await new BlockchainHelper().getChainId() === 1
    },
    async approve(token) {
      // let address = await new BlockchainHelper().getAddress()
      let vue = this
      await new ethers.Contract(token, Ierc20Abi, store.state.signer)
          .approve(await new BlockchainHelper().getManagerAddressV2(), "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
          .then(function (receipt) {
            vue.$log.debug(receipt)
          })
    },
    async requestApproval() {
      if (this.orderTypeSwitch === false) {
        const loadingComponent = this.$buefy.loading.open()
        try {
          await this.approve(this.fromToken.address)
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
      } else {
        try {
          let address = await new BlockchainHelper().getAddress()
          let chainId = await new BlockchainHelper().getChainId()
          this.$log.debug("Allowance params", await this.getInchFromAddress(), address, chainId)
          let checkAllow = await new ApiClient().checkInchAllowance(await this.getInchFromAddress(), address, chainId)
//          let swapAmount = new BigNumber(this.fromTokenValue).shiftedBy(this.fromToken.decimals).toString(10)
          const allowanceInch = new BigNumber(checkAllow.data.allowance)
          this.$log.debug("CheckAllow value:", allowanceInch)
          if (Number(allowanceInch) <= 0) {
            this.$log.debug("Get extra allowance params", await this.getInchFromAddress(), chainId)
            let getAllowanceTxnResponse = await new ApiClient().getExtraInchAllowance(await this.getInchFromAddress(), chainId)
            this.$log.debug("GetExtraAllowance txn", getAllowanceTxnResponse)
            if (getAllowanceTxnResponse.status === 200) {
              const txAllowOut = await store.state.signer.sendTransaction({
                from: address,
                to: getAllowanceTxnResponse.data.to,
                value: ethers.BigNumber.from(getAllowanceTxnResponse.data.value).toHexString(),
                gasPrice: ethers.BigNumber.from(getAllowanceTxnResponse.data.gasPrice).toHexString(),
                data: getAllowanceTxnResponse.data.data
              })
              if (txAllowOut.status) {
                this.$log.debug("Allowance extra on 1inch completed")
                this.isApproved = true;
                return true;
              }
            }
          }
        } catch (err) {
          this.$log.error("Check 1inch allowance error " + err)
        }
      }
    },
    async getTokenAllowance(token) {
      let address = await new BlockchainHelper().getAddress()
      let tokenContract = await new ethers.Contract(token, Ierc20Abi, store.state.signer)
      return await tokenContract
          .allowance(address, await new BlockchainHelper().getManagerAddressV2())
    },
    async checkIfAlreadyApproved() {
      let chainId = await new BlockchainHelper().getChainId()
      if (this.orderTypeSwitch === false) {
        if (this.fromToken.symbol !== undefined) {
          let nativeToken = new BlockchainHelper().getNativeToken(chainId)
          if (this.fromToken.symbol === nativeToken) {
            this.isApproved = true
            return true
          } else if (this.isConnected()) {
            try {
              this.$log.debug("Checking Approve")
//BigNumber and exact amount
              let allowance = await this.getTokenAllowance(this.fromToken.address)
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
      } else {
        let nativeToken = new BlockchainHelper().getNativeToken(1)
        if (this.fromToken.symbol === nativeToken) {
          this.isApproved = true
          return true
        }
        const address = await new BlockchainHelper().getAddress()
        this.$log.debug("Allowance params", await this.getInchFromAddress(), address, chainId)
        try {
//avoid repeated requests; must be a bigNumber!
          let checkAllow = await new ApiClient().checkInchAllowance(await this.getInchFromAddress(), address, chainId)
//          const swapAmount = new BigNumber(this.fromTokenValue).shiftedBy(this.fromToken.decimals).toString(10)
//          const allowanceInch = checkAllow.data.allowance
          const allowanceInch = new BigNumber(checkAllow.data.allowance)
          this.$log.debug("CheckAllow value:", BigNumber(allowanceInch).toString(10))
          if (Number(allowanceInch) <= 0) {
//          if (new BigNumber(allowanceInch).comparedTo(swapAmount) === 1) {
/*            this.isApproved = true
            return true;
*/            this.isApproved = false
            return false;
          } else {
/*            this.isApproved = false
            return false
*/            this.isApproved = true
            return true
          }
        } catch (err) {
          this.$log.error("Check 1inch allowance error " + err)
        }
      }
    },
    isTokensSelected() {
      return this.toToken['name'] !== undefined && this.fromToken['name'] !== undefined
    },
    isAmountSet() {
      return this.fromTokenValue !== 0
          && this.fromTokenValue !== null
          && this.targetPriceValue !== 0
          && this.targetPriceValue !== null
    },
    async updateFromTokenBalance() {
      let balance = await new BlockchainHelper().getTokenBalance(this.fromToken)
      await store.dispatch('setFromTokenAvailableAmount', balance);
    },
    async updateToTokenBalance() {
      let balance = await new BlockchainHelper().getTokenBalance(this.toToken)
      await store.dispatch('setToTokenAvailableAmount', balance);
    },
    onInvertClick() {
      this.inverted = !this.inverted
      if (parseFloat(this.targetPriceValue) !== 0 && this.targetPriceValue !== null) {
        let targetPrice = new BigNumber(1).dividedBy(this.targetPriceValue).decimalPlaces(18)
        if (targetPrice.isNaN() || !targetPrice.isFinite()) {
          targetPrice = 0
        }
        this.targetPriceValue = targetPrice.toString(10)
      }
    },
    async getTokensList() {
      this.allTokens = await new BlockchainHelper().getTokensList()
      await store.dispatch('setAllTokensList', this.allTokens)
    },
    calculateMinimumRateOffset(response) {
      let res = new TradeHelper().calculateMinimumRateOffset(response);
      return res
    },
    async updatePrices() {
      let res = new TradeHelper().updatePrices(this.fromToken, this.fromTokenPrice, this.toToken, this.toTokenPrice, this.checkingLiquidity, this.noLiquidityPool, this.poolContract, this.poolContract, this.minimumRate, this.minMinimumRate, this.maxMinimumRate,this.fromTokenValue, this.guaranteedTargetQuantity, this.guaranteedPricePercentage);
      res.then((val) => {
        [this.fromTokenPrice, this.toTokenPrice, this.checkingLiquidity, this.noLiquidityPool, this.poolContract, this.minimumRate, this.minMinimumRate, this.maxMinimumRate, this.guaranteedTargetQuantity, this.guaranteedPricePercentage] = val;
      });
    },
    validateTargetPrice() {
      let res = new TradeHelper().validateTargetPrice(this.targetPriceValue,this.inverted, this.minMinimumRate,this.maxMinimumRate);
      this.showPriceError = res;
    },
    calculatePercentage(chainId, guaranteedPrice) {
      let res = new TradeHelper().calculatePercentage(chainId, guaranteedPrice, this.inverted, this.targetPriceValue, this.fromTokenValue);
      [this.guaranteedTargetQuantity, this.guaranteedPricePercentage] = res;
    },
    calculateInvertedPrice() {
      let inverted = new BigNumber(1).dividedBy(this.targetPriceValue).decimalPlaces(18)
      inverted = new BigNumber(inverted).multipliedBy(this.fromTokenValue).decimalPlaces(18)
      if (inverted.isNaN() || !inverted.isFinite()) {
        return 0
      }
      return inverted.toNumber()
    },
    calculateTargetPrice() {
      if (this.orderTypeSwitch === false) {
        let price = new BigNumber(this.targetPriceValue).multipliedBy(this.fromTokenValue).decimalPlaces(6)
        if (price.isNaN() || !price.isFinite()) {
          return 0
        }
        return price.toNumber()
      } else {
        return this.toTokenMarketValue
      }
    },
    calculateDollarPrice() {
      let price = new BigNumber(this.fromTokenPrice).multipliedBy(this.fromTokenValue).decimalPlaces(6)
      if (price.isNaN() || !price.isFinite()) {
        return 0
      }
      return price.toString(10)
    },
    calculateMin() {
      let price = new BigNumber(this.minimumRate).decimalPlaces(6)
      if (price.isNaN() || !price.isFinite()) {
        return 0
      }
      return price.toString(10)
    },
    calculateMax() {
      let price = new BigNumber(1).dividedBy(this.minimumRate).decimalPlaces(6)
      if (price.isNaN() || !price.isFinite()) {
        return 0
      }
      return price.toString(10)
    },
    show0ApiInfo() {
      return this.guaranteedTargetQuantity &&
          this.guaranteedPricePercentage &&
          this.guaranteedPricePercentage !== 'NaN' &&
          this.guaranteedPricePercentage > 0.5
    },
    getTradingViewURL(symbol) {
      if (symbol === 'ETH' || symbol === 'WETH') {
        return 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_0edbc&interval=1D&range=12M&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&locale=en&withdateranges=1&symbol=UNISWAP%3AWETHUSDT'
      }
      return `https://www.tradingview.com/widgetembed/?frameElementId=tradingview_0edbc&interval=1D&range=12M&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&locale=en&withdateranges=1&symbol=1/UNISWAP%3A${symbol}WETH`
    },
    goToProView(address) {
      this.$router.push({name:'Pro Trade', params: { fromAddress: address }}).catch(()=>{});
    },
    getDollarValue() {
      return this.priceCalculatorMode === 1 ? new BigNumber(this.fromTokenPrice).decimalPlaces(18).toString(10) : new BigNumber(this.toTokenPrice).decimalPlaces(18).toString(10)
    },
    showOrderTypeSwitch() {
      return this.fromTokenValue &&
          this.fromToken.symbol &&
          this.toToken.symbol && (
              store.state.currentNetwork.text === 'Ethereum'
              || store.state.currentNetwork.text === 'Polygon'
    )},
    showTargetTypeSwitch() {
      return this.orderTypeSwitch === false &&
          this.fromTokenValue &&
          this.fromToken.symbol &&
          this.toToken.symbol && (
              store.state.currentNetwork.text === 'Ethereum'
    )},
    async onOrderTypeSwitchChange() {
      this.slippage = 0.5
      if (this.orderTypeSwitch) {
        const loadingComponent = this.$buefy.loading.open()
        try {
          await this.calculateToTokenMarketValue()
          await this.checkIfAlreadyApproved()
        } catch (e) {
          this.$log.error(e)
        } finally {
          loadingComponent.close()
        }
      }
      else {
        this.preSetTargetPrice()
      }
    },
    async calculateToTokenMarketValue(){
      if (this.orderTypeSwitch) {
        this.targetPriceValue = undefined
        this.toTokenMarketValue = 'CALCULATING...'
        const chainId = await new BlockchainHelper().getChainId()
        const amount = new BigNumber(this.fromTokenValue).shiftedBy(this.fromToken.decimals).toString(10)
        const inchQuote = (await new ApiClient().getInchQuote(await this.getInchFromAddress(), await this.getInchToAddress(), amount, chainId)).data
        this.toTokenMarketValue = new BigNumber(inchQuote.toTokenAmount).shiftedBy(-this.toToken.decimals).toString(10)
      }
    },
    showGasTypeSwitch() {
      return (this.fromTokenValue !== null || this.fromTokenValue !== "") &&
          this.canBeRelayed &&
          this.orderTypeSwitch === false
    },
    async calculateMinGasDisplayToUser() {
      let res = new TradeHelper().calculateMinGasDisplayToUser(this.fromToken, this.toToken, this.fromTokenValue);
      [this.canBeRelayed, this.minGasToDisplayUser, this.nativeToken] = await res;
    },
    async getInchFromAddress() {
      const chainId = await new BlockchainHelper().getChainId()
      let nativeTokenAddress = new BlockchainHelper().getNativeTokenAddress(chainId).toLowerCase()
      let dummyInchNative = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      if (this.fromToken.address.toLowerCase() === nativeTokenAddress) {
        return dummyInchNative;
      }
      return this.fromToken.address.toLowerCase()
    },
    async getInchToAddress() {
      const chainId = await new BlockchainHelper().getChainId()
      let nativeTokenAddress = new BlockchainHelper().getNativeTokenAddress(chainId).toLowerCase()
      let dummyInchNative = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
      if (this.toToken.address.toLowerCase() === nativeTokenAddress) {
        return dummyInchNative;
      }
      return this.toToken.address.toLowerCase()
    },
    async showProTradeIcon(mode) {
      const chainId = await new BlockchainHelper().getChainId()
      if(mode === 0) {
        this.proTradeFromVisible = false
      } else {
        this.proTradeToVisible = false
      }
      this.$log.debug(`PRO view ${this.fromToken.symbol} for is ${this.fromToken.proView}`)
      if(chainId === 1) {
        try{
          if(mode === 0 && this.fromToken.address) {
            const pool = (await new ApiClient().getPoolProView(this.fromToken.address, chainId)).data
            this.proTradeFromVisible = this.fromToken.proView === true && pool.poolContract !== false
          } else if (mode === 1 && this.toToken.address) {
            const pool = (await new ApiClient().getPoolProView(this.toToken.address, chainId)).data
            this.proTradeToVisible = this.fromToken.proView === true && pool.poolContract !== false
          } else {
            this.$log.debug('Mode not found')
          }
        } catch (e) {
          if(mode === 0) {
            this.proTradeFromVisible = false
          } else {
            this.proTradeToVisible = false
          }
          this.$log.error(e)
        }
      }
    },
    preSetTargetPrice() {
      const min = this.calculateMin()
      if(min) {
        const offset = new BigNumber(min).multipliedBy(5).dividedBy(100)
        this.targetPriceValue = new BigNumber(min).plus(offset).toString(10)
      }
    },
    setPriceOffset(percentage) {
      let res = new TradeHelper().priceOffset(percentage, this.inverted, this.targetPriceValue, this.maxMinimumRate, this.orderTypeSwitch, this.minMinimumRate);
      [this.targetPriceValue, this.orderTypeSwitch] = res;
    },
    onBalancePercentageChange(percent) {
      if(store.state.fromTokenAvailableAmount > 0) {
        const value = new BigNumber(store.state.fromTokenAvailableAmount).multipliedBy(percent).dividedBy(100).decimalPlaces(18).toString()
        this.$log.debug(`Set fromTokenValue ${value} from percentage`)
        this.fromTokenValue = value
      } else {
        this.fromTokenValue = "0"
      }
    },
    updatePercentFromFromTokenValue(amount) {
      const percentage = new BigNumber(amount).dividedBy(store.state.fromTokenAvailableAmount).multipliedBy(100).decimalPlaces(18).toNumber()
      this.$log.debug(`Set balance percentage from fromTokenValue ${percentage}`)
      this.balancePercentage = percentage
    }
  },
}
</script>

<style scoped lang="scss">
@import '../styles/Trade/trade.scss';
</style>