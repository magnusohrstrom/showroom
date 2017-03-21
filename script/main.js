
const showRoom = (function(){
  let tempList = [];
  let fullList = [];


  return {
    //Get function for all get requests.
    getShort: (url) => {
      return $.ajax({
        method: 'GET',
        dataType:'json',
        url:url
      })
        .always(function(res){
          console.log(res);
        })
          .fail(()=>{
            console.log('error!');
          });
    },

    //Main search function/////////////////////////////////////////
    getFromSearchQuery: () => {

      let query = document.getElementsByClassName('search-input')[0].value;
      let artist = document.getElementById('artist-select').value;
      let type = document.getElementById('type-select').value;
      let yearFrom = document.getElementById('year-from').value;
      let yearTo = document.getElementById('year-to').value;

      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=${query}&involvedMaker=${artist}&type=${type}&imgonly=True&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=WU1Jjq7U&format=json&st=OBJECTS`)
        .done(function(response){
          console.log(response);
          tempList = response.artObjects;
          showRoom.appendResponseToInterface(tempList);


        });
      },



    //Appends search-result-respond to html-interface.
    appendResponseToInterface:(list) => {
      let Html = '';
      let section = document.getElementsByClassName('list-section')[0];
      for (let i = 0; i < list.length; i++) {
        if(list[i].webImage !== null){
          Html += `<figure class="list-figure">
                          <img src="${list[i].webImage.url}">
                          <h4>${list[i].title}</h4>
                          <p>${list[i].principalOrFirstMaker}</p>
                        </figure>`;
        }
      }
      section.innerHTML = Html;
      /*
let Html = '';
      let section = document.getElementsByClassName('list-section')[0];
      for (let i = 0; i < list.length; i++) {
        if(list[i].webImage !== null){
          Html += `<figure class="list-figure">
                          <img src="${list[i].webImage.url}">
                          <h3>${list[i].title}</h3>
                          <p>${list[i].principalMaker}</p>
                          <p>${list[i].dating.year}</p>
                        </figure>`;
          }
        }
      section.innerHTML = Html;*/

    },

    appendHtmlForEachResponse: (object) => {
      var section = document.getElementsByClassName('list-section')[0];

      if(object.webImage !== null){
        Html += `<figure class="list-figure">
                        <img src="${object.webImage.url}">
                        <h3>${object.title}</h3>
                        <p>${object.principalMaker}</p>
                        <p>${object.dating.year}</p>
                      </figure>`;
        }

    section.innerHTML = Html;
    },

    getListOfObjectNumbers:(response) => {
      let list = response.artObjects;
      return tempList = list.map(function(val){ return val.objectNumber; });
    },

    getObjectsFromObjectNumberList: (list) => {
      fullList = [];

      for (let i = 0; i < list.length; i++) {
        showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/${list[i]}?key=WU1Jjq7U&format=json`)
          .then(function(resp){
            //showRoom.appendHtmlForEachResponse(resp.artObject);
            fullList.push(resp.artObject);
            console.log(i);
            console.log(fullList);
          });
      /*
      Html = '';
      for (var i = 0; i < list.length; i++) {
        showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/${list[i]}?key=mvBTcUjC&format=json`)
          .then(function(resp){
            console.log(resp);
            showRoom.appendListFigure(resp);
            console.log(i);
          });
        }
      showRoom.appendHtml(); */

      }
    },

    logTempList: () =>{

      console.log(fullList);
    },
    //Enables click on search-button when enter-key is pressed.
    enterKey:(key) => {
      key=window.event;
      if(window.event.keyCode == 13){
        document.getElementsByClassName('search-button')[0].click();
        return false;
  }

},
    //funciton that sets eventlisteners on app initiation.
    init: () => {
      //document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchQuery);
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery);
      //document.getElementsByClassName('search-input')[0].addEventListener('onkeypress','return showRoom.enterKey(event);');

    }
};//end showRoom.
})();

showRoom.init();

//showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=rembrandt&type=painting&imgonly=True&ps=100&key=WU1Jjq7U&format=json`);
