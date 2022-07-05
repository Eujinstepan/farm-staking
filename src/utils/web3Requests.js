import Web3 from "web3";
import FARM_ABI from "../constants/POOLABI.json";
import NFT_FARM_ABI from "../constants/POOLNFTABI.json";
import Store from "../store/index";
import {
  FARM_ADDRESS,
  NFT_FARM_ADDRESS,
  DAI_ADDRESS,
  STONE_ADDRESS,
  XCIV_ADDRESS,
  NFT_ADDRESS,
  LP2_ADDRESS,
  LP3_ADDRESS,
  RT2_ADDRESS,
  RT3_ADDRESS,
  LP4_ADDRESS,
  LP5_ADDRESS,
  RT4_ADDRESS,
  RT5_ADDRESS,
  NETWORK,
} from "../constants/const";
import BlockchainHelper from "./blockchain";
import DAI_ABI from "../constants/DAIABI.json";
import STONE_ABI from "../constants/STONEABI.json";
import XCIV_ABI from "../constants/XCIV_ABI.json";
import NFT_ABI from "../constants/NFT_ABI.json";
import LP3_ABI from "../constants/3lpABI.json";
import LP2_ABI from "../constants/2lpABI.json";
import RT2_ABI from "../constants/2rtABI.json";
import RT3_ABI from "../constants/3rtABI.json";
import LP4_ABI from "../constants/4lpABI.json";
import LP5_ABI from "../constants/5lpABI.json";
import RT4_ABI from "../constants/4rtABI.json";
import RT5_ABI from "../constants/5rtABI.json";

export default class Web3Requests {
  web3 = new Web3(Web3.givenProvider);
  networkId = null;
  farm_pool_contract = null;
  farm_pool_nft_contract = null;
  lp2_contract = null;
  lp3_contract = null;
  lp4_contract = null;
  lp5_contract = null;
  nft_contract = null;
  dai_contract = null;
  stone_contract = null;

  async init() {
    Store.state.provider.provider.on("chainChanged", (networkId) => {
      this.networkId = networkId;
    });
    if (!this.networkId) {
      const network = await NETWORK;
      switch (network) {
        case "kovan":
          this.networkId = 4;
          this.chainId = 42;
          break;
        case "rinkeby":
          this.networkId = 3;
          this.chainId = 42;
          break;
        default:
          this.networkId = 4;
          this.chainId = 42;
          break;
      }
    }

    this.farm_pool_contract = new this.web3.eth.Contract(
      FARM_ABI,
      FARM_ADDRESS[this.networkId]
    );
    this.farm_pool_nft_contract = new this.web3.eth.Contract(
      NFT_FARM_ABI,
      NFT_FARM_ADDRESS[this.networkId]
    );
    this.lp2_contract = new this.web3.eth.Contract(
      LP2_ABI,
      LP2_ADDRESS[this.networkId]
    );
    this.lp3_contract = new this.web3.eth.Contract(
      LP3_ABI,
      LP3_ADDRESS[this.networkId]
    );
    this.lp4_contract = new this.web3.eth.Contract(
      LP4_ABI,
      LP4_ADDRESS[this.networkId]
    );
    this.lp5_contract = new this.web3.eth.Contract(
      LP5_ABI,
      LP5_ADDRESS[this.networkId]
    );
    this.nft_contract = new this.web3.eth.Contract(
      NFT_ABI,
      NFT_ADDRESS[this.networkId]
    );
    this.dai_contract = new this.web3.eth.Contract(
      DAI_ABI,
      DAI_ADDRESS[this.networkId]
    );
    this.stone_contract = new this.web3.eth.Contract(
      STONE_ABI,
      STONE_ADDRESS[this.networkId]
    );
  }

  async getNetwork() {
    await this.init();
    return this.web3.eth.net.getNetworkType().then((network) => {
      return network;
    });
  }

  async poolLength() {
    await this.init();
    return this.farm_pool_contract.methods.poolLength().call();
  }

  async poolLengthNFT() {
    await this.init();
    return this.farm_pool_nft_contract.methods.poolLength().call();
  }

  async loadbalances() {
    await this.init();
    try {
      //   const xciv_contract = new this.web3.eth.Contract(
      //     XCIV_ABI,
      //     XCIV_ADDRESS[this.networkId]
      //   );
      //   const farm_contract = new this.web3.eth.Contract(
      //     FARM_ABI,
      //     FARM_ADDRESS[this.networkId]
      //   );

      //   const nft_farm_contract = new this.web3.eth.Contract(
      //     NFT_FARM_ABI,
      //     NFT_FARM_ADDRESS[this.networkId]
      //   );
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];
      let daiBalance = await this.dai_contract.methods
        .balanceOf(address)
        .call();

      //   let claimDAI = await this.dai_contract.methods
      //     .balanceOf(FARM_ADDRESS[this.networkId])
      //     .call();
      //   if (claimDAI > 0) {
      //     claimDAI = claimDAI / 1000000000000000000;
      //     claimDAI = Math.floor(claimDAI, 3);
      //   }
      //   let daiBalance = await this.dai_contract.methods.balanceOf(address).call();
      //   if (daiBalance > 0) {
      //     daiBalance = daiBalance / 1000000000000000000;
      //     daiBalance = Math.floor(daiBalance, 3);
      //   }
      let stoneBalance = await this.stone_contract.methods
        .balanceOf(address)
        .call();

      //   let xcivBalance = await xciv_contract.methods.balanceOf(address).call();
      //   if (xcivBalance > 0) {
      //     xcivBalance = xcivBalance / 1000000000000000000;
      //     xcivBalance = Math.floor(xcivBalance, 3);
      //   }

      //   let approvedBalance = await this.dai_contract.methods
      //     .allowance(address, FARM_ADDRESS[this.networkId])
      //     .call();
      //   if (approvedBalance > 0) {
      //     approvedBalance = approvedBalance / 1000000000000000000;
      //     approvedBalance = Math.floor(approvedBalance, 3);
      //   }

      //   let stakedBalance = await farm_contract.methods
      //     .getUserLP(0, address)
      //     .call();
      //   if (stakedBalance > 0) {
      //     stakedBalance = stakedBalance / 1000000000000000000;
      //     stakedBalance = Math.floor(stakedBalance, 3);
      //   }

      //   let pendingBalance = await farm_contract.methods
      //     .pendingTokens(0, address)
      //     .call();
      //   if (pendingBalance > 0) {
      //     pendingBalance = (pendingBalance / 1000000000000000000).toFixed(18);
      //   }
      let nft_wallet_balance = await this.nft_contract.methods
        .balanceOf(address, 0)
        .call();

      let lp2_balance = await this.lp2_contract.methods
        .balanceOf(address)
        .call();

      let lp3_balance = await this.lp3_contract.methods
        .balanceOf(address)
        .call();
      let lp4_balance = await this.lp4_contract.methods
        .balanceOf(address)
        .call();

      let lp5_balance = await this.lp5_contract.methods
        .balanceOf(address)
        .call();

      //   await this.nft_contract.methods.balanceOf(address, 0).call();
      //      let nft_staked_balance = farm_pool_nft_contract.methods

      let nft_staked_balance = await this.farm_pool_nft_contract.methods
        .getUserLP(0, address)
        .call();
      let nft_reward_balance = await this.farm_pool_nft_contract.methods
        .pendingTokens(0, address)
        .call();
      //   let nft_reward_balance = await nft_farm_contract.methods
      //     .pendingTokens(0, address)
      //     .call();
      //   if (nft_reward_balance > 0) {
      //     nft_reward_balance = (nft_reward_balance / 1000000000000000000).toFixed(
      //       18
      //     );
      //   }
      return [
        daiBalance, //0
        nft_wallet_balance, //1
        nft_staked_balance, //2
        nft_reward_balance, //3
        lp2_balance, //4
        lp3_balance, //5
        lp4_balance, //6
        lp5_balance, //7
        stoneBalance, //8
        0, //9
        0, //10
      ];
    } catch (err) {
      console.log(err);
    }
  }

  async claimDAI(amount) {
    await this.init();
    if (FARM_ADDRESS[this.networkId] === "") {
      return;
    }

    try {
      const contract = new this.web3.eth.Contract(
        FARM_ABI,
        FARM_ADDRESS[this.networkId]
      );
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];

      if (amount > 10) {
        console.log("Cannot get more than 10 DAI at once.", true);
        return;
      }
      amount = this.web3.utils.toWei(amount.toString(), "ether");

      contract.methods
        .claimDAI(amount)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, true, receipt);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
        });
      return 1;
    } catch (err) {
      console.log(err);
    }
  }

  async addToken() {
    await this.init();
    if (
      FARM_ABI[this.networkId] === "" ||
      STONE_ADDRESS[this.networkId] === ""
    ) {
      return;
    }
    try {
      // const stone_contract = new this.web3.eth.Contract(
      //   STONE_ABI,
      //   STONE_ADDRESS[this.networkId]
      // );

      const decimal = await this.stone_contract.methods.decimals().call();
      const symbol = await this.stone_contract.methods.symbol().call();

      await this.web3.currentProvider.sendAsync({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: STONE_ADDRESS[this.networkId],
            symbol: symbol,
            decimals: decimal,
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async claimTokens(pid) {
    await this.init();
    if (FARM_ABI[this.networkId] === "") {
      return;
    }
    try {
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];
      await this.farm_pool_contract.methods
        .withdrawYield(pid)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, true, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log("TX HASH: ", txHash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async approveTokens(id, amount) {
    await this.init();
    if (DAI_ADDRESS[this.networkId] === "") {
      return;
    } else if (XCIV_ABI[this.networkId] === "") {
      return;
    } else if (DAI_ADDRESS[this.networkId] !== "") {
      try {
        const contract = new this.web3.eth.Contract(
          DAI_ABI,
          DAI_ADDRESS[this.networkId]
        );
        const addresses = await this.web3.eth.getAccounts();
        const address = addresses[0];
        console.log(id, amount);
        amount = this.web3.utils.toWei(amount.toString(), "ether");
        return contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err) {
            console.log(err.message, true);
          })
          .on("confirmation", function () {
            return address;
          });
      } catch (err) {
        console.log(err);
      }
    } else if (XCIV_ABI[this.networkId] === "") {
      try {
        const contract = new this.web3.eth.Contract(
          XCIV_ABI,
          XCIV_ADDRESS[this.networkId]
        );
        const addresses = await this.web3.eth.getAccounts();
        const address = addresses[0];
        amount = this.web3.utils.toWei(amount.toString(), "ether");
        return contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err, receipt) {
            console.log(err.message, true, receipt);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return address;
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getUserAcc() {
    await this.init();
    return this.web3.eth.getAccounts().then((userId) => {
      return userId[0];
    });
  }

  async stakingTokens(amount) {
    await this.init();
    let address = await this.getUserAcc();
    if (FARM_ABI[this.networkId] === "") {
      return;
    } else {
      try {
        const contract = this.farm_pool_contract;

        amount = this.web3.utils.toWei(amount.toString(), "ether");
        return await Promise.all([
          contract.methods
            .enterStaking(amount)
            .send({
              from: address,
            })
            .on("error", function (err, receipt) {
              console.log(err.message, true, receipt);
            })
            .on("transactionHash", function (txHash) {
              console.log("Processing= " + txHash, false, true);
            })
            .on("confirmation", function (confirmation, receipt) {
              return receipt;
            }),
        ]);
      } catch (err) {
        console.log(err);
        console.log("", false, false);
      }
    }
    if (NFT_FARM_ABI[this.networkId] === "") {
      return;
    } else {
      try {
        console.log("Staking NFT now...", false, true);
        this.farm_pool_nft_contract.methods
          .enterStaking(0, amount)
          .send({
            from: address,
          })
          .on("error", function (err, receipt) {
            console.log(err.message, true, receipt);
          })
          .on("transactionHash", function (txHash) {
            console.log(
              "Processing, tx=<a target='_blank' href='" + txHash + false,
              true
            );
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            const txHash = receipt.transactionHash;
            console.log("Confirmed, " + txHash, true);
          });
      } catch (err) {
        console.log(err);
        console.log("", false, false);
      }
    }
  }

  async LeaveStakingTokens(amount) {
    await this.init();
    let address = await this.getUserAcc();
    if (FARM_ABI[this.networkId] === "") {
      return;
    } else {
      try {
        const contract = new this.web3.eth.Contract(
          FARM_ABI,
          FARM_ADDRESS[this.networkId]
        );
        console.log("ADRESAZZZ", address);
        amount = this.web3.utils.toWei(amount.toString(), "ether");
        console.log("AMOUNT: ", amount);
        contract.methods
          .leaveStaking(amount)
          .send({
            from: address,
          })
          .on("error", function (err, receipt) {
            console.log(err.message, true, receipt);
            return err;
          })
          .on("transactionHash", function (txHash) {
            console.log("Processing, :", txHash, false, true);
            return txHash;
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return true;
          });
      } catch (err) {
        console.log(err);
      }
    }
    if (NFT_FARM_ABI[this.networkId] === "") {
      return;
    } else {
      try {
        console.log("Unstaking now...", false, true);
        const contract = new this.web3.eth.Contract(
          NFT_FARM_ABI,
          NFT_FARM_ADDRESS[this.networkId]
        );
        const addresses = await this.web3.eth.getAccounts();
        const address = addresses[0];

        contract.methods
          .leaveStaking(0, amount)
          .send({
            from: address,
          })
          .on("error", function (err, receipt) {
            console.log(err.message, receipt);
          })
          .on("transactionHash", function (txHash) {
            console.log(
              "Processing, tx=<a target='_blank' href='" +
                txHash +
                "'>" +
                txHash +
                "</a>",
              false,
              true
            );
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(
              "Unstaked, tx=<a target='_blank' href='" +
                confirmationNumber +
                "'>" +
                receipt +
                "</a>"
            );
            return address;
          });
      } catch (err) {
        console.log(err);
        console.log("", false, false);
      }
    }
  }

  async approveLP(pid, amount) {
    await this.init();
    const addresses = await this.web3.eth.getAccounts();
    const address = addresses[0];
    amount = this.web3.utils.toWei(amount.toString(), "ether");
    if (pid == 1) {
      try {
        return this.lp2_contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err) {
            console.log(err.message, true);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return address;
          });
      } catch (error) {
        console.error(error);
      }
    } else if (pid == 2) {
      try {
        return this.lp3_contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err) {
            console.log(err.message, true);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return address;
          });
      } catch (error) {
        console.error(error);
      }
    } else if (pid == 3) {
      try {
        return this.lp4_contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err) {
            console.log(err.message, true);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return address;
          });
      } catch (error) {
        console.error(error);
      }
    } else if (pid == 4) {
      try {
        return this.lp5_contract.methods
          .approve(FARM_ADDRESS[this.networkId], amount)
          .send({
            from: address,
          })
          .on("error", function (err) {
            console.log(err.message, true);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            console.log(confirmationNumber, receipt);
            return address;
          });
      } catch (error) {
        console.error(error);
      }
    }
  }

  async depositLP(address, amount, id) {
    await this.init();
    amount = this.web3.utils.toWei(amount.toString(), "ether");
    this.farm_pool_contract.methods
      .deposit(id, amount)
      .send({
        from: address,
      })
      .on("error", function (err) {
        console.log(err.message, true);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        return receipt;
      });
  }

  async approveWithdrawLP(pid, amount) {
    await this.init();
    if (
      RT2_ABI[this.networkId] === "" ||
      RT3_ABI[this.networkId] === "" ||
      RT4_ABI[this.networkId] === "" ||
      RT5_ABI[this.networkId] === ""
    ) {
      return;
    }
    try {
      let contract;
      if (pid == 1) {
        contract = await new this.web3.eth.Contract(
          RT2_ABI,
          RT2_ADDRESS[this.networkId]
        );
      } else if (pid == 2) {
        contract = await new this.web3.eth.Contract(
          RT3_ABI,
          RT3_ADDRESS[this.networkId]
        );
      } else if (pid == 3) {
        contract = await new this.web3.eth.Contract(
          RT4_ABI,
          RT4_ADDRESS[this.networkId]
        );
      } else if (pid == 4) {
        contract = await new this.web3.eth.Contract(
          RT5_ABI,
          RT5_ADDRESS[this.networkId]
        );
      }
      console.log(pid);

      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];
      amount = this.web3.utils.toWei(amount.toString(), "ether");
      return contract.methods
        .approve(FARM_ADDRESS[this.networkId], amount)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, true, receipt);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
          return address;
        });
    } catch (err) {
      console.log(err);
    }
  }

  async withdrawLP(address, amount, pid) {
    await this.init();
    if (FARM_ABI[this.networkId] === "") {
      return;
    }
    try {
      const contract = new this.web3.eth.Contract(
        FARM_ABI,
        FARM_ADDRESS[this.networkId]
      );
      console.log("Withdrawing ...");
      amount = this.web3.utils.toWei(amount.toString(), "ether");
      contract.methods
        .withdraw(pid, amount)
        .send({
          from: address,
        })
        .on("error", function (err) {
          console.log(err.message, true);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
        });
      return true;
    } catch (error) {
      console.log(error);
    }
    return Promise;
  }

  async withdraw(pid, amount) {
    await this.init();
    let userId = await this.getUserAcc();
    try {
      this.farm_pool_contract.methods
        .withdraw(0, amount)
        .send({
          from: userId,
        })
        .on("error", function (err) {
          console.log(err.message, true);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async userInfos(pid) {
    await this.init();
    let userId = await this.getUserAcc();
    return this.farm_pool_contract.methods.userInfo(pid, userId).call();
  }

  async poolInformation(pid) {
    await this.init();
    return this.farm_pool_contract.methods
      .poolInfo(pid)
      .call()
      .then((data) => {
        return data;
      });
  }

  async userLP(pid) {
    await this.init();
    let userId = await this.getUserAcc();
    return this.farm_pool_contract.methods.getUserLP(pid, userId).call();
  }

  async pendingTokens(pid) {
    await this.init();
    await this.init();
    const addresses = await this.web3.eth.getAccounts();
    const address = addresses[0];
    return this.farm_pool_contract.methods
      .pendingTokens(pid, address)
      .call()
      .then((response) => {
        return response;
      });
  }

  async getTVL(token_id) {
    await this.init();
    return await new BlockchainHelper().getTokenBalance(token_id);
  }

  async approveNFT() {
    await this.init();
    if (NFT_ABI[this.networkId] === "") {
      return;
    }

    try {
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];
      return this.nft_contract.methods
        .setApprovalForAll(NFT_FARM_ADDRESS[this.networkId], true)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, true, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log("Processing, :", txHash, false, true);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          const txHash = receipt.transactionHash;
          console.log("NFT Approved, :", txHash, confirmationNumber, receipt);
          return address;
        });
    } catch (err) {
      console.log(err);
      console.log("", false, false);
    }
  }

  async stakingNFTTokens(amount) {
    await this.init();
    const addresses = await this.web3.eth.getAccounts();
    const address = addresses[0];
    if (NFT_FARM_ABI[this.networkId] === "") {
      return;
    }
    try {
      console.log("Staking NFT now...", false, true);
      this.farm_pool_nft_contract.methods
        .enterStaking(0, amount)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, true, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log(
            "Processing, tx=<a target='_blank' href='" + txHash + false,
            true
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          const txHash = receipt.transactionHash;
          console.log("Confirmed, " + txHash, true);
        });
    } catch (err) {
      console.log(err);
      console.log("", false, false);
    }
  }

  async claimNFTTokens() {
    await this.init();
    if (NFT_FARM_ABI[this.networkId] === "") {
      return;
    }

    try {
      console.log("Claiming now...", false, true);
      const contract = new this.web3.eth.Contract(
        NFT_FARM_ABI,
        NFT_FARM_ADDRESS[this.networkId]
      );
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];

      contract.methods
        .withdrawYield(0)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log(
            "Processing, tx=<a target='_blank' href='" +
              txHash +
              "'>" +
              txHash +
              "</a>",
            false,
            true
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(
            "Claimed, tx=<a target='_blank' href='" +
              confirmationNumber +
              "'>" +
              receipt +
              "</a>"
          );
        });
    } catch (err) {
      console.log(err);
      console.log("", false, false);
    }
  }

  async LeaveNFTStakingTokens(amount) {
    await this.init();
    if (NFT_FARM_ABI[this.networkId] === "") {
      return;
    }

    try {
      console.log("Unstaking now...", false, true);
      const contract = new this.web3.eth.Contract(
        NFT_FARM_ABI,
        NFT_FARM_ADDRESS[this.networkId]
      );
      const addresses = await this.web3.eth.getAccounts();
      const address = addresses[0];

      contract.methods
        .leaveStaking(0, amount)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log(
            "Processing, tx=<a target='_blank' href='" +
              txHash +
              "'>" +
              txHash +
              "</a>",
            false,
            true
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(
            "Unstaked, tx=<a target='_blank' href='" +
              confirmationNumber +
              "'>" +
              receipt +
              "</a>"
          );
          return address;
        });
    } catch (err) {
      console.log(err);
      console.log("", false, false);
    }
  }

  async approve_xCIVNFT(amount) {
    await this.init();
    if (XCIV_ABI[this.networkId] === "") {
      return false;
    }
    let amount_represent = this.web3.utils.toWei(amount.toString(), "ether");
    const addresses = await this.web3.eth.getAccounts();
    const address = addresses[0];

    try {
      console.log("Approving xCIV now...", false, true);
      const contract = new this.web3.eth.Contract(
        XCIV_ABI,
        XCIV_ADDRESS[this.networkId]
      );

      await contract.methods
        .approve(NFT_FARM_ADDRESS[this.networkId], amount_represent)
        .send({
          from: address,
        })
        .on("error", function (err, receipt) {
          console.log(err.message, receipt);
        })
        .on("transactionHash", function (txHash) {
          console.log(
            "Processing, tx=<a target='_blank' href='" +
              txHash +
              "'>" +
              txHash +
              "</a>",
            false,
            true
          );
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(
            "xCIV approved, tx=<a target='_blank' href='" +
              confirmationNumber +
              "'>" +
              receipt +
              "</a>"
          );
          return true;
        });
    } catch (err) {
      console.log(err);
      console.log("", false, false);
      return false;
    }
    return true;
  }

  async checkAllowance(pid) {
    await this.init();
    let userId = await this.getUserAcc();
    console.log("Account", userId);
    if (pid == 0) {
      return await this.dai_contract.methods
        .allowance(userId, FARM_ADDRESS[this.networkId])
        .call();
    } else if (pid == 1) {
      return await this.lp2_contract.methods
        .allowance(userId, FARM_ADDRESS[this.networkId])
        .call();
    } else if (pid == 2) {
      return await this.lp3_contract.methods
        .allowance(userId, FARM_ADDRESS[this.networkId])
        .call();
    } else if (pid == 3) {
      return await this.lp4_contract.methods
        .allowance(userId, FARM_ADDRESS[this.networkId])
        .call();
    } else if (pid == 4) {
      return await this.lp5_contract.methods
        .allowance(userId, FARM_ADDRESS[this.networkId])
        .call();
    }
  }
}
