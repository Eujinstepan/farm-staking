<template>
  <div class="farm-pool columns is-mobile">
    <div class="pool column is-11">
      <div class="pool-container columns is-mobile is-multiline px-2 mt-2">
        <div
          class="column is-2 px-0"
          style="margin-left: -3%; margin-right: 0%"
          v-if="!photoLength && poolData.url"
        >
          <img :src="poolData.url[0]" alt="Avatar" :style="poolData.style" />
        </div>
        <div
          class="column is-2 px-0"
          style="margin-left: -3%; margin-right: 0%"
          v-else-if="photoLength && poolData.url"
        >
          <div class="columns is-mobile">
            <div class="column icon-design px-0 icon-top-design">
              <img
                class="top-image-desktop"
                :src="poolData.url[0]"
                alt="Avatar"
              />
            </div>
            <div class="column icon-design px-0 icon-bottom-design">
              <img
                class="bottom-image-desktop"
                :src="poolData.url[1]"
                alt="Avatar"
              />
            </div>
          </div>
        </div>
        <div class="column is-2 valign-text-middle px-0">
          <span class="title-text" v-if="poolData.text"
            >{{ poolData.text }}
          </span>
          <span class="title-text" v-else>Data loading ...</span>
        </div>
        <div class="column is-3 px-0">
          <div class="top-text">
            <span style="margin-right: 20%"
              >{{ parseFloat(usd_deposited_amount).toFixed(2) }} $</span
            >
          </div>
          <div class="bottom-text">
            <span style="margin-right: 20%"
              >{{ parseFloat(deposited_amount).toFixed(2) }}
              {{ poolData.deposited_currency }}</span
            >
          </div>
        </div>
        <div class="column is-2 px-0">
          <div class="top-text">
            <span>{{ parseFloat(yieldUsd).toFixed(2) }} $</span>
          </div>
          <div class="bottom-text">
            <span
              >{{ parseFloat(yieldToken).toFixed(2) }}
              {{ poolData.yield_currency }}</span
            >
          </div>
        </div>
        <div class="column is-2 px-0">
          <div class="top-text">
            <span class="">{{ parseFloat(tvlUsd).toFixed(2) }} $</span>
          </div>
          <div class="bottom-text">
            <span class=""
              >{{ parseFloat(tvlToken).toFixed(2) }}
              {{ poolData.tvl_currency }}</span
            >
          </div>
        </div>
        <div class="column is-1 px-0" @click="openRoiModal()">
          <h1 style="font-weight: 700; font-size: 1vw">
            {{ parseFloat(apr).toFixed(3) }}%
          </h1>
        </div>
        <transition name="fade"
          ><div class="column is-12" v-if="expandPool">
            <hr />
            <div class="columns is-mobile" style="width: 94%; margin-left: 3%">
              <!-- <div class="column is-6 textLeftAlign pl-0 mt-2"> -->
              <div class="column is-6">
                <div>
                  Wallet Balance:
                  {{ parseFloat(wallet_balance).toFixed(2) }}
                  {{ poolData.wallet_balance_token }} -
                  {{ parseFloat(wallet_balance_usd).toFixed(2) }} $
                </div>
                <div v-if="poolData.second_token">
                  {{
                    parseFloat(wallet_balance_first_token).toFixed(2) +
                    "  " +
                    poolData.first_token +
                    "  -  " +
                    parseFloat(wallet_balance_usd_first_token).toFixed(2)
                  }}
                  $
                  <br />
                  {{
                    parseFloat(wallet_balance_second_token).toFixed(2) +
                    "  " +
                    poolData.second_token +
                    "  -  " +
                    parseFloat(wallet_balance_usd_second_token).toFixed(2)
                  }}
                  $
                </div>
              </div>
              <div
                class="column is-2"
                :class="{ 'button-container': isRewardZero }"
                v-if="isRewardClaimed"
              >
                <button
                  class="action-button"
                  :class="{ disable: isRewardZero }"
                  @click="claimReward()"
                >
                  Claim Reward
                </button>
              </div>
              <div class="column is-2" v-else>
                <button class="action-button">
                  <div class="lds-dual-ring"></div>
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isWalletBalanceZero }"
                v-if="isApproved"
              >
                <button
                  class="action-button"
                  :class="{ disable: isWalletBalanceZero }"
                  @click="openModal('Deposit')"
                >
                  Deposit
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isWalletBalanceZero }"
                v-else-if="!isApproved"
              >
                <button
                  class="action-button"
                  :class="{ disable: isWalletBalanceZero }"
                  @click="approveDeposit(poolData.id, wallet_balance)"
                >
                  Approve to stake
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isWalletBalanceZero }"
                v-else
              >
                <button
                  class="action-button"
                  :class="{ 'button-container': isWalletBalanceZero }"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isDepositedAmountZero }"
                v-if="isWithdrawApproved"
              >
                <button
                  class="action-button"
                  :class="{ disable: isDepositedAmountZero }"
                  @click="openModal('Withdraw')"
                >
                  Withdraw
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isDepositedAmountZero }"
                v-else-if="isWithdrawApproving"
              >
                <button
                  class="action-button"
                  :class="{ disable: isDepositedAmountZero }"
                >
                  <div class="lds-dual-ring"></div>
                </button>
              </div>
              <div
                class="column is-2 px-0"
                :class="{ 'button-container': isDepositedAmountZero }"
                v-else
              >
                <button
                  class="action-button"
                  @click="approveWithdraw(poolData.id, deposited_amount)"
                  :class="{ disable: isDepositedAmountZero }"
                >
                  Approve to withdraw
                </button>
              </div>
            </div>
          </div></transition
        >
      </div>
    </div>
    <div class="expand column is-1">
      <button v-if="!expandPool" class="expand-pool" @click="openExpandPool">
        +
      </button>
      <button v-else class="expand-pool" @click="closeExpandPool">-</button>
    </div>
  </div>
</template>

<script>
import Web3Helper from "../utils/web3Requests";
import ApiClient from "../utils/apiClient";
import axios from "axios";
import GraphQlHelper from "../utils/graphqlRequests";
import store from "../store";
import Store from "../store/index";
import Decimal from "decimal.js";

export default {
  name: "FarmPoolComponent",
  components: {},
  store,
  data() {
    return {
      isRewardZero: false,
      isRewardClaimed: true,
      isWalletBalanceZero: false,
      isDepositedAmountZero: false,
      chainId: null,
      poolData: "",
      expandPool: false,
      inputAmount: null,
      photoLength: null,
      deposited_amount: 0,
      reward_debt: 0,
      usd_deposited_amount: 0,
      yieldToken: 0,
      yieldUsd: 0,
      tvlToken: 0,
      tvlUsd: 0,
      apr: 0,
      wallet_balance: 0,
      wallet_balance_usd: 0,
      wallet_balance_first_token: 0,
      wallet_balance_second_token: 0,
      wallet_balance_usd_first_token: 0,
      wallet_balance_usd_second_token: 0,
      isApproved: false,
      isApproving: false,
      isWithdrawApproved: false,
      isWithdrawApproving: false,
      isWithdrawing: false,
      isDepositing: false,
      sender: "",
      balancePercentage: 0,
      isHidden: 0,
      actionTitle: "",
      withdraw_disable: false,
      deposit_disable: false,
    };
  },
  props: {
    poolItem: {
      type: Object,
    },
    amountPid: {
      type: Number,
    },
  },
  methods: {
    openModal(title) {
      // this.actionTitle = title;
      // this.isHidden = 1;
      if (title == "Deposit") {
        this.isDepositing = true;
      } else if (title == "Withdraw") {
        this.isWithdrawing = true;
      }
      this.$emit(
        "open-amount-modal",
        title,
        this.poolData.id,
        this.poolData.text,
        parseFloat(this.deposited_amount),
        this.wallet_balance
      );
    },
    closeModal() {
      this.$emit("close-amount-modal");
    },
    openExpandPool() {
      this.expandPool = true;
    },
    closeExpandPool() {
      this.expandPool = false;
    },
    openRoiModal() {
      // this.$emit("open-roi-modal");
    },
    claimReward() {
      if (this.poolData.is_nft == false) {
        this.isRewardClaimed = false;
        new Web3Helper()
          .claimTokens(this.poolData.id)
          .then(() => {
            this.isRewardClaimed = true;
            this.isWithdrawApproved = false;
            this.isWithdrawApproving = false;
            localStorage.setItem("w" + this.poolData.id, "");
            this.checkBalanceStatus();
          })
          .catch((e) => {
            console.log(e);
            this.isRewardClaimed = true;
          })
          .finally(() => {
            this.priceUpdates();
            this.checkBalanceStatus();
          });
      } else {
        this.claimRewardNFT();
      }
    },
    claimRewardNFT() {
      new Web3Helper()

        .claimNFTTokens()
        .then(() => {
          console.log("Claimed NFT");
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.priceUpdates();
          this.checkBalanceStatus();
        });
    },
    approveWithdraw(id, amount) {
      this.isWithdrawApproving = true;
      if (this.poolData.is_nft == false && id == 0) {
        new Web3Helper()
          .approveTokens(id, amount)
          .then((data) => {
            this.sender = data.from;
            this.isWithdrawApproved = true;
            this.isWithdrawApproving = false;
            localStorage.setItem("w" + id, true);
            localStorage.setItem("sender", this.sender);
          })
          .catch((e) => {
            this.isWithdrawApproving = false;
            this.isWithdrawApproved = false;
            localStorage.setItem("w" + id, "");
            console.log(e);
          })
          .finally(() => {
            this.priceUpdates();
            this.checkBalanceStatus();
          });
      } else if (this.poolData.is_nft == false) {
        new Web3Helper()
          .approveWithdrawLP(id, amount)
          .then((data) => {
            this.sender = data.from;
            localStorage.setItem("w" + id, true);
            this.isWithdrawApproved = true;
            this.isWithdrawApproving = false;
            localStorage.setItem("sender", this.sender);
          })
          .catch((e) => {
            this.isWithdrawApproving = false;
            this.isWithdrawApproved = false;
            localStorage.setItem("w" + id, "");
            console.log(e);
          })
          .finally(() => {
            this.priceUpdates();
            this.checkBalanceStatus();
          });
      } else {
        new Web3Helper()
          .approve_xCIVNFT(amount)
          .then((data) => {
            this.sender = data.from;
            this.isWithdrawApproved = true;
            this.isWithdrawApproving = false;
            localStorage.setItem("w" + id, true);
            localStorage.setItem("sender", this.sender);
          })
          .catch((e) => {
            this.isWithdrawApproving = false;
            this.isWithdrawApproved = false;
            localStorage.setItem("w" + id, "");
            console.log(e);
          })
          .finally(() => {
            this.priceUpdates();
            this.checkBalanceStatus();
          });
      }
    },
    approveDeposit(id, amount) {
      if (amount > 0 && !localStorage.getItem(id)) {
        this.isApproving = true;
        if (this.poolData.is_nft == false && id == 0) {
          new Web3Helper()

            .approveTokens(id, amount)
            .then((data) => {
              this.isApproving = false;
              this.isApproved = true;
              // localStorage.setItem(id, true);
              this.sender = data.from;
              localStorage.setItem("sender", this.sender);
            })
            .catch((e) => {
              this.isApproving = false;
              this.isApproved = false;
              // localStorage.setItem(id, "");
              console.log(e);
            })
            .finally(() => {
              this.priceUpdates();
              this.checkBalanceStatus();
            });
        } else if (this.poolData.is_nft == true) {
          new Web3Helper()
            .approveNFT()
            .then((address) => {
              this.isApproving = false;
              this.isApproved = true;
              // localStorage.setItem(id, true);
              this.sender = address;
              localStorage.setItem("sender", address);
            })
            .catch((e) => {
              this.isApproving = false;
              this.isApproved = false;
              // localStorage.setItem(id, "");
              console.log(e);
            })
            .finally(() => {
              this.priceUpdates();
              this.checkBalanceStatus();
            });
        } else {
          new Web3Helper()

            .approveLP(id, amount)
            .then((data) => {
              this.isApproving = false;
              this.isApproved = true;
              // localStorage.setItem(id, true);
              this.sender = data.from;
              localStorage.setItem("sender", this.sender);
            })
            .catch((e) => {
              this.isApproving = false;
              this.isApproved = false;
              // localStorage.setItem(id, "");
              console.log(e);
            })
            .finally(() => {
              this.priceUpdates();
              this.checkBalanceStatus();
            });
        }
      }
    },
    async withdraw(id, amount) {
      if (this.poolData.id == id) {
        this.isWithdrawing = true;
        this.$emit("close-amount-modal");
        this.sender = localStorage.getItem("sender");
        if (id == 0) {
          await new Web3Helper()
            .LeaveStakingTokens(amount)
            .then((val) => {
              console.log(val);
            })
            .finally(() => {
              this.priceUpdates();
              this.checkBalanceStatus();
            });
          this.isWithdrawing = false;
        } else if (id == 5) {
          this.withdrawNFT(id, amount);
          this.isWithdrawing = false;
        } else {
          await new Web3Helper()
            .withdrawLP(this.sender, amount, id)
            .then((val) => {
              console.log(val);
              this.isApproved = false;
            })
            .finally(() => {
              this.priceUpdates();
              this.checkBalanceStatus();
            });

          this.isWithdrawing = false;
        }
        this.priceUpdates();
        this.checkBalanceStatus();
      }
    },
    async deposit(id, amount) {
      if (this.poolData.id == id) {
        this.isDepositing = true;
        this.$emit("close-amount-modal");
        this.sender = localStorage.getItem("sender");
        if (id == 0) {
          await new Web3Helper()
            .stakingTokens(amount)
            .then(() => {
              this.isWithdrawApproved = false;
              this.isWithdrawApproving = false;
              this.isApproved = true;
              localStorage.setItem("w0", "");
              this.isDepositing = false;
            })
            .catch((e) => {
              this.isDepositing = false;
              console.log(e);
            })
            .finally(() => {
              this.priceUpdates();
            });
        } else if (id == 5) {
          this.depositNFT(id, amount);
        } else {
          let amount = this.deposited_amount;
          await new Web3Helper()
            .depositLP(this.sender, amount, id)
            .then(() => {
              console.log("brenda");
              this.isWithdrawApproved = false;
              this.isWithdrawApproving = false;
              this.isApproved = true;
              localStorage.setItem("w" + id, "");
              this.isDepositing = false;
            })
            .catch((e) => {
              this.isDepositing = false;
              console.log(e);
            })
            .finally(() => {
              this.priceUpdates();
              this.isWithdrawApproved = false;
              this.isWithdrawApproving = false;
            });
        }
        this.inputAmount = null;
      }
    },
    async withdrawNFT(id, amount) {
      await new Web3Helper()
        .LeaveNFTStakingTokens(amount)
        .then(() => {
          // localStorage.setItem(id, "");
          this.isWithdrawing = false;
          this.isApproved = false;
        })
        .catch((e) => {
          this.isWithdrawing = false;
          console.log(e);
        })
        .finally(() => {
          this.checkBalanceStatus();
          this.priceUpdates();
        });
      this.checkBalanceStatus();
      this.priceUpdates();
    },
    async depositNFT(pid, amount) {
      this.isApproving = false;
      await new Web3Helper()
        .stakingNFTTokens(amount)
        .then(() => {
          console.log("DONE!");
          localStorage.setItem("w" + pid, "");
          this.isWithdrawApproved = false;
          this.isWithdrawApproving = false;
          this.isDepositing = false;
        })
        .catch((e) => {
          this.isDepositing = false;
          console.log(e);
        })
        .finally(() => {
          this.priceUpdates();
          this.checkBalanceStatus();
        });
      this.priceUpdates();
      this.checkBalanceStatus();
    },
    getPendingTokens(pid) {
      !this.poolData.is_nft && pid < 5
        ? new Web3Helper().pendingTokens(pid).then((data) => {
            this.yieldToken = data / Math.pow(10, 18);
            new ApiClient()
              .getPricesUSD("civfund-stone")
              .then((res) => {
                if (res.length) {
                  this.yieldUsd = res[0].current_price * this.yieldToken;
                }
                this.checkBalanceStatus();
              })
              .catch(() => {});
          })
        : "";
    },
    async getDaiAmount() {
      let network = await Store.state.provider.getNetwork();
      new Web3Helper()
        .loadbalances()
        .then((response) => {
          console.log('start 1===============>')
          if (this.poolData.id == 1) {
            this.wallet_balance = response[4] / Math.pow(10, 18);
            // new ApiClient()
            //   .getPricesUSD("civfund-stone")
            //   .then((res) => {
            //     if (res.length) {
            //       this.wallet_balance_usd =
            //         this.wallet_balance * res[0].current_price;
            //       // this.checkAllowance(this.poolData.id);
            //     }
            //     this.checkBalanceStatus();
            //   })
            //   .catch(() => {});
          } else if (this.poolData.id == 2) {
            this.wallet_balance_first_token = response[8] / Math.pow(10, 18); //ONE
            this.wallet_balance_second_token = response[10] / Math.pow(10, 18); //USDT
            this.wallet_balance_usd_second_token = response[10]; //USDT

            this.wallet_balance = response[5] / Math.pow(10, 18);
            new ApiClient()
              .getPricesUSD("civfund-stone")
              .then((res) => {
                new ApiClient()
                  .getPricesUSD("ethereum")
                  .then((res2) => {
                    if (res.length) {
                      this.wallet_balance_usd =
                        (this.wallet_balance * res[0].current_price) /
                        res2[0].current_price;

                      this.wallet_balance_usd_first_token =
                        this.wallet_balance_first_token * res[0].current_price; //ONE
                      // this.checkAllowance(this.poolData.id);
                    }
                    this.checkBalanceStatus();
                  })
                  .catch(() => {});
              })
              .catch(() => {});
          } else if (this.poolData.id == 3) {
            this.wallet_balance_first_token = response[8] / Math.pow(10, 18); //ONE
            this.wallet_balance_second_token = response[0] / Math.pow(10, 18); //CIV

            this.wallet_balance = response[6] / Math.pow(10, 18); //CIV
            new ApiClient()
              .getPricesUSD("civfund-stone")
              .then((res) => {
                if (res.length) {
                  this.wallet_balance_usd_first_token =
                    this.wallet_balance_first_token * res[0].current_price; //ONE
                  new ApiClient()
                    .getPricesUSD("civilization")
                    .then((res2) => {
                      this.wallet_balance_usd =
                        this.wallet_balance *
                        (res[0].current_price / res2[0].current_price);
                      this.wallet_balance_usd_second_token =
                        this.wallet_balance_second_token *
                        res2[0].current_price; //CIV
                      // this.checkAllowance(this.poolData.id);
                      this.checkBalanceStatus();
                    })
                    .catch(() => {});
                }
              })
              .catch(() => {});
          } else if (this.poolData.id == 4) {
            this.wallet_balance_first_token = response[0] / Math.pow(10, 18); //CIV
            this.wallet_balance_second_token = response[10] / Math.pow(10, 18); //ETH

            this.wallet_balance = response[7] / Math.pow(10, 18);

            new ApiClient()
              .getPricesUSD("civilization")
              .then((res) => {
                if (res.length) {
                  this.wallet_balance_usd_first_token =
                    this.wallet_balance_first_token * res[0].current_price; //CIV
                  new ApiClient()
                    .getPricesUSD("ethereum")
                    .then((res2) => {
                      if (res2.length) {
                        this.wallet_balance_usd =
                          (res[0].current_price / res2[0].current_price) *
                          this.wallet_balance;
                        this.wallet_balance_usd_second_token =
                          this.wallet_balance_second_token *
                          res2[0].current_price; //ETH
                        this.checkBalanceStatus();
                        // this.checkAllowance(this.poolData.id);
                      }
                    })
                    .catch(() => {});
                }
              })
              .catch(() => {});
          } else if (this.poolData.is_nft) {
            this.wallet_balance = response[1];
            this.deposited_amount = response[2];
            axios
              .get(
                `${process.env.VUE_APP_API_HOST}/getNftUsdPrice/0x495f947276749ce646f68ac8c248420045cb7b5e/11155307892213316102126205517473478203086619238533575936401408031787321393652/?chainId=${network.chainId}`
              )
              .then((response) => {
                new ApiClient()
                  .getPricesUSD("ethereum")
                  .then((res) => {
                    if (res.length) {
                      this.wallet_balance_usd =
                        this.wallet_balance *
                        response.data *
                        res[0].current_price;
                      this.usd_deposited_amount =
                        this.deposited_amount *
                        response.data *
                        res[0].current_price;
                      this.checkBalanceStatus();
                      // this.checkAllowance(this.poolData.id);
                    }
                  })
                  .catch(() => {});
              });

            // this.checkAllowance(this.poolData.id);

            this.yieldToken = response[3] / Math.pow(10, 18);

            new ApiClient()
              .getPricesUSD("civfund-stone")
              .then((res) => {
                if (res.length) {
                  // this.checkAllowance(this.poolData.id);
                  this.yieldUsd = this.yieldToken * res[0].current_price;
                  this.checkBalanceStatus();
                }
              })
              .catch(() => {});
          } else if (this.poolData.id == 0) {
            this.wallet_balance = response[0] / Math.pow(10, 18);
            new ApiClient()
              .getPricesUSD("civilization")
              .then((res) => {
                if (res.length) {
                  this.wallet_balance_usd =
                    res[0].current_price * this.wallet_balance;
                  this.checkBalanceStatus();
                }
              })
              .catch(() => {});
          }
        })
        .then(() => {
          this.checkAllowance(this.poolData.id);
        });
    },
    getDepositedAmount() {
      if (!this.poolData.is_nft) {
        new Web3Helper().userLP(this.poolData.id).then((response) => {
          this.deposited_amount = response / Math.pow(10, 18);
          new ApiClient()
            .getPricesUSD(this.poolData.first_token_id)
            .then((res) => {
              if (res.length) {
                if (this.poolData.second_token_id) {
                  new ApiClient()
                    .getPricesUSD(this.poolData.second_token_id)
                    .then((res2) => {
                      if (res2.length) {
                        this.usd_deposited_amount =
                          this.deposited_amount *
                          (res[0].current_price / res2[0].current_price);
                      }
                    })
                    .catch(() => {});
                } else {
                  this.usd_deposited_amount =
                    this.deposited_amount * res[0].current_price;
                }
              }
            })
            .catch(() => {});
        });
      } else {
        new GraphQlHelper().getDepositedAmount().then((response) => {
          if (response.data.data.users.length && this.poolData.id == 0) {
            this.deposited_amount = parseFloat(
              response.data.data.users[0].amount / Math.pow(10, 18)
            );
            new ApiClient()
              .getPricesUSD("civilization")
              .then((res) => {
                if (res.length) {
                  this.usd_deposited_amount =
                    res[0].current_price * this.deposited_amount;
                }
              })
              .catch(() => {});
          }
        });
      }
    },
    async getPoolInfo(pid) {
      let network = await Store.state.provider.getNetwork();
      if (!this.poolData.is_nft) {
        axios
          .get(
            `${process.env.VUE_APP_API_HOST}/getPoolData/${pid}/?chainId=${network.chainId}`
          )
          .then((response) => {
            this.tvlToken = response.data.balance;
            this.tvlUsd = response.data.tvlUSD;
            if (response.data.roiPerYear)
              this.apr = response.data.roiPerYearPerc;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    async getNFTPoolInfo() {
      let network = await Store.state.provider.getNetwork();
      if (this.poolData.is_nft) {
        axios
          .get(
            `${process.env.VUE_APP_API_HOST}/getNftPoolData/0?chainId=${network.chainId}`
          )
          .then((response) => {
            this.tvlToken = response.data.balance;
            this.tvlUsd = response.data.tvlUSD;
            this.apr = response.data.roiPerYearPerc;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    checkAllowance(id) {
      if (id < 5) {
        new Web3Helper().checkAllowance(id).then((res) => {
          let allowance = new Decimal(res);
          if (
            allowance
              .dividedBy(Math.pow(10, 18))
              .lessThan(new Decimal(this.wallet_balance))
          ) {
            this.isApproved = false;
            this.isApproving = false;
          } else {
            this.isApproved = true;
          }
        });
      }
    },
    checkBalanceStatus() {
      this.isWalletBalanceZero = this.wallet_balance == 0 ? true : false;
      this.isRewardZero = this.yieldToken == 0 ? true : false;
      this.isDepositedAmountZero = this.deposited_amount == 0 ? true : false;
    },
    priceUpdates() {
      console.log("Updating Pool Infos");
      this.getPoolInfo(this.poolData.id);
      this.getPendingTokens(this.poolData.id);
      this.getDepositedAmount();
      this.getNFTPoolInfo();
      this.getDaiAmount();
    },
  },
  mounted() {
    this.isWithdrawApproved = localStorage.getItem("w" + this.poolItem.id);
    Store.state.provider.provider.on("chainChanged", () => {
      localStorage.setItem("w" + this.poolData.id, "");
      localStorage.setItem("sender", "");
    });
    this.$root.$on("deposit", this.deposit);
    this.$root.$on("withdraw", this.withdraw);
    // this.getPoolInfo(this.poolData.id);
    // this.getPendingTokens(this.poolData.id);
    // this.getDepositedAmount();
    // this.getNFTPoolInfo();
    this.getDaiAmount();
    console.log('start 2==========>')
    window.setInterval(() => {
      // this.isWithdrawApproved = localStorage.getItem("w" + this.poolItem.id);
      // this.getPoolInfo(this.poolData.id);
      // this.getPendingTokens(this.poolData.id);
      // this.getDepositedAmount();
      // this.getNFTPoolInfo();
      this.getDaiAmount();
    console.log('start 3==========>')
    }, 10000);
    window.setInterval(() => {
      this.isWithdrawApproved = localStorage.getItem("w" + this.poolItem.id);
    }, 3000);
  },
  created() {
    this.poolData = this.poolItem;
    this.poolData.url.length == 2
      ? (this.photoLength = true)
      : (this.photoLength = false);
  },
  beforeDestroy() {
    this.$root.$off("deposit", this.deposit);
    this.$root.$off("withdraw", this.withdraw);
  },
};
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.top-text {
  font-size: 1.4vw;
  color: white;
  display: flex;
  justify-content: center;
}
.bottom-text {
  font-size: 1.4vw;
  color: $topaz;
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
.top-image-desktop {
  right: -10px;
  position: relative;
  z-index: 1;
  height: 36px !important;
}
.bottom-image-desktop {
  position: relative;
  height: 36px !important;
}
.icon-top-design {
  display: flex;
  justify-content: end;
}
.icon-bottom-design {
  display: flex;
  justify-content: start;
}
span {
  white-space: normal;
}
.textLeftAlign {
  text-align: left;
}
.textRightAlign {
  text-align: right;
}
.pool {
  display: flex;
  justify-content: center;
}
.expand {
  display: flex;
  justify-content: flex-start;
  margin-top: auto;
  margin-bottom: auto;
}
.pool-container {
  width: 100%;
  display: flex;
  flex: 1;
  list-style: none;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  padding: 10px;
  border-radius: 30px;
  margin: 5px;
  color: $white;
  border: solid 1px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;
}
h1 {
  font-size: 1.5vw;
  font-weight: 500;
}
.title-text {
  font-size: 1.5vw;
  font-weight: 700;
}
.input-amount {
  width: 100%;
}
.expand-pool {
  min-width: 45px;
  min-height: 45px;
  font-weight: 700;
  font-size: 41px;
  line-height: 21px;
  padding: 10px;
  border-radius: 15px;
  color: $white;
  border: solid 1px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px $dark-1 inset;

  &:hover {
    box-shadow: 2px 1000px 1px #4b5369 inset;
  }
}
hr {
  width: 94%;
  margin-left: 3%;
  display: flex;
  justify-content: center;
  border: solid 1px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(101deg, $success, $purple);
  background-origin: border-box;
}
input {
  display: flex;
  width: 100%;
  background-color: $vulcan;
  border: solid 1px transparent;
  color: white;
  border-radius: 10px;
  font-size: 23px;
  padding: 12px 15px;
}
input:hover {
  border: solid 1px transparent;
}
input::placeholder {
  font-size: 1vw;
}
.action-button {
  border-radius: 15px;
  width: 100%;
  border: solid 3px transparent;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px #35b0a9 inset;
  padding: 10px 0;
  font-weight: 500;
  font-size: 1vw;
  line-height: 30px;
  overflow: hidden;
  color: $white;
  cursor: pointer;

  &:hover {
    box-shadow: 2px 1000px 1px #268883 inset;
  }
}
::placeholder {
  color: $topaz;
  font-family: $font-family-rajdhani;
  font-style: normal;
  font-weight: 500;
  align-self: center;
}
::-webkit-input-placeholder {
  text-align: center;
}

:-moz-placeholder {
  /* Firefox 18- */
  text-align: center;
}

@media (min-width: 1800px) {
  .top-text {
    font-size: 1vw;
  }
  .bottom-text {
    font-size: 1vw;
  }
  .title-text {
    font-size: 1vw;
    font-weight: 700;
  }
}
@media (max-width: 1100px) {
  .top-text {
    font-size: 1.6vw;
  }
  .bottom-text {
    font-size: 1.6vw;
  }
  .title-text {
    font-size: 2vw;
    font-weight: 700;
  }
}

::-moz-placeholder {
  /* Firefox 19+ */
  text-align: center;
}

:-ms-input-placeholder {
  text-align: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.lds-dual-ring {
  display: inline-block;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.disable {
  cursor: no-drop;
  pointer-events: none;
  color: #6d6969;
  box-shadow: 2px 1000px 1px #cecece inset;
}
.button-container {
  cursor: no-drop;
}
</style>
