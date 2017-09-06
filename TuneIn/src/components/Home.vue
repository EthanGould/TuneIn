<script>
export default {
	name: 'welcome',
	data() {
		return {
			playlists: this.fetchPlaylists(),
			isTrue: true
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
  </div>
</template>
