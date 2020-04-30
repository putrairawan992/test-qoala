import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'

import { store } from './store/Store';
import moment from 'moment';

Vue.config.productionTip = false

Vue.use(VModal)

Vue.filter('formatDate', function(value) {
  if (value) {    
    return moment(value, 'DD/MM/YYYY hh:mm:ss').format('DD-MMM-YYYY, hh:mm A')
  }
});

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
