<template>
	<div class="aaa" style="padding: 15px 0;">
	  <video-player  class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                 customEventName="customstatechangedeventname"
                 @play="onPlayerPlay($event)"
                 @pause="onPlayerPause($event)"
 
                 @statechanged="playerStateChanged($event)"
                 @ready="playerReadied">
                
	  </video-player>
  </div>
</template>

<script>
export default {
  data() {
    return {
        playerOptions: {
	   		muted: true,
		    language: 'en',
		    height: '200',
		    width: '300',
		    playbackRates: [0.7, 1.0, 1.5, 2.0],
		    sources: [{
		   		type: "video/mp4",
		    	src: ""
		    }],
          	poster: "",
        	}
      	}
  	},
  	props:[
  		'_src',
  		'_poster'
  	],
  	computed: {
    	player() {
      		return this.$refs.videoPlayer.player
    	}
  	},
	created() {
		this.listLoading = false
//		this.playerOptions.sources[0].src = _src
		this.playerOptions.sources[0].src = this._src
		this.playerOptions.poster = this._poster
	},
	methods: {
	  // listen event
	  onPlayerPlay(player) {
	  },
	  onPlayerPause(player) {
	  },	
	  // ...player event
	 
	      // or listen state event
	  playerStateChanged(playerCurrentState) {
	  },
	 
	  // player is ready
	  playerReadied(player) {
	  }
	}
};
</script>

<style scoped="">
</style>