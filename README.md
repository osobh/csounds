# CloudSounds
Project Cloud Sounds aka ListRrrr
------------------------------------------
Original Idea:

A shared playlist among friends - Search, Add, Filter, Push, Enjoy Variety!

Description:
First search through tracks and like them (create a local favorites playlist for the week), then on a playlist amongst friends we all add our top 3 or 5, the general shared playlist will showcase what everyone has rated over the week and allow anyone to play the tracks chosen.


Aims:
This project aims to to first connect to users account and allow them to search for genres of music. The search will return results from the SoundCloud API and then the app will display the results in a nice carousel with the ability to play the music listings in the interface.

Steps to Accomplish:

1) First create a simple page that will load the SoundCloud SDK for JS and then populate it with dev auth token. 
2) Host the callback.html page for auth purposes which re-directs to local page.
3) Once the user has authenticated take them to a page that will allow them to search for tracks in a certain genre.
4) once genre has been input, we will grab a few initial results of the search.
5) tracks will populate on the page as text first, then we will fetch the image and populate the placeholder area.
6) for every track placeholder there will be a play button that will embed the track in selection and allow the user to listed to that selection.

** Stretch Goals **
1) Playlist creation and appending
2) ability to generate a playlist made up of other users playlist that I intially create.
3) many others things I haven't thought of.
