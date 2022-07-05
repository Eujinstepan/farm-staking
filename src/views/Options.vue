<template>
  <div class="options-page">
    <img alt="Vue logo" src="../assets/civ-txt.png">
    <div class="info">
      <p>ETH Available: 5.6</p>
      <p>CIV: 128,567.0</p>
    </div>

    <div class="options">
      <ul class="options-list">
        <router-link tag="li" :to="{name: 'Invest'}">
          Invest (Soon)
        </router-link>
        <router-link tag="li" :to="{name: 'Trade'}">
          Trade
        </router-link>
        <li>
          <a href="https://dao.civfund.com" target="_blank">
            Vote
          </a>
        </li>
        <router-link tag="li" :to="{name: 'ChooseWallet'}">
          Connect Wallet
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>


export default {
  name: 'Options',
}
</script>

<style scoped lang="scss">
  .info {
    margin-top: 15px;
    margin-bottom: 35px;
    font-size: 25px;
    line-height: 30px;
    color: $white;
  }
  .options-page {
    margin-top:150px;

    img {
      width: 285px;
      height: 276px;
    }
  }

  .options {
    margin-top: 20px;
  }
  .options-list {
    li {
      cursor: pointer;
      width: 286px;
      height: 45px;
      font-weight: 500;
      font-size: 22px;
      line-height: 21px;
      padding: 10px;
      border-radius: 30px;
      margin: 12px auto;
      color: $white;
      border: solid 2px transparent;
      background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success, $purple);
      background-origin: border-box;
      background-clip: content-box, border-box;
      box-shadow: 2px 1000px 1px $dark-1 inset;
    }

    &:hover {
      box-shadow: 2px 1000px 1px #4b5369 inset;
    }

    &:last-child {
      font-weight: 600;
      font-size: 18px;
      width: 195px;
      border: solid 5px transparent;
      margin-top: 50px;
      background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, $success, $purple);
    }
  }
</style>
