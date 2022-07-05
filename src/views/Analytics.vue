<template>
  <div class="analytics-page">
    <b-notification
        type="is-danger"
        has-icon
        aria-close-label="Close notification"
        role="alert"
        v-if="error"
    >
      {{message}}
    </b-notification>

    <p class="is-size-3-desktop is-size-4-tablet has-text-light mb-4">CivTrade analytics for {{currentNetwork}}</p>

    <div class="is-flex is-justify-content-end mb-4">
      <b-input class="mr-2" v-model="searchTerm" :placeholder="'Search'"></b-input>
      <b-select v-model="perPage" class="mr-2">
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
        <option value="500">500 per page</option>
      </b-select>
      <b-button class="is-primary" @click="exportToCSV()">Export to CSV</b-button>
    </div>

    <b-table :data="displayData" v-if="loaded" :paginated="true" :per-page="perPage" :hoverable="true"
             :sticky-header="true" :height="'450px'" :striped="true" :debounce-search="1000"
    >

      <b-table-column field="orderID" label="ID" sortable v-slot="props">
        {{ props.row['orderID'] }}
      </b-table-column>

      <b-table-column field="orderState" label="Status" sortable v-slot="props">
        {{ props.row['orderState'] }}
      </b-table-column>

      <b-table-column field="trader" label="From" sortable v-slot="props">
        <a :href="props.row['trader']" target="_blank">{{ props.row['walletShort'] }}</a>
      </b-table-column>

      <b-table-column field="AmountFrom" label="Traded" sortable v-slot="props">
        {{ props.row['AmountFrom'] }} {{ props.row['tokenFrom'] }}
      </b-table-column>

      <b-table-column field="AmountTo" label="Wanted" sortable v-slot="props">
        {{ props.row['AmountTo'] }} {{ props.row['tokenTo'] }}
      </b-table-column>

      <b-table-column field="targetPrice" label="Target price" sortable v-slot="props">
        {{ props.row['targetPrice'] }}
      </b-table-column>

      <b-table-column field="invertedPrice" label="Inverted price" sortable v-slot="props">
        {{ props.row['invertedPrice'] }}
      </b-table-column>

      <b-table-column field="poolFee" label="Earn%" sortable v-slot="props">
        {{ props.row['poolFee'] }}
      </b-table-column>

      <b-table-column field="timeInTrade" label="Duration" sortable v-slot="props">
        {{ props.row['timeInTrade'] }}
      </b-table-column>

      <b-table-column field="timeOpened" label="Opened" sortable v-slot="props">
        <a :href="props.row['openTxn']" :title="props.row['openedAgo']" target="_blank">{{ props.row['timeOpened'] }}</a>
      </b-table-column>

      <b-table-column field="timeClosed" label="Closed" sortable v-slot="props">
        <a :href="props.row['closeTxn']" :title="props.row['closedAgo']" target="_blank">{{ props.row['timeClosed'] }}</a>
      </b-table-column>

    </b-table>

  </div>
</template>

<script>


import ApiClient from "../utils/apiClient";
import BlockchainHelper from "../utils/blockchain";

const debounce = 250

export default {
  name: 'Analytics',
  watch: {
    '$store.state.chainId': async function (newValue, oldValue) {
      if (oldValue !== undefined) {
        await this.parseAnalytics()
      }
    },
    searchTerm: {
      deep: true,
      handler: async function () {
        if (this.timeout)
          clearTimeout(this.timeout);

        this.timeout = setTimeout(async () => {
          this.displayData = this.data.filter(el => {
            for(const attribute in el) {
              const value = el[attribute]
              if(value.toString().toLowerCase().includes(this.searchTerm.toString().toLowerCase())) {
                this.$log.debug('Found search term on: '+el[attribute])
                return el[attribute]
              }
            }
            return false
          });
        }, debounce)
      },
    }
  },
  async mounted() {
    await this.parseAnalytics()
  },
  data: () => {
    return {
      data: [],
      displayData: [],
      searchTerm: null,
      loaded: false,
      error: false,
      perPage: 10,
      currentNetwork: 'Ethereum',
      message: 'An error occurred loading the analytics, please try again'
    }
  },
  methods: {
    async parseAnalytics() {
      const loadingComponent = this.$buefy.loading.open()
      try {
        this.data = await new ApiClient().getAnalytics();
        this.displayData = await new ApiClient().getAnalytics();
        await this.getCurrentNetwork()
        this.loaded = true;
      } catch (e) {
        this.$log.error(e)
        this.error = true
        this.$buefy.toast.open({
          duration: 5000,
          message: this.message,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        loadingComponent.close()
      }
    },
    exportToCSV: function () {
      const replacer = (key, value) => value === null ? '' : value
      const header = Object.keys(this.data[0])
      const csvContent = [
        header.join(','), // header row first
        ...this.displayData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n')

      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csvContent));
      element.setAttribute('download', 'civ-trades-export.csv');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async getCurrentNetwork() {
      let chainId = await (new BlockchainHelper()).getChainId()
      if (chainId === 1) {
        this.currentNetwork = 'Ethereum'
      } else if(chainId === 4) {
        this.currentNetwork = 'Rinkeby'
      } else if(chainId === 42) {
        this.currentNetwork = 'Kovan'
      } else if(chainId === 137) {
        this.currentNetwork = 'Polygon'
      } else if(chainId === 80001) {
        this.currentNetwork = 'Mumbai'
      } else {
// here do not throw error but show Eth as default
        this.currentNetwork = 'Ethereum'
      }
    }
  }
}
</script>

<style scoped lang="scss">

.analytics-page {
  //max-width: 1500px;
  width: 90%;
  margin: 80px auto 30px auto;
  border-radius: 5px;
  min-width: 310px;
  //overflow: auto;
}
</style>


