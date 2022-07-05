<template>
  <div class="columns">
    <div class="column is-6 is-offset-3">
      <div class="mt-6 has-text-light">
        <div class="has-text-weight-bold has-text-success block">Your investment successfully completed!</div>
        <div class="">CIV tokens will be deposited to your wallet within 1 hour. </div>
        <div><span class="has-text-weight-bold">Questions?</span> Please email <a href="mailto:civ@civfund.org" class="is-underlined">civ@civfund.org</a></div>
        <div class="block mt-4 has-text-weight-bold">Welcome to $CIV !</div>
        <div>Note: To see your new balance, add the CIV token address to your wallet</div>
        <div>For Metamask, click the button <a href="https://civfund.org/the-civ-token/#add-to-metamask">Add to Metamask</a> (bottom of web page)</div>
        <div>🗝 CIV contract ETH: 0x37fE0f067FA808fFBDd12891C0858532CFE7361d</div>
        <div>🆔 CIV contract Polygon: 0x42F6bdCfd82547e89F1069Bf375aa60e6c6c063d</div>
        <div class="mt-4">
          <a class="has-text-info" @click="$router.push({name: 'Trade'})">
            Explore CivTrade
          </a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GetCivSuccess"
}
</script>

<style scoped>

</style>