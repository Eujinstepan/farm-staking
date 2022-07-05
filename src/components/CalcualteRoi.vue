<template>
  <div class="container" tabindex="0" @keyup.esc="closeRoiModal">
    <div class="header">
      <div class="header-icon">
        <img :src="'/icon_svg/calculator.svg'" alt="" />
      </div>
      <div class="header-text">ROI CALCULATOR</div>
    </div>
    <div class="body">
      <div class="staked-amount-container">
        <div class="top-text">{{ staked_coin }} STAKED</div>
        <div class="price-container">
          <div class="price-converter">
            <div class="usd-price"><input v-model="usd_value" name="" id=""> USD</div>
            <div class="token-price">4321.00 {{ staked_coin }}</div>
          </div>
          <div class="right-icon" @click="console.log('clicked')">
            <img :src="'/icon_svg/convert.svg'" class="converter-icon" />
          </div>
        </div>
      </div>
      <div class="duration-container">
        <div class="top-text"></div>
        <div class="duration-input">
          <div class="duration-number"></div>
          <div class="duration-specifier"></div>
        </div>
        <div class="bottom-durations">
          <div class="duration-button"></div>
        </div>
      </div>
      <div class="roi-container">
        <div class="roi-icon-container"></div>
        <div class="roi-text-container">
          <div class="roi-top-text"></div>
          <div class="roi-usd-price"></div>
          <div class="roi-token-price"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  props: {
    staked_coin: {
      type: String,
    },
  },
  data() {
    return {
      test: 0,
      usd_value:1234.00,
    };
  },
  methods: {
    closeRoiModal() {
      console.log("closed");
      this.$emit("close-roi-modal");
    },
  },
  mounted() {
    this.test = 1;
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style scoped>
.container {
  background: #1f2330;
  border: solid rgb(84, 54, 153) 1px;
  border-radius: 50px;
  height: 70vh;
  width: 350px;
}
.header {
  display: flex;
  padding: 1vw;
  background: #4b5369;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}
.header-icon {
  width: 10%;
  margin-left: 20px;
  margin-top: 5px;
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
  display: flex;
  justify-content: left;
}
.top-text {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
}
.staked-amount-container {
  width: 100%;
}
.price-container {
  display: flex;
  width: inherit;
  background: #4b5369;
  border-radius: 20px;
}
.price-converter {
  width: 80%;
  margin-top: 5px;
}
.usd-price {
  display: flex;
  justify-content: flex-end;
  color: white;
  font-size: 20px;
}
.token-price {
  display: flex;
  justify-content: flex-end;
  color: white;
  font-size: 15px;
}
.right-icon {
  width: 20%;
  padding: 10px;
  margin-top: 5px;
}
.converter-icon {
  cursor: pointer;
}
input {
  background: inherit;
  border: none;
  font-size: 20px;
  color: white;
  
}
</style>
