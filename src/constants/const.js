// export const NETWORK =
//     window.location.hostname.includes('dev-') ||
//     window.location.hostname.includes('localhost')
//         ? 'kovan'
//         : 'mainnet'

// 4: Kovan
// 3: Rinkeby
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);
function getNetwork() {
  return web3.eth.net.getNetworkType().then((network) => {
    return network
  });
}

export const NETWORK = getNetwork().then(network => {return network});

export const DAI_ADDRESS = {
  1: "",
  3: "0x1e5F7A5480fdC7DD682C3048f225b5501d4b39f8",
  4: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
};

export const STONE_ADDRESS = {
  1: "",
  3: "0x9Cee90195e9334e3F1D970C7Ca72Fe13Fb80418a",
  4: "0x0577651ed93bc1c0bddfed075a11433d392190f5",
};

export const XCIV_ADDRESS = {
  1: "",
  3: "0x5D8CA5f541F0D2c8591f6742a4f47F9C07a6544F",
  4: "0xBBc8DeB6b80243081f696B9E044C8635e8f19945",
};

export const FARM_ADDRESS = {
  1: "",
  3: "0xa475179a388f1Aff559209eE3BC9369036CE1409",
  4: "0x046711417a1A159565Bf5Bf62E26A9eeA2Ad7c22",
};

export const NFT_ADDRESS = {
  1: "",
  3: "0x9987E16Ce332d35bB0d372731F09F49eF67A2a91",
  4: "0x89b4094F15B20447e61B239a3C682903C2B804B5",
};

export const NFT_FARM_ADDRESS = {
  1: "",
  3: "0x2d5F268A6624A46bF5Eb1Ed2a4dc6F77E3Cbe581",
  4: "0x4590186B517A9d77D7992366d0141321d937d250",
};

export const LP2_ADDRESS = {
  1: "",
  3: "0x5933D331846b7B697267A8623359cEEDA166D489",
  4: "0x1419AA0271b5ADBe2608E71eccF881505d04b534",
};

export const LP3_ADDRESS = {
  1: "",
  3: "0x7311DC367cc711b0C068eDE091983d9D5DE262E5",
  4: "0x13Af52480aDEa7F25449A979ED788043bd3C5a51",
};

export const LP4_ADDRESS = {
  1: "",
  3: "0x29e7E73099a4F94683Ec1E0CD15062AcBA3f9075",
  4: "0xCCC4278160875dA9219F7c66c10DB9bEB0757A6F",
};

export const LP5_ADDRESS = {
  1: "",
  3: "0xb726C84dcb9B29015c9B33c03E6B2f1AC0c27E12",
  4: "0x30bc11b8Cc4c696aDC2368BD898491B5A0fB0E42",
};

export const RT2_ADDRESS = {
  1: "",
  3: "0x2391789A32a76811Cea825428A2890499123920a",
  4: "0xF41608ca7e621C1b8A53921E0ECd587Ebcc2217e",
};

export const RT3_ADDRESS = {
  1: "",
  3: "0x37322A20b9C5Dc9498544d24C4F6553079085769",
  4: "0xFA6450141AD3B45eBf6597CE743Ef62F298A80A5",
};

export const RT4_ADDRESS = {
  1: "",
  3: "0x8660aa6C72050af7207B2410B04639B8B7a1f6DD",
  4: "0x6Dd59FC29e2541E91c045DdD45Af509C5C7AB1C7",
};

export const RT5_ADDRESS = {
  1: "",
  3: "0xDD71e6486Ef4859cAf5b5f39D3829f4cFC8eC065",
  4: "0x73C096414f9612d15AbF9a2dAc125a162470756e",
};
