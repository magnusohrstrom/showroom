
const showRoom = (function(){
  let tempList = [];
  let originList = [];

  return {
    //Get

    appendResultsToInterface: (list) => {

      let section = document.getElementsByClassName('list-section')[0];
      let movieHtml = '';

      for(var i = 0 ; i < list.length; i++){
        if(list[i].hasImage !== false){
          movieHtml +=
            `<img src="${list[i].webImage.url}">`;
          }
          else{}
        }



        section.innerHTML = movieHtml;

    },
    getFromSearchTitle: () => {
      let query = document.getElementsByClassName('search-input')[0].value;
      $.ajax({
        method: 'GET',
        dataType:'jsonp',
        //beforeSend:function(xhr){xhr.setRequestHeader('Access-Control-Allow-Origin', '*');},

        //url:"http://www.rijksmuseum.nl/api/oai2/mvBTcUjC/",
        //url:"http://www.rijksmuseum.nl/api/oai2/[mvBTcUjC]/?verb=ListRecords&set=collectie_online&metadataPrefix=oai_dc",
        url:`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=mvBTcUjC&format=jsonp&ps=100`,

        success: (response) => {

          tempList = response.artObjects;
          showRoom.appendResultsToInterface(tempList);

          console.log(tempList);
        },
        error:() => { console.log("error");}


      });
    },
    logTempList: () =>{
      console.log(tempList);
    },
    //funciton that sets eventlisteners on app initiation.
    init: () => {
      document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchTitle);
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.logTempList);


    }
};//end showRoom.
})();

showRoom.init();


//showRoom.getFromSearchTitle();

/*
function get(){
  var init = {
    method: 'GET'
  }
  fetch('https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=mvBTcUjC&format=json', init
).then(function(response){
  return response;
  }).then(function(json){
     console.log(json);
   });
}
//get();

//get();
function jsonGET(){
  $.ajax({
    method: 'GET',
    url:'https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=mvBTcUjC&format=jsonp',
    dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
    success: (res) => {
          return res.artObject.webImage.url;
   },
    error: () => { console.log("error");}
  });
  var frame = document.getElementsByClassName('main-figure')[0];
  var text = document.createTextNode(jsonGET.success);
  frame.appendChild(text);
  //frame.style.background = 'url('+jsonGET.success+')';
}
//jsonGET();
function getshort(){
  $.get({
    url:'https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=mvBTcUjC&format=jsonp',
    dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
    success: (res) => {
          var img = res.artObject.webImage.url;
          var frame = document.getElementsByClassName('main-figure')[0];
          var text = document.createTextNode(jsonGET.success);
          frame.appendChild(text);
          frame.style.background = 'url('+img+')';
   },
    error: () => { console.log("error");}
  });
}
//getshort();
function getshort2(){
  $.get({
    url:'https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=mvBTcUjC&format=jsonp',
    dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
    success: (res) => {
          var img = res.artObject.webImage.url;
          var frame = document.getElementsByTagName('img')[0];
          var text = document.createTextNode(jsonGET.success);
          frame.appendChild(text);
          frame.setAttribute('src',img);
   },
    error: () => { console.log("error");}
  });
}

//getshort2();

function getshort3(){
  $.get({
    url:'https://rijksmuseum.nl/api/en/collection/sk-c-5?key=mvBTcUjC&format=json',
    dataType: 'json', //change the datatype to 'jsonp' works in most cases
    success: (res) => {
          console.log(res);
   },
    error: () => { console.log("error");}
  });
}
//getshort3();
*/
