Opentokfire
============

This app is made possible with OpenTok API for live video, and Firebase for scalable and real-time data storage. 
OpenTokFire lets users create rooms to video chat around different topics. It’s like Google Hangouts without requiring 
users to login to Google. There is a maximum of four videos per room. When the room reaches its capacity, users could 
be added onto a wait-list and still subscribe to the on-going conversation.


## How To Run: 
<pre>
  gem install sinatra     # installs sinatra
  ruby app.rb
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
<pre>
  post '/getSession' do
    api_key='20276891'
    api_secret ='955a1150144543122f8bb3443214920782f3af2a'

    TBO = OpenTok::OpenTokSDK.new api_key, api_secret
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