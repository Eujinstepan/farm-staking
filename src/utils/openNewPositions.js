import {signMetaTxRequest} from './txnForwarder/signOpenPos.js';
import {ForwarderAbi} from './abi/forwarderAbi.js';
import {positionMgrV2Abi} from './abi/positionMgrV2Abi.js';
import {AutoTaskUrl, ForwarderAddress, getRelayAddress} from './txnForwarder/forwarderAddresses.js';
import BlockchainHelper from "./blockchain";
import BigNumber from "bignumber.js";
import store from "../store"
import {ethers} from "ethers";

async function createPosRelaying (contractTarget, poolAddress, userSentTokenTwo, isNativeFlag, txnValueNative, tickLower, tickUpper, liquidity, estimatedGas, message, txnTotal) {
  const provider = store.state.provider
  const userNetwork = await new BlockchainHelper().getChainId();
  let gasPrice = await new BlockchainHelper().getGasPrice()
  let gasValue = new BigNumber(gasPrice).multipliedBy(estimatedGas).multipliedBy(0.9)

  const condition1 = isNativeFlag
  const condition2 = txnValueNative > (gasValue * 20)
  const condition3 = (txnTotal - txnValueNative) > gasValue
	
  if ( condition1 && condition2 && condition3 ) {
    const AutoTask = AutoTaskUrl(userNetwork.chainId);
    if (!AutoTask) throw new Error(`Missing autotask url`);
    const ForwardAddr = ForwarderAddress(userNetwork.chainId);
    const forwarder = await new ethers.Contract(ForwardAddr, ForwarderAbi, store.state.signer);
  
    let contract =  await new ethers.Contract(contractTarget.options.address, positionMgrV2Abi, store.state.signer);
    const to = contract.address; 
    const from = await store.state.signer.getAddress();
    const data = contract.interface.encodeFunctionData('createPos', [isNativeFlag, userSentTokenTwo, true, poolAddress, tickLower, tickUpper, liquidity]);
    let request = await signMetaTxRequest(message, provider, forwarder, txnValueNative, txnTotal, { to, from, data });

    //user sends ETH separately given ERC20 limits
    const tx = await store.state.signer.sendTransaction({
        to: getRelayAddress(userNetwork.chainId),
        value: '0x'+Number(txnTotal).toString(16),
		data: request.signature
    });

	let hash = tx.hash
	request = { ...request, hash }

    try {
      await fetch(AutoTask, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' },
      }).then(response=>response.json()).then(data=>{ hash = JSON.parse(data.result); });
      return hash
    } catch (e) {
      throw ("Relay error")
    }
  } else {
    throw ("Insufficient txn value for executing relay")
  }
}

async function createPosDirectly (contractTarget, poolAddress, userSentTokenTwo, isNativeFlag, txnValueNative, tickLower, tickUpper, liquidity, estimatedGas) {
  const blockChainHelper = new BlockchainHelper()
  let address = await blockChainHelper.getAddress()
  return await contractTarget.createPos(
      isNativeFlag,
      userSentTokenTwo,
      false,
      poolAddress,
      tickLower,
      tickUpper,
      liquidity,
      {
        from: address,
        gasLimit: estimatedGas,
        value: txnValueNative
      }
  );
}

export async function openNewPosition(sendRelayed, contractTarget, poolAddress, userSentTokenTwo, isNativeFlag, txnValueNative, tickLower, tickUpper, liquidity, estimatedGas, message = '', txnTotal = 0) {			
  if (sendRelayed) 
     return createPosRelaying(contractTarget, poolAddress, userSentTokenTwo, isNativeFlag, txnValueNative, tickLower, tickUpper, liquidity, estimatedGas, message, txnTotal);
  else 
     return createPosDirectly(contractTarget, poolAddress, userSentTokenTwo, isNativeFlag, txnValueNative, tickLower, tickUpper, liquidity, estimatedGas);
}