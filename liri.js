
require("dotenv").config(); // use .env to hide keys 

var keys = require("./keys.js"); // export the keys.js
var fs = require("fs"); // to read the random.txt
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var commandInput = process.argv[2];
var searchInput = process.argv[3];



switch (commandInput) {

    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong(searchInput);
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doIt();
        break;

    default: console.log("\n" + "Welcome to Liribot! Type any Command." + "\n" +
    "spotify-this-song 'your-song'" + "\n" +
    "movie-this 'any-movie'" + "\n" + 
    "do-what-it-says " + "\n");
}

function concertThis() {
    var artist = searchInput;
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp",
        "utf8", function (err, response, body) {

            if (!err && response.statusCode === 200) {


                // returns 5 venues 
                for (var i = 0; i < 4; i++) {

                    var divider = "\n=========================================================";

                    var concertData = JSON.parse(body);

                    // moment.js
                    var date = concertData[i].datetime;
                    var format = "LLL";
                    var result = moment(date).format(format);

                    // print out info
                    var concertInfo = "\nVenue: " + concertData[i].venue.name + " Location: " + concertData[i].venue.city
                        + ", " + concertData[i].venue.region + " Date: " + result;

                    console.log(concertInfo);

                    // append file to log.txt
                    fs.appendFile("log.txt", concertInfo + divider, function (err) {
                        if (err) throw (err);
                    })
                }
            }
        });
}

function spotifyThisSong(searchInput) {

    var spotify = new Spotify(keys.spotify);

    if(searchInput === ""){
        searchInput = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: searchInput, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // iterating thru the object
        
        artist = data.tracks.items[0].album.artists[0].name;
        linktospotify = data.tracks.items[0].album.external_urls.spotify;
        album = data.tracks.items[0].album.name;

        var divider = "\n=========================================================";
        
        // append file to log.txt
        var spotifyData = "\nArtist: " + artist + "\nPrewiew URL: " + linktospotify + "\nAlbum: " + album;
        fs.appendFile("log.txt", spotifyData + divider, function (err) {
            if (err) throw (err);
            console.log(spotifyData);
        })
    });
}

function movieThis() {
    request("http://www.omdbapi.com/?t=" + searchInput + "&y=&plot=short&apikey=trilogy", "utf8", function (err, response, body) {
        if (!err && response.statusCode === 200) {

            var jsonData = JSON.parse(body);
            var divider = "\n=========================================================";
            var movieData =
                "\nTitle: " + jsonData.Title + "\nYear: " + jsonData.Year +
                "\nMovie rating: " + jsonData.imdbRating + "\nRotten tomatoes rating: " + jsonData.Ratings[1].Value
                + "\nCountry produced: " + jsonData.Country + "\nLanguage of the movie: " + jsonData.Language
                + "\nPlot: " + jsonData.Plot + "\nActors: " + jsonData.Actors
            
                // append file to log.txt
                fs.appendFile("log.txt", movieData + divider, function (err) {
                    if (err) throw err;
                    console.log(movieData);
            })
        }
    });
}

function doIt() {

    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            console.log("Error occurred: " + err);
        }
        content = data.split(", ");
        console.log(content[0]); // test log from random.txt
        
        // spotify the song I want it that way from random.txt file 
        if(content[0] == "spotify-this-song"){
            spotifyThisSong(content[1]);
        }
    });
}
