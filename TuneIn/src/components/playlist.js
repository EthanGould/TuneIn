var playlist = {

  init: function() {
    this.tracks = this.fetchTracks(),
    this.playlist = this.fetchPlaylist(),
    this.playlistName = '',
    this.trackUrl = ''
    this.header = document.querySelector('.js-header');
    this.playlistContainer = document.querySelector('.js-playlist');
  },

  /**
   * Retrieves all tracks for a playlist from Firebase.
   */
  fetchTracks: function() {
    const tracksRef = firebase.database().ref('tracks/-KtMuXZd0QXuWAqJvpUD');
    tracksRef.on('value', (snapshot) => {
      this.tracks = snapshot.val() || {};
      this.buildPlaylist();
    });
  },

  /**
   * Retrieves a playlist from Firebase.
   */
  fetchPlaylist: function() {
    const playlistRef = firebase.database().ref('playlists/-KtMuXZd0QXuWAqJvpUD');
    playlistRef.on('value', (snapshot) => {
      this.playlist = snapshot.val();
      this.header.innerText = snapshot.val().title;
    });
  },

  // /**
  //  * Retrieves track data from SoundCloud based on the queried track ID.
  //  */
  // getTrack: function() {
  //   if ('' === this.trackUrl) { return; }
  //   SC.get('/resolve?url=' + this.trackUrl).then((track) => {
  //     // Grab data we need in the app.
  //     const trackData = {
  //       soundCloudId: track.id,
  //       duration: track.duration,
  //       title: track.title,
  //       artist: track.user.username,
  //       artwork: track.artwork_url || track.user.avatar_url,
  //       isLink: false,
  //       soundCloudLink: this.trackUrl
  //     };

  //     // Save track to Firebase.
  //     this.addTrack(trackData);
  //   }).catch((error) => {
  //     if (403 === error.status) {
  //       const trackData = {
  //         soundCloudId: null,
  //         duration: null,
  //         title: 'Listen on SoundCloud',
  //         artist: null,
  //         artwork: null,
  //         isLink: true,
  //         soundCloudLink: this.trackUrl
  //       };
  //       // Save track to Firebase.
  //       this.addTrack(trackData);
  //     }
  //   });

  // },

  buildPlaylist: function() {
    var markup = '';
    Object.keys(this.tracks).map((track) => {
      track = this.tracks[track];
      markup += `<li class="list__item js-track-item" data-id=${track.id} data-sc-id=${track.soundCloudId}>
                  <a href=${track.soundCloudLink} target="_blank" class="list__link track">
                    <img src="${track.artwork}" class="track__img"/>
                    <div class="track__details">
                      <span class="track__title track--link" href=${track.soundCloudLink}>${track.title}
                      <span class="track__artist">${track.artist}</span>
                    </div>
                  </a>
                </li>`;

            // <a href="javascript:;" v-on:click="toggleTrackState(track)" v-bind:class="{ 'track--active':
            //   <img v-bind:src="track.artwork" class="track__img"/>
            //   <div class="track__details">
            //   <span class="track__title">{{track.title}}</span>
            //   <span class="track__artist">{{track.artist}}</span>
            //   </div>
            //   <span v-if="currentTrack.id === track.id" class="track__progress">{{trackPr
            // </a>

    });
    this.playlistContainer.innerHTML = markup;
    window.eventHandlers();
  },

  /**
   * Adds a track to Firebase.
   *
   * @param obj track The track data to be sent to Firebase.
   */
  addTrack: function(track) {
    const key = firebase.database().ref('tracks/' + this.id).push().key;
    const tracksRef = firebase.database().ref('tracks/' + this.id + '/' + key );
    // Save new track ID to the track's data.
    track.id = key;
    // Save track to Firebase.
    tracksRef.set(track);
    this.trackUrl = '';
    this.$nextTick(this.showNewestAddition);
  },

  showNewestAddition: function() {
    const lastTrack = document.querySelector('.list__item:last-child');
    lastTrack.scrollIntoView({behavior: 'smooth'});
  }
}

playlist.init();

// <template>
//   <div>
//     <site-header v-bind:headerText="playlistName + ' (' + Object.keys(tracks || 0).length + ' tracks)'"></site-header>
//     <track-item v-bind:tracks="tracks"></track-item>
//     <form v-on:submit.prevent="getTrack" class="form form--inline">
//       <input v-model="trackUrl" type="input" class="form__input" placeholder="SoundCloud URL">
//       <input type="submit" value="add" class="form__submit">
//     </form>
//   </div>
// </template>
