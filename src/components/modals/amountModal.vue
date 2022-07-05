<template>
  <div class="container" tabindex="0" @keyup.esc="closeRoiModal">
    <div class="header">
      <div class="header-text">Amount of {{ token }} to {{ title }}</div>
    </div>
    <div class="body">
      <div style="width: 85%; margin: 10px auto 10px">
        <b-field>
          <b-slider
            v-model="balancePercentage"
            :min="0"
            :max="100"
            :tooltip="true"
            :format="'percent'"
            :rounded="true"
            :bigger-slider-focus="true"
            @change="onBalancePercentageChange"
          >
            <b-slider-tick :value="0"></b-slider-tick>
            <b-slider-tick :value="25"></b-slider-tick>
            <b-slider-tick :value="50"></b-slider-tick>
            <b-slider-tick :value="75"></b-slider-tick>
            <b-slider-tick :value="100"></b-slider-tick>
          </b-slider>
        </b-field>
      </div>
      <div>
        <input
          v-model.number="inputAmount"
          type="number"
          placeholder="Type an amount"
          class="input-amount"
          @change="onInputChange"
        />
        <div v-if="errorMessage" class="error-message-base">
          <h3 class="error-message">{{ errorMessage }}</h3>
        </div>
      </div>
      <div class="buttons-container">
        <div class="button-container">
          <button class="action-button danger" @click="actionReject">
            Cancel
          </button>
        </div>
        <div class="button-container">
          <button class="action-button" @click="actionApproval">
            {{ title }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "amountModal",
  props: {
    title: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    pid: {
      type: Number,
    },
    walletBalance: {},
    depositedAmount: {
      type: Number,
    },
  },
  data() {
    return {
      balancePercentage: null,
      inputAmount: null,
      maxAmount: null,
      errorMessage: null,
    };
  },
  methods: {
    onBalancePercentageChange(percent) {
      //   console.log(this.pid);
      //   this.$emit("action-modal", this.pid, 2);
      this.inputAmount = (this.maxAmount * percent) / 100;
    },
    actionApproval() {
      if (
        this.title == "Deposit" &&
        this.inputAmount <= this.walletBalance &&
        this.inputAmount > 0
      ) {
        if (this.pid == 5) {
          if (Number.isInteger(this.inputAmount)) {
            this.errorMessage = null;
            this.$root.$emit("deposit", this.pid, this.inputAmount);
          } else {
            this.errorMessage =
              "Input amount for NFT should be an Integer (Ex. 10, 20)";
          }
        } else {
          console.log(this.inputAmount);
          this.errorMessage = null;
          this.$root.$emit("deposit", this.pid, this.inputAmount);
        }
      } else if (
        this.title == "Withdraw" &&
        this.inputAmount <= this.depositedAmount &&
        this.inputAmount > 0
      ) {
        if (this.pid == 5) {
          if (Number.isInteger(this.inputAmount)) {
            this.errorMessage = null;
            this.$root.$emit("withdraw", this.pid, this.inputAmount);
          } else {
            this.errorMessage =
              "Input amount for NFT should be an Integer (Ex. 10, 20)";
          }
        } else {
          this.errorMessage = null;
          this.$root.$emit("withdraw", this.pid, this.inputAmount);
        }
      } else {
        this.errorMessage = "Input amount not valid!";
      }
    },
    actionReject() {
      this.$emit("close-modal");
    },
    onInputChange() {
      if (this.title == "Deposit") {
        this.balancePercentage = (this.inputAmount / this.walletBalance) * 100;
      } else if (this.title == "Withdraw") {
        this.balancePercentage =
          (this.inputAmount / this.depositedAmount) * 100;
      }
    },
  },
  mounted() {
    if (this.title == "Deposit") {
      this.maxAmount = parseFloat(this.walletBalance);
    } else if (this.title == "Withdraw") {
      this.maxAmount = parseFloat(this.depositedAmount);
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/variables.scss";
.container {
  background: #1f2330;
  border: solid rgb(84, 54, 153) 1px;
  border-radius: 50px;
  height: 75vh;
  width: 350px;
}
.header {
  display: flex;
  padding: 1vw;
  background: #4b5369;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
.header-text {
  color: white;
  font-size: 24px;
  margin-left: 20px;
  margin-top: 5px;
}
.body {
  margin-top: 20px;
  padding: 10px;
  margin-left: 25px;
  margin-right: 25px;
}
input {
  display: flex;
  width: 100%;
  background-color: $vulcan;
  border: solid 1px transparent;
  color: white;
  border-radius: 10px;
  margin-top: 20%;
  font-size: 23px;
  padding: 12px 15px;
}
input:hover {
  border: solid 1px transparent;
}
input::placeholder {
  font-size: 20px;
}
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.danger {
  box-shadow: 2px 1000px 1px #c0392b inset !important;
}
.action-button {
  border-radius: 15px;
  width: 100%;
  border: solid 3px transparent;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px #35b0a9 inset;
  padding: 10px 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  overflow: hidden;
  color: $white;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 1000px 1px #268883 inset;
  }
}
::placeholder {
  color: $topaz;
  font-family: $font-family-rajdhani;
  font-style: normal;
  font-weight: 500;
  align-self: center;
}
.buttons-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10%;
}
.button-container {
  display: flex;

  width: 45%;
}
.error-message-base {
  padding: 10px;
  margin: 10px;
  color: #333;
}
.error-message {
  color: #ffffff;
  background: #9b0707;
  border: 1px solid #a33a3a;
  border-radius: 15px;
}
</style>