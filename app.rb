require 'sinatra'
# require 'json'
# require 'opentok'
get '/' do
  erb :index
end

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

get '/:topic' do
  @topic=params[:topic]
  erb :topic 
end 