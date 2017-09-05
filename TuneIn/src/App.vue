<script>
import Playlist from './components/Playlist'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export default {
  name: 'app',
  components: {
    Playlist,
	}  
}
</script>

<template>
  <div id="app">
		<router-link to="/playlist">Go to Playlist</router-link>
		<router-view></router-view>
  </div>
</template>