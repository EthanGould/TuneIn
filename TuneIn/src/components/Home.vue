<script>
import SiteHeader from './SiteHeader';

export default {
	name: 'welcome',
	data() {
		return {
			playlists: this.fetchPlaylists(),
		}
	},

  components: {
    SiteHeader
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
    <site-header v-bind:headerText="'TuneIn'" v-bind:homescreen="true"></site-header>
    <ul class="list">
      <li class="list__item">
        <a v-bind:href="'#playlist/new'" class="list__link list__link--cta">New Playlist +</a>
      </li>
      <li v-for="playlist in playlists" class="list__item">
        <a v-bind:href="'#playlist/' + playlist.id" class="list__link">
          {{playlist.title}}
        </a>
      </li>
    </ul>
  </div>
</template>
