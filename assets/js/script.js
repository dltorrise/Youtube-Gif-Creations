//API Keys

youTubeAPIKey = "AIzaSyAhj_Zz-hBzSR0xyA5VtmdLDG6Of19XaCA"
giphyAPIKey = "Tz8BYCiyjjd3A55xytpungY3SGFNZkod"

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
var backgroundSound = document.getElementById("youtube-video")
var saveVideoError = document.getElementById("save-error")

//var videoErrorMessage = document.getElementById("video-error")


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
      
        for (var i = 0; i < data.items.length; i++) {
            var embedKey = data.items[i].id.videoId
            //Creating a h3 element and a p element
            var nameOfVideo = document.createElement('h6');
            var thumbNail = document.createElement('img')
                    
            //Setting the text of the h3 element and p element.
            nameOfVideo.textContent = data.items[i].snippet.title
            console.log(nameOfVideo.textContent)
            thumbNail.src = data.items[i].snippet.thumbnails.default.url
            videoSearchResults.appendChild(nameOfVideo)
            videoSearchResults.appendChild(thumbNail)

            titles[embedKey] = nameOfVideo.textContent //theoretically for each i, this should push the title onto array
            thumbNail.setAttribute('data-video', embedKey) //creates a data attribute with nameOfVideo but really I should be using whatever goes in iframe
            thumbNail.addEventListener("click", videoClickHandler) //adds event listener to each gif


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
    pickedGif = ''
    gifInVideo.removeAttribute('src')
    pickedGif = event.target.getAttribute('data-gif');
    console.log(pickedGif)
    gifInVideo.src = pickedGif 
}

  var pickedVideo

  var videoClickHandler = function (event) { //only purpose of this is to define pickedVideo
    console.log("Video clicked")
    pickedVideo = '' //clears out variable
    backgroundSound.removeAttribute('src') //when you click it a second time
    //console.log(backgroundSound.src)
    pickedVideo = event.target.getAttribute('data-video'); //embed key of video you pick
    console.log(pickedVideo)
    backgroundSound.src = `https://www.youtube.com/embed/${pickedVideo}?enablejsapi=1` 
    }

    //embeddable might be deprecated, actually not entirely certain why this code isn't working
    // if (isEmbeddable(pickedVideo) && (pickedGif)) { //runs embedkey into function
    //         console.log("working")
    //         renderVideo(pickedGif, pickedVideo)
    // } else {
    //     videoErrorMessage.textContent = "Sorry, this video is not embeddable. Please choose another one"
    //     videoErrorMessage.classList.add("red") //text color red
    // }


//function to play video

// global variable for the player
var player;

//this function gets called when API is ready to use
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player2', {
        videoId: String(pickedGif),
        //videoId: pickedVideo, //should play picked video
        events: {
          'onReady': onPlayerReady,
          //'onStateChange': onPlayerStateChange
        }
    });
  }

function onPlayerReady(event) {

    // bind events
    var playButton = document.getElementById("play-button");
 
    playButton.addEventListener("click", function() {
        console.log('play button clicked')
        player.playVideo();
    });

    var pauseButton = document.getElementById("pause-button");

    pauseButton.addEventListener("click", function() {
        console.log('pause button clicked')
        player.pauseVideo();
    });

    var stopButton = document.getElementById("stop-button");
   
    stopButton.addEventListener("click", function() {
        console.log('stop button clicked')
        player.stopVideo();
    });

}

// Inject YouTube API script
// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//The window.postMessage() method safely enables cross-origin 
//communication between Window objects; e.g., between a page and a
// pop-up that it spawned, or between a page and an iframe embedded 
//within it.

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
var saveVideoError = document.createElement("h6")
saveVideoError.innerHTML = ""
document.body.appendChild(saveVideoError)

function createVideo() {
    if (pickedVideo && pickedGif) {
        console.log(titles[pickedVideo])
        pastVideoPicks.push(titles[pickedVideo]) //should return the name of the video
        pastGifPicks.push(pickedGif)
        localStorage.setItem("videoPicks", JSON.stringify(pastVideoPicks))
        localStorage.setItem("gifPicks", JSON.stringify(pastGifPicks))
        saveVideoError.innerHTML = "Success! You saved your creation!"
    } else {
        saveVideoError.innerHTML = "Sorry, you have to pick a Gif and a video to save your creation!"
    }

}


//previous video button storage
function previousVideo() {
    console.log(titles)
    previousVideoResults.textContent = "Last 5 Videos"
    console.log("previous videos clicked")
    //previousVideoResults.classList.add("h5", ".text-primary")
    var listOfVideos = document.createElement('ol') //creates box for list
    previousVideoResults.appendChild(listOfVideos) //appends it to search container
    for (i=0; i<pastGifPicks.length; i++) { //actually doesn't matter which array we use bc they should store same amount
        if (pastGifPicks.length>5) {
          pastGifPicks.shift() //removes first element  
          pastVideoPicks.shift()
        }
        // var pastVideo = document.createElement('li')
        // var pastVideoThumbnail = document.createElement('img')
        // //pastVideo.classList.add("list-group-item")
        // pastVideo.addEventListener("click", gifClickHandler) //so you can click on it
        // pastVideo.setAttribute('data-video', pastVideoPicks[i]) 
        // pastVideoThumbnail.src = ///how am I going to do this without another fetch?
        // console.log(pastVideo.getAttribute('data-video'))
        // listOfVideos.appendChild(pastVideo)

        var title = document.createElement('h6')
        title.textContent = pastVideoPicks[i]
        var pastGif = document.createElement('li') //creates a list element
        var pastGifThumbnail = document.createElement('img')
        pastGifThumbnail.addEventListener("click", videoClickHandler)
        pastGifThumbnail.setAttribute('data-gif', pastGifPicks[i])
        pastGifThumbnail.src = pastGifPicks[i]
        pastGif.appendChild(title)
        pastGif.appendChild(pastGifThumbnail)
        listOfVideos.appendChild(pastGif) //this should put them next to each other
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

// put an attribute on search results and then do event.target to determine
// which one, look at 6.21

//going to have to embed youtube video in html
//getting back html and have boiler plate
//have a redirect

