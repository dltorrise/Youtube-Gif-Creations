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


//variables

let pastGifPicks = JSON.parse(localStorage.getItem("gifPicks")) //makes an array

if (pastGifPicks===null) {
    pastGifPicks = [] //makes sure we only create an empty array if nothing is there
}

let pastVideoPicks = JSON.parse(localStorage.getItem("videoPicks")) //makes an array

if (pastVideoPicks===null) {
    pastVideoPicks = [] //makes sure we only create an empty array if nothing is there
}

var gifPick
var videoPick


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
            //var thumbNail = document.createElement('img')
            for (var i = 0; i < data.items.length; i++) {
                //Creating a h3 element and a p element
                var nameOfVideo = document.createElement('h6');
                var thumbNail = document.createElement('img')
        
                //Setting the text of the h3 element and p element.
                nameOfVideo.textContent = data.items[i].snippet.title
                thumbNail.src = data.items[i].snippet.thumbnails.default.url
                var embedKey = data.items[i].id.videoId
                videoSearchResults.appendChild(nameOfVideo)
                videoSearchResults.appendChild(thumbNail)

                thumbNail.addEventListener("click", videoClickHandler) //adds event listener to each gif
                thumbNail.setAttribute('data-video', embedKey) //creates a data attribute with nameOfVideo but really I should be using whatever goes in iframe
                
        
                //Appending the dynamically generated html to the div associated with the id="users"
                //Append will attach the element as the bottom most child.

                //local storage - push value of chosen video onto array
                
                
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
                
                
        
                //Appending the dynamically generated html to the div associated with the id="users"
                //Append will attach the element as the bottom most child.
                
              }
            //local storage - push value of chosen gif onto array

        



        })
                

 }

 var pickedGif

 var gifClickHandler = function (event) { //only purpose of this is to define variable for gif
 //probably don't need this if but will keep it here for now
    console.log("Gif clicked")
    pickedGif = event.target.getAttribute('data-gif');
    console.log(pickedGif)
    if (pickedVideo) {
        renderVideo() //runs other function so long as both variables are defined
    }
    
  };

  var pickedVideo

  var videoClickHandler = function (event) { //only purpose of this is to define pickedVideo
    console.log("Video clicked")
    pickedVideo = event.target.getAttribute('data-video');
    console.log(pickedVideo)
    if (pickedGif) {
        renderVideo()
    }
    
  };


//create another function that takes parameters pickedGif and pickedVideo, which will render video
//pickedGif and pickedVideo are data attributes
function renderVideo(pickedGif, pickedVideo) {
    console.log("function runs")
    //render gif
    gifInVideo.src = pickedGif //value of attribute, url of gif
    console.log(gifInVideo.src)
    //render video
    backgroundSound.src = `https://www.youtube.com/embed/${pickedVideo}`
    console.log(backgroundSound.src)
}
 //https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys

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