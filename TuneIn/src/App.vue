<script>
import SongItem from './components/SongItem'
import SongForm from './components/SongForm'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

export default {
  name: 'app',
  components: {
    SongItem,
    SongForm
  }
}
</script>

<template>
  <div id="app">
    <song-item></song-item>
    <song-form></song-form>
  </div>
</template>