import Vue from "vue";
import BigNumber  from 'bignumber.js'
import moment from 'moment'

const number_format= function (number, decimals, decPoint, thousandsSep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    const n = !isFinite(+number) ? 0 : +number
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    const sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    const dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = ''

    const toFixedFix = function (n, prec) {
        if (('' + n).indexOf('e') === -1) {
            return +(Math.round(n + 'e+' + prec) + 'e-' + prec)
        } else {
            const arr = ('' + n).split('e')
            let sig = ''
            if (+arr[1] + prec > 0) {
                sig = '+'
            }
            return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec)
        }
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}

Vue.filter("formatPrice", (price, decimals = 2) => {
    let formattedPrice = (0).toFixed(decimals)
    if(price !== null) {
        formattedPrice = new BigNumber(price).toFixed(decimals)
    }
    formattedPrice = number_format(formattedPrice, decimals, '.', ',')
    let split = formattedPrice.split('.')
    if(parseInt(split[1]) === 0) {
        formattedPrice = split[0]
    }

    if(formattedPrice === 'NaN') {
        formattedPrice = new BigNumber(price).decimalPlaces(decimals)
        if(formattedPrice.isNaN() || ! formattedPrice.isFinite()) {
            formattedPrice = '-'
        }
    }

    return formattedPrice.toString(10)
})
Vue.filter("dateFormat", (date, format) => {
    return moment(String(date)).format(format)
})

Vue.filter("dateFormatFromTimestamp", (timestamp) => {
    return  moment.unix(timestamp).format("HH:mm");
})

Vue.filter("dateFormatFromDatestamp", (timestamp) => {
    return  moment.unix(timestamp).format("dddd YYYY/MM/DD HH:mm");
})

Vue.filter("feeTierFormat", (feeTier) => {
    if (feeTier) return  Number(feeTier) / 10000 + '%';
})

Vue.filter('intlFormat', (value, maximumSignificantDigits = 4, minimumSignificantDigits = 2) => {
    if(value !== undefined) {
        return new Intl.NumberFormat('en-US', { maximumSignificantDigits: maximumSignificantDigits, minimumSignificantDigits: minimumSignificantDigits }).format(value)
    }
    return '-'
})