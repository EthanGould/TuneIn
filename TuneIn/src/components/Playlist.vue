<script>
export default {
	name: 'playlist',

	data () {
		return {
      songs: this.fetchSongs(),
      playlists: this.fetchPlaylist(),
      playlistName: '',
      trackId: '',
      trackCount: 0,
      player: '',
      currentSong: '',
      isPlaying: false
		}
	},

  props: ['id'],

  methods: {

    /**
     * Retrieves all songs for a playlist from Firebase.
     */
    fetchSongs() {
      const songsRef = firebase.database().ref('songs/');
      songsRef.once('value').then((snapshot) => {
        var songs = snapshot.val();
        if (songs) {
          this.songs = songs[this.id];
        }
      });
    },

    /**
     * Retrieves all playlists from Firebase.
     */
    fetchPlaylist() {
      const playlistsRef = firebase.database().ref('playlists/' + this.$route.params.id);
      playlistsRef.once('value').then((snapshot) => {
        this.playlists = snapshot.val();
        this.playlistName = snapshot.val().title;
      });
    },

    /**
     * Retrieves song data from SoundCloud based on the queried track ID.
     */
    getSong() {
      const soundcloudURL = 'http://api.soundcloud.com/tracks/';
      const clientID = '?client_id=22aa56e479e5b0a4968c22120c32bde8';

      this.$http.get(soundcloudURL + this.trackId + clientID).then((response) => {
        const song = JSON.parse(response.bodyText);
        // Grab data we need in the app.
        const songData = {
          id: song.id,
          title: song.title,
          artist: song.user.username,
          artwork: song.artwork_url || song.user.avatar_url
        };
        // Save song to Firebase.
        this.addSong(songData);
      });
    },

    /**
     * Adds a song to Firebase.
     *
     * @param obj song The song data to be sent to Firebas.
     */
    addSong(song, playlist) {
      const key = firebase.database().ref('songs/' + this.id).push().key;
      const songsRef = firebase.database().ref('songs/' + this.id + '/' + key );
      // Save song to Firebase.
      songsRef.set(song);
      // Update the master list of songs.
      this.fetchSongs();
    },

    /**
     *  Adds a playlist to firebase.
     */
    addPlaylist() {
      const key = firebase.database().ref('playlists/').push().key;
      const playlistRef = firebase.database().ref('playlists/' + key);
      // Save song to Firebase.
      playlistRef.set({
        id: key,
        title: this.playlistName
      });

      this.fetchPlaylist();
    },

    toggleSongState(songId) {
      // If the song was clicked again, pause it.
      if (this.currentSong === songId && this.isPlaying) {
        this.player.pause();
        this.currentSong = '';
      // Otherwise, play the newly selected song.
      } else {
        SC.stream('/tracks/' + songId).then((player) => {
          player.play();
          this.player = player;
          this.isPlaying = true;
          this.currentSong = songId;
        });
      }
    }
  }
}
</script>

<style>
  .active {
    background-color: lightgrey;
  }
</style>

<template>
  <div>
    <h3>Viewing: {{playlistName}}</h3>
    <ul>
      <li v-for="song in songs" v-bind:class="{ active: currentSong === song.id }">
        <a href="javascript:;" v-on:click="toggleSongState(song.id)">
          <img v-bind:src="song.artwork"/>{{song.title}} - <strong>{{song.artist}}</strong>
        </a>
      </li>
    </ul>
    <form v-on:submit.prevent="getSong">
      <input v-model="trackId" type="input" style="width:50%;" placeholder="SoundCloud song ID ex: 339643264">
      <input type="submit" value="add">
    </form>
  </div>
</template>
