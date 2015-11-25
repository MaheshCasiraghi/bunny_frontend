
//Initialize twitter feed on the basis of latitude and longitude
function getData(lat, lon) {
    return $.ajax({
        url: 'https://bunnybackend.herokuapp.com/get-feed?lat=' + lat + '&lon=' + lon,
        dataType: 'json'
    });
}

//Manipulate data from the API request, calling youtube API, and filling the #twitterFeed with them

function handleData(data) {


    //Instantiating variables and anipulate data from the API req

    feeds = data.statuses;
            
    var len = feeds.length;
    var displaylimit = 5;
    var showdirecttweets = false;
    var showretweets = true;
    var showtweetlinks = true;
    var showprofilepic = true;
    var showtweetactions = true;
    var showretweetindicator = true;
    var feedHTML = '';
    var displayCounter = 1;  
    var headerHTML = '';
    var loadingHTML = '';
    loadingHTML += '<div id="loading-container"><img src="/static/images/ajax-loader.gif" width="32" height="32" alt="tweet loader" /></div>';
    $('#twitterFeed').html(loadingHTML);



      //Loop through the array of returned tweets
      for(var i=0;i<len;i++) {

        // PURGE LINKS THAT ARE NOT YOUTUBE LINKS
        if ((feeds[i].entities.urls[0].expanded_url).indexOf("youtu") !== -1 &&
            (feeds[i].entities.urls[0].expanded_url).indexOf("search_query") == -1
            ) {

        var tweetscreenname = feeds[i].user.name;
        var tweetusername = feeds[i].user.screen_name;
        var profileimage = feeds[i].user.profile_image_url_https;
        var verifiedStatus = feeds[i].user.verified.toString();
        var status = feeds[i].text; 
        var isaretweet = false;
        var isdirect = false;
        var tweetid = feeds[i].id_str;
        var youtubeApiKey = "AIzaSyApxKGBdJO8w_DxfGCdsyBzo-NfuCoWhGo";

            // PUTIFYING VIDEO HANDLER FOR PROPER VISUALIZATION
        var dirtyYoutubeVideoArray = feeds[i].entities.urls[0].expanded_url.split("/");
        var dirtyYoutubeVideo = dirtyYoutubeVideoArray[dirtyYoutubeVideoArray.length - 1];
        var cleanedPrefixUrlArray = dirtyYoutubeVideo.split("watch?v=");
        var cleanedPrefixYoutubeVideo = cleanedPrefixUrlArray[cleanedPrefixUrlArray.length - 1];        
        var cleanedUrlArray = cleanedPrefixYoutubeVideo.split("&");
        var youtubeVideo = cleanedUrlArray[0];
        var ids = {}; 

                    
          //If the tweet has been retweeted, get the profile pic of the tweeter
          if(typeof feeds[i].retweeted_status != 'undefined'){
             profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
             tweetscreenname = feeds[i].retweeted_status.user.name;
             tweetusername = feeds[i].retweeted_status.user.screen_name;
             tweetid = feeds[i].retweeted_status.id_str;
             status = feeds[i].retweeted_status.text; 
             isaretweet = true;
           };
           
                     
           //Check to see if the tweet is a direct message
           if (feeds[i].text.substr(0,1) == "@") {
             isdirect = true;
           }
                     
                     
           //Generate twitter feed HTML based on selected options
           if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) { 
            if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {          


           //Fill the Title Element asynchronously with a cal to youtube APIs
            $.ajax({
                  url: "https://www.googleapis.com/youtube/v3/videos?id=" + youtubeVideo + "&key="+ youtubeApiKey + "&fields=items(snippet(title))&part=snippet", 
                  dataType: "jsonp",
                  request: youtubeVideo,
                  success: function(data, a, b,c ){
                           var id = this.request;
                           var title = data.items[0].snippet.title;
                           var domToFill = '#videoTitle' + id;
                           $(domToFill).html(title);
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                  }
              });

              //Setting HTML of the feed according with specific locally set criteria.
              if (showtweetlinks == true) {
                status = addlinks(status);
              }
               
              if (displayCounter == 1) {
                feedHTML += headerHTML;
              }

              feedHTML += '<div class="twitter-article" id="tw'+displayCounter+'"><div id="videoTitle'+youtubeVideo+'" class="titleTweet" ></div>';                                     
              feedHTML += '<iframe title="YouTube video player" class="youtube-player" type="text/html" width="auto" height="auto" src="http://www.youtube.com/embed/'+youtubeVideo+'" frameborder="0" allowFullScreen></iframe>';        
              feedHTML += '<div class="twitter-text">'
              feedHTML += '<div class="twitter-pic"><a href="https://twitter.com/'+tweetusername+'" target="_blank"><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';    
              feedHTML += '<p><span class="tweetprofilelink"><strong><a class="username ' + verifiedStatus + '" href="https://twitter.com/'+tweetusername+'" target="_blank">'+tweetscreenname+'</a></strong> <a href="https://twitter.com/'+tweetusername+'" class="handler" target="_blank">@'+tweetusername+'</a></span><a href="https://twitter.com/'+tweetusername+'" class="twitter-follow-button" data-show-count="false">Follow @'+tweetusername+'</a><span><a href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'" target="_blank"></a></span><br/><span id="textStatus">'+status+'</span></p>';
              if ((isaretweet == true) && (showretweetindicator == true)) {
                feedHTML += '<div id="retweet-indicator"></div>';
              }           
              if (showtweetactions == true) {
                feedHTML += '<div class="tweetTime">'+relative_time(feeds[i].created_at)+'</div>'       
                feedHTML += '<div id="twitter-actions"><div class="intent" id="intent-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetid+'" title="Reply"></a></div><div class="intent" id="intent-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetid+'" title="Retweet"></a></div><div class="intent" id="intent-fave"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetid+'" title="Favourite"></a></div></div>';
              }
              
              feedHTML += '</div>';
              feedHTML += '</div>';
              displayCounter++;





            }   
          }
        }
      }



      //Refresh #twitterFeed with data   
      $('#twitterFeed').html(feedHTML).promise().done(function(){
        //(Re)Initialize follow
        $('#introPreSubmit').show();
        $('#video-form').show();
        $('#introPostSubmit').hide();
        $(':input','#video-form')
          .removeAttr('checked')
          .removeAttr('selected')
          .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
          .val('');
        // We'd need to de-widgify this to reinitialize everytime with function below
        // (too much work, let's just hide after first time for now.. :-))
        $('.twitter-follow-button').hide();
        console.log("TwitterFeed Refreshed");

        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');    

      });



      //Add twitter action animation and rollovers
      if (showtweetactions == true) {       
      
        //Add new window for action clicks
        $('#twitter-actions a').click(function(){
          var url = $(this).attr('href');
          window.open(url, 'tweet action window', 'width=580,height=500');
          return false;
        });
      }



    //Add links to feed elements
    function addlinks(data) {
        //Add link to all http:// links within tweets
         data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
            return '<a href="'+url+'"  target="_blank">'+url+'</a>';
        });
             
        //Add link to @usernames used within tweets
        data = data.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
            return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
        //Add link to #hastags used within tweets
        data = data.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
            return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
        });
        return data;
    }

    //Make timing relative to client
      function relative_time(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
      delta = delta + (relative_to.getTimezoneOffset() * 60);
     
      if (delta < 60) {
        return '1m';
      } else if(delta < 120) {
        return '1m';
      } else if(delta < (60*60)) {
        return (parseInt(delta / 60)).toString() + 'm';
      } else if(delta < (120*60)) {
        return '1h';
      } else if(delta < (24*60*60)) {
        return (parseInt(delta / 3600)).toString() + 'h';
      } else if(delta < (48*60*60)) {
        //return '1 day';
    return shortdate;
      } else {
        return shortdate;
      }
    }

}


     

