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
    
    SC.initialize({
        client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
        redirect_uri: 'https://g26sounds.herokuapp.com/callback',
    });
    var user = $('#user a');
    var welcome = $('#welcome');
    var target = $('#target');
    var myTarget = $('#target2');
    var fireTarget = $('#target3');
    var myCheck = $('#my-check');
    var clickTrack = $('#trackButton');
    var playlistSubmit = $('#playlist-submit')
    var myTracks = $('#my-tracks');
    var cloudButton = $('#cloud');
    var firePost = $('#my-firelist');
    var fireGet = $('#fire-get')
    var storage = $.localStorage;
    var newID;

    //-----------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------

    if (storage.isSet('oauth_token')) {
        cloudButton.hide();
        console.log("we have a token and it is " + storage.get('oauth_token'));
        SC.initialize({
            client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
            redirect_uri: 'https://g26sounds.herokuapp.com/callback',
            oauth_token: storage.get('oauth_token')
        });
        SC.get('/me').then(function(me) {
            welcome.show();
            user.text('Hello, ' + me.username);
            var userName = me.username;
            localStorage.setItem("user", userName);
            newID = me.id;
            target.show();
        });
    } else {
        console.log("We don't have a token in localstorage");
        SC.connect().then(function(response) {
            storage.remove('oauth_token');
            storage.set('oauth_token', response.oauth_token);
            SC.initialize({
                client_id: "8f3340456fa4c0f8b18414c4a289dd9c",
                redirect_uri: 'https://g26sounds.herokuapp.com/callback',
                oauth_token: storage.get(oauth_token)
            });
            return SC.get('/me');
        }).then(function(me) {
            cloudButton.fadeOut("slow");
            welcome.show();
            welcome.text('Hello, ' + me.username + "<br>" + 'Your userID is ' + me.id);
            var userName = me.username;
            console.log(userName);
            storage.set("user", userName);
            newID = me.id;
            clickTrack.fadeIn("slow");
            target.show();
        }).then(function() {
            console.log(oauth_token);
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    //This is where on random track click event we submit the selected tracks and their info to the soundcloud playlist we create. 
    //------------------------------------------------------------------------------------------------------------------
    playlistSubmit.hide();

    var tracksIDselected = [];
    var playListID;
    var scPlayID;
    clickTrack.click(function(event) {
        event.preventDefault();
        //While we grab the explore stuff let's check to see if the g26 playlist is there
        var scPlayList = SC.get(`/users/${newID}/playlists`).then(function(response) {
            console.log(response);
            if (response.length === 0) {
                console.log("there are no playlists");
                SC.connect().then(function() {
                    SC.post('/playlists', {
                        playlist: {
                            title: 'g26'
                        }
                    }).then(function() {
                        trackScraper(response);
                    })
                });
                console.log("aaaaand we just created the g26Playlist");
                //trackScraper();
                
                
            } else {
                // we want to loop through all the playlists and find the g26 playlist ID
               trackScraper(response);
            } // --End of the Else 
        });
        
         function trackScraper(response){
                for (var i = 0; i < response.length; i++) {
                    //while we are looping we grab any tracks present
                var presentTracks = response[i].tracks;
                for (var key in presentTracks) {
                    var presentListTracks = presentTracks[key].id;
                    var myTracksTitle = presentTracks[key].uri;
                    console.log(presentListTracks);
                    tracksIDselected.push({id: presentListTracks});
                }
                    
                    var playListTitle = response[i].title;
                    if (playListTitle === "g26") {
                        playListID = response[i].id;
                    }
                    console.log(playListTitle);
                }
                storage.set('playID', playListID);
                //Returning the value of the playlistID we stored earlier.
                scPlayID = localStorage.getItem('playID');
                // console.log(scPlayID +"something");
                
    playlistSubmit.click(function(event) {
                    event.preventDefault();
                    $('.track-checkbox:checked').each(function() {
                        //console.log($(this).val());
                        var tracksID = ($(this).val());
                        tracksIDselected.push({
                            id: tracksID
                        });
                    })

                    SC.connect().then(function() {
                        SC.put(`/users/${newID}/playlists/${scPlayID}?oauth_token=${localStorage.getItem('oauth_token')}&client_id=8f3340456fa4c0f8b18414c4a289dd9c`, {
                            playlist:{
                                'tracks': tracksIDselected
                            }
                        }).then(function(response) {
                            console.log(response);
                        });

                    });
                    
                    alert("You have added the tracks to your playlist");
                });
                }
        
        
        //-
        var scProm = SC.get('/tracks', {
            limit: 20
        }).then(function(response) {
            playlistSubmit.fadeIn(1500);
            playlistSubmit.click(function(event) {
                event.preventDefault();
                $('.track-checkbox:checked').each(function() {
                    //console.log($(this).val());
                    var tracksID = ($(this).val());
                    tracksIDselected.push({
                        id: tracksID
                    });
                })
            });
            for (var i = 0; i < response.length; i++) {
                var trackDiv = $('<div class="player">');
                target.append(trackDiv);
                var randomTrack = response[i];
                SC.oEmbed(response[i].uri, {
                    autoplay: false,
                    maxheight: 150,
                    maxwidth: 225
                }).then(generateRandOmbed(trackDiv, randomTrack));
            }
        });
    });

    function generateRandOmbed(div, randomTrack) {
        return function(embed) {
            div.append(embed.html);
            var randomFavs = $(`<div class="checkbox"><label style="width: 70%"><input type="checkbox" name="optionsCheckboxes" value="${randomTrack.id}" class="track-checkbox"><span class="checkbox-material"><span class="check"></span></span>${randomTrack.genre}</label></div>`);
            div.append(randomFavs);
        };
    }
    //------------------------------------------------------------------------------------------------------------------
    // This area is for the click event for the user to call their playlist items
    //------------------------------------------------------------------------------------------------------------------
    firePost.hide();
    myTracks.click(function(event) {
        event.preventDefault();
        firePost.fadeIn(2000);
        var scProm = SC.get(`/users/${newID}/playlists`, {
            limit: 5
        }).then(function(response) {
            for (var i = 0; i < response.length; i++) {
                var ptracks = response[i].tracks;
                for (var key in ptracks) {
                    var tracksUri = ptracks[key].uri;
                    console.log(tracksUri);
                    var tracksID = ptracks[key].id;
                    console.log(tracksID);
                    var myTracksTitle = ptracks[key].genre;
                    var trackDiv = $('<div class="player">');
                    myTarget.append(trackDiv);
                    SC.oEmbed(tracksUri, {
                        autoplay: false,
                        maxheight: 175,
                        maxwidth: 200
                    }).then(generateOmbed(trackDiv, myTracksTitle, tracksID));

                    function generateOmbed(div, myTracksTitle, tracksID) {
                        return function(embed) {
                            div.append(embed.html);
                            var myFavs = $(`<div class="checkbox"><label><input type="checkbox" class="track-checkbox" value="${tracksID}" name="optionsCheckboxes"><span class="checkbox-material"><span class="check"></span></span>${myTracksTitle}</label></div>`);
                            div.append(myFavs);
                        };
                    }
                }
            }
        });
    });
    var fireTracksUri;
    var fireTracksIDselected = {};
    var fireUser = localStorage.getItem("user");
    
    firePost.click(function(){
       event.preventDefault();
                    $('.track-checkbox:checked').each(function() {
                        var fireTracksID = ($(this).val());
                        console.log(fireTracksID);
                        fireTracksIDselected[fireTracksID] = {
                            "upvotevalue": 1,
                            "username": fireUser,
                        }; 
                    });
                   
    console.log(fireTracksIDselected);
    console.log("You are sending data to firebase!!");
    
    function writeUserData(userName, fireTracksID) {
        var playInsert = {};
        playInsert = fireTracksID;
        firebase.database().ref('tracks/').set(playInsert);
    }

    writeUserData(fireUser, fireTracksIDselected)
    alert("Your Selections have been send to the top ten list!");
        
    });

fireGet.click(function(){
    firebase.database().ref('tracks/').on('value', function(snapshot) {
        var snapshot = snapshot.val();
          console.log(snapshot);
          function trackCounter(){
            var counter = 0;

            $("#plus").click(function(){
              counter++;
              $("#count").text(counter);
            });
            
            $("#minus").click(function(){
              counter--;    
              $("#count").text(counter);
            });  
        };
          
          
          for(var key in snapshot){
            var trackDiv = $('<div class="player">');
            fireTarget.append(trackDiv);
            var newURL = "https://api.soundcloud.com/tracks/"+ key;
            
            SC.oEmbed(newURL, {
                        autoplay: false,
                        maxheight: 175,
                        maxwidth: 200
                    }).then(generateOmbed(trackDiv)).catch(function(err){console.log(err)});
    
    function generateOmbed(div) {
                        return function(embed) {
                            div.append(embed.html);
                            //var myFavs = $(`<p class="button" id="minus">-</p><p id="count">0</p><p class="button" id="plus">+</p>`);
                            var minusButton = $('<p class="button" id="minus">').text('-');
                            var plusButton = $('<p class="button" id="plus">+</p>'); 
                            var countButton = $('<p id="count">').text('0');
                            //var countBox = (minusButton + countButton + plusButton);
                            //div.append(myFavs);
                            div.append(plusButton);
                            div.append(countButton);
                            div.append(minusButton);
                           
                            // Regiester listeners
                            var counter = 0;
                            plusButton.click(function(){
                              counter++;
                              countButton.text(counter);
                            });
                            
                            minusButton.click(function(){
                              counter--;    
                              countButton.text(counter);
                            }); 
                        };
                    }
                }
      
        });
     
    
    });
    
});
    
