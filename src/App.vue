<template>
  <div id="app">
    <Header/>
    <router-view/>
    <div class="footer-space"></div>
  </div>
</template>

<script>
import Header from "./components/Header";
import store from "./store";
import BlockchainHelper from "./utils/blockchain";
import {mainNetList} from "./utils/lists/mainet";

export default {
  store,
  components: {
    Header
  },
  async mounted() {
    await new BlockchainHelper().connectToAlreadyConnectedWallet()
  },
  async created() {
    if(localStorage.allTokensList === undefined) {
      localStorage.allTokensList = JSON.stringify(mainNetList)
    }
  },
  methods:{}
}
</script>

<style lang="scss">
@media screen and (min-width:1921px) {
  body{
    width: 1920px !important;
    margin: 0 auto !important;
  }
}

html, body, .navbar {
  background-color: #121622 !important;
}
a {
  color: $white !important;
}

input, button {
  font-family: Rajdhani,serif !important;
}
#app {
  font-family: Rajdhani,serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

@include mq($from: desktop) {
  .navbar, .navbar-menu, .navbar-start, .navbar-end {
    align-items: center !important;
  }
}

@include mq($until: desktop) {
  .navbar-menu {
    background-color: #0E121E !important;
  }
}

.modal-close {
  display: none !important;
}

.b-numberinput input[type=number] {
  text-align: right !important;
}

.crypto-value input, .crypto-value input:active, .crypto-value input:focus,
.token-value input, .token-value input:active, .token-value input:focus {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  font-weight: 500;
  font-size: 22px;
  color: white;
  text-align: right;
  padding-right: 0;
}

.has-text-dim {
  color: #ffffff59;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
  }
}

@include mq($until: tablet) {
  .footer-space {
    margin-top: 6rem;
  }
}

input {
  &::placeholder {
    color: $light-1 !important;
  }
}

.trade {
  input::placeholder, {
    color: white !important;
  }
  input::-moz-placeholder, {
    color: white !important;
    opacity: 1;
  }
}

.-walletlink-css-reset .-walletlink-extension-dialog-box-top-description-text {
  background: unset !important;
}

input + .has-text-danger {
  display: none;
}

.control.has-icons-right .input {
  padding-right: 0 !important;
}

.web3modal-modal-card{
  height: 70% !important;
}

.analytics-page {
  table {
    background: #e9e9ec;

    a {
      color: $dark-1 !important;
      text-decoration: underline;
      text-underline-position: under;

      &:hover {
        color: $black !important;
      }
    }

    td{
      border: none;
      text-align: left !important;
    }
  }

  .table-wrapper {
    overflow: auto;
  }
}

$slider-background: #1f2330;

.b-slider-thumb {
  background: $slider-background !important;
  transform: rotate(45deg) !important;
  border: 4px solid #d2d2d2 !important;
  border-radius: 4px !important;
  width: 1.15rem !important;
  height: 1.15rem !important;
}

.b-slider .b-slider-track {
  background: #4b5369 !important;
}

.b-slider-tick{
  background: $slider-background !important;
  width: 0.625rem !important;
  height: 0.625rem !important;
  transform: rotate(45deg) !important;
  border: 1px solid #8288a9 !important;
  border-radius: unset !important;
  transform-origin: 10px 0 !important;
}

.b-slider-track {
  background: #474d57;
}

div.b-slider.is-primary.is-rounded.slider-focus div.b-slider-track div.b-slider-fill {
  background: #383636 !important;
}
</style>
