var dotenv = require("dotenv").config();
var keys = require("./keys.js")
var request = require('request'); // "Request" library
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var arguments = [];

for(var i = 2;i < process.argv.length;i++)
{
    arguments.push(process.argv[i]);
}


switch(arguments[0])
{
    case "spotify-this-song":
    {
        Spotifythis(arguments);
        break;
    }
    case "my-tweets":
    {
        getMyTweets("liribot7");
        break;
    }
    case "movie-this":
    {
        GetMovie(arguments);
        break;
    }
    case "do-what-it-says":
    {
        doWhatItSays();
        break;
    }
}

function doWhatItSays()
{
    fs.readFile("random.txt", "utf8", function(error, data) 
    {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          
          console.log("ERROR ------------------------------------------")
          console.log(error);
          console.log("------------------------------------------------")
          return;
        }

        var dataArr = data.split(",");

        switch(dataArr[0])
        {
            case "spotify-this-song":
            {
                Spotifythis(dataArr);
                break;
            }
            case "my-tweets":
            {
                getMyTweets(dataArr[1]);
                break;
            }
            case "movie-this":
            {
                GetMovie(dataArr);
                break;
            }
        }
    });     
}

function Spotifythis(arguments)
{
    var spotifyName = "";
    console.log(arguments);
    if(arguments.length === 1)
    {
        spotifyName = "The+Sign"
    }
    else
    {
        for (var i = 1; i < arguments.length; i++)
        {
            if (i > 1 && i < arguments.length) 
            {
                spotifyName = spotifyName + "+" + arguments[i];
            }
            else
            {
                spotifyName += arguments[i];
            }
        }
    }
    spotifyName = spotifyName.split("+").join(" ");
    console.log(spotifyName);
    spotify.search({ type: 'track', query: spotifyName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log(data.tracks.items[0].name);
      console.log(data.tracks.items[0].artists[0].name);
      console.log(data.tracks.items[0].album.name);
      console.log(data.tracks.items[0].href);
      });
}

function getMyTweets(userName)
{
    var params = { q:userName,count: 20,result_type: 'recent'};
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets.statuses.length)
            for(let i = 0; i < tweets.statuses.length; i++)
            {
                console.log("Text: " + tweets.statuses[i].text);
                console.log("Creation Time: " + tweets.statuses[i].created_at);
            }
        }
        else
        {
            console.log(error);
        }
    });
}

function GetMovie(argumentlist)
{
    var movieName = "";
    if(argumentlist.length === 1)
    {
        movieName = "Mr+Nobody"
    }
    else
    {
        for (var i = 1; i < argumentlist.length; i++)
        {
            if (i > 1 && i < argumentlist.length) 
            {
                movieName = movieName + "+" + argumentlist[i];
            }
            else
            {
                movieName += argumentlist[i];
            }
        }
    }
    //console.log(movieName);
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
      
          // Parse the body of the site and recover just the imdbRating
          // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("imdb Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1]);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        }
      });
}


