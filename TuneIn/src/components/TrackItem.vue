<script>

export default {
	name: 'track-item',

	props: ['tracks'],

	data () {
		return {
			player: false,
			isPlaying: false,
			currentTrack: false,
			trackProgress: 0
		}
	},

	methods: {

		/**
     * Pause or play a track from SoundCloud.
     */
    toggleTrackState(track) {
      // If the currently playing track was selected again, pause it.
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

		/**
     * Identify and play the next track in the playlist.
     */
		playNextTrack() {
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
		updateTrackProgress(milliseconds) {
      this.trackProgress = Math.floor(milliseconds / this.currentTrack.duration * 100);
    }
	}
}

</script>

<template>
	<ul class="list">
    <li v-for="track in tracks" class="list__item">
      <template v-if="track.isLink">
        <a v-bind:href="track.soundCloudLink" target="_blank" class="list__link track track--external">
          <svg width="24" height="24" viewBox="0 0 24 24" class="track__img"><path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/></svg>
          <div class="track__details">
            <span class="track__title track--link" v-bind:href="track.soundCloudLink">{{track.title}}</span>
            <span class="track__artist">{{track.soundCloudLink}}</span>
          </div>
        </a>
      </template>
      <template v-else>
        <a href="javascript:;" v-on:click="toggleTrackState(track)" v-bind:class="{ 'track--active': currentTrack.id === track.id }" class="list__link track">
  			  <img v-bind:src="track.artwork" class="track__img"/>
          <div class="track__details">
            <span class="track__title">{{track.title}}</span>
            <span class="track__artist">{{track.artist}}</span>
          </div>
  			  <span v-if="currentTrack.id === track.id" class="track__progress">{{trackProgress}}%</span>
  			</a>
      </template>
    </li>
	</ul>
</template>
