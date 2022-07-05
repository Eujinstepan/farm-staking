import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    civPrice: 0,
    ethBalance: 0,
    currentNetwork: {},
    readableSelectedAddress: undefined,
    fromTokenAvailableAmount: 0,
    toTokenAvailableAmount: 0,
    selectedFromToken: undefined,
    selectedToToken: undefined,
    allTokensList: undefined,
    chainId: undefined,
    proViewBuyValue: undefined,
    proViewSellValue: undefined,
    signer: undefined,
    provider: undefined
  },
  mutations: {
    setCivPrice(state, data) {
      state.civPrice = data
    },
    setEthereumBalance(state, data) {
      state.ethBalance = data
    },
    setCurrentNetwork(state, data) {
      state.currentNetwork = data
    },
    setReadableSelectedAddress(state, data) {
      state.readableSelectedAddress = data
    },
    setSigner(state, data) {
      state.signer = data
    },
    setProvider(state, data) {
      state.provider = data
    },
    setFromTokenAvailableAmount(state, data) {
      if(data === null || data === undefined){
        data = 0
      }
      state.fromTokenAvailableAmount = data
    },
    setToTokenAvailableAmount(state, data) {
      state.toTokenAvailableAmount = data
    },
    setSelectedFromToken(state, data) {
      state.selectedFromToken = data
    },
    setSelectedToToken(state, data) {
      state.selectedToToken = data
    },
    setAllTokensList(state, data) {
      state.allTokensList = data
    },
    setChainId(state, data) {
      state.chainId = data
    },
    setProViewBuyValue(state, data) {
      state.proViewBuyValue = data
    },
    setProViewSellValue(state, data) {
      state.proViewSellValue = data
    }
  },
  actions: {
    setCivPrice(context, data) {
      context.commit("setCivPrice", data);
    },
    setEthereumBalance(context, data) {
      context.commit("setEthereumBalance", data);
    },
    setCurrentNetwork(context, data) {
      context.commit("setCurrentNetwork", data);
    },
    setReadableSelectedAddress(context, data) {
      context.commit("setReadableSelectedAddress", data);
    },
    setSigner(context, data) {
      context.commit("setSigner", data);
    },
    setProvider(context, data) {
      context.commit("setProvider", data);
    },
    setFromTokenAvailableAmount(context, data) {
      context.commit("setFromTokenAvailableAmount", data);
    },
    setToTokenAvailableAmount(context, data) {
      context.commit("setToTokenAvailableAmount", data);
    },
    setSelectedFromToken(context, data) {
      context.commit("setSelectedFromToken", data);
    },
    setSelectedToToken(context, data) {
      context.commit("setSelectedToToken", data);
    },
    setAllTokensList(context, data) {
      context.commit("setAllTokensList", data);
    },
    setChainId(context, data) {
      context.commit("setChainId", data);
    },
    setProViewBuyValue(context, data) {
      context.commit("setProViewBuyValue", data);
    },
    setProViewSellValue(context, data) {
      context.commit("setProViewSellValue", data);
    },
  },
});
