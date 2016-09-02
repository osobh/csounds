'use strict'
$(document).ready(function() {
    var config = {
    apiKey: "AIzaSyDvVWNlfyQEwpPyelSTqITdtCGnhydlAp0",
    authDomain: "flickering-heat-1671.firebaseapp.com",
    databaseURL: "https://flickering-heat-1671.firebaseio.com",
    storageBucket: "flickering-heat-1671.appspot.com",
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  
  $('#fire-grab').click(function(){
    
    console.log("You are sending data to firebase!!");
    
    function writeUserData(userName, tracks) {
        firebase.database().ref('users/').set({
          username: userName,
          tracks: { id: trackID }
          });
    }
    
    writeUserData("omar", "none@gmail.com")
    
    
  })
  
  
});