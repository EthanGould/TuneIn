<template>
	<form>
		<input v-model="trackId" type="input">
		<input v-on:click="getSong" type="button" value="add">
	</form>
</template>

<script>
export default {
	name: 'song-form',

	data () {
		return {
			trackId: null
		}
	},

  methods: {
    getSong: function(event) {
      var soundcloudURL = 'http://api.soundcloud.com/tracks/';
      var clientID = '?client_id=22aa56e479e5b0a4968c22120c32bde8';
      var self = this;

      this.$http.get(soundcloudURL + this.trackId + clientID).then(function(response) {
        var songData = JSON.parse(response.bodyText);
        console.log(songData);
      });
    }
  }
}
</script>

// 335998055