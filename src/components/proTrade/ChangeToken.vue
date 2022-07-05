<template>
  <div class="box-border border-top z-index-high pt-2" style="height: 51px;border-left: none;margin-top: 0">

    <div class="is-flex is-justify-content-end" @click="fromTokenListModalOpen = true">
      <div class="trade-label change-token-label mr-4 mt-1" style="white-space: nowrap">
        Change Token
      </div>
      <div class="change-token is-flex is-justify-content-space-between mr-1">
        <img class="token-logo"
             :src="fromToken.logoURI">
        <div class="token-name">{{ fromToken.symbol }}</div>
        <img class="arrow-icon"
             src="@/assets/arrowImage.svg" alt="Arrow Down">
      </div>
    </div>

    <token-list-modal
        :all-tokens="allTokens"
        :from-token="fromToken"
        :to-token="{}"
        :is-component-modal-active="fromTokenListModalOpen"
        @selected="fromTokenSelected"
        @close="fromTokenListModalOpen = false"
    />
  </div>
</template>

<script>
import TokenListModal from "../TokenListModal";
import BlockchainHelper from "../../utils/blockchain";

export default {
  name: "ChangeToken",
  components: {TokenListModal},
  data() {
    return {
      allTokens: [],
      fromTokenListModalOpen: false,
      fromToken: {}
    }
  },
  async mounted() {
    const fromAddress = this.$route.params.fromAddress
    this.allTokens = await new BlockchainHelper().getProVIewTokensList()
    this.fromToken = this.allTokens.filter((el) => {
      return el.address === fromAddress
    })
    this.fromToken = this.fromToken[0]
  },
  methods: {
    async fromTokenSelected(token) {
      this.fromTokenListModalOpen = false
      this.fromToken = token
      this.$router.push({name:'Pro Trade', params: { fromAddress: this.fromToken.address }}).catch(()=>{});
      this.$emit('update')
    }
  }
}
</script>

<style scoped lang="scss">
.change-token-label {
  color: #26a69a;
  font-size: 18px;
  font-weight: 600;
}

.change-token {
  background-color: black;
  border-radius: 22px;
  width: 250px;
  min-width: 150px;
  height: 37px;
  cursor: pointer;
  margin-right: 20px;
  padding: 5px;

.token-logo {
  position: relative;
  left:5px;

}

.token-name {
  color: white;
  position: relative;
  top: 2px;
  font-size: 18px;
  font-weight: 700;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80px;
}

.arrow-icon {
  position: relative;
  width: 20px;
  right: 14px;
  top: 1px;
}

&:hover {
   filter: brightness(120%);
 }
}
</style>