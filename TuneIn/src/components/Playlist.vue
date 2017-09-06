<script>
export default {
	name: 'playlist',

	data () {
		return {
      tracks: this.fetchTracks(),
      playlist: this.fetchPlaylist(),
      playlistName: '',
      trackUrl: '',
      trackCount: 0,
      player: '',
      currentTrack: '',
      isPlaying: false
		}
	},

  props: ['id'],

  methods: {

    /**
     * Retrieves all tracks for a playlist from Firebase.
     */
    fetchTracks() {
      const tracksRef = firebase.database().ref('tracks/' + this.id);
      tracksRef.once('value').then((snapshot) => {
        this.tracks = snapshot.val() || {};
      });
    },

    /**
     * Retrieves a playlist from Firebase.
     */
    fetchPlaylist() {
      const playlistRef = firebase.database().ref('playlists/' + this.$route.params.id);
      playlistRef.once('value').then((snapshot) => {
        this.playlist = snapshot.val();
        this.playlistName = snapshot.val().title;
      });
    },

    /**
     * Retrieves track data from SoundCloud based on the queried track ID.
     */
    getTrack() {
      SC.get('/resolve?url=' + this.trackUrl).then((track) => {
        // Grab data we need in the app.
        const trackData = {
          id: track.id,
          title: track.title,
          artist: track.user.username,
          artwork: track.artwork_url || track.user.avatar_url
        };
        // Save track to Firebase.
        this.addTrack(trackData);
        // Reset track URL input.
        this.trackUrl = '';
      });
    },

    /**
     * Adds a track to Firebase.
     *
     * @param obj track The track data to be sent to Firebase.
     */
    addTrack(track) {
      const key = firebase.database().ref('tracks/' + this.id).push().key;
      const tracksRef = firebase.database().ref('tracks/' + this.id + '/' + key );
      // Save track to Firebase.
      tracksRef.set(track);
      // Update the master list of tracks.
      this.fetchTracks();
    },

    /**
     *  Pause or play a track from SoundCloud.
     */
    toggleTrackState(trackId) {
      // If the track was clicked again, pause it.
      if (this.currentTrack === trackId && this.isPlaying) {
        this.player.pause();
        this.currentTrack = '';

      // Otherwise, play the newly selected track.
      } else {
        SC.stream('/tracks/' + trackId).then((player) => {
          player.play();
          this.player = player;
          this.isPlaying = true;
          this.currentTrack = trackId;
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
    <h3>Viewing: {{playlistName}} ({{Object.keys(tracks || {}).length}} tracks)</h3>
    <ul>
      <li v-for="track in tracks" v-bind:class="{ active: currentTrack === track.id }">
        <a href="javascript:;" v-on:click="toggleTrackState(track.id)">
          <img v-bind:src="track.artwork"/>{{track.title}} - <strong>{{track.artist}}</strong>
        </a>
      </li>
    </ul>
    <form v-on:submit.prevent="getTrack">
      <input v-model="trackUrl" type="input" style="width:50%;" placeholder="SoundCloud URL">
      <input type="submit" value="add">
    </form>
  </div>
</template>
