// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Home from './components/Home'
import Playlist from './components/Playlist'

Vue.use(VueRouter);

Vue.config.productionTip = false

const router = new VueRouter({
	routes: [
		{
			path: '/home',
			components: {
				default: Home
			}
		},
		{
			path: '/playlist',
			components: {
				default: Playlist
			}
		}
	]
});

/* eslint-disable no-new */
new Vue({
	router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
