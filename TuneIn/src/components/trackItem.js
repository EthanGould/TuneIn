var trackItem = {
  init: function() {
    this.player = false;
    this.isPlaying = false;
    this.currentTrack = false;
    this.trackProgress = 0;

    this.tracks = document.querySelectorAll('.js-track-item');
  },

	/**
   * Identify and play the next track in the playlist.
   */
	playNextTrack: function() {
		const arr = Object.keys(this.tracks).map(function(val) { return val });
    const currentTrackIndex = arr.indexOf(this.currentTrack.id);
    // Grab the next track ID or the loop back to the first track.
    const nextTrackId = arr[currentTrackIndex+1] || arr[0];
    const nextTrack = this.tracks[nextTrackId];
    this.toggleTrackState(nextTrack)
	},

	/**
   * Updates the progress of the track as it plays.
   *
   * @param integer milliseconds The progress of the track in milliseconds.
   */
	updateTrackProgress: function(milliseconds) {
    this.trackProgress = Math.floor(milliseconds / this.currentTrack.duration * 100);
  }
}

window.eventHandlers = function() {
  this.tracks = document.querySelectorAll('.js-track-item');
  this.tracks.forEach(function(track) {
    track.addEventListener('click', function(event) {
      event.preventDefault();
      toggleTrackState(track);
    });
  });

  this.trackForm = document.querySelector('.js-add-track');
  this.trackForm.addEventListener('submit', window.addTrack);
}

/**
 * Retrieves track data from SoundCloud based on the queried track ID.
 */
window.getTrack = function() {
  if ('' === this.trackUrl) { return; }
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
    window.addTrack(trackData);
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
}

window.addTrack = function(track) {
  const key = firebase.database().ref('tracks/-KtMuXZd0QXuWAqJvpUD').push().key;
  const tracksRef = firebase.database().ref('tracks/-KtMuXZd0QXuWAqJvpUD/' + key );
  // Save new track ID to the track's data.
  track.id = key;
  // Save track to Firebase.
  tracksRef.set(track);
  // this.trackUrl = '';
  // this.$nextTick(this.showNewestAddition);
}

/**
 * Pause or play a track from SoundCloud.
 */
window.toggleTrackState = function(track) {
    // If the currently playing track was selected again, pause it.
    // if (this.currentTrack.id === track.getAttribute('id') && this.isPlaying) {
    //   this.player.pause();
    //   this.currentTrack = '';
    // }

    // Otherwise, play the newly selected track.
    SC.stream('/tracks/' + track.getAttribute('data-sc-id')).then((player) => {
      player.play();
      this.player = player;
      this.isPlaying = true;
      this.currentTrack = this.tracks[track.getAttribute('data-sc-id')];
      player.on('finish', this.playNextTrack);
      player.on('time', this.updateTrackProgress);
    });
  },


trackItem.init();