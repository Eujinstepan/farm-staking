export const AutoTaskUrl = function (chainId) {
    chainId=chainId.toString()
    if (chainId === '1') {
        return 'https://api.defender.openzeppelin.com/autotasks/c4b04a3b-5872-4ccd-8cf7-8717d30ff1f4/runs/webhook/3c4bcb7e-2f16-4776-bb97-6afcaa6fc8df/39c9XjMyAV3H274DQu1GT9';
    } else if (chainId === '4') {
        return 'https://api.defender.openzeppelin.com/autotasks/7635e8f7-259e-4ec6-b092-c620b5ba491d/runs/webhook/3c4bcb7e-2f16-4776-bb97-6afcaa6fc8df/NSM7WShgtu9qN5DzxWVZSW';
    } else if (chainId === '42') {
        return 'https://api.defender.openzeppelin.com/autotasks/aa110cbd-7891-4dcc-817a-87bd458e0df6/runs/webhook/3c4bcb7e-2f16-4776-bb97-6afcaa6fc8df/Nco4avC5G97NP9wJhZkDYN';
    } else if (chainId === '137') {
        return 'https://api.defender.openzeppelin.com/autotasks/4ff8a10c-51ef-4c53-a736-b6e84aa81ed4/runs/webhook/3c4bcb7e-2f16-4776-bb97-6afcaa6fc8df/EnMAQVNbjmipzybVXAedn4';
    } else if (chainId === '80001') {
        return 'https://api.defender.openzeppelin.com/autotasks/090f5b45-5974-4232-82e1-16540be9f9ed/runs/webhook/3c4bcb7e-2f16-4776-bb97-6afcaa6fc8df/ARmAWoC1f1Zgsx35Y9EN7X';
    } else {
        throw 'Unsupported Network'
    }
}

export const ForwarderAddress = function (chainId) {
	chainId = String(chainId)
    if (chainId === '1') {
        return '0xcB9985eb9433A757841D44ec8fCf5c585781bC44';
    } else if (chainId === '4') {
        return '0xcB9985eb9433A757841D44ec8fCf5c585781bC44';
    } else if (chainId === '42') {
        return '0xcB9985eb9433A757841D44ec8fCf5c585781bC44';
    } else if (chainId === '137') {
        return '0xcB9985eb9433A757841D44ec8fCf5c585781bC44';
    } else if (chainId === '80001') {
        return '0xcB9985eb9433A757841D44ec8fCf5c585781bC44';
    } else {
        throw 'Unsupported Network2 '+chainId
    }
}

export const getRelayAddress = function (chainId) {
	chainId = String(chainId)
    if (chainId === '1') {
        return '0xd26cc7c8d96f6ca5291758d266447f6879a66e16';
    } else if (chainId === '4') {
        return '0xd26cc7c8d96f6ca5291758d266447f6879a66e16';
    } else if (chainId === '42') {
        return '0xd26cc7c8d96f6ca5291758d266447f6879a66e16';
    } else if (chainId === '137') {
        return '0xd26cc7c8d96f6ca5291758d266447f6879a66e16';
    } else if (chainId === '80001') {
        return '0xd26cc7c8d96f6ca5291758d266447f6879a66e16';
    } else {
        throw 'Unsupported Network1 '+chainId
    }
}

/*
module.exports = { 
  signMetaTxRequest,
  buildRequest,
  buildTypedData,
};
*/