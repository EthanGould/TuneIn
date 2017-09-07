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
    <li v-for="track in tracks" v-bind:class="{ 'track--active': currentTrack.id === track.id }" class="list__item track">
			<a href="javascript:;" v-on:click="toggleTrackState(track)" class="list__link">
			  <img v-bind:src="track.artwork" class="track__img"/>
        <div class="track__details">
          <span class="track__title">{{track.title}}</span>
          <span class="track__artist">{{track.artist}}</span>
        </div>
			  <span v-if="currentTrack.id === track.id" class="track__progress">{{trackProgress}}%</span>
			</a>
		</li>
	</ul>
</template>
