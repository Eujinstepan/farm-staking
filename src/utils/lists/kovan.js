import EthereumLogo from '@/assets/eth-logo.png';
import CIVLogo from '@/assets/CIV_logo-1.svg';

export const kovanTokenList = [{
    "chainId": 42,
    "address": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    "mainNetAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "name": "Ethereum",
    "symbol": "ETH",
    "id": "ethereum",
    "decimals": 18,
    "logoURI": EthereumLogo,
    "extensions": {"optimismBridgeAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c"}
}, {
    "chainId": 42,
    "address": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    "mainNetAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "name": "Wrapped ETH",
    "symbol": "WETH",
    "id": "WETH",
    "decimals": 18,
    "logoURI": EthereumLogo,
    "extensions": {"optimismBridgeAddress": "0xD134Db47DDF5A6feB245452af17cCAf92ee53D3c"}
}, {
    "chainId": 42,
    "address": "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    "mainNetAddress": "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    "name": "Synthetix",
    "symbol": "SNX",
    "id": "synthetix",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/SNX.svg",
    "extensions": {"optimismBridgeAddress": "0xD134Db47DDF5A6feB245452af17cCAf92ee53D3c"}
}, {
    "chainId": 42,
    "address": "0x859F1A0612Bd7a7F7de75B92C934F7723e5A1227",
    "mainNetAddress": "0x37fe0f067fa808ffbdd12891c0858532cfe7361d",
    "name": "Civilization",
    "symbol": "CIV",
    "id": "civ",
    "decimals": 18,
    "logoURI": CIVLogo,
    "extensions": {"optimismBridgeAddress": "0x859F1A0612Bd7a7F7de75B92C934F7723e5A1227"}
}, {
    "chainId": 42,
    "address": "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
    "mainNetAddress": "0x6b175474e89094c44da98b954eedeac495271d0f",
    "name": "Dai stable coin",
    "symbol": "DAI",
    "id": "dai",
    "decimals": 18,
    "logoURI": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=010",
    "extensions": {"optimismBridgeAddress": "0xb415e822C4983ecD6B1c1596e8a5f976cf6CD9e3"}
}, {
    "chainId": 42,
    "address": "0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B",
    "mainNetAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
    "name": "Tether USD",
    "symbol": "USDT",
    "id": "tether",
    "decimals": 6,
    "logoURI": "https://ethereum-optimism.github.io/logos/USDT.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    "mainNetAddress": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    "name": "Wrapped Bitcoin",
    "symbol": "WBTC",
    "id": "wrapped-bitcoin",
    "decimals": 8,
    "logoURI": "https://ethereum-optimism.github.io/logos/WBTC.svg",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x24a19ee5a5c8757acdebe542a9436d9c796d1c9e",
    "mainNetAddress": "0xb6ed7644c69416d67b522e20bc294a9a9b405b31",
    "name": "0xBitcoin",
    "symbol": "0xBTC",
    "id": "0xBTC",
    "decimals": 8,
    "logoURI": "https://ethereum-optimism.github.io/logos/0xBTC.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0xa36085F69e2889c224210F603D836748e7dC0088",
    "mainNetAddress": "0x514910771af9ca656af840dff83e8264ecf986ca",
    "name": "Chainlink",
    "symbol": "LINK",
    "id": "chainlink",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/LINK.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x50EB44e3a68f1963278b4c74c6c343508d31704C",
    "mainNetAddress": "0xc581b735a1688071a1746c968e0798d642ede491",
    "name": "Tether EUR",
    "symbol": "EURT",
    "id": "eurt",
    "decimals": 6,
    "logoURI": "https://ethereum-optimism.github.io/logos/USDT.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x50dC5200082d37d5dd34B4b0691f36e3632fE1A8",
    "mainNetAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "name": "USD Coin",
    "symbol": "USDC",
    "id": "cusdc",
    "decimals": 6,
    "logoURI": "https://ethereum-optimism.github.io/logos/USDC.svg",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "mainNetAddress": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "name": "Uniswap",
    "symbol": "UNI",
    "id": "uniswap",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/UNI.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x992d6F63dB3D70Fb725c194a8A4864302Fd88ABd",
    "mainNetAddress": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "name": "Right2",
    "symbol": "RT2",
    "id": "uniswap",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/UNI.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0xeb597bd03152f99ffb9731219df1853Be99f2E62",
    "mainNetAddress": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "name": "USD",
    "symbol": "USD",
    "id": "uniswap",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/UNI.png",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}, {
    "chainId": 42,
    "address": "0x0A38500D7b5686B6095C476a99A5f0824d7A2a5b",
    "mainNetAddress": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "name": "Rights4",
    "symbol": "RT4",
    "id": "civ",
    "decimals": 18,
    "logoURI": CIVLogo,
    "extensions": {"optimismBridgeAddress": "0x859F1A0612Bd7a7F7de75B92C934F7723e5A1227"}
}, {
    "chainId": 42,
    "address": "0x76b06a2f6dF6f0514e7BEC52a9AfB3f603b477CD",
    "mainNetAddress": "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919",
    "name": "Rai Reflex Index",
    "symbol": "RAI",
    "id": "rai",
    "decimals": 18,
    "logoURI": "https://ethereum-optimism.github.io/logos/RAI.svg",
    "extensions": {"optimismBridgeAddress": "0x22F24361D548e5FaAfb36d1437839f080363982B"}
}]