
$(function(){
  var topics=new Firebase('http://gamma.firebase.com/song/firebaseRoulette/topics')
  // var clear=new Firebase('http://gamma.firebase.com/song/firebaseRoulette')
  //  clear.remove()
  listTopics=function(){
    topics.on('value',function(data){
      console.log(data.val())
      $('#topList .container').html('')
      data.forEach(addTopicLink)
    })
  }
  addTopic=function(name,session_id){
    // check to see if topic already exist
    
    topics.once('value',function(data){
      name=name.toLowerCase()
      var test=name
      if(!data.hasChild(name)){
        var newTopicRef=new Firebase('http://gamma.firebase.com/song/firebaseRoulette/topics/'+name)
        newTopicRef.child('name').set(name)
        newTopicRef.child('session_id').set(session_id)
        newTopicRef.child('totalUser').set(0)
      }
      else
        alert('Topic: '+name+'already exist')
      // window.location="/"+test;
    })
    
  }
  addTopicLink=function(topic){
    topicName=topic.val()['name'].toLowerCase()
    totalUser=topic.val()['totalUser']
    var template='<a href="/'+topicName+'" topic="'+topicName+'"class="each_room btn">'+
            '<i class="icon-group"></i>'+
            '<span class="each_room_name">'+topicName+'</span>'+
            '<span class="totalUser">'+totalUser+'</span>'+
          '</a>' 
    $('#topList .container').append(template)
  }
  function submitTopic(){
    var name=$('#topic_input').val()
    $.post( '/getSession',{},function(data){
      if(data['session_id']!=null){
          console.log(data['session_id'])
          addTopic(name, data['session_id'])
          
      }
    })
  }
  listTopics()
  // creating a new topic
  $('#topic_input').keypress(function(e){
    if(e.keyCode==13){
      submitTopic()
      $('#topic_input').val('')
    } 
  })
  $('#submitTopic').click(function(){
    submitTopic()
  })

  
  
})













