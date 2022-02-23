var youTubePlayer;
window.onload = function () {
  let clickedViedo = null
  let body = document.getElementsByTagName("body")[0]
  let input = document.createElement('input')
  input.id = 'YouTube-video-id'
  input.type = 'hidden'
  input.value = 'yPkS7yiTHP4'
  input.pattern = '[_\-0-9A-Za-z]{11}'

  let div = document.createElement('div')
  div.id = 'YouTube-player'
  div.style.display = 'none'
  body.appendChild(input)
  body.appendChild(div)
  onYouTubeIframeAPIReady()
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
    if( request.videoId !== undefined && request.videoId !== null ) {
      document.getElementById('YouTube-video-id').value = request.videoId
      youTubePlayer.cueVideoById({suggestedQuality: 'tiny',
                                  videoId: request.videoId
                                });
      youTubePlayer.pauseVideo();
    } else if(request.backgroundVideoPlay !== undefined && request.backgroundVideoPlay !== null ){
      youTubePlayerPlay()
    } else if(request.backgroundVideoPause !== undefined && request.backgroundVideoPause !== null ){
      youTubePlayerPause()
    }
  }
);


function onYouTubeIframeAPIReady() {
  'use strict';
  var inputVideoId = document.getElementById('YouTube-video-id');
  var videoId = inputVideoId.value;
  var suggestedQuality = 'tiny';
  var height = 180;
  var width = 320;
  var youTubePlayerVolumeItemId = 'YouTube-player-volume';


  function onError(event) {
      youTubePlayer.personalPlayer.errors.push(event.data);
  }


  function onReady(event) {
      var player = event.target;

      player.loadVideoById({suggestedQuality: suggestedQuality,
                            videoId: videoId
                           });
      player.pauseVideo();
  }


  function onStateChange(event) {
      var volume = Math.round(event.target.getVolume());
      var volumeItem = document.getElementById(youTubePlayerVolumeItemId);

      if (volumeItem && (Math.round(volumeItem.value) != volume)) {
          volumeItem.value = volume;
      }

      var player = event.target;
      if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(0);
        player.playVideo();
      }
  }


  youTubePlayer = new YT.Player('YouTube-player',
                                {videoId: videoId,
                                 height: height,
                                 width: width,
                                 playerVars: {'autohide': 0,
                                              'cc_load_policy': 0,
                                              'controls': 2,
                                              'disablekb': 1,
                                              'iv_load_policy': 3,
                                              'modestbranding': 1,
                                              'rel': 0,
                                              'showinfo': 0,
                                              'start': 3
                                             },
                                 events: {'onError': onError,
                                          'onReady': onReady,
                                          'onStateChange': onStateChange
                                         }
                                });

  // Add private data to the YouTube object
  youTubePlayer.personalPlayer = {'currentTimeSliding': false,
                                  'errors': []};
}

function youTubePlayerActive() {
  'use strict';

  return youTubePlayer && youTubePlayer.hasOwnProperty('getPlayerState');
}

/**
 * Pause.
 */
 function youTubePlayerPause() {
  'use strict';

  if (youTubePlayerActive()) {
      youTubePlayer.pauseVideo();
  }
}

/**
 * Play.
 */
 function youTubePlayerPlay() {
  'use strict';

  if (youTubePlayerActive()) {
      youTubePlayer.playVideo();
  }
}