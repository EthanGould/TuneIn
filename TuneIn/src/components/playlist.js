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

  /**
   * Creates markup for each track in playlist from Firebase.
   */
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

  showNewestAddition: function() {
    const lastTrack = document.querySelector('.list__item:last-child');
    lastTrack.scrollIntoView({behavior: 'smooth'});
  }
}

playlist.init();
