import axiosRetry from "axios-retry";
import BlockchainHelper from "./blockchain";
import axios from "axios";
import Vue from "vue";

axiosRetry(axios, { retries: process.env.VUE_APP_API_RETRIES });

export const serverCivAddress = process.env.VUE_APP_API_HOST;

export default class ApiClient {
  async getPricesUSD(ids) {
    try {
      return (
        await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`)
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getCivPricesUSD() {
    const chainId = await new BlockchainHelper().getChainId();
    try {
      return (
        await axios.get(
          `${serverCivAddress}/getToken/0x73A83269b9bbAFC427E76Be0A2C1a1db2a26f4C2/?chainId=${chainId}`
        )
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getTrades(wallet) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      return (
        await axios.get(
          `${serverCivAddress}/trades/${wallet}?chainId=${chainId}`
        )
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getTradeBalance(wallet, tradeId, version) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      return (
        await axios.get(
          `${serverCivAddress}/getTradeBalance/${tradeId}/${wallet}/${version}?chainId=${chainId}`
        )
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getTraditionalSwapPrice(fromToken, toToken, amount, slippage = 0.005) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      if (chainId === 1) {
        return await axios.get(
          `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${amount}&slippagePercentage=${slippage}`
        );
      } else if (chainId === 4) {
        return await axios.get(
          `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${amount}&slippagePercentage=${slippage}`
        );
      } else if (chainId === 42) {
        return await axios.get(
          `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${amount}&slippagePercentage=${slippage}`
        );
      } else if (chainId === 137) {
        return await axios.get(
          `https://polygon.api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${amount}&slippagePercentage=${slippage}`
        );
      } else if (chainId === 80001) {
        return await axios.get(
          `https://polygon.api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${amount}&slippagePercentage=${slippage}`
        );
      } else {
        throw new Error("Unsupported network");
      }
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async subscribeEmail(postData) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      return await axios.post(
        `${serverCivAddress}/notifications/mail/subscribe?chainId=${chainId}`,
        postData
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async unSubscribeEmail(postData) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      return await axios.post(
        `${serverCivAddress}/notifications/mail/unsubscribe?chainId=${chainId}`,
        postData
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async isSubscribedEmail(wallet) {
    try {
      const chainId = await new BlockchainHelper().getChainId();
      return await axios.get(
        `${serverCivAddress}/notifications/mail/subscribed/${wallet}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getAnalytics() {
    try {
      let chainId = await new BlockchainHelper().getChainId();
      if (chainId === undefined) {
        chainId = 1;
      }
      return (
        await axios.get(`${serverCivAddress}/tradelytics?chainId=${chainId}`)
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getCustomTokenDetails(tokenName) {
    try {
      return (
        await axios.get(
          `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenName}`
        )
      ).data;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getCIVPrice() {
    try {
      return (
        await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=civilization"
        )
      ).data[0].current_price;
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async evaluateLimitTrade(
    poolAddress,
    fromAddress,
    toAddress,
    fromTokenValue,
    targetPrice,
    chainId
  ) {
    try {
      return await axios.get(
        `${serverCivAddress}/evaluateLimitTrade/${poolAddress}/${fromAddress}/${toAddress}/${fromTokenValue}/${targetPrice.toString(
          10
        )}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getPool(fromAddress, toAddress, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/getPool/${fromAddress}/${toAddress}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getPoolProView(fromAddress, chainId) {
    const allTokenList = await new BlockchainHelper().getTokensList();
    const fromToken = allTokenList.filter((token) => {
      if (token.mainNetAddress) {
        return (
          token.address.toLowerCase() === fromAddress.toLowerCase() ||
          token.mainNetAddress.toLowerCase() === fromAddress.toLowerCase()
        );
      }
      return token.address.toLowerCase() === fromAddress.toLowerCase();
    })[0];
    const toToken = await new BlockchainHelper().getProViewToToken(fromToken);
    try {
      return await axios.get(
        `${serverCivAddress}/getPool/${fromAddress}/${toToken}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getTopOfOrderBook(poolAddress, gapPercent, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/topOfOrderBook/${poolAddress}/${gapPercent}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getBottomOfOrderBook(poolAddress, gapPercent, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/bottomOfOrderBook/${poolAddress}/${gapPercent}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getSwaps(poolAddress, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/getSwaps/${poolAddress}?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getNativeDollarValue(chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/getNativeDollarValue?chainId=${chainId}`
      );
    } catch (e) {
      Vue.$log.error(e);
      throw e;
    }
  }

  async getPoolInfo(pool, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/getPoolInfo/${pool}?chainId=${chainId}`
      );
    } catch (err) {
      throw ("Pool Info error", err);
    }
  }

  async getMidOfOrderBook(pool, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/midOfOrderBook/${pool}?chainId=${chainId}`
      );
    } catch (err) {
      throw ("Mid of order book error", err);
    }
  }

  async getTokenInfo(tokenAddress, tokenPool, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/tokenInfo/${tokenAddress}/${tokenPool}?chainId=${chainId}`
      );
    } catch (err) {
      throw ("Token Info error", err);
    }
  }

  async getTokenInfoFull(tokenAddress, tokenPool, chainId) {
    try {
      return await axios.get(
        `${serverCivAddress}/tokenInfoFull/${tokenAddress}/${tokenPool}?chainId=${chainId}`
      );
    } catch (err) {
      throw ("Token Info Full error", err);
    }
  }

  async swapTokens(
    fromToken,
    toToken,
    fromTokenAmount,
    slippage,
    destinationAddress,
    networkId
  ) {
    try {
      //Thats all it takes to call the 1inch API, just a simple get request, it gives you a response object with data attribute which can be used in a transaction
      return await axios.get(
        `https://api.1inch.io/v4.0/${networkId}/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${fromTokenAmount}&fromAddress=${destinationAddress}&slippage=${slippage}&destReceiver=${destinationAddress}&allowPartialFill=false`
      );
    } catch (err) {
      throw ("Swap 1inch error", err);
    }
  }

  async checkInchAllowance(fromToken, destinationAddress, networkId) {
    try {
      return await axios.get(
        `https://api.1inch.io/v4.0/${networkId}/approve/allowance?tokenAddress=${fromToken}&walletAddress=${destinationAddress}`
      );
    } catch (err) {
      throw ("Approve 1inch check error", err);
    }
  }

  async getExtraInchAllowance(fromToken, networkId) {
    try {
      return await axios.get(
        `https://api.1inch.io/v4.0/${networkId}/approve/transaction?tokenAddress=${fromToken}`
      );
    } catch (err) {
      throw ("Get extra 1inch approval error", err);
    }
  }

  async getInchQuote(fromToken, toToken, fromTokenAmount, networkId) {
    try {
      return await axios.get(
        `https://api.1inch.io/v4.0/${networkId}/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${fromTokenAmount}`
      );
    } catch (err) {
      throw ("1inch quote error", err);
    }
  }

  async getChartString(symbol) {
    try {
      let ethpair = await axios.get(
        `${serverCivAddress}/tradingViewEth/${symbol}`
      );
      if (ethpair.data.toUpperCase() !== "NONE") {
        return ethpair.data;
      } else {
        let usdtpair = await axios.get(
          `${serverCivAddress}/tradingViewUsdt/${symbol}`
        );
        if (usdtpair.data.toUpperCase() !== "NONE") {
          return usdtpair.data;
        } else {
          return "NONE";
        }
      }
    } catch (err) {
      throw ("get tradingview symbol error", err);
    }
  }

  async getChartEth(symbol) {
    try {
      let result = await axios.get(
        `${serverCivAddress}/tradingViewEth/${symbol}`
      );
      return result.data;
    } catch (err) {
      throw ("get tradingview Eth error", err);
    }
  }

  async getChartUsdt(symbol) {
    try {
      let result = await axios.get(
        `${serverCivAddress}/tradingViewUsdt/${symbol}`
      );
      return result.data;
    } catch (err) {
      throw ("get tradingview Usdt error", err);
    }
  }

  async getMaxDollarSwappable(chainId) {
    try {
      let result = await axios.get(
        `${serverCivAddress}/maxDollarSwappable?chainId=${chainId}`
      );
      return result.data;
    } catch (err) {
      throw ("Max dollar swappable error", err);
    }
  }

  async getPaymentClientSecret(data) {
    try {
      let result = await axios.post(`${serverCivAddress}/payments`, data);
      return result.data;
    } catch (err) {
      throw ("Get payment client secret error", err);
    }
  }

  async getSwapDetails(dollarAmount, network) {
    try {
      let result = await axios.get(
        `${serverCivAddress}/getSwapDetails/${dollarAmount}?chainId=${network}`
      );
      return result.data;
    } catch (err) {
      throw ("Get swap details error", err);
    }
  }
}
