<script>
import SiteHeader from './SiteHeader';

export default {
	name: 'new-playlist',

	data() {
		return {
			playlistTitle: '',
      genre: null
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
      if ('' === this.playlistTitle) { return; }
      const key = firebase.database().ref('playlists/').push().key;
      const playlistRef = firebase.database().ref('playlists/' + key);
      // Save song to Firebase.
      playlistRef.set({
        id: key,
        title: this.playlistTitle,
        genre: this.genre
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
      	<select class="form__select" v-model="genre">
      		<option value="rap" selected>Rap</option>
          <option value="pop">Pop</option>
      		<option value="EMD">EDM</option>
          <option value="country">Country</option>
          <option value="instrumental">Instrumental</option>
      	</select>
      </label>
      <input type="submit" value="add" class="form__submit">
    </form>
  </div>
</template>