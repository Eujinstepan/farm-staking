import _ from "lodash";
import BigNumber from "bignumber.js";
import BlockchainHelper from "./blockchain";
import ApiClient from "./apiClient.js";
export default class TradeHelper {
  priceOffset(
    percentage,
    inverted,
    targetPriceValue,
    maxMinimumRate,
    orderTypeSwitch,
    minMinimumRate
  ) {
    if (inverted) {
      const offset = new BigNumber(targetPriceValue)
        .multipliedBy(percentage)
        .dividedBy(100);
      const toSet = new BigNumber(targetPriceValue).plus(offset);
      const max = new BigNumber(1).dividedBy(maxMinimumRate).decimalPlaces(18);
      if (new BigNumber(toSet).comparedTo(max) === 1) {
        targetPriceValue = new BigNumber(max)
          .minus(new BigNumber(max).multipliedBy(0.2005).dividedBy(100))
          .toString(10);
        orderTypeSwitch = true;
      } else {
        if (orderTypeSwitch === true) {
          targetPriceValue = new BigNumber(max)
            .minus(new BigNumber(max).multipliedBy(0.2005).dividedBy(100))
            .toString(10);
          orderTypeSwitch = false;
        } else {
          targetPriceValue = toSet.toString(10);
        }
      }
    } else {
      const offset = new BigNumber(targetPriceValue)
        .multipliedBy(percentage)
        .dividedBy(100);
      const toSet = new BigNumber(targetPriceValue).plus(offset);
      const min = minMinimumRate;
      if (new BigNumber(toSet).comparedTo(min) === -1) {
        targetPriceValue = new BigNumber(min)
          .plus(new BigNumber(min).multipliedBy(0.2005).dividedBy(100))
          .toString(10);
        orderTypeSwitch = true;
      } else {
        if (orderTypeSwitch === true) {
          targetPriceValue = new BigNumber(min)
            .plus(new BigNumber(min).multipliedBy(0.2005).dividedBy(100))
            .toString(10);
          orderTypeSwitch = false;
        } else {
          targetPriceValue = toSet.toString(10);
        }
      }
    }
    var returnResult = [targetPriceValue, orderTypeSwitch];
    return returnResult;
  }

  async calculateMinGasDisplayToUser(fromToken, toToken, fromTokenValue) {
    //      const userProvider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await new BlockchainHelper().getChainId();
    let nativeToken = new BlockchainHelper().getNativeToken(chainId);
    let isNativeFlag =
      fromToken.symbol === nativeToken || toToken.symbol === nativeToken;
    let txnValueNative =
      fromToken.symbol === nativeToken
        ? new BigNumber(fromTokenValue).shiftedBy(18).toString(10)
        : 0;
    let estimatedGas = 500000;
    let gasPrice;
    try {
      gasPrice = await new BlockchainHelper().getGasPrice();
    } catch (e) {
      console.log("Cannot get gas price so set it 0");
      gasPrice = 0;
    }
    let gasValue = new BigNumber(gasPrice).multipliedBy(estimatedGas);
    let minGas = new BigNumber(gasValue).multipliedBy(20).shiftedBy(18);
    let canBeRelayed =
      isNativeFlag && new BigNumber(txnValueNative).comparedTo(minGas) === 1;
    console.log(`txnValueNative ${txnValueNative}`);
    console.log(`minGas ${minGas}`);
    console.log(`Can be relayed? ${canBeRelayed}`);
    console.log(`GasValue? ${gasValue}`);
    let minGasToDisplayUser = new BigNumber(gasValue).multipliedBy(20);
    minGasToDisplayUser =
      Number(minGasToDisplayUser).toLocaleString("fullwide");
    console.log(`minGasToDisplayUser? ${minGasToDisplayUser}`);

    let returnResult = [canBeRelayed, minGasToDisplayUser, nativeToken];
    return returnResult;
  }

  calculatePercentage(
    chainId,
    guaranteedPrice,
    inverted,
    targetPriceValues,
    fromTokenValue
  ) {
    let targetPriceValue = inverted
      ? new BigNumber(1).dividedBy(targetPriceValues).decimalPlaces(18)
      : new BigNumber(targetPriceValues);
    if (targetPriceValue.isNaN() || !targetPriceValue.isFinite()) {
      targetPriceValue = new BigNumber(0);
    }
    let targetQuantity = new BigNumber(fromTokenValue)
      .multipliedBy(targetPriceValue.toNumber())
      .decimalPlaces(6)
      .toNumber();
    let guaranteedTargetQuantity = new BigNumber(fromTokenValue)
      .multipliedBy(guaranteedPrice)
      .decimalPlaces(18)
      .toNumber();
    let diff = new BigNumber(targetQuantity)
      .minus(guaranteedTargetQuantity)
      .decimalPlaces(18)
      .toNumber();
    console.log("Diff " + diff);
    let guaranteedPricePercentage = null;
    if (diff <= 0) {
      guaranteedPricePercentage = 0;
    } else {
      let percentage = new BigNumber(diff)
        .dividedBy(guaranteedTargetQuantity)
        .decimalPlaces(18);
      if (percentage.isNaN() || !percentage.isFinite()) {
        percentage = 0;
      }
      percentage = new BigNumber(percentage)
        .multipliedBy(100)
        .decimalPlaces(18);
      guaranteedPricePercentage = percentage.toFixed(2);
    }
    let returnResult = [guaranteedTargetQuantity, guaranteedPricePercentage];
    return returnResult;
  }

  validateTargetPrice(targetPriceValue,inverted, minMinimumRate,maxMinimumRate) {
    let showPriceError = null;
    if (targetPriceValue) {
      if (!inverted) {
        showPriceError = minMinimumRate !== undefined && new BigNumber(targetPriceValue).comparedTo(minMinimumRate) !== 1
      } else {
        let invert = new BigNumber(1).dividedBy(maxMinimumRate).decimalPlaces(18)
        if (invert.isNaN() || !invert.isFinite()) {
          invert = 0
        }
        showPriceError = minMinimumRate !== undefined && new BigNumber(targetPriceValue).comparedTo(invert) !== -1
      }
    }

    return showPriceError;
  }

  calculateMinimumRateOffset(response) {
    const offsetPercentage = 0.2
    let offset = new BigNumber(response.data.rate).multipliedBy(offsetPercentage).decimalPlaces(18)
    offset = new BigNumber(offset).dividedBy(100).decimalPlaces(18)
    return offset
  }

  async updatePrices(
    fromToken,
    fromTokenPrice,
    toToken,
    toTokenPrice,
    checkingLiquidity,
    noLiquidityPool,
    poolContract,
    minimumRate,
    minMinimumRate,
    maxMinimumRate,
    fromTokenValue,
    guaranteedTargetQuantity,
    guaranteedPricePercentage
  ) {
    let chainId = await new BlockchainHelper().getChainId();
    let prices = await new ApiClient().getPricesUSD(fromToken.id);
    fromTokenPrice = _.get(prices, "0.current_price", 0);
    prices = await new ApiClient().getPricesUSD(toToken.id);
    toTokenPrice = _.get(prices, "0.current_price", 0);
    // Check if Liquidity pool exists
    let fromAddress = fromToken.address;
    let toAddress = toToken.address;
    if (fromAddress && toAddress && chainId) {
      try {
        checkingLiquidity = true;
        new ApiClient()
          .getPool(fromAddress, toAddress, chainId)
          .then((response) => {
            noLiquidityPool = false;
            poolContract = response.data.poolContract;
            minimumRate = new BigNumber(response.data.rate)
              .decimalPlaces(18)
              .toString(10);
            //			add safety buffer on top of price
            const offset = this.calculateMinimumRateOffset(response);
            minMinimumRate = new BigNumber(response.data.rate)
              .plus(offset)
              .decimalPlaces(18);
            console.log(
              `Minimum rate is ${
                response.data.rate
              } and we add offset ${offset}% and becomes ${minMinimumRate.toString(
                10
              )} the current MIN`
            );
            //			if price is inverted
            maxMinimumRate = new BigNumber(response.data.rate)
              .minus(offset)
              .decimalPlaces(18);
            console.log(
              `Minimum rate is ${
                response.data.rate
              } and we subtract offset ${offset}% and becomes ${maxMinimumRate.toString(
                10
              )} the current MAX`
            );
            this.validateTargetPrice();
          })
          .catch((error) => {
            noLiquidityPool = true;
            throw error;
          });
        let toTokenAddress = toToken.address.toLowerCase();
        let fromTokenAddress = fromToken.address.toLowerCase();
        if (chainId === 42 || chainId === 4) {
          toTokenAddress = toToken.mainNetAddress.toLowerCase();
          fromTokenAddress = fromToken.mainNetAddress.toLowerCase();
        }
        if (fromTokenValue) {
          let amountReference = new BigNumber(fromTokenValue)
            .shiftedBy(fromToken.decimals)
            .decimalPlaces(0)
            .toString(10);
          let guaranteedPriceResponse =
            await new ApiClient().getTraditionalSwapPrice(
              fromTokenAddress,
              toTokenAddress,
              amountReference
            );
          console.log(
            "Guaranteed price from 0xAPI is: " +
              guaranteedPriceResponse.data.guaranteedPrice
          );
          this.calculatePercentage(
            chainId,
            guaranteedPriceResponse.data.guaranteedPrice
          );
        }
      } catch (e) {
        console.error(e);
        guaranteedTargetQuantity = null;
        guaranteedPricePercentage = null;
        console.log(guaranteedTargetQuantity, guaranteedPricePercentage);
      } finally {
        checkingLiquidity = false;
      }
    }

    let returnResult = [fromTokenPrice,toTokenPrice,checkingLiquidity,noLiquidityPool,poolContract,minimumRate,minMinimumRate,maxMinimumRate,guaranteedTargetQuantity,guaranteedPricePercentage];
    return returnResult;
  }
}
