import Vue from 'vue/dist/vue.esm.js'
import VueRagePower from '../index.vue'

Vue.component('vue-rage-power', VueRagePower)

new Vue({
    el: '#app',
    template: `
        <vue-rage-power>
            <textarea></textarea>
        </vue-rage-power>
    `
})
