OpenTokFire
============

This app is made possible with OpenTok API for live video, and Firebase for scalable and real-time data storage. 
OpenTokFire lets users create rooms to video chat around different topics. It’s like Google Hangouts without requiring 
users to login to Google. There is a maximum of four videos per room. When the room reaches its capacity, users could 
be added onto a wait-list and still subscribe to the on-going conversation.


## How To Run: 
Open up your terminal and gem install the sinatra framework. Then run the app server. 
<pre>
  gem install sinatra     # installs sinatra
  ruby app.rb             # run the server
</pre>


# Tokbox API Walkthrough
In order to use the Tokbox API for this project, you first need to visit the <a href="http://www.tokbox.com/opentok/api/documentation/gettingstarted">Tokbox Getting Started Guide</a>
and apply for an 'api_key' and an 'api_secret' 

## Opentok Gem 
before we can use the '<a href="https://github.com/opentok/Opentok-Ruby-SDK">Opentok Ruby SDK</a>', 
we need to include it at the top of your app.rb file
<pre>
  require 'opentok'
</pre>

## generating a session_id
We first use the 'api_key' and 'api_secret' to initialize an <a href="http://www.tokbox.com/opentok/api/tools/documentation/api/server_side_libraries.html">OpenTokSDK object</a>. 
Then we call the 'create_session()' to get a session_id. We can later send a post request to this url and get a JSON reponse containing 
the session_id

<pre>
  post '/getSession' do
    api_key='20276891'
    api_secret ='955a1150144543122f8bb3443214920782f3af2a'
    
    # create an OpenTok object
    TBO = OpenTok::OpenTokSDK.new api_key, api_secret
    # generate a session_id
    session_id = TBO.create_session(request.ip)
    object={
      :api_key=>api_key,
      :session_id=>session_id
    }
    content_type :json
    return object.to_json
  end 
</pre>


## generating a token
The token is used to connect to a session when the user enters a topic room. We can make a post request to '/getToken' and attach 
the session_id in the params.  OpenTok SDK object then generates a token for the session_id by calling generate_token(). 

<pre>
  post '/getToken' do
    api_key='20276891'
    api_secret ='955a1150144543122f8bb3443214920782f3af2a'
    session_id=params[:session_id]
    TBO = OpenTok::OpenTokSDK.new api_key, api_secret, true
    token= TBO.generate_token :session_id=> session_id, :role=> OpenTok::RoleConstants::PUBLISHER, :api_url => 'https://api.opentok.com/hl'
    object={
      :api_key=>api_key,
      :token=>token
    }
    content_type :json
    return object.to_json
  end 
</pre>

## Setting up OpenTok Client-side Code 
With the token and session_id, you can easily connect to a session and subscribe to all the streams within the session. 
Below I have included only the Pseudo-code. You can find the full implementation in 'topics.erb' file. You can also 
refer to the <a href="http://www.tokbox.com/opentok/api/documentation/gettingstarted">Tokbox Getting Started Guide</a> for 
more details on how to implement the handlers

<pre>
  var session=TB.initSession(session_id)
  
  // setup tokbox session event
  session.addEventListener('sessionConnected', sessionConnectedHandler);
  session.addEventListener('streamCreated', addNewStreamHandler)
  session.addEventListener("streamDestroyed", streamDestroyedHandler);
  
  // connect the session
  session.connect(api_key, token)
  
  function sessionConnectedHandler(event){    
    // subscribe to all the streams ...
  }
  function addNewStreamHandler(event){
    // display the new stream for all users
  }
  
  function subscribeToStreams(streams){
    // interate through all the streams in the session
    // and display each stream
  }
  
  function streamDestroyedHandler(event){
    // initiate chat for the next person on the waitlist 
  }

</pre>  

#FireBase API Walkthrough

This project is made up of two pages. A homepage for displaying a list of topics and a show topic page to start a video chat 

To use the Firebase Javascript API, we must first include the following in your html: 


    <script src="http://static.firebase.com/v0/firebase.js"></script>


## HomePage 
To create the topics database, I created a firebase object using a location url that specify the location of the new table.
<pre>
var topics=new Firebase('https://gamma.firebase.com/user_name/project_name/topics')
</pre> 

Next, we need to setup <a href="http://www.firebase.com/docs/firebase/on.html"> the on() </a> event listener. 
When something changers in the topics database, it will trigger the callback function to add the most updated list onto the page.

<pre>
  // get a list of topics 
  listTopics=function(){
    topics.on('value',function(data){
      $('#listContainer').html('')
      // iterate through the list
      data.forEach(addTopicLink)
    })
  }
</pre> 

To create a new entry to the topics table, use the <a href="http://www.firebase.com/docs/firebase/set.html">set()</a> method to set the value of 'session_id' generated with Tokbox API earlier. 
I also wanted each room to display its total numbers of users. So I added a 'totalUser' attributes and initialized it to 1. When everything 
is done, use window.location to redirect the user to the room. 

<pre>
    var newTopicRef=new Firebase('https://gamma.firebase.com/billma/opentokFire/topics/'+name)
    newTopicRef.set({name:name,session_id:session_id,totalUser:1}, function(){
        window.location="/"+name;
    })
</pre>


##Topics Page

To count the number of users in a room first create a 'users_count' table, and <a href="http://www.firebase.com/docs/firebase/push.html">push()</a> a new count into the 
table when the page first load, then we setup <a href="http://www.firebase.com/docs/firebase/removeondisconnect.html">removeOnDisconnect()</a>
listener to automatically remove the count when the user disconnects from the room. 
<pre>
    var users_count=new Firebase('https://gamma.firebase.com/billma/opentokFire/topics/'+current_topic+'/count')
    newCount=users_count.push()
    newCount.removeOnDisconnect()
</pre>


Whenever there is a change in the 'users_count' table, recount the table and update the 'totalUsers' attribute. 
<pre>
    users_count.on('value',function(data){
      var count=0
      data.forEach(function(){
        count++;
      })
      current_topic_ref.child('totalUser').set(count)
      $('#totalUser span').html(count)
      current_topic_ref.child('totalUser').setOnDisconnect(count-1)
    })
</pre>

If a room reaches its capacity, the user can get on a waitlist, the app will automatically initiate the user's video
chat when someone else leaves 

<pre>
      waitlist_ref.on('value',function(data){
      var count=0
      var before_me=0;
      // count the wailist
      data.forEach(function(data){
        count++;
      })
      // get Id of the person in the front 
      // of the waitlist
      nextInLine.once('value',function(data){
        data.forEach(function(data){
          nextInLine_id=data.ref().name()
        })
      })
      // update the position of the person 
      // who is currently waitlisted
      updateWaitlist(data)
    })
</pre>



