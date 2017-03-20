
const showRoom = (function(){
  let tempList = [];
  let originList = [];

  return {
    //Get

    appendResultsToInterface: (list) => {

      let section = document.getElementsByClassName('list-section')[0];
      let movieHtml = '';

      for(var i = 0 ; i < list.length; i++){
        if(list[i].webImage !== null){
          movieHtml += `<figure class="list-figure">
                          <img src="${list[i].webImage.url}">
                          <p>${list[i].longTitle}</p>
                        </figure>`;
          }
        }
        section.innerHTML = movieHtml;
    },

    getFromSearchQuery: () => {

      let query = document.getElementsByClassName('search-input')[0].value;

      $.ajax({
        method: 'GET',
        dataType:'json',
        //url:"https://www.rijksmuseum.nl/api/pages/nl/ontdek-de-collectie/overzicht/rembrandt-harmensz-van-rijn?key=mvBTcUjC&format=json",
        url:`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=mvBTcUjC&format=jsonp&ps=10`,

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
      document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchQuery);
      //document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.logTempList);


    }
};//end showRoom.
})();

showRoom.init();


//showRoom.getFromSearchTitle();


function get(){
  var init = {
    method: 'GET',
    headers: 'CORS'
  };
  fetch('https://www.rijksmuseum.nl/api/pages/en/explore-the-collection/overview/rembrandt-harmensz-van-rijn?key=mvBTcUjC&format=json', init
).then(function(response){
  return response.json();
  }).then(function(json){
     console.log(json);
     //json.JSON.parse();
   });
}
//get();


function getFrom(){



  $.ajax({
    method: 'GET',
    dataType:'json',
    url:"https://www.rijksmuseum.nl/api/pages/nl/ontdek-de-collectie/overzicht/rembrandt-harmensz-van-rijn?key=mvBTcUjC&format=json",
    //url:`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=mvBTcUjC&format=jsonp&ps=10`,

    success: (response) => {

      console.log(response);
      tempList = response.JSON.parse();
      //showRoom.appendResultsToInterface(tempList);

      console.log(tempList);
    },
    error:() => { console.log("error");}

});
}
getFrom();







/*
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
