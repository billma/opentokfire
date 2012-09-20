
$(function(){
  

  
  var topics=new Firebase('http://gamma.firebase.com/song/firebaseRoulette/topics')
  // var clear=new Firebase('http://gamma.firebase.com/song/firebaseRoulette')
  //  clear.remove()

  
  listTopics=function(){
    topics.on('value',function(data){
       console.log(data.val())
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
        var newTopicRef=new Firebase('http://gamma.firebase.com/song/firebaseRoulette/topics/'+name)
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
    // if(totalUser=="0"){
      // var emptyTopicRef=new Firebase('http://gamma.firebase.com/song/firebaseRoulette/topics/'+name)
      // emptyTopicRef.remove()
    // }else{
      var template='<a href="/'+topicName+'" topic="'+topicName+'"class="each_room btn">'+
        '<i class="icon-group"></i>'+
        '<span class="each_room_name">'+topicName+'</span>'+
        '<span class="totalUser">'+totalUser+'</span>'+
      '</a>' 
      // $('#topList .container').append(template) 
      
      $('#listContainer').append(template)
      
    // }

  

  }
  function submitTopic(){
    var name=$('#topic_input').val()
    $.post( '/getSession',{},function(data){
      if(data['session_id']!=null){
          addTopic(name, data['session_id'])
          // alert(data['session_id'])
          // window.location="/"+name;
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













