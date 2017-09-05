<script>
export default {
	name: 'playlist',

	data () {
		return {
      songs: this.fetchSongs(),
      trackId: null
		}
	},

  methods: {

    /**
     * Retrieves all songs for a playlist.
     */
    fetchSongs: function() {
      var self = this;
      var songsRef = firebase.database().ref('songs/').once('value').then(function(snapshot) {
        console.log('songs snapshot!', snapshot.val());
        self.songs = snapshot.val();
        return snapshot.val();
      });
    },

    /**
     * Retrieves song data from SoundCloud based on the queried track ID.
     */
    getSong: function() {
      var soundcloudURL = 'http://api.soundcloud.com/tracks/';
      var clientID = '?client_id=22aa56e479e5b0a4968c22120c32bde8';
      var self = this;

      this.$http.get(soundcloudURL + this.trackId + clientID).then(function(response) {
        var song = JSON.parse(response.bodyText);
        console.log(song);
        var songData = {
          id: song.id,
          title: song.title,
          artist: song.user.username,
          artwork: song.artwork_url || song.user.avatar_url
        };
        self.addSong(songData);
      });
    },

    /**
     * Adds a song to Firebase.
     *
     * @param obj song The song data to be sent to Firebas.
     */
    addSong: function(song) {
      var songsRef = firebase.database().ref('songs/' + song.id);
      // Save song to Firebase.
      songsRef.set(song);
      // Update the master list of songs.
      this.fetchSongs();
    }
  }
}
</script>

<template>
  <div>
    <ul id="playlist">
      <li v-for="song in songs">
        <img v-bind:src="song.artwork"/>{{song.title}} - <strong>{{song.artist}}</strong>
      </li>
    </ul>
    <form v-on:submit.prevent="getSong">
      <input v-model="trackId" type="input" style="width:50%;" placeholder="SoundCloud song ID ex: 339643264">
      <input type="submit" value="add">
    </form>
  </div>
</template>
