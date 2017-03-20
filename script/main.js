
const showRoom = (function(){
  let tempList = [];
  let fullList = [];
  let Html = '';

  return {
    //Get function for all get requests.
    getShort: (url) => {
      return $.ajax({
        method: 'GET',
        dataType:'json',
        url:url
      })
        .always(function(res){

        })
          .fail(()=>{
            console.log('error!');
          });
    },

    appendListFigure:(object) => {
      if(object.artObject.webImage !== null){
        Html += `<figure class="list-figure">
                        <img src="${object.artObject.webImage.url}">
                        <h3>${object.artObject.title}</h3>
                        <p>${object.artObject.principalMaker}</p>
                        <p>${object.artObject.dating.year}</p>
                      </figure>`;
        }
    },

    appendHtml: () => {
      let section = document.getElementsByClassName('list-section')[0];
      console.log(Html);
      section.innerHTML = Html;
    },

    appendResultsToInterface: (object) => {

      let section = document.getElementsByClassName('list-section')[0];

      for(let i = 0 ; i < list.length; i++){
        if(list[0][i].artObject.webImage !== null){
          Html += `<figure class="list-figure">
                          <img src="${list[i].Object.artObject.webImage.url}">
                          <h3>${list[i].artObject.title}</h3>
                          <p>${list[i].artObject.principalMaker}</p>
                          <p>${list[i].artObject.dating.year}</p>
                        </figure>`;
          }
        }
        section.innerHTML = Html;
    },
    //Main search function/////////////////////////////////////////
    getFromSearchQuery: () => {

      let query = document.getElementsByClassName('search-input')[0].value;

      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&key=mvBTcUjC&format=json&ps=10`)
        .done(function(response){
          showRoom.getListOfObjectNumbers(response);

          });
          console.log(tempList);
          showRoom.getObjectsFromObjectNumberList(tempList);

      },

    getListOfObjectNumbers:(response)=>{
      let list = response.artObjects;
      return tempList = list.map(function(val){ return val.objectNumber; });
    },

    getObjectsFromObjectNumberList: (list) => {
      Html = '';
      for (var i = 0; i < list.length; i++) {
        showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/${list[i]}?key=mvBTcUjC&format=json`)
          .then(function(resp){
            console.log(resp);
            showRoom.appendListFigure(resp);
            console.log(i);
          });
        }
      showRoom.appendHtml();
    },

    logTempList: () =>{

      console.log(fullList);
    },
    //funciton that sets eventlisteners on app initiation.
    init: () => {
      document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchQuery);
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.logTempList);


    }
};//end showRoom.
})();

showRoom.init();
