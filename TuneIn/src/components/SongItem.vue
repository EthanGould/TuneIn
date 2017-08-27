<template>
  <div>
  	<h2>Title Here</h2>
  	<p>{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'song-item',
  data () {
    return {
      title: '',
      artist: ''
    }
  }
}
</script>