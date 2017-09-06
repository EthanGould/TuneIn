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
      trackProgress: '',
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
      tracksRef.on('value', (snapshot) => {
        this.tracks = snapshot.val() || {};
      });

      return {};
    },

    /**
     * Retrieves a playlist from Firebase.
     */
    fetchPlaylist() {
      const playlistRef = firebase.database().ref('playlists/' + this.$route.params.id);
      playlistRef.once('value', (snapshot) => {
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
          soundCloudId: track.id,
          duration: track.duration,
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
      // Save new track ID to the track's data.
      track.id = key;
      // Save track to Firebase.
      tracksRef.set(track);
      // Update the master list of tracks.
      this.fetchTracks();
    },

    /**
     *  Pause or play a track from SoundCloud.
     */
    toggleTrackState(track) {
      console.log('all tracks', this.tracks);
      // If the track was clicked again, pause it.
      if (this.currentTrack.id === track.id && this.isPlaying) {
        this.player.pause();
        this.currentTrack = '';

      // Otherwise, play the newly selected track.
      } else {
        SC.stream('/tracks/' + track.soundCloudId).then((player) => {
          player.play();
          this.player = player;
          this.isPlaying = true;
          this.currentTrack = this.tracks[track.id];
          player.on('finish', this.playNextTrack);
          player.on('time', this.updateTrackProgress);
        });
      }
    },

    updateTrackProgress(milliSeconds) {
      this.trackProgress = Math.floor(milliSeconds / this.currentTrack.duration * 100);
      console.log(this.trackProgress);
    },

    playNextTrack() {
      const arr = Object.keys(this.tracks).map(function(val) { return val });
      const nextTrackIndex = arr.indexOf(this.currentTrack.id);
      const nextTrackId = arr[nextTrackIndex+1];
      const nextTrack = this.tracks[nextTrackId];
      this.toggleTrackState(nextTrack)
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
    <h3>{{playlistName}} ({{Object.keys(tracks || {}).length}} tracks)</h3>
    <ul>
      <li v-for="track in tracks" v-bind:class="{ active: currentTrack.id === track.id }">
        <a href="javascript:;" v-on:click="toggleTrackState(track)">
          <img v-bind:src="track.artwork"/>{{track.title}} - <strong>{{track.artist}}</strong>
          <span v-if="currentTrack.id === track.id">{{trackProgress}}%</span>
        </a>
      </li>
    </ul>
    <form v-on:submit.prevent="getTrack">
      <input v-model="trackUrl" type="input" style="width:50%;" placeholder="SoundCloud URL">
      <input type="submit" value="add">
    </form>
  </div>
</template>
