import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

import i18n from './lang' // internationalization
// import messages from './lang';

import Print from 'vue-print-nb'
Vue.use(Print)

// import DisableAutocomplete from 'vue-disable-autocomplete'
//
// Vue.use(DisableAutocomplete)

import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
window.$ = window.jQuery = require('jquery')

import VueMoment from 'vue-moment'
// import moment from 'moment-timezone'

Vue.use(VueMoment)

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// export function getLanguage() {
//   const chooseLanguage = Cookies.get('language');
//   if (chooseLanguage) {
//     return chooseLanguage;
//   }

// if has not choose language
//   const language = (navigator.language || navigator.browserLanguage).toLowerCase();
//   const locales = Object.keys(messages);
//   for (const locale of locales) {
//     if (language.indexOf(locale) > -1) {
//       return locale;
//     }
//   }
//   return 'en';
// }

// Vue.use(VueI18n);
// export const i18n = new VueI18n({
//   locale: getLanguage(),
//   fallbackLocale: 'en',
//   messages
// });

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
