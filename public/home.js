
$(function(){
  // var clear = new Firebase('https://gamma.firebase.com/billma/opentokFire')
  // clear.remove()
  // 
  //  
  var topics=new Firebase('https://gamma.firebase.com/billma/opentokFire/topics')

  listTopics=function(){
    topics.on('value',function(data){
      $('#listContainer').html('')
      data.forEach(addTopicLink)
     
    })
  }
  addTopic=function(name,session_id){
    // check to see if topic already exist
    name=name.toLowerCase()
    topics.once('value',function(data){
      // var test=name
      if(!data.hasChild(name)){
        var newTopicRef=new Firebase('https://gamma.firebase.com/billma/opentokFire/topics/'+name)
        newTopicRef.set({name:name,session_id:session_id,totalUser:1}, function(){
           window.location="/"+name;
        })
      }else{
        alert('Topic: '+name+'already exist')
      } 
  
    })
  }
  addTopicLink=function(topic){
    topicName=topic.val()['name'].toLowerCase()
    totalUser=topic.val()['totalUser']
    if(totalUser=="0"){
      topic.ref().remove(listTopics)
    }else{
      var template='<a href="/'+topicName+'" topic="'+topicName+'"class="each_room btn">'+
        '<i class="icon-group"></i>'+
        '<span class="each_room_name">'+topicName+'</span>'+
        '<span class="totalUser">'+totalUser+'</span>'+
      '</a>'   
      $('#listContainer').append(template)    
    }

  }
  function submitTopic(){
    var name=$('#topic_input').val()
    $.post( '/getSession',{},function(data){
      if(data['session_id']!=null){
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













