<template>
  <b-modal v-model="modalActive" :can-cancel="['x']">
    <div class="token-list-modal">
      <h1 class="c-title">
        Select a token
      </h1>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
      <b-field vertical>
        <b-input placeholder="Search name or paste address" v-model="tokenName"></b-input>
      </b-field>
      <h1 class="c-title">Common
        <b-tooltip class="tooltip-common-token p-0" position="is-bottom" type="is-black" multilined>
          <b-icon icon="information-outline" size="is-small"></b-icon>
          <template v-slot:content>
            <div class="note">
              Commonly used
            </div>
          </template>
        </b-tooltip>
      </h1>
      <div class="c-common-bases">
        <div
            :class="'c-common-token ' + (token.symbol === fromToken.symbol ||
            token.symbol === toToken.symbol
              ? 'disabled'
              : '')"
            v-for="(token, tokenIndex) in commonTokens" :key="'common-token' + tokenIndex" @click="selectToken(token)"
        >
          <img :src="token.logoURI" alt="token"/>
          <span>{{ token.symbol }}</span>
        </div>
      </div>
      <ul>
        <RecycleScroller
            class="scroller"
            direction="vertical"
            :items="filteredTokens"
            :item-size="50"
            :min-item-size="50"
            :prerender="filteredTokens.length > 100 ? 100 : filteredTokens.length"
            key-field="symbol"
            v-slot="{ item }"
            :emit-update="true"
        >
          <li
              :class="
              'c-item ' + (item.symbol === fromToken.symbol ||
              item.symbol === toToken.symbol
                ? 'disabled'
                : '')
            "
              @click="selectToken(item)"
          >
            <img :src="item.logoURI" :alt="item.name"/>
            <div class="d-flex">
              <h5>{{ item.symbol }}</h5>
              <p>{{ item.name }}</p>
            </div>
          </li>
        </RecycleScroller>
      </ul>
    </div>
  </b-modal>
</template>

<script>
import {RecycleScroller} from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import Web3 from "web3";
import ApiClient from "../utils/apiClient";

export default {
  name: "TokenListModal",
  component: {
    RecycleScroller
  },
  props: {
    isComponentModalActive: {
      type: Boolean,
      default: false,
    },
    allTokens: {
      type: Array,
      default: () => []
    },
    fromToken: {
      type: Object
    },
    toToken: {
      type: Object
    }
  },
  data: () => {
    return {
      tokenName: '',
      filteredTokens: [],
      commonTokens: [],
      common: [
        // MAINNET
        'civ:0x37fe0f067fa808ffbdd12891c0858532cfe7361d',
        '0ne:0x73a83269b9bbafc427e76be0a2c1a1db2a26f4c2',
        'shib:0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
        'leash:0x27c70cd1946795b66be9d954418546998b546634',
        'bone:0x9813037ee2218799597d83d4a5b6f3b6778218d9',
        'eth:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'weth:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        'dai:0x6b175474e89094c44da98b954eedeac495271d0f',
        'usdc:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        'usdt:0xdac17f958d2ee523a2206206994597c13d831ec7',
        'wbtc:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        // POLYGON
        'civ:0x42f6bdcfd82547e89f1069bf375aa60e6c6c063d',
        'matic:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        'wmatic:0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        'dai:0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        'usdt:0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        'usdc:0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
      ],
      modalActive: false
    }
  },
  watch: {
    isComponentModalActive: {
      handler: function () {
        if (!this.isComponentModalActive) {
          this.$emit("close");
        }
        this.modalActive = this.isComponentModalActive
      },
    },
    allTokens: {
      handler: function () {
        this.filteredTokens = this.allTokens;
        let common = this.common
        this.commonTokens = this.allTokens.filter(token => {
          return common.includes(token.symbol.toString().toLowerCase()+":"+token.address.toString().toLowerCase())
        }).sort(function (a, b) {
          if (common.indexOf(a.symbol.toString().toLowerCase()+":"+a.address.toLowerCase()) < common.indexOf(b.symbol.toString().toLowerCase()+":"+b.address.toLowerCase())) {
            return -1;
          } else if (common.indexOf(a.symbol.toString().toLowerCase()+":"+a.address.toLowerCase()) > common.indexOf(b.symbol.toString().toLowerCase()+":"+b.address.toLowerCase())) {
            return 1;
          } else {
            return 0;
          }
        });
      },
    },
    tokenName: {
      handler: async function () {
        if (this.tokenName.startsWith('0x')) {
          const web3 = new Web3()
          const isValidAddress = web3.utils.isAddress(this.tokenName)
          if (isValidAddress) {
            let customToken = {}
            try {
              customToken = await new ApiClient().getCustomTokenDetails(this.tokenName)
            } catch (ex) {
              this.$log.error(ex)
              customToken = {
                'name': 'Custom Token',
                'symbol': 'CST',
                'image': {
                  'small': 'https://styles.redditmedia.com/t5_2wlj3/styles/communityIcon_7jxh2j4ouky41.png?width=256&s=59ea46d93492e9d0951b43d7c580f72982a86974'
                }
              }
            }
            this.filteredTokens = this.allTokens.filter(token => token.address.toLowerCase() === this.tokenName.toLowerCase());
            if (this.filteredTokens.length === 0) {
              this.filteredTokens.push({
                name: customToken['name'],
                symbol: customToken['symbol'],
                logoURI: customToken['image']['small'],
                chainId: 1,
                decimals: 18,
                address: this.tokenName
              })
            }
          } else {
            this.$log.warn(`Address ${this.tokenName} is invalid`)
            this.filteredTokens = [];
          }
        } else {
          this.filteredTokens = this.allTokens.filter(token => token.name.toString().toLowerCase().includes(this.tokenName.toString().toLowerCase()) || token.symbol.toString().toLowerCase().includes(this.tokenName.toString().toLowerCase()));
        }
      }
    }
  },
  components: {},
  methods: {
    selectToken: function (token) {
      this.$emit("selected", token);
    }
  },
};
</script>

<style scoped lang="scss">
.token-list-modal {
  background-color: $dark;
  max-width: 530px;
  width: 90%;
  border-radius: 10px;
  margin: auto;
  padding: 15px 10px;
  text-align: left;
  position: relative;

  .delete {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 100;
  }

  .c-common-bases {
    display: flex;
    flex-wrap: wrap;
  }

  .tooltip-common-token.b-tooltip {
    .tooltip-content {
      padding: 0 !important;
      width: 150px !important;
      background: $black !important;
    }
  }

  .scroller {
    height: 500px;
  }

  .c-item {
    height: 50px;
    display: flex;
    align-items: center;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .c-common-token {
    border-radius: 4px;
    border: 1px solid $light-1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    padding: 4px;
    width: fit-content;
    margin-bottom: 16px;
    cursor: pointer;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    img {
      width: 28px;
      height: 28px;
    }

    &:hover {
      background: $dark-1;
    }

    span {
      margin-left: 4px;
      color: $white;
    }
  }

  .c-title {
    margin-bottom: 4px;
  }

  .c-title,
  h5 {
    color: $white !important;
  }

  ul {
    max-height: 500px;
    overflow: auto;

    li {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease-in;

      &:hover {
        margin-left: 8px;
      }

      img {
        width: 32px;
        height: 32px;
        border-radius: 20px;
      }

      .d-flex {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
      }

      p {
        font-size: 12px;
        color: $light-1;
      }
    }
  }
}

</style>
