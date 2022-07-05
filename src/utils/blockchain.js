import {SafeAppWeb3Modal} from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Store from '../store/index';
import EthereumLogo from '../assets/eth-logo.png';
import KovanLogo from '../assets/kovan-logo.png';
import PolygonLogo from '../assets/polygon.png';
import NAIcon from '../assets/na-icon.png';
import WalletLink from 'walletlink'
import Portis from "@portis/web3";
import MewConnect from "@myetherwallet/mewconnect-web-client";
import {Bitski} from "bitski";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Vue from "vue";
import BigNumber from "bignumber.js";
import {Ierc20Abi} from "../constants/ierc20abi";
import {
    civLimitManagerAbiEth,
    civLimitManagerAddressEth,
    civLimitManagerHelperFunctionsAbiEth,
    civLimitManagerHelperFunctionsAddressEth,
    civLimitManagerAbiRinkeBy,
    civLimitManagerAddressRinkeBy,
    civLimitManagerHelperFunctionsAbiRinkeBy,
    civLimitManagerHelperFunctionsAddressRinkeBy,
    civLimitManagerAbiKovan,
    civLimitManagerAddressKovan,
    civLimitManagerHelperFunctionsAbiKovan,
    civLimitManagerHelperFunctionsAddressKovan,
    civLimitManagerAbiPolygon,
    civLimitManagerAddressPolygon,
    civLimitManagerHelperFunctionsAbiPolygon,
    civLimitManagerHelperFunctionsAddressPolygon,
    civLimitManagerAbiMumbai,
    civLimitManagerAddressMumbai,
    civLimitManagerHelperFunctionsAbiMumbai,
    civLimitManagerHelperFunctionsAddressMumbai,
    civLimitManagerAbiEthV2,
    civLimitManagerAbiRinkeByV2,
    civLimitManagerAddressMumbaiV2,
    civLimitManagerAddressPolygonV2,
    civLimitManagerAddressKovanV2,
    civLimitManagerAddressRinkeByV2,
    civLimitManagerAddressEthV2,
    civLimitManagerAbiMumbaiV2,
    civLimitManagerAbiPolygonV2, civLimitManagerAbiKovanV2
} from "./constants";
import ethLogo from "@/assets/eth-logo.png";
import maticLogo from "@/assets/maticLogo.png";
import {kovanTokenList} from "./lists/kovan";
import {rinkeByTokenList} from "./lists/rinkeby";
import {polygonTokenList} from "./lists/polygon";
import {mumbaiTokenList} from "./lists/mumbai";
import {mainNetList} from "./lists/mainet";
import ApiClient from "./apiClient";
import {proViewList} from "./lists/proViewOnly";
import {ethers} from "ethers";
import store from "../store";

const INFURA_ID = '8ad1bacff3ea416989bc1bf33cf96d40'

// noinspection SpellCheckingInspection
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: "91c3e8def19540d9afe99932218f6e0f" // required
        }
    },
    'custom-coinbase': {
        display: {
            logo: 'data:image/png;base64,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',
            name: 'Coinbase',
            description: 'Scan with WalletLink to connect',
        },
        options: {
            appName: 'CIVFund',
            networkUrl: `https://mainnet.infura.io/v3/` + INFURA_ID,
            chainId: '1',
        },
        package: WalletLink,
        connector: async (_, options) => {
            const {appName, networkUrl, chainId} = options
            const walletLink = new WalletLink({
                appName: appName,
                appLogoUrl: 'https://app.civfund.org/public/img/civ-txt-small.9325bfd0.png',
                darkMode: true
            });
            const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
            await provider.enable();
            return provider;
        },
    },
    bitski: {
        package: Bitski, // required
        options: {
            clientId: "8397c091-0c1c-4c45-957d-12c1149d15d0", // required
            callbackUrl: "https://dev-app.civfund.org" // required
        }
    },
    mewconnect: {
        package: MewConnect, // required
        options: {
            infuraId: INFURA_ID // required
        }
    },
    portis: {
        package: Portis, // required
        options: {
            id: "70201299-acac-4df5-b17b-72c17a0bc38d" // required
        }
    },
    fortmatic: {
        package: Fortmatic, // required
        options: {
            key: "pk_live_7EC1E5E1705E2FCD" // required
        }
    },
    torus: {
        package: Torus, // required
    }
};

const web3Modal = new SafeAppWeb3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
    theme: "dark"
});

export default class BlockchainHelper {

    isConnected() {
        return Store.state.signer !== undefined
    }

    async init() {
        let instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance, "any");
        const signer = provider.getSigner()
        await Store.dispatch('setSigner', signer);
        await Store.dispatch('setProvider', provider);
    }

    async connectToAlreadyConnectedWallet() {
        if (web3Modal.cachedProvider) {
            await this.init()
            await this.postConnectActions();
        }
    }

    async connectWallet() {
        if (web3Modal.cachedProvider) {
            await web3Modal.clearCachedProvider();
        }
        Vue.$log.debug("Opening a dialog", web3Modal);
        await this.init()
        await this.postConnectActions();
    }

    async postConnectActions() {
        try {
            let account = await this.getAddress()
            await Store.dispatch('setReadableSelectedAddress', await this.resolveAddressToEnsDomain(account));
            Vue.$log.debug("Wallet Connect " + account)
            Vue.$log.debug("Chain Id: " + await this.getChainId())
            await this.updateCivPrice()
            await this.syncChainSelected()
        } catch (e) {
            Vue.$log.error("Could not get a wallet connection", e);
        }
        this.setEvents()
        let fromTokenBalance = await this.getTokenBalance(Store.state.selectedFromToken)
        let toTokenBalance = await this.getTokenBalance(Store.state.selectedToToken)
        await Store.dispatch('setFromTokenAvailableAmount', fromTokenBalance);
        await Store.dispatch('setToTokenAvailableAmount', toTokenBalance);
    }

    async updateCivPrice() {
        let civPrice = await new ApiClient().getCIVPrice()
        await Store.dispatch('setCivPrice', civPrice);
    }

    async syncChainSelected() {
        let network
        let chainId = await this.getChainId()
        if (chainId === 1) {
            network = {icon: EthereumLogo, text: 'Ethereum'}
        } else if (chainId === 4) {
            network = {icon: KovanLogo, text: 'RinkeBy'}
        } else if (chainId === 42) {
            network = {icon: KovanLogo, text: 'Kovan'}
        } else if (chainId === 137) {
            network = {icon: PolygonLogo, text: 'Polygon'}
        } else if (chainId === 80001) {
            network = {icon: PolygonLogo, text: 'Mumbai'}
        } else {
            network = {icon: NAIcon, text: 'Unsupported network'}
        }
        await Store.dispatch('setCurrentNetwork', network);
        await Store.dispatch('setChainId', chainId)
    }

    async getTokenBalance(token) {
        if (this.isConnected() && token !== undefined && token.symbol) {
            let wellFormedAccount = await this.getAddress()
            Vue.$log.debug("Checking Balance of " + wellFormedAccount + " for token " + token.symbol + " (" + token.address + ")")
            const chainId = await this.getChainId()
            let mainToken = chainId === 137 || chainId === 80001 ? 'MATIC' : 'ETH';
            if (token.symbol === mainToken) {
                let ret = new BigNumber(await this.getBalance())
                Vue.$log.debug("Balance of mainToken for " + wellFormedAccount + " is: " + ret)
                return ret
            } else {
                try {
                    let erc20 = await new ethers.Contract(token.address, Ierc20Abi, Store.state.signer);
                    let balance = ethers.utils.formatUnits(await erc20.balanceOf(await this.getAddress()), token.decimals)
                    Vue.$log.debug("Balance of erc20 token" + token.address + " for " + wellFormedAccount + " is: " + balance)
                    return balance
                } catch (e) {
                    Vue.$log.error(`Error for token ${token.symbol}: ` + e)
                }
            }
        }
    }

    async resolveAddressToEnsDomain(address) {
        let name
        try {
            let chainId = await this.getChainId()
            if (chainId === 1) {
                let provider = Store.state.provider
                name = await provider.lookupAddress(address);
                if(name === null) {
                    name = address.slice(0, 4) + '...' + address.slice(-3);
                }
            } else {
                name = address.slice(0, 4) + '...' + address.slice(-3);
            }
        } catch (e) {
            name = address.slice(0, 4) + '...' + address.slice(-3);
        }

        return name
    }

    async getAbi() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerAbiEth;
            case 4:
                return civLimitManagerAbiRinkeBy;
            case 42:
                return civLimitManagerAbiKovan;
            case 137:
                return civLimitManagerAbiPolygon;
            case 80001:
                return civLimitManagerAbiMumbai;
            default:
                throw new Error('Not known Network id')
        }
    }

    async getManagerAddress() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerAddressEth;
            case 4:
                return civLimitManagerAddressRinkeBy;
            case 42:
                return civLimitManagerAddressKovan;
            case 137:
                return civLimitManagerAddressPolygon;
            case 80001:
                return civLimitManagerAddressMumbai;
            default:
                throw new Error('Not known Network id')
        }
    }

    async getAbiV2() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerAbiEthV2;
            case 4:
                return civLimitManagerAbiRinkeByV2;
            case 42:
                return civLimitManagerAbiKovanV2;
            case 137:
                return civLimitManagerAbiPolygonV2;
            case 80001:
                return civLimitManagerAbiMumbaiV2;
            default:
                throw new Error('Not known Network id')
        }
    }

    async getManagerAddressV2() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerAddressEthV2;
            case 4:
                return civLimitManagerAddressRinkeByV2;
            case 42:
                return civLimitManagerAddressKovanV2;
            case 137:
                return civLimitManagerAddressPolygonV2;
            case 80001:
                return civLimitManagerAddressMumbaiV2;
            default:
                throw new Error('Not known Network id')
        }
    }

    async getHelperAbi() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerHelperFunctionsAbiEth;
            case 4:
                return civLimitManagerHelperFunctionsAbiRinkeBy;
            case 42:
                return civLimitManagerHelperFunctionsAbiKovan;
            case 137:
                return civLimitManagerHelperFunctionsAbiPolygon;
            case 80001:
                return civLimitManagerHelperFunctionsAbiMumbai;
            default:
                throw new Error('Not known Network id')
        }
    }

    async getHelperManagerAddress() {
        let chainId = await this.getChainId()
        switch (chainId) {
            case 1:
                return civLimitManagerHelperFunctionsAddressEth;
            case 4:
                return civLimitManagerHelperFunctionsAddressRinkeBy;
            case 42:
                return civLimitManagerHelperFunctionsAddressKovan;
            case 137:
                return civLimitManagerHelperFunctionsAddressPolygon;
            case 80001:
                return civLimitManagerHelperFunctionsAddressMumbai;
            default:
                throw new Error('Not known Network id')
        }
    }

    getExplorerLink(chainId) {
        if (chainId === 1) {
            return 'https://etherscan.io/tx/'
        } else if (chainId === 4) {
            return 'https://rinkeby.etherscan.io/tx/'
        } else if (chainId === 42) {
            return 'https://kovan.etherscan.io/tx/'
        } else if (chainId === 137) {
            return 'https://polygonscan.com/tx/'
        } else if (chainId === 80001) {
            return 'https://mumbai.polygonscan.com/tx/'
        } else {
            throw 'Unsupported Network'
        }
    }

    getNativeToken(chainId) {
        if (chainId === undefined) {
            Vue.$log.warn('Web3 or Metamask not installed')
        } else if (chainId === 1) {
            return 'ETH'
        } else if (chainId === 4) {
            return 'ETH'
        } else if (chainId === 42) {
            return 'ETH'
        } else if (chainId === 137) {
            return 'MATIC'
        } else if (chainId === 80001) {
            return 'MATIC'
        } else {
            throw 'Unsupported Network'
        }
    }

    getNativeTokenAddress(chainId) {
        if (chainId === undefined) {
            Vue.$log.warn('Web3 or Metamask not installed')
        } else if (chainId === 1) {
            return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        } else if (chainId === 4) {
            return '0xc778417E063141139Fce010982780140Aa0cD5Ab'
        } else if (chainId === 42) {
            return '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
        } else if (chainId === 137) {
            return '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
        } else if (chainId === 80001) {
            return '0x9c3c9283d3e44854697cd22d3faa240cfb032889'
        } else {
            throw 'Unsupported Network'
        }
    }

    async getChainId() {
        let network = {
            chainId: 1
        }
        try {
            network = await Store.state.provider.getNetwork()
        } catch (e) {
            Vue.$log.debug('Chain id not found, we set it to 1, ' + e)
        }
        return network.chainId;
    }

    async getNativeTokenObject() {
        let chainId = await this.getChainId()
        let tokenObject
        switch (chainId) {
            case 42:
                tokenObject = {
                    id: "ethereum",
                    name: "Ether",
                    symbol: "ETH",
                    logoURI: ethLogo,
                    chainId: 42,
                    decimals: 18,
                    address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
                    mainNetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    proView: false
                }
                break
            case 4:
                tokenObject = {
                    id: "ethereum",
                    name: "Ether",
                    symbol: "ETH",
                    logoURI: ethLogo,
                    chainId: 4,
                    decimals: 18,
                    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                    mainNetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    proView: false
                }
                break
            case 137:
                tokenObject = {
                    id: "wmatic",
                    name: "Matic",
                    symbol: "MATIC",
                    logoURI: maticLogo,
                    chainId: 137,
                    decimals: 18,
                    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
                    mainNetAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    proView: false
                }
                break
            case 80001:
                tokenObject = {
                    id: "wmatic",
                    name: "Matic",
                    symbol: "MATIC",
                    logoURI: maticLogo,
                    chainId: 80001,
                    decimals: 18,
                    address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
                    mainNetAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
                    proView: false
                }
                break
            default:
                tokenObject = {
                    id: "ethereum",
                    name: "Ether",
                    symbol: "ETH",
                    logoURI: ethLogo,
                    chainId: 1,
                    decimals: 18,
                    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    mainNetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                    proView: true
                }
                break
        }
        return tokenObject;
    }

    async getTokensList() {
        const chainId = await this.getChainId()
        const fromToken = await new BlockchainHelper().getNativeTokenObject()
        let list = []
        if (chainId === 42) {
            Vue.$log.debug('Loading Kovan Tokens List')
            list = kovanTokenList
        } else if (chainId === 4) {
            Vue.$log.debug('Loading Rinkeby Tokens List')
            list = rinkeByTokenList
        } else if (chainId === 137) {
            Vue.$log.debug('Loading Polygon Mainnet Tokens List')
            list = polygonTokenList
        } else if (chainId === 80001) {
            Vue.$log.debug('Loading Polygon Testnet Mumbai Tokens List')
            list = mumbaiTokenList
        } else {
            Vue.$log.debug('Loading Ethereum Tokens List')
            list = mainNetList
        }

        return [fromToken, ...list]
    }

    async getProVIewTokensList() {
        const fromToken = await new BlockchainHelper().getNativeTokenObject()
        return [fromToken, ...proViewList]
    }

    async getProViewToToken(fromToken) {

        if (fromToken === undefined || fromToken.symbol === undefined) {
            return false
        }

        const chainId = await this.getChainId()
        const nativeToken = new BlockchainHelper().getNativeToken(chainId)
        let toAddress

        switch (chainId) {
            case 4:
                if (nativeToken === fromToken.symbol) {
                    toAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
                } else {
                    toAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
                }
                break
            case 42:
                if (nativeToken === fromToken.symbol) {
                    toAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
                } else {
                    toAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
                }
                break
            case 137:
                if (nativeToken === fromToken.symbol) {
                    toAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
                } else {
                    toAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
                }
                break
            case 80001:
                if (nativeToken === fromToken.symbol) {
                    toAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
                } else {
                    toAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
                }
                break
            default:
                if (nativeToken === fromToken.symbol) {
                    toAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
                } else {
                    toAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // ETH
                }
                break
        }

        return toAddress
    }

    async getAddress() {
        if(Store.state.signer) {
            return await Store.state.signer.getAddress()
        }
        return null
    }

    async getBalance() {
        let balance = await Store.state.provider.getBalance(await this.getAddress());
        return ethers.utils.formatEther(balance);
    }

    setEvents() {
        Store.state.provider.provider
            .on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    let address = await this.resolveAddressToEnsDomain(accounts[0])
                    await Store.dispatch('setReadableSelectedAddress', address)
                } else {
                    await Store.dispatch('setReadableSelectedAddress', undefined)
                }
                Vue.$log.debug("Accounts changed", accounts);
                let fromTokenBalance = await this.getTokenBalance(Store.state.selectedFromToken)
                let toTokenBalance = await this.getTokenBalance(Store.state.selectedToToken)
                await Store.dispatch('setFromTokenAvailableAmount', fromTokenBalance);
                await Store.dispatch('setToTokenAvailableAmount', toTokenBalance);
            });
        Store.state.provider.provider
            .on("chainChanged", (networkId) => {
                this.syncChainSelected()
                Vue.$log.debug("Network changed", networkId);
                location.reload(true)
            });
    }

    async getCivManager() {
        const abi = await this.getAbiV2()
        const managerAddress = await this.getManagerAddressV2()
        return new ethers.Contract(managerAddress, abi).connect(store.state.signer);
    }

    async getGasPrice() {
        return ethers.utils.formatEther(await store.state.signer.getGasPrice())

    }
}

