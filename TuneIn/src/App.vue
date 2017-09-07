<script>
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export default {
  name: 'app',
}
</script>

<template>
  <div id="app" style="margin: 50px 0;">
		<router-view></router-view>
  </div>
</template>