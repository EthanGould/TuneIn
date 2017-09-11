<script>
import SiteHeader from './SiteHeader';

export default {
	name: 'new-playlist',

	data() {
		return {
			playlistTitle: ''
		}
	},

  components: {
    SiteHeader
  },

	methods: {
    /**
     *  Adds a playlist to firebase.
     */
    addPlaylist() {
      const key = firebase.database().ref('playlists/').push().key;
      const playlistRef = firebase.database().ref('playlists/' + key);
      // Save song to Firebase.
      playlistRef.set({
        id: key,
        title: this.playlistTitle
      });
      this.playlistTitle = '';
    }
	}
}
</script>

<template>
  <div>
    <site-header v-bind:headerText="'New Playlist'"></site-header>
  	<form v-on:submit.prevent="addPlaylist" class="form">
      <label>
        Playlist Name
        <input v-model="playlistTitle" type="input" class="form__input">
      </label>
      <label>
        Add a genre
      	<select class="form__select">
      		<option>Rap</option>
      		<option>Country</option>
      		<option>EDM</option>
      	</select>
      </label>
      <input type="submit" value="add" class="form__submit">
    </form>
  </div>
</template>