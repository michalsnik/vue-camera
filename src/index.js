import VueCamera from './VueCamera.vue'

const plugin = {
  install (Vue) {
    Vue.component('VueCamera', VueCamera)
  }
}

export default VueCamera;

// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
