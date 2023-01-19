//API Keys

//priorities
//outlines for clicked


//desires
//volume button toggle
//speed up bottons toggle
//video length toggle

//finishing up
//ryan formatting
//clean up code


youTubeAPIKey = "AIzaSyAhj_Zz-hBzSR0xyA5VtmdLDG6Of19XaCA"
giphyAPIKey = "Tz8BYCiyjjd3A55xytpungY3SGFNZkod"

//will have to swap giphy API key once deployed

//DOM Elements

var getVideoBtn = document.getElementById("video-form")
var getGifBtn = document.getElementById("gif-form")
var getCreateVideoBtn = document.getElementById("save-video")
var getPreviousVideoBtn = document.getElementById("previous-video")

var videoInput = document.getElementById("video")
var gifInput = document.getElementById("gif")

var videoSearchResults = document.getElementById("video-results")
var gifSearchResults = document.getElementById("gif-results")
var previousVideoResults = document.getElementById("previous-results")

var gifInVideo = document.getElementById("gif-for-video")
//var backgroundSound = document.getElementById("youtube-video")
var saveVideoErrorMessage = document.getElementById("save-error")
var controlsSection = document.getElementById("controls")
var videoContainer = document.getElementById("video-container")
var videoErrorMessage = document.getElementById("video-error-message")

//variables

let pastGifPicks = JSON.parse(localStorage.getItem("gifPicks")) //makes an array

if (pastGifPicks===null) {
    pastGifPicks = [] //makes sure we only create an empty array if nothing is there
}

//this contains name of the videos to render local storage

let pastVideoPicks = JSON.parse(localStorage.getItem("videoPicks")) //makes an array

if (pastVideoPicks===null) {
    pastVideoPicks = [] //makes sure we only create an empty array if nothing is there
}

//this contains actual video ids to repopulate local storage

let embedKeyz = JSON.parse(localStorage.getItem("embedKeys")) //makes an array

if (embedKeyz===null) {
    embedKeyz = [] //makes sure we only create an empty array if nothing is there
}

// function to fetch youtube api

let titles = {} //globally defining an object to be used for local storage


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
        videoDoesntWork.innerHTML = '' // i want this error to clear everytime i search
        for (var i = 0; i < data.items.length; i++) {
            var embedKey = data.items[i].id.videoId
            var nameOfVideo = document.createElement('h6');
            var thumbNail = document.createElement('img')
            nameOfVideo.textContent = data.items[i].snippet.title
            console.log(nameOfVideo.textContent)
            thumbNail.src = data.items[i].snippet.thumbnails.default.url
            videoSearchResults.appendChild(nameOfVideo)
            videoSearchResults.appendChild(thumbNail)
            titles[embedKey] = nameOfVideo.textContent //theoretically for each i, this should push the title onto array
            thumbNail.setAttribute('data-video', embedKey) //creates a data attribute with nameOfVideo but really I should be using whatever goes in iframe
            thumbNail.addEventListener("click", videoClickHandler) //adds event listener to each gif
            console.log(embedKey)

            }              
    })
}
                
 // function to fetch gif api

 var gifData = {}; //something Jason recommended to make finding data in object easier

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
            for (var i = 0; i < 5; i++) {
                var gif = document.createElement('img');
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
    if (document.getElementById('gif-picked')) {
        document.getElementById('gif-picked').removeAttribute('id','video-picked')
    }
    pickedGif = ''
    gifInVideo.removeAttribute('src')
    event.target.setAttribute('id', 'gif-picked')
    pickedGif = event.target.getAttribute('data-gif');
    console.log(pickedGif)
    gifInVideo.src = pickedGif 
}

  var pickedVideo //defined globally
 
  var videoClickHandler = function (event) { //only purpose of this is to define pickedVideo
    console.log("Video clicked")
    if (document.getElementById('video-picked')) {
        document.getElementById('video-picked').removeAttribute('id','video-picked')
    }
    pickedVideo = '' //clears out variable
    pickedVideo = event.target.getAttribute('data-video'); //embed key of video you pick
    event.target.setAttribute('id', 'video-picked')
    console.log(pickedVideo)
    onYouTubePlayerAPIReady(pickedVideo)
    }


//function to play video

// Replace the id='player' element with an <iframe> and
// YouTube player after the API code downloads.
var player;

//I know this function is working, I just don't know how to dynamically
//add video ID and also add play and pause buttons
function onYouTubePlayerAPIReady(pickedVideo) {
  videoDoesntWork.innerHTML = ''
  console.log(pickedVideo)
  if (player) {
    player.destroy()
  }
  player = new YT.Player('player', {
    videoId: pickedVideo, //input is working, sort of
    //videoId: 'M7lc1UVf-VE',
    events: {
        'onReady': onPlayerReady,
        'onError': showErrorMessage

    }
  });
}

var videoDoesntWork = document.createElement('h6')

function showErrorMessage() {
    videoDoesntWork.innerHTML = "This video doesn't seem to be working. There is either an issue with your network or you picked a video that is not embeddable. Please pick another video or try again at another time" //this error message
    videoErrorMessage.appendChild(videoDoesntWork)
}

//not usually a network issue, could be country issue or deleted video

function onPlayerReady(event) {

    console.log(player.getPlayerState())
    controlsSection.classList.remove("hide") //shows buttons once video displays
    getCreateVideoBtn.classList.remove("hide")
    videoContainer.classList.remove("hide")


    // bind events
    var playButton = document.getElementById("play-button");
    playButton.addEventListener("click", function() {
        player.playVideo();
    });

    var pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", function() {
        player.pauseVideo();
    });

    var muteButton = document.getElementById("mute-button");
    muteButton.addEventListener("click", function(){
        if (player.isMuted()) { //if it's muted, unmute it
            muteButton.innerHTML = ''
            player.unMute();
            muteButton.innerHTML = 'UNMUTE'
        } else { //if its unmuted, mute it
            muteButton.innerHTML = ''
            player.mute();
            muteButton.innerHTML = 'MUTE'
        }
    })

}

//loads iframe api

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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

// search bar for gif, pretty much same as other function

function gifSearchSubmit(event) {
    console.log('clicked')
    event.preventDefault() 
    if (!gifInput.value) { 
        return
    } else {
        var gif = gifInput.value.trim()
        getGif(gif) 
        gifInput.value = ''
    }
}

// create video to save to local storage 

var saveVideoError = document.createElement("h6")
saveVideoError.innerHTML = ""
saveVideoErrorMessage.appendChild(saveVideoError)

//trying to get it to return out of function, so it doesn't save
//multiple but haven't gotten that to work yet

function createVideo() {
    for (i=0; i<pastGifPicks.length; i++) {
        if (pastGifPicks[i]===pickedGif && embedKeyz[i]===pickedVideo) {
            saveVideoError.innerHTML = "You already saved this video! Check Previous Videos"
            return
        }
        
    }
    if (pickedVideo && pickedGif) {
        console.log(titles[pickedVideo])
        pastVideoPicks.push(titles[pickedVideo]) //should return the name of the video
        pastGifPicks.push(pickedGif)
        embedKeyz.push(pickedVideo)
        localStorage.setItem("videoPicks", JSON.stringify(pastVideoPicks))
        localStorage.setItem("gifPicks", JSON.stringify(pastGifPicks))
        localStorage.setItem("embedKeys", JSON.stringify(embedKeyz))
        saveVideoError.innerHTML = "Success! You saved your creation!"
    } else {
        saveVideoError.innerHTML = "Sorry, you have to pick a Gif and a video to save your creation!"
    }

}


//previous video button to render storage
function previousVideo() {
    console.log(titles)
    previousVideoResults.textContent = "Your Saved Videos" 
    previousVideoResults.setAttribute("style", "color:white; font-size:1.2rem")
    var listOfVideos = document.createElement('ol') //creates box for list
    previousVideoResults.appendChild(listOfVideos) //appends it to search container
    for (i=0; i<pastGifPicks.length; i++) { //actually doesn't matter which array we use bc they should store same amount
        if (pastGifPicks.length>5) {
          pastGifPicks.shift() //removes first element  
          pastVideoPicks.shift()
        }
        var title = document.createElement('h6')
        title.textContent = pastVideoPicks[i]
        var pastGif = document.createElement('li') //creates a list element
        var pastGifThumbnail = document.createElement('img')
        pastGifThumbnail.addEventListener("click", renderPastVideo)
        pastGifThumbnail.setAttribute('data-gif', pastGifPicks[i])
        pastGifThumbnail.setAttribute('data-video', embedKeyz[i]) //should store embed key
        pastGifThumbnail.src = pastGifPicks[i]
        pastGif.appendChild(title)
        pastGif.appendChild(pastGifThumbnail)
        listOfVideos.appendChild(pastGif) //this should put them next to each other
        function renderPastVideo(event) {
            //renders past video
            pickedVideo = '' //clears out variable
            pickedVideo = event.target.getAttribute('data-video'); //embed key of video you pick
            console.log(pickedVideo)
            onYouTubePlayerAPIReady(pickedVideo)
            //renders past gif
            pickedGif = ''
            gifInVideo.removeAttribute('src')
            pickedGif = event.target.getAttribute('data-gif');
            console.log(pickedGif)
            gifInVideo.src = pickedGif 
        }
    }
}

//event listener for video button 

getVideoBtn.addEventListener("submit", videoSearchSubmit) //button inside of form needs to be submit


//event listener for gif button

getGifBtn.addEventListener("submit", gifSearchSubmit)

//event listener for create video button

getCreateVideoBtn.addEventListener("click",createVideo)

//event listener for previous videos button

getPreviousVideoBtn.addEventListener("click",previousVideo)


//tests if HTML5 is supported in browser
// var videoElement = document.createElement('video');
// if (videoElement && videoElement.canPlayType && (videoElement.canPlayType('video/mp4; codecs="avc1.42001E, mp4a.40.2"') || videoElement.canPlayType('video/webm; codecs="vp8.0, vorbis"'))) {
//     console.log("it works!") //logged
// }

//The window.postMessage() method safely enables cross-origin 
//communication between Window objects; e.g., between a page and a
// pop-up that it spawned, or between a page and an iframe embedded 
//within it.
