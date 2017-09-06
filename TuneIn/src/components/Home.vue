<script>
export default {
	name: 'welcome',
	data() {
		return {
			playlists: this.fetchPlaylists(),
			playlistName: ''
		}
	},

	methods: {

		/**
     * Retrieves all playlists from Firebase.
     */
    fetchPlaylists() {
      const self = this;
      const playlistsRef = firebase.database().ref('playlists/');
      playlistsRef.once('value').then(function (snapshot) {
        self.playlists = snapshot.val();
        return snapshot.val();
      });
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
      this.playlistName = '';
      this.fetchPlaylists();
    }
	}
}
</script>

<template>
	<div>
		<div><h3>Welcome to TuneIn!</h3><p>Select a playlist below</p></div>
    <ul>
      <li v-for="playlist in playlists">
        <a v-bind:href="'#playlist/' + playlist.id">
          {{playlist.title}}
        </a>
      </li>
    </ul>
    <p>or create new one!</p>
    <form v-on:submit.prevent="addPlaylist">
      <input v-model="playlistName" type="input" style="width:50%;" placeholder="Playlist name">
      <input type="submit" value="add">
    </form>
  </div>
</template>
