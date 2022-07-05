<template>
  <div id="header">
    <div class="is-relative">
      <div class="navbar">
        <div
          class="nav-container-window-hidden"
          v-bind:class="{ 'nav-container-window': scrolled }"
        >
          <div class="logo">
            <router-link tag="a" :to="{ name: 'Trade' }">
              <img src="../assets/civ-txt-small.png" alt="CIV Fund" />
            </router-link>
          </div>

          <div class="middle-content">
            <router-link tag="a" :to="{ name: 'Trade' }"> Trade </router-link>
            <router-link tag="a" :to="{ name: 'Farm' }"> Farm </router-link>
            <tooltip-link label="Invest"></tooltip-link>
            <a href="https://dao.civfund.org" target="'_blank'"> Vote </a>
          </div>

          <div class="end-content">
            <div
              class="civ-network"
              v-if="$store.state.readableSelectedAddress"
            >
              <b-dropdown
                :scrollable="false"
                :max-height="100"
                v-model="currentMenu"
                aria-role="list"
              >
                <template #trigger>
                  <button class="current-menu-button" icon-right="menu-down">
                    <img class="media-left" :src="currentMenu.icon" />
                    <p>{{ currentMenu.text }}</p>
                    <b-icon icon="menu-down"></b-icon>
                  </button>
                </template>

                <b-dropdown-item
                  v-for="(menu, index) in menus"
                  :key="index"
                  :value="menu"
                  aria-role="listitem"
                >
                  <div class="media">
                    <img class="media-left" :src="menu.icon" />
                    <div class="media-content">
                      <h3>{{ menu.text }}</h3>
                    </div>
                  </div>
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="civ-value is-desktop-show" @click="prefillETHCIV()">
              <div>CIV ${{ $store.state.civPrice | formatPrice(3) }}</div>
            </div>
            <div
              class="connect-wallet"
              v-if="!$store.state.readableSelectedAddress"
            >
              <button @click="showWeb3Modal()">Connect wallet</button>
            </div>
            <div
              class="wallet-details"
              @click="disconnectAndShowWeb3Modal()"
              v-else
            >
              <span>{{ $store.state.readableSelectedAddress }}</span>
            </div>
            <div class="menu">
              <button @click="toggleMenu">
                <b-icon icon="dots-horizontal"></b-icon>
              </button>
              <div
                class="menu-content"
                v-if="menuOpened"
                @click="menuOpened = false"
              >
                <div>
                  <a href="https://docs.civfund.org" target="_blank">
                    Docs
                    <b-icon icon="book-multiple"></b-icon>
                  </a>
                </div>
                <div>
                  <router-link tag="a" :to="{ name: 'Trade analytics' }">
                    Analytics
                    <b-icon icon="google-analytics"></b-icon>
                  </router-link>
                </div>
                <div>
                  <a
                    @click="notificationModalActive = true"
                    v-if="$store.state.readableSelectedAddress"
                  >
                    Subscription
                    <b-icon icon="email-outline"></b-icon>
                  </a>
                </div>
                <div>
                  <a href="https://t.me/civsettlers" target="_blank">
                    Telegram
                    <b-icon icon="telegram"></b-icon>
                  </a>
                </div>
                <div>
                  <a
                    href="https://www.immunefi.com/bounty/civilization"
                    target="_blank"
                  >
                    Bug Bounty
                    <b-icon icon="bug"></b-icon>
                  </a>
                </div>
                <div>
                  <a href="https://civfund.org" target="_blank">
                    About
                    <b-icon icon="information-outline"></b-icon>
                  </a>
                </div>
                <div class="pattent-text">© 2022 Patent-pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle-content-bottom">
      <router-link tag="a" :to="{ name: 'Trade' }"> Trade </router-link>
      <router-link tag="a" :to="{ name: 'Farm' }"> Farm </router-link>
      <tooltip-link label="Invest"></tooltip-link>
      <a href="https://dao.civfund.org" target="'_blank'"> Vote </a>
    </div>
    <notification-modal
      :is-notification-modal-active="notificationModalActive"
      @close="onNotificationModalClose"
    ></notification-modal>
  </div>
</template>

<script>
import EthereumLogo from "@/assets/eth-logo.png";
import PolygonLogo from "@/assets/polygon-logo.png";
import TooltipLink from "./TooltipLink";
import BlockchainHelper from "../utils/blockchain";
import store from "../store/index";
import NotificationModal from "./NotificationModal";

export default {
  name: "Header",
  store,
  components: {
    NotificationModal,
    TooltipLink,
  },
  data() {
    return {
      scrolled: false,
      menuOpened: false,
      tooltip1: false,
      tooltip2: false,
      tooltipBottom1: false,
      tooltipBottom2: false,
      connectWalletOpened: false,
      maxHeight: 200,
      menus: [
        { icon: EthereumLogo, text: "Ethereum" },
        { icon: PolygonLogo, text: "Polygon" },
      ],
      notificationModalActive: false,
    };
  },
  async created() {
    await new BlockchainHelper().updateCivPrice();
  },
  computed: {
    currentMenu: {
      get() {
        return this.$store.state.currentNetwork;
      },
      set(value) {
        if (value.text === "Ethereum") {
          this.switchNetwork(1);
        } else if (value.text === "Polygon") {
          this.switchNetwork(137);
        } else if (value.text === "Rinkeby-test") {
          this.switchNetwork(4);
        } else if (value.text === "Kovan-test") {
          this.switchNetwork(42);
        } else if (value.text === "Mumbai-test") {
          this.switchNetwork(80001);
        }
      },
    },
  },
  methods: {
    async showWeb3Modal() {
      await new BlockchainHelper().connectWallet();
      await this.updateFromTokenBalance();
      await this.updateToTokenBalance();
    },
    async disconnectAndShowWeb3Modal() {
      this.showWeb3Modal();
    },
    onCloseWallet() {
      this.connectWalletOpened = false;
    },
    scroll() {
      window.onscroll = () => {
        this.scrolled = window.pageYOffset > 50;
      };
    },
    toggleMenu() {
      this.menuOpened = !this.menuOpened;
    },
    async updateFromTokenBalance() {
      let balance = await new BlockchainHelper().getTokenBalance(
        store.state.selectedFromToken
      );
      await store.dispatch("setFromTokenAvailableAmount", balance);
    },
    async updateToTokenBalance() {
      let balance = await new BlockchainHelper().getTokenBalance(
        store.state.selectedToToken
      );
      await store.dispatch("setToTokenAvailableAmount", balance);
    },
    async prefillETHCIV() {
      let chainId = await new BlockchainHelper().getChainId();
      if (chainId === 137) {
        let token;
        let allTokens = store.state.allTokensList;
        this.$log.debug(allTokens);
        token = allTokens.filter(
          (token) => token.symbol.toLowerCase() === "matic"
        );
        if (token.length > 0) {
          store.dispatch("setSelectedFromToken", token[0]);
        }

        token = allTokens.filter(
          (token) => token.symbol.toLowerCase() === "civ"
        );
        if (token.length > 0) {
          store.dispatch("setSelectedToToken", token[0]);
          this.toToken = token[0];
        }
      } else {
        let token;
        let allTokens = store.state.allTokensList;
        this.$log.debug(allTokens);
        token = allTokens.filter(
          (token) => token.symbol.toLowerCase() === "eth"
        );
        if (token.length > 0) {
          store.dispatch("setSelectedFromToken", token[0]);
        }

        token = allTokens.filter(
          (token) => token.symbol.toLowerCase() === "civ"
        );
        if (token.length > 0) {
          store.dispatch("setSelectedToToken", token[0]);
          this.toToken = token[0];
        }
      }
    },
    onNotificationModalClose() {
      this.notificationModalActive = false;
    },

    addNetwork(id) {
      let networkData;
      switch (id) {
        case 1:
          networkData = [
            {
              chainId: "0x1",
              chainName: "Ethereum Mainnet",
              rpcUrls: [
                "https://eth-mainnet.alchemyapi.io/v2/Hiyd3vdAT8heHJrqd0di_l-5ZY0gKX9R",
              ],
            },
          ];
          break;
        case 4:
          networkData = [
            {
              chainId: "0x4",
              chainName: "Rinkeby",
              rpcUrls: [
                "https://eth-rinkeby.alchemyapi.io/v2/iXMz9p9wub_ZZ9OalPQnx-3CdG96TcAn",
              ],
            },
          ];
          break;
        case 42:
          networkData = [
            {
              chainId: "0x2a",
              chainName: "Kovan",
              rpcUrls: [
                "https://eth-kovan.alchemyapi.io/v2/IUQcJ8bQwnkriTrje6GDqjb8x71yBIre",
              ],
            },
          ];
          break;
        case 137:
          networkData = [
            {
              chainId: "0x89",
              chainName: "Polygon",
              rpcUrls: [
                "https://polygon-mainnet.g.alchemy.com/v2/B_jy9FcZAhJxHM_dXr_RxPFAYycpaEXw",
              ],
            },
          ];
          break;
        case 80001:
          networkData = [
            {
              chainId: "0x13881",
              chainName: "Mumbai",
              rpcUrls: [
                "https://polygon-mumbai.g.alchemy.com/v2/ZLsTjZkIPICiQ7XeOvJMorucmD_rr3-T",
              ],
            },
          ];
          break;
        default:
          break;
      }

      return window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: networkData,
      });
    },
    switchNetwork(id) {
      let chainId;
      switch (id) {
        case 1:
          chainId = "0x1";
          break;
        case 4:
          chainId = "0x4";
          break;
        case 42:
          chainId = "0x2a";
          break;
        case 137:
          chainId = "0x89";
          break;
        case 80001:
          chainId = "0x13881";
          break;
        default:
          break;
      }
      if (chainId) {
        try {
          window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainId }],
            })
            .then(async () => {
              let address = await new BlockchainHelper().getAddress();
              address = await new BlockchainHelper().resolveAddressToEnsDomain(
                address
              );
              await store.dispatch("setReadableSelectedAddress", address);
            });
        } catch (e) {
          this.addNetwork(id).then(() => {
            window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: chainId }],
            });
          });
        }
      }
    },
  },
  mounted() {
    this.scroll();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
h3 {
  margin: 40px 0 0;
}

.current-menu-button {
  background: #212429 !important;
  border-radius: 12px;
  margin-right: 8px;
  color: $white;
  height: 40px;
  display: flex;
  padding: 6px 8px;
  align-items: center;
  border: none;
  cursor: pointer;
  width: max-content;

  @include mq($until: mobile) {
    width: 40px;
    display: flex;
    justify-content: center;
  }

  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border-radius: 50%;

    @include mq($until: mobile) {
      margin-right: 0;
    }
  }

  p {
    font-size: 16px;
    font-weight: 500;

    @include mq($until: mobile) {
      display: none;
    }
  }

  span {
    @include mq($until: mobile) {
      display: none;
    }
  }
}

.civ-network {
  button {
    border-radius: 12px;
  }
}

.dropdown-menu {
  margin-top: 8px;
  .dropdown-content {
    background: #212429 !important;
    border-radius: 12px;

    .media {
      display: flex;
      align-items: center;
      height: 30px;

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      h3 {
        margin-top: 0;
        color: $white;
        text-align: left;
      }
    }

    .dropdown-item {
      &:hover {
        background: $dark-1;
      }
    }

    .is-active {
      background: $dark;

      h3 {
        color: $white;
      }
    }
  }
}

.middle-content {
  background-color: rgb(25, 27, 31);
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  overflow: auto;
  -webkit-box-align: center;
  align-items: center;

  a {
    display: flex;
    flex-flow: row nowrap;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: rgb(195, 197, 203);
    font-size: 1rem;
    font-weight: 500;
    padding: 8px 12px;
    word-break: break-word;
    overflow: hidden;
    white-space: nowrap;
  }

  .router-link-exact-active {
    border-radius: 12px;
    font-weight: 600;
    -webkit-box-pack: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    background-color: rgb(44, 47, 54);
    cursor: default;
  }
}

.middle-content-bottom {
  flex-direction: row;
  -webkit-box-pack: justify;
  justify-content: space-between;
  justify-self: center;
  z-index: 99;
  position: fixed;
  bottom: 0;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  background-color: rgb(25, 27, 31);
  border: 1px solid rgb(44, 47, 54);
  display: none;

  .router-link-exact-active {
    border-radius: 12px;
    font-weight: 600;
    -webkit-box-pack: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    background-color: rgb(44, 47, 54);
    cursor: default;
  }

  a {
    display: flex;
    flex-flow: row nowrap;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: rgb(195, 197, 203);
    font-size: 1rem;
    font-weight: 500;
    padding: 8px 12px;
    word-break: break-word;
    overflow: hidden;
    white-space: nowrap;
  }
}

@include mq($from: desktop) {
  .middle-content {
    justify-self: center;
  }
}

@include mq($until: desktop) {
  .middle-content {
    justify-self: start;
  }
  .nav-container-window-hidden {
    grid-template-columns: 50px 1fr 120px !important;
  }
}

@include mq($until: tablet) {
  .middle-content {
    display: none;
  }
  .middle-content-bottom {
    width: fit-content;
    min-width: 280px;
    padding: 4px;
    border-radius: 16px;
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    -webkit-box-align: center;
    align-items: center;
  }
}

.nav-container-window-hidden {
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  z-index: 21;
  background-image: linear-gradient(transparent 50%, rgb(25, 27, 31) 50%);
  background-position: 0 0;
  background-size: 100% 200%;
  box-shadow: transparent 0 0 0 1px;
  transition: background-position 0.1s ease 0s, box-shadow 0.1s ease 0s;
  background-blend-mode: hard-light;
  position: relative;
  padding-top: 10px;

  @include mq($until: mobile) {
    display: flex;
    justify-content: space-between;
  }
}

.nav-container-window {
  background-position: 0 -100% !important;
  box-shadow: rgb(44 47 54) 0 0 0 1px !important;

  .logo {
    visibility: hidden !important;
  }
}

.logo {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  padding: 10px;

  img {
    width: 40px;
    max-width: 40px !important;
    vertical-align: middle;
  }
}

.end-content {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  justify-self: flex-end;
}

.civ-value {
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(33, 36, 41);
  border: 2px solid rgb(33, 36, 41);
  border-radius: 12px;
  color: rgb(255, 255, 255);
  cursor: auto;
  display: flex;
  font-weight: 500;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 6px 8px;
  width: fit-content;
  white-space: nowrap;
  margin-right: 0.5rem;

  &.is-desktop-show {
    @include mq($from: mobile) {
      display: flex;
    }

    @include mq($until: mobile) {
      display: none;
    }
  }

  &:hover {
    background: rgb(59, 64, 72);
    cursor: pointer;
  }
}

.connect-wallet {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(33, 36, 41);
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  margin-right: 0.5rem;

  .is-desktop-show {
    @include mq($from: mobile) {
      display: flex;
    }

    @include mq($until: mobile) {
      display: none;
    }
  }

  .is-mobile-show {
    @include mq($from: mobile) {
      display: none;
    }

    @include mq($until: mobile) {
      display: flex;
    }
  }

  button {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 12px;
    user-select: none;
    font-weight: 500;
    background-color: rgba(21, 61, 111, 0.44);
    border: 1px solid rgba(21, 61, 111, 0.44);
    color: rgb(80, 144, 234);

    &:hover {
      border: 1px solid rgba(49, 95, 154, 0.44);
      color: rgb(57, 130, 231);
    }
  }

  .router-link-exact-active {
    cursor: default;

    button {
      border: 1px solid rgba(49, 95, 154, 0.44);
      color: #ffffff;

      &:hover {
        color: #ffffff;
      }
    }
  }
}

.menu {
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  margin-right: 0.5rem;

  button {
    width: 100%;
    margin: 0;
    height: 38px;
    background-color: rgb(25, 27, 31);
    border: 1px solid rgb(25, 27, 31);
    padding: 0.15rem 0.5rem;
    border-radius: 12px;
    color: white;
    cursor: pointer;

    &:hover {
      border: 1px solid rgb(64, 68, 79);
    }
  }
}

.navbar {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  -webkit-box-pack: justify;
  justify-content: space-between;
  position: fixed;
  top: 0;
  z-index: 2;
}

.menu-content {
  position: absolute;
  right: 0;
  color: white;
  min-width: 196px;
  max-height: 370px;
  overflow: auto;
  background-color: rgb(33, 36, 41);
  border: 1px solid rgb(25, 27, 31);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  top: 3rem;
  z-index: 100;

  .is-mobile-show {
    @include mq($from: mobile) {
      display: none;
    }

    @include mq($until: mobile) {
      display: flex;
    }
  }

  a {
    display: flex;
    flex: 1 1 0;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.5rem;
    -webkit-box-pack: justify;
    justify-content: space-between;
    color: rgb(195, 197, 203) !important;
  }
}

.menu:last-child {
  margin-right: 1rem;
}

.menu-content {
  a:hover {
    color: #ffffff !important;
  }
}

.wallet-details {
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(33, 36, 41);
  border: 2px solid rgb(33, 36, 41);
  border-radius: 12px;
  color: rgb(255, 255, 255);
  cursor: auto;
  display: flex;
  font-weight: 500;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 6px 8px;
  width: fit-content;
  white-space: nowrap;
  margin-right: 0.5rem;

  &:hover {
    background: rgb(59, 64, 72);
    cursor: pointer;
  }
}

.pattent-text {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: #c3c5cb;
}
</style>
