youTubeAPIKey = "AIzaSyAhj_Zz-hBzSR0xyA5VtmdLDG6Of19XaCA"
giphyAPIKey = "Tz8BYCiyjjd3A55xytpungY3SGFNZkod"

var getVideoBtn = document.getElementById("video-form")
var getGifBtn = document.getElementById("gif-form")

var videoInput = document.getElementById("video")
var gifInput = document.getElementById("gif")

var videoSearchResults = document.getElementById("video-results")


// function to fetch youtube api

function getVideo(search) {
    console.log(search)
    search = encodeURIComponent(search) //converts it so that website will take it
    var videoResults = `https://youtube.googleapis.com/youtube/v3/search?q=${search}&key=${youTubeAPIKey}`
    fetch(videoResults) //returns response
    .then(function (response) {
        return response.json()
    
    }) .then(function (data) {

        console.log(data)
        var nameOfVideo = document.createElement('h6')
            //var thumbNail = document.createElement('img')
        nameOfVideo.textContent = data.items.etag
        



        })
                

 }

 // function to fetch gif api

 function getGif(gif) {
    console.log(gif)
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
        getVideo(search) //calls function as city as parameter
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
        getGif(gif) //calls function as city as parameter
        gifInput.value = '' //clears search box by creating empty string
    }
}

//event listener for video button 

getVideoBtn.addEventListener("submit", videoSearchSubmit) //button inside of form needs to be submit


//event listener for gif button

getGifBtn.addEventListener("submit", gifSearchSubmit)

// put an attribute on search results and then do event.target to determine
// which one, look at 6.21

//going to have to embed youtube video in html
//getting back html and have boiler plate
//have a redirect