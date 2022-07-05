const ethSigUtil = require('eth-sig-util');
import BigNumber from "bignumber.js";

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
/*  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },*/
  { name: 'nativeValue', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: 'CivTradeZeroGas',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  }
}

async function buildRequest(message, forwarder, txnValueNative, txnTotal, input) {
  let nonce
  let fromAddress = input.from;
  try {
    nonce = await forwarder.getNonce(fromAddress).then(nonce => nonce.toString());
  } catch (e) {
	throw('error!')
  }
  return { action: message, from: input.from, to: input.to, nativeValue: new BigNumber(txnValueNative).decimalPlaces(0), txnTotal: new BigNumber(txnTotal).decimalPlaces(0), nonce, data: input.data };
}

async function buildTypedData(forwarder, request) {
  let chainId
  try {
    chainId = await forwarder.provider.getNetwork().then(n => n.chainId);
  } catch (e) {
	throw('Error in fetching chainId!')
  }
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

async function signTypedData(signer, from, data) {
  // If signer is a private key, use it to sign
  if (typeof(signer) === 'string') {
    const privateKey = Buffer.from(signer.replace(/^0x/, ''), 'hex');
    return ethSigUtil.signTypedMessage(privateKey, { data });
  }
  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  const isHardhat = data.domain.chainId == 31337;
  const [method, argData] = isHardhat
    ? ['eth_signTypedData', data]
    : ['eth_signTypedData_v4', JSON.stringify(data)]
  return await signer.send(method, [from, argData] );
}

export async function signMetaTxRequest(message, signer, forwarder, txnValueNative, txnTotal, input) {
  const request = await buildRequest(message, forwarder, txnValueNative, txnTotal, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData(signer, input.from, toSign);
  return { signature, request };
}
/*
module.exports = { 
  signMetaTxRequest,
  buildRequest,
  buildTypedData,
};
*/