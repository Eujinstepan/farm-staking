export const nativeAddress = function (chainId) {
    if (chainId === '1') {
        return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    } else if (chainId === '4') {
        return '0xc778417E063141139Fce010982780140Aa0cD5Ab';
    } else if (chainId === '42') {
        return '0xd0A1E359811322d97991E03f863a0C30C2cF029C';
    } else if (chainId === '137') {
        return '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
    } else if (chainId === '80001') {
        return '0x9c3c9283d3e44854697cd22d3faa240cfb032889';
    } else {
        throw 'Unsupported Network'
    }
}