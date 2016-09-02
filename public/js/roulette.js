'use strict'
$( document ).ready(function() {
//-------------------------------------------------------------------------------------------
// Initializing the SoundCloud SDK 3.0 
//-------------------------------------------------------------------------------------------

  SC.initialize({
    client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
    redirect_uri: 'http://cloudsounds.dyndns.org/callback.html',
    //oauth_token : '1-241613-226893814-958bd700c744e'
  });
  
//-------------------------------------------------------------------------------------------
//Setting up all the Global Variables
//-------------------------------------------------------------------------------------------

var welcome = $('#welcome');
var target = $('#target');
var myTarget = $('#target2');
var myCheck = $('#my-check');
var clickTrack = $('#trackButton');
var myTracks = $('#my-tracks');
var cloudButton = $('#cloud');
var storage=$.localStorage;
var newID;
//-------------------------------------------------------------------------------------------
// here we are checking to see if localStorage has our oauth_token 
//-------------------------------------------------------------------------------------------

if(storage.isSet('oauth_token')){
  cloudButton.hide();
  console.log("we have a token and it is " + storage.get('oauth_token'));
  
  //reset SC.initialize
        SC.initialize({
        client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
        redirect_uri: 'http://cloudsounds.dyndns.org/callback.html',
        oauth_token : storage.get('oauth_token')
        });
        
        SC.get('/me').then(function(me) {
        welcome.show();
        //welcome.text('Hello, ' + me.username +" , " + 'Your userID is ' + me.id );
        welcome.text('Hello, ' + me.username);       
        newID = me.id;
        target.show();
      });
        
  
}else{
  console.log("We don't have a token in localstorage");
  SC.connect().then(function(response) {
        
        storage.remove('oauth_token');
        storage.set('oauth_token', response.oauth_token);
        
        //reset SC.initialize
        SC.initialize({
        client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
        redirect_uri: 'http://cloudsounds.dyndns.org/callback.html',
        oauth_token : storage.get(oauth_token)
        });
        // start to return user information
        return SC.get('/me');
        }).then(function(me) {
        cloudButton.fadeOut("slow");
        welcome.show();
        welcome.text('Hello, ' + me.username +"<br>" + 'Your userID is ' + me.id );
        newID = me.id;
        clickTrack.fadeIn("slow");
        target.show();
      }).then(function(){
        console.log(oauth_token);
      });  
  
} 

//-------------------------------------------------------------------------------------------
//In this section we want to start to create buttons for different events that will happen on the page
//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------
//Random Tracks Button sets up an event handler on the button to grab random track data from SC
//-------------------------------------------------------------------------------------------
  var randomTracksTitle;
  // var randomTracksURL;
  clickTrack.click(function(event){
  event.preventDefault();
  
  var scProm = SC.get('/tracks', { limit: 5 }).then(function(response){
    for(var i = 0 ; i < response.length; i++){
      var trackDiv = $('<div class="player">');
      target.append(trackDiv);
      randomTracksTitle = response[i].title;
      console.log(randomTracksTitle);
      //randomTracksURL = response[i].uri;
      SC.oEmbed(response[i].uri, { autoplay: false, maxheight: 150, maxwidth: 196 }).then(generateOmbed(trackDiv));
    }
    
      });
  });
  
  function generateOmbed(div){
     return function(embed){
       div.append(embed.html);
       var randomFavs = $(`<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"><span class="checkbox-material"><span class="check"></span></span>${randomTracksTitle}</label></div>`);
       div.append(randomFavs);
       
     };
  }
  
//-------------------------------------------------------------------------------------------
//My Tracks Button sets up an event handler on the button to grab random track data from SC
//-------------------------------------------------------------------------------------------
var myTracksTitle;
var myTracksURL;
myTracks.click(function(event){
  event.preventDefault();
  
  var scProm = SC.get(`/users/${newID}/playlists`, { limit: 20 }).then(function(response){
    for(var i = 0 ; i < response.length; i++){
      var trackDiv = $('<div class="player">');
      myTracksTitle = response[i].title;
      myTracksURL = response[i].uri;
      trackDiv.innerText = ("Track title " + response[i].title);
      myTarget.append(trackDiv);
      //Setup the player embed on the div
      SC.oEmbed(response[i].uri, { autoplay: false, maxheight: 175, maxwidth: 200 }).then(generateOmbed(trackDiv));
    }
    
      });
  });
  
  function generateOmbed(div){
     return function(embed){
       div.append(embed.html);
       var myFavs = $(`<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"><span class="checkbox-material"><span class="check"></span></span>${myTracksTitle}</label></div>`);
       div.append(myFavs);
     }
  }



//Notes:
//trackDiv.innerText = ("Track title " + response[i].title);
//target.append(trackDiv.innerText);

// Closing Tag for Body Onload----------------------------------------------------------------------------------------  
 });


 