<script>
import SiteHeader from './SiteHeader';
import TrackItem from './TrackItem';

export default {
	name: 'playlist',

	data () {
		return {
      tracks: this.fetchTracks(),
      playlist: this.fetchPlaylist(),
      playlistName: '',
      trackUrl: ''
		}
	},

  components: {
    TrackItem,
    SiteHeader
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
    },

    /**
     * Retrieves a playlist from Firebase.
     */
    fetchPlaylist() {
      const playlistRef = firebase.database().ref('playlists/' + this.$route.params.id);
      playlistRef.on('value', (snapshot) => {
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
          artwork: track.artwork_url || track.user.avatar_url,
          isLink: false,
          soundCloudLink: this.trackUrl
        };

        // Save track to Firebase.
        this.addTrack(trackData);
      }).catch((error) => {
        if (403 === error.status) {
          const trackData = {
            soundCloudId: null,
            duration: null,
            title: 'Listen on SoundCloud',
            artist: null,
            artwork: null,
            isLink: true,
            soundCloudLink: this.trackUrl
          };
          // Save track to Firebase.
          this.addTrack(trackData);
        }
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
      this.trackUrl = '';
      this.showNewestAddition();
    },

    showNewestAddition() {
      setTimeout(() => {
        const lastTrack = document.querySelector('.list__item:last-child');
        lastTrack.scrollIntoView({behavior: 'smooth'});
      }, 100); // Wait for Vue to render newest addition.
    }
  }
}
</script>

<template>
  <div>
    <site-header v-bind:headerText="playlistName + ' (' + Object.keys(tracks || 0).length + ' tracks)'"></site-header>
    <track-item v-bind:tracks="tracks"></track-item>
    <form v-on:submit.prevent="getTrack" class="form form--inline">
      <input v-model="trackUrl" type="input" class="form__input" placeholder="SoundCloud URL">
      <input type="submit" value="add" class="form__submit">
    </form>
  </div>
</template>
