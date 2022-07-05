<template>
  <section>
    <section v-if="type==='action'">
      <b-tooltip label="Immediately receive the current balance of tokens in your position" v-if="trade.status === 'Open'" :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
    </section>

    <section v-else-if="type==='status'">
      <b-tooltip label="CivTrade actively in the market & earning fees" v-if="trade.status === 'Open' && trade.currentAmount1 === '0'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="CivTrade actively in the market & earning fees" v-if="trade.status === 'Open' && trade.currentAmount1 !== '0'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="CivTrade closed & tokens sent to your wallet" v-if="trade.status === 'Completed'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="CivTrade closed & tokens sent to your wallet" v-if="trade.status === 'Closed'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="CivTrade auto-completed & tokens sent to your wallet" v-if="trade.status === 'Filled'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="Attention: error, please email civ@civfund.org for help" v-if="trade.status === 'Error'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
      <b-tooltip label="No known status, please email civ@civfund.org for help" v-if="trade.status === 'Undefined'"
                 :position="getPosition()">
        <b-icon icon="information"></b-icon>
      </b-tooltip>
    </section>
  </section>
</template>

<script>
export default {
  name: "TradesInfoTooltip",
  props: ['trade', 'type'],
  methods: {
    getPosition() {
      if (window.innerWidth <= 760) {
        return 'is-left';
      } else {
        return 'is-right';
      }
    }
  }
}
</script>

<style scoped>

</style>
