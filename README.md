Opentokfire
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
the session_id in the params.  OpenTok SDK object then generates a token for the session_id and return a JSON response to 
the client. 

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

<pre>
  var session=TB.initSession(session_id)
  
  // setup tokbox session event
  session.addEventListener('sessionConnected', sessionConnectedHandler);
  session.addEventListener('streamCreated', addNewStreamHandler)
  session.addEventListener("streamDestroyed", streamDestroyedHandler);
  // connect the session
  session.connect(api_key, token)
  
  function sessionConnectedHandler(event){    
  
    // other code ...
    
    subscribeToStreams(event.streams)
  }
  function addNewStreamHandler(event){
    var stream=event.streams[0]
    if(stream.connection.connectionId==session.connection.connectionId){
      return;
    } 
    
    // other code ...
    
    var div= document.createElement('div')
    div.setAttribute('id', 'stream'+stream.streamId)
    div.setAttribute('class', 'eachVideo')
    $('#streams').append(div)
    session.subscribe(stream,div.id,{width:250, height:180})
  }
  
  // interate through all the streams in the session
  // and display each stream
  function subscribeToStreams(streams){
    for(var i=0; i<streams.length;i++){
      if(streams[i].connection.connectionId==session.connection.connectionId){
        return;
      } 
      var div= document.createElement('div')
      div.setAttribute('id', 'stream'+streams[i].streamId)
      div.setAttribute('class', 'eachVideo')
      $('#streams').append(div)
      session.subscribe(streams[i],div.id,{width:250, height:180})
    }
  }
  
  // When a user disconnects from a session
  function streamDestroyedHandler(event){
    var stream=event.streams[0]
    
    // initiate chat for the next person on the waitlist 
    
  }
  jfdksal
</pre>  