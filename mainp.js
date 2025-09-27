  let currentsong = new Audio();
  let songs;
  let currfolder;
 // let folder;
  function secondsToMMSS(Seconds) {
    if(isNaN(Seconds)|| Seconds<0){
        return "Invalid input";
    }
  const minutes = Math.floor(Seconds / 60);
  const remainingseconds = Math.floor(Seconds % 60);

  // Pad both minutes and seconds to 2 digits
  const mm = String(minutes).padStart(2, '0');
  const ss = String(remainingseconds).padStart(2, '0');

  return `${mm}:${ss}`;
}
async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    //console.log("Raw Response:", response);

    //HTML को parse करके links निकालो
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
     songs = [];

    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

// SOW ALL THE SONG ON THE PLAY LIST
 let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
 songUL.innerHTML=" "
 for (const song of songs) {
    songUL.innerHTML= songUL.innerHTML + `<li>  <img class ="invart" src = "music.svg" alt="">
            
    <div class="info">
              <div> ${song.replaceAll("%20"," " )}</div>
              <div>HSachan</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
            <img class ="invart" src="img/play.svg" alt="">
            </div>
           
    </li>`;
      
 }

 // Attach an event listener to each song

 let list = Array.from(document.querySelector(".songList")
 .getElementsByTagName("li"))     // every list axis by tagName
 list.forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
    
 })
 return songs;
}
const playMusic=(track, pause=false)=>{
    //let audio =new Audio("/songs/" + track)
     currentsong.src= `/${currfolder}/` + track
     if(!pause){
        currentsong.play()
        play.src = "img/pause.svg";
     }
    currentsong.play();

    
     
     // SONGINFO ME SONG NAME FILL
     let gana = document.querySelector(".songinfo");
     gana.innerHTML= decodeURI(track);
     
     //SONG DURATION FILL 

     let ganaT= document.querySelector(".songtime");
     ganaT.innerHTML="00:00/00:00"

    }
    //  sorry it is not working 
    async function displayAlboms() {
        let a = await fetch(`http://127.0.0.1:5500/songs/`)
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
       // console.log(div)
      let anchors = div .getElementsByTagName("a")
      //console.log(anchors)
       Array.from (anchors).forEach(  async e =>{
           if (e.href.includes("/songs")){
               console.log(e.href)
             console.log( e.href.split("/").slice(-2)[0])

//             //    //get the   meta data of the folder
//                 let an = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
//                  let response = await an.json();
//                  console.log(response)
//             //
           }
     })
     // Lode the playlist when ever card is clicked

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //console.log(e)
    e.addEventListener("click", async item=>{
        //console.log(item,item.currentTarget.dataset)
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
    })
})
        
  }
async function main(){
  
    // GET THE LIST OF ALL SONGS //(sorry)
    await getsongs("songs/ncs");
 playMusic(songs[0],true)
//console.log(songs);

displayAlboms()
 // ATTACH AC EVENT LISTENER TO PLAY ,NEXT ,PREVIOUS

 play.addEventListener("click",function(){
    if(currentsong.paused){
        currentsong.play()
        play.src = "img/pause.svg"
    }
    else{
        currentsong.pause();
        play.src = "img/play.svg"
    }
 })

// LISTEN FOR TIME UPDATE EVENT
currentsong.addEventListener("timeupdate",()=>{
    //console.log(currentsong.currentTime,currentsong.duration)
    let timeup=document.querySelector(".songtime");
    timeup.innerHTML = `${secondsToMMSS(currentsong.currentTime)}/${secondsToMMSS(currentsong.duration)}`
    let SEEKBAR = document.querySelector(".circle");
    SEEKBAR.style.left= (currentsong.currentTime/currentsong.duration)*100 +"%";
})

// ADD EVENT LISTENER TO SEEKBAR , with our making variable

document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent= (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent + "%";
    currentsong.currentTime= ((currentsong.duration)*percent)/100;
})
//ADD EVENT LISTENER IN hamburgar;
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
})
// add EventListener in close

document.querySelector(".close").addEventListener("click",()=>{
document.querySelector(".left").style.left="-120%";
});

//add Event listner in previous and Next
previous.addEventListener("click", () => {
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);

    if (index > 0) {
        playMusic(songs[index - 1]);
    } else {
        // अगर पहला song है तो आखिरी वाला चला दो (optional loop)
        playMusic(songs[songs.length - 1]);
    }
});


next.addEventListener("click", () => {
    // currentsong.src से current song का नाम निकालो
    let currentTrack = currentsong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentTrack);

    if (index !== -1 && index + 1 < songs.length) {
        playMusic(songs[index + 1]);
    } else {
        // अगर last song है तो फिर से पहला चला दो (optional loop)
        playMusic(songs[0]);
    }
});
//ADD AN Eventlistener in volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    //console.log("setting volume to :",e.target.value);
    currentsong.volume = parseInt(e.target.value)/100
})

// // Lode the playlist when ever card is clicked // its also above initaliz

// Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     //console.log(e)
//     e.addEventListener("click", async item=>{
//         //console.log(item,item.currentTarget.dataset)
//         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
//     })
// })

// add the event listener to mute the track
document.querySelector(".volume >img").addEventListener("click", e=>{
   // console.log(e.target)
    if(e.target.src.includes( "volume.svg")){
        e.target.src= e.target.src.replace ("volume.svg","mute.svg")
        
        currentsong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume= .10;
         document.querySelector(".range").getElementsByTagName("input")[0].value=10;
    }
})


}

main();






