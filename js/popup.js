// import youtubeApi from './script.js';

const searchViedoForm = document.getElementById('search-viedo')
const searchString = document.getElementById('search-string')
var youTubePlayer;

function imgClickVideo(img, index) {
  img.addEventListener('click', function() {
    let playVideoId = document.getElementById('playVideoId' + index)
    youTubePlayer.cueVideoById({suggestedQuality: 'tiny',
                                videoId: playVideoId.value
                               });
    youTubePlayer.pauseVideo();
    document.getElementById('videoPlayerImg').src = this.src
    document.getElementById('videoData').style.display = 'none'
    document.getElementById('videoPlayer').style.display = ''
  })
}


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

let searchQuery = ''

searchViedoForm.addEventListener('submit', event => {
  event.preventDefault()
  if(searchString.value.indexOf('https://www.youtube.com/watch?v=') != -1){
    let href = searchString.value.indexOf('=')
    let videoId = searchString.value.substring(href+1, searchString.value.length)

    document.getElementById('playVideoImg').src = 'https://i.ytimg.com/vi/'+ videoId +'/mqdefault.jpg'
    document.getElementById('playVideoImg').style.display = ''
    document.getElementById('play_pause').style.display = ''

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        "videoId": videoId
      })
    })
  }else{
    alert('請輸入正確的格式')
  }
})

const videoPlay = document.getElementById('play_pause')
videoPlay.addEventListener('click', () => {
  if(document.getElementById("playImg").style.display == 'none'){
    document.getElementById("playImg").style.display = ''
    document.getElementById("pauseImg").style.display = 'none'
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        "backgroundVideoPause": true
      })
    })
  } else if(document.getElementById("pauseImg").style.display == 'none'){
    document.getElementById("playImg").style.display = 'none'
    document.getElementById("pauseImg").style.display = ''
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        "backgroundVideoPlay": true
      })
    })
  }
});
