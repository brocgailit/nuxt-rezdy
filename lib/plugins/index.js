import axios from 'axios'
import * as helpers from './helpers/index.js'
import countries from './helpers/countries.json'
import standardFields from './helpers/rezdy-fields.json'

const options = JSON.parse(`<%= JSON.stringify(options) %>`)
const { namespace, baseURL, token, stripe, vinti4, twoCheckout, cardProcessor, availability, localization } = options
const $axios = axios.create({baseURL})
$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
const axiosMethod = method => (endpoint, options) => $axios[method](endpoint, options).then(res => res.data)
$axios.$get = axiosMethod('get')
$axios.$post = axiosMethod('post')
$axios.$put = axiosMethod('put')
$axios.$delete = axiosMethod('delete')


export default (ctx, inject) => {
  const { store } = ctx
  const { state } = store

  const plugin = {
    countries,
    standardFields,
    cardProcessor,
    stripe,
    vinti4,
    twoCheckout,
    availability,
    localization,
    checkout(parent) {
      return helpers.checkout.call(parent)
    },
    checkoutProduct(productCode, parent) {
      return helpers.checkoutProduct.call(parent, { namespace, state, productCode})
    },
    checkoutSession(session, parent) {
      const { productCode } = session
      return helpers.checkoutProduct.call(parent, { namespace, state, productCode, session})
    },
    getQuote(quote) {
      return helpers.getQuote({ $axios, ...quote })
    },
    placeOrder(booking) {
      return helpers.placeOrder({ $axios, namespace, state, booking })
    },
    updateBookingStatus(orderNumber, booking, status) {
      return helpers.updateBookingStatus({ $axios, orderNumber, booking, status })
    },
    /* pay(booking) {
      return helpers.pay({ $axios, ...booking, checkoutOptions})
    }, */
    cancelBooking(orderNumber) {
      return helpers.cancelBooking({ $axios, orderNumber})
    },
    getSessions(params) {
      return helpers.getSessions({ $axios, params })
    },
    getProductByCode(productCode) {
      return helpers.getProductByCode({ state, store, namespace, productCode })
    },
    getCompany(companyAlias) {
      return helpers.getCompany({ $axios, companyAlias })
    },
    getProducts(params) {
      return helpers.getProducts({ state, store, namespace, params })
    },
    getProductPickupLocations(productCode) {
      return helpers.getProductPickupLocations({ $axios, productCode })
    },
    getProductTagGroups(product) {
      return helpers.getProductTagGroups(product)
    },
    getVoucher(voucher) {
      return helpers.getVoucher({ $axios, voucher })
    },
    message(string) {
      return helpers.message({ namespace, string })
    }
  }

  inject(namespace, plugin)
  ctx.$rezdy = plugin
  
}