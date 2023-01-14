//API Keys

youTubeAPIKey = "AIzaSyAhj_Zz-hBzSR0xyA5VtmdLDG6Of19XaCA"
giphyAPIKey = "Tz8BYCiyjjd3A55xytpungY3SGFNZkod"

//DOM Elements

var getVideoBtn = document.getElementById("video-form")
var getGifBtn = document.getElementById("gif-form")
var getCreateVideoBtn = document.getElementById("create-video")
var getPreviousVideoBtn = document.getElementById("previous-video")

var videoInput = document.getElementById("video")
var gifInput = document.getElementById("gif")

var videoSearchResults = document.getElementById("video-results")
var gifSearchResults = document.getElementById("gif-results")
var previousVideoResults = document.getElementById("previous-results")

var gifInVideo = document.getElementById("gif-for-video")
var backgroundSound = document.getElementById("final-video")

var videoErrorMessage = document.getElementById("video-error")


//variables

let pastGifPicks = JSON.parse(localStorage.getItem("gifPicks")) //makes an array

if (pastGifPicks===null) {
    pastGifPicks = [] //makes sure we only create an empty array if nothing is there
}

let pastVideoPicks = JSON.parse(localStorage.getItem("videoPicks")) //makes an array

if (pastVideoPicks===null) {
    pastVideoPicks = [] //makes sure we only create an empty array if nothing is there
}



//function to check if video is embeddable (this isn't working but not sure why. This value might be deprecated)

// async function isEmbeddable(videoID) {
//     var isEmbeddable
//     console.log(videoID)
//     var embedURL = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoID}&key=${youTubeAPIKey}`
//     await fetch(embedURL) //returns response
//     .then(function (response) {
//         return response.json()
    
//     }) .then(function (data) {

//         console.log(data)
//         if (data.items[0].status.embeddable) {
//             isEmbeddable = true
//         } else {
//             isEmbeddable = false
//         } //will return true or false
//     })
//     console.log(isEmbeddable)
//     return isEmbeddable
// }

// function to fetch youtube api


function getVideo(search) {
    console.log(search)
    videoSearchResults.textContent = '' //clear out all text content
    search = encodeURIComponent(search) //converts it so that website will take it
    var videoResults = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${youTubeAPIKey}`
    fetch(videoResults) //returns response
    .then(function (response) {
        return response.json()
    
    }) .then(function (data) {
        console.log(data)
        var embedKey = data.items[0].id.videoId
        console.log(embedKey)
        for (var i = 0; i < data.items.length; i++) {
            //Creating a h3 element and a p element
            var nameOfVideo = document.createElement('h6');
            var thumbNail = document.createElement('img')
                    
            //Setting the text of the h3 element and p element.
            nameOfVideo.textContent = data.items[i].snippet.title
            thumbNail.src = data.items[i].snippet.thumbnails.default.url
            videoSearchResults.appendChild(nameOfVideo)
            videoSearchResults.appendChild(thumbNail)
            
            thumbNail.addEventListener("click", videoClickHandler) //adds event listener to each gif
            thumbNail.setAttribute('data-video', embedKey) //creates a data attribute with nameOfVideo but really I should be using whatever goes in iframe

            }              
    })
}
                
 // function to fetch gif api
 var gifData = {};

 function getGif(gif) {
    console.log(gif)
    gifSearchResults.textContent = '' //clear out all text content
    gif = encodeURIComponent(gif) //converts it so that website will take it
    var gifResults = `https://api.giphy.com/v1/gifs/search?q=${gif}&key=${giphyAPIKey}`
    fetch(gifResults) //returns response
    .then(function (response) {
        return response.json()
    
    }) .then(function (data) {
        gifData = data;
        console.log(data);
            //var thumbNail = document.createElement('img')
            for (var i = 0; i < 5; i++) {
                //Creating a h3 element and a p element
                var gif = document.createElement('img');
                //Setting the text of the h3 element and p element.
                gif.src = gifData.data[i].images.fixed_height_small.url
                gifSearchResults.appendChild(gif)
                gif.setAttribute('data-gif', gif.src) //creates a data attribute to url of gif
                gif.addEventListener("click", gifClickHandler) //adds event listener to each gif
                
              }
        })             
 }

 ///event listeners

 var pickedGif

 var gifClickHandler = function (event) { //only purpose of this is to define variable for gif
    console.log("Gif clicked")
    if (pickedGif) {
        pickedGif = '' //clears out if someone already chose one
    }
    pickedGif = event.target.getAttribute('data-gif');
    console.log(pickedGif)
    if (pickedVideo) {
        renderVideo(pickedGif, pickedVideo) //runs other function so long as both variables are defined
    }
}

  var pickedVideo

  var videoClickHandler = function (event) { //only purpose of this is to define pickedVideo
    console.log("Video clicked")
    // if (pickedVideo) {
    //     pickedVideo = '' //clears out if someone already chose one
    // }
    pickedVideo = event.target.getAttribute('data-video'); //embed key of video you pick
    console.log(pickedVideo)
    if (pickedGif) {
        renderVideo(pickedGif, pickedVideo) //runs other function so long as both variables are defined
    }
    //embeddable might be deprecated, actually not entirely certain why this code isn't working
    // if (isEmbeddable(pickedVideo) && (pickedGif)) { //runs embedkey into function
    //         console.log("working")
    //         renderVideo(pickedGif, pickedVideo)
    // } else {
    //     videoErrorMessage.textContent = "Sorry, this video is not embeddable. Please choose another one"
    //     videoErrorMessage.classList.add("red") //text color red
    // }
    
  };

//create a promise that adds the autoplay and mute on there and then unmutes itself
//puts the gif on top again

//create another function that takes parameters pickedGif and pickedVideo, which will render video
function renderVideo(pickedGif, pickedVideo) {
    console.log("function runs")
    //render gif
    gifInVideo.src = pickedGif //value of attribute, url of gif
    console.log(gifInVideo.src)
    //render video
    backgroundSound.src = `https://www.youtube.com/embed/${pickedVideo}?enablejsapi=1` 
    console.log(backgroundSound.src)
    onYouTubeIframeAPIReady(pickedVideo) //will define player
}

//function to play video

//basically I just need external buttons to play and pause the video 
//then I can put the gif over it

var playVideoElement = document.getElementById("play-video")

//from YouTube docs

$(document).ready(function(){
    var iframeCount = $('iframe');
        iframeCount.each(function (index) {
            $(this).siblings('.play-btn').attr('id', 'ytposter-' + index);
            $(this).attr('id', 'ytplayer-' + index);
        });
});

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var yt_player = [], playButton = [];

// 2. This function enables you to use the API on your page
window.onYouTubeIframeAPIReady = function() {
  $('iframe').each(function (index, value) {
    yt_player[index] = new YT.Player(value.id, {
      events: {
        'onReady': onPlayerReady(index, value),
        'onStateChange': onPlayerStateChange
      }});
  });
}

// 3. The API will call this function when the video player is ready.
function onPlayerReady(index, value) {
  var ytplayerid = value.id,
        ytplaybuttonid = $(value).siblings('.play-btn').attr('id');
  
  playButton[index] = document.getElementById(pickedVideo);
  playButton[index].addEventListener("click", function() {
    $("#"+pickedVideo).hide();
    $("#"+pickedVideo).siblings('img').hide();

    var ytvideoid = $("#"+pickedVideo).siblings('iframe').data('ytvideoid');

    if (window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
      yt_player[index].mute();
    }
    yt_player[index].playVideo();
    $("#"+ytplayerid).show();

  });
  var pauseButton = document.getElementById("pause-video");
  pauseButton.addEventListener("click", function() {
    yt_player[index].pauseVideo();
  });
}
  
// 4. The API calls this function when the player's state changes.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      $('#pause-video').show();
    }
  }

// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;

// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('final-video', {
//         videoId: pickedVideo,
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
//     playVideoElement.addEventListener("click", playVideoBtn)
//     playVideoElement.addEventListener("click", playVideoBtn)
//     function playVideoBtn() {
//         playVideoElement.innerHTML = "Pause Video"
//         playVideoElement.removeEventListener("click", playVideoBtn)
//         playVideoElement.addEventListener("click", pauseVideoBtn)
//         player.pauseVideo()
//     }

//     function pauseVideoBtn() {
//         playVideoElement.innerHTML = "Play Video"
//         playVideoElement.removeEventListener("click", pauseVideoBtn)
//         playVideoElement.addEventListener("click", playVideoBtn)
//         player.playVideo()
//     }
// }
// console.log(player)





// function pauseVideoBtn() {
//     playVideoElement.innerHTML = "Play Video"
//     playVideoElement.removeEventListener("click", pauseVideoBtn)
//     playVideoElement.addEventListener("click", playVideoBtn)
//     player.playVideo()
// }

// function playVideoBtn() {
//     playVideoElement.innerHTML = "Pause Video"
//     playVideoElement.removeEventListener("click", playVideoBtn)
//     playVideoElement.addEventListener("click", pauseVideoBtn)
//     player.pauseVideo() //console is saying player is undefined
// }

 //function for search bar and calls function to get video

function videoSearchSubmit(event) {
    console.log('clicked')
    event.preventDefault() //event is deprecated under some circumstances, so e is preferred
    if (!videoInput.value) { //so that it doesn't do anything if there is no input
        return
    } else {
        var video = videoInput.value.trim() //searchInput is an HTML element and so .value is input
        //.trim bc white space can sometimes mess up databases
        getVideo(video) //calls function as video as parameter
        videoInput.value = '' //clears search box by creating empty string
    }
}

// search bar for gif

function gifSearchSubmit(event) {
    console.log('clicked')
    event.preventDefault() //event is deprecated under some circumstances, so e is preferred
    if (!gifInput.value) { //so that it doesn't do anything if there is no input
        return
    } else {
        var gif = gifInput.value.trim() //searchInput is an HTML element and so .value is input
        //.trim bc white space can sometimes mess up databases
        getGif(gif) //calls function with gif as parameter
        gifInput.value = '' //clears search box by creating empty string
    }
}

// create video local storage 
function createVideo() {
    //but at some point we also need to push chosen value onto these arrays in other functions
    localStorage.setItem("videoPicks", JSON.stringify(pastVideoPicks))
    localStorage.setItem("gifPicks", JSON.stringify(pastGifPicks))
}

//previous video button storage
function previousVideo() {
    previousVideoResults.textContent = "Last 5 Videos"
    previousVideoResults.classList.add("h5", ".text-primary")
    var listOfVideos = document.createElement('ul') //creates box for list
    previousVideoResults.appendChild(listOfVideos) //appends it to search container
    for (i=0; i<5; i++) { //actually doesn't matter which array we use bc they should store same amount
        if (pastGifPicks.length>5) {
          pastGifPicks.shift() //removes first element  
          pastVideoPicks.shift()
        }
        var pastVideo = document.createElement('li')
        pastVideo.classList.add("list-group-item")
        pastVideo.addEventListener("click", buttonClickHandler)
        pastVideo.textContent = histoire[i]
        pastVideo.setAttribute('data-city', histoire[i])
        console.log(pastVideo.getAttribute('data-city'))
        listOfCities.appendChild(pastVideo)
    }
}

//event listener for video button 

getVideoBtn.addEventListener("submit", videoSearchSubmit) //button inside of form needs to be submit


//event listener for gif button

getGifBtn.addEventListener("submit", gifSearchSubmit)

//event listener for create video button

getCreateVideoBtn.addEventListener("submit",createVideo)

//event listener for previous videos button

getPreviousVideoBtn.addEventListener("submit",previousVideo)

// put an attribute on search results and then do event.target to determine
// which one, look at 6.21

//going to have to embed youtube video in html
//getting back html and have boiler plate
//have a redirect