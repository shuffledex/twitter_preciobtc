var twit = require('twit');
var cron = require('node-cron');
var config = require('./config.js');

var Twitter = new twit(config);

// STREAM BOT ==========================

var stream = T.stream('user');
//listens to the event when someone follows and calls 
//callback function followed 
stream.on('follow', followed);

function followed(eventmsg) {
	//getting name and username of the user
    var name = eventmsg.source.name;
    var screenName = eventmsg.source.screen_name;
    //since twitter blocks tweets of same type so we'll associate a
    //unique number using Math.random() or anything you like
    tweetPost('@' + screenName + ' gracias por el follow! deseamos que PrecioBTC.com te ayude a encontrar el mejor precio para tu próxima operación en Bitcoin. ' + Math.floor(Math.random()*10);
}
//Posting the tweet!
function tweetPost(msg) {
    var tweet = {
        status: msg
    }
    T.post('statuses/update', tweet, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {
    var params = {
        q: 'bitcoin OR btc',  // REQUIRED
        result_type: 'recent',
        lang: 'es'
    }
    // for more parametes, see: https://dev.twitter.com/rest/reference/get/search/tweets

    Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
          // grab ID of tweet to retweet
            var retweetId = data.statuses[0].id_str;
            // Tell TWITTER to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        // if unable to Search a tweet
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
}

retweet()


// FAVORITE BOT====================

// find a random tweet and 'favorite' it
var favoriteTweet = function(){
  var params = {
      q: 'bitcoin OR btc',//'@RipioApp OR @BudaPuntoCom OR @buenbit OR @ArgenBTC OR @BitInka OR @CryptoMKT OR @SatoshiTango',  // REQUIRED
      result_type: 'mixed',
      lang: 'es'
  }
  // for more parametes, see: https://dev.twitter.com/rest/reference

  // find the tweet
  Twitter.get('search/tweets', params, function(err,data){

    // find tweets
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);   // pick a random tweet

    // if random tweet exists
    if(typeof randomTweet != 'undefined'){
      // Tell TWITTER to 'favorite'
      Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, response){
        // if there was an error while 'favorite'
        if(err){
          console.log('CANNOT BE FAVORITE... Error');
        }
        else{
          console.log('FAVORITED... Success!!!');
        }
      });
    }
  });
}

// function to generate a random tweet tweet
function ranDom (arr) {
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
};