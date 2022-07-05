<template>
  <div class="farm" tabindex="0" @keyup.esc="closeModals">
    <div class="roi-modal" v-if="isHidden">
      <roi-calculators
        :staked_coin="'DAI'"
        @close-roi-modal="closeRoiModal"
      ></roi-calculators>
    </div>
    <div class="amount-modal" v-if="amountModal">
      <amount-modal
        :pid="amountModalPid"
        :title="amountModalTitle"
        :token="amountModalText"
        :depositedAmount="depositedAmount"
        :walletBalance="walletBalance"
        @action-modal="actionModal"
        @close-modal="closeAmountModal"
      >
      </amount-modal>
    </div>
    <div
      class="limit-trade"
      :class="{ notFocused: isHidden || amountModal }"
      v-if="farmPools"
    >
      <div class="trades-1 valign-text-middle rajdhani-bold-white-25px">
        CivFarm
      </div>
      <div style="width: 100%; margin: 10px auto 10px">
        <div class="is-hidden-mobile">
          <div class="columns mt-5">
            <div class="pool-titles column is-3"></div>
            <div class="pool-titles column is-3">Deposited Amount</div>
            <div class="pool-titles column is-2">Yield</div>
            <div class="pool-titles column is-2 pl-6 textLeftAlign">TVL</div>
            <div class="pool-titles column is-1 pl-0 textLeftAlign">APR</div>
          </div>
        </div>
        <div v-for="data in farmPools" :key="data.id">
          <div v-if="!isMobile">
            <farm-pool-desktop
              @open-roi-modal="openRoiModal"
              @open-amount-modal="openAmountModal"
              @close-amount-modal="closeAmountModal"
              :poolItem="data"
              :amountPid="amountModalPid"
            ></farm-pool-desktop>
          </div>
          <div v-else>
            <h1 id="length" style="color: white"></h1>
            <farm-pool-mobile
              :poolItem="data"
              :amountPid="amountModalPid"
              @open-roi-modal="openRoiModal"
              @open-amount-modal="openAmountModal"
              @close-amount-modal="closeAmountModal"
            ></farm-pool-mobile>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="trades-1 valign-text-middle rajdhani-medium-topaz-32px"
        style="margin-top: 40vh"
      >
        0 Farm Pool Results Available ...
      </div>
    </div>
  </div>
</template>

<script>
import FarmPoolDesktop from "../components/FarmPoolDesktop.vue";
import FarmPoolMobile from "../components/FarmPoolMobile.vue";
import RoiCalculators from "../components/CalcualteRoi.vue";
import AmountModal from "../components/modals/amountModal.vue";
export default {
  components: { FarmPoolDesktop, FarmPoolMobile, RoiCalculators, AmountModal },
  data() {
    return {
      isHidden: 0,
      amountModal: 0,
      selectedPool: null,
      amountModalTitle: null,
      amountModalPid: null,
      amountModalText: null,
      depositedAmount: null,
      walletBalance: null,
      amount: null,
      farmPools: [
        {
          id: 0,
          is_nft: false,
          nft_name: null,
          url: ["/icon_svg/civ-2@2x.svg"],
          text: "Stake CIV",
          isCiv: true,
          deposited_currency: "CIV",
          wallet_balance_token: "CIV",
          yield_currency: "0NE",
          tvl_currency: "CIV",
          first_token_id: "civilization",
          two_coins: false,
          token_contract: "0x37fe0f067fa808ffbdd12891c0858532cfe7361d",
        },
        {
          id: 1,
          is_nft: false,
          nft_name: null,
          url: ["/icon_svg/stone@2x.svg"],
          text: "Stake 0NE",
          isCiv: false,
          deposited_currency: "0NE",
          wallet_balance_token: "0NE",
          yield_currency: "0NE",
          tvl_currency: "0NE",
          first_token_id: "civfund-stone",
          two_coins: false,
          token_contract: "0x73a83269b9bbafc427e76be0a2c1a1db2a26f4c2",
        },
        {
          id: 2,
          is_nft: false,
          nft_name: null,
          url: ["/icon_svg/stone@2x.svg", "/icon_svg/ethereum@2x.svg"],
          text: "0NE / ETH",
          isCiv: false,
          deposited_currency: "LPTokens",
          wallet_balance_token: "LPTokens",
          yield_currency: "0NE",
          tvl_currency: "LPTokens",
          two_coins: true,
          first_token: "0NE",
          second_token: "ETH",
          first_token_id: "civfund-stone",
          second_token_id: "ethereum",
          token_contract: "0x73a83269b9bbafc427e76be0a2c1a1db2a26f4c2",
          second_token_contract: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        },
        {
          id: 3,
          is_nft: false,
          nft_name: null,
          url: ["/icon_svg/stone@2x.svg", "/icon_svg/civ-2@2x.svg"],
          text: "0NE / CIV",
          isCiv: false,
          deposited_currency: "LPTokens",
          wallet_balance_token: "LPTokens",
          yield_currency: "0NE",
          tvl_currency: "LPTokens",
          two_coins: true,
          first_token: "0NE",
          second_token: "CIV",
          first_token_id: "civfund-stone",
          second_token_id: "civilization",
          token_contract: "0x73a83269b9bbafc427e76be0a2c1a1db2a26f4c2",
          second_token_contract: "0x37fe0f067fa808ffbdd12891c0858532cfe7361d",
        },
        {
          id: 4,
          is_nft: false,
          nft_name: null,
          url: ["/icon_svg/civ-2@2x.svg", "/icon_svg/ethereum@2x.svg"],
          text: "CIV / ETH",
          isCiv: true,
          deposited_currency: "LPTokens",
          wallet_balance_token: "LPTokens",
          yield_currency: "0NE",
          tvl_currency: "LPTokens",
          two_coins: true,
          first_token: "CIV",
          second_token: "ETH",
          first_token_id: "civilization",
          second_token_id: "ethereum",
          token_contract: "0x37fe0f067fa808ffbdd12891c0858532cfe7361d",
        },
        {
          id: 5,
          nft_id: 0,
          is_nft: true,
          url: ["/icon_svg/emeraldNFT.JPG"],
          text: "NFT Elite Emerald 2000",
          isCiv: "false",
          deposited_currency: "NFT",
          wallet_balance_token: "NFT",
          yield_currency: "0NE",
          yield_id: "0NE",
          tvl_amount_currency: "NFT",
          tvl_currency: "NFT",
          style: "width:50px; border-radius:10px",
          token_contract: "0x73a83269b9bbafc427e76be0a2c1a1db2a26f4c2",
        },
      ],
      isMobile: null,
    };
  },
  methods: {
    openRoiModal() {
      this.isHidden = 1;
    },
    closeRoiModal() {
      this.isHidden = 0;
    },
    // depositEvent(amount) {
    //   this.amount = amount;
    //   this.$root.$emit("deposit", this.amountModalPid, amount );
    // },
    // withdrawEvent(amount) {
    //   this.$root.$emit("withdraw", this.amountModalPid, amount );
    // },
    openAmountModal(title, pid, text, depositedAmount, walletBalance) {
      this.amountModalTitle = title;
      this.amountModalPid = pid;
      this.amountModalText = text;
      this.depositedAmount = depositedAmount;
      this.walletBalance = walletBalance;
      this.amountModal = 1;
    },
    closeAmountModal() {
      this.amountModal = 0;
    },
    actionModal(pid, amount) {
      console.log(pid, amount, this.actionTitle);
      // if (this.actionTitle == "Deposit") {
      //   this.approveDeposit(pid, amount);
      // } else if (this.actionTitle == "Withdraw") {
      //   this.withdraw(pid, amount);
      // }
    },
    closeModals() {
      this.closeAmountModal();
      this.closeRoiModal();
    },
  },
  mounted() {
    let width = screen.width;
    if (width > 780) {
      this.isMobile = false;
    } else if (width <= 780) {
      this.isMobile = true;
    }
  },
};
</script>


<style lang="scss">
@import "../styles/variables.scss";
.limit-trade {
  max-width: 1920px;
  width: 80%;
  margin: 80px auto 30px auto;
  min-width: 310px;

  @include mq($until: mobile) {
    margin-top: 25px;
  }
}
.notFocused {
  user-select: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-filter: brightness(30%);
  filter: brightness(30%);
  pointer-events: none;
}
.textLeftAlign {
  text-align: left;
}
.textRightAlign {
  text-align: right;
}
.roi-modal {
  position: absolute;
  z-index: 2;
  float: left;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.amount-modal {
  position: absolute;
  z-index: 2;
  float: left;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

div:focus {
  outline: none;
}
.pool-titles {
  color: #7b7e88;
  font-family: "Rajdhani", Helvetica;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
}
</style>
