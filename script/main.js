
const showRoom = (function(){
  let tempList = [];
  let fullList = [];



  return {

    //Get function for all get requests including error handler and loading icon.
    getShort: (url) => {
      document.getElementsByClassName('loading-img')[0].classList.toggle('active');
      return $.ajax({
        method: 'GET',
        dataType:'json',
        url:url
      })
        .always(function(res){
          console.log(res);
          document.getElementsByClassName('loading-img')[0].classList.toggle('active');
        })
          .fail((error)=>{
            console.log(error);
            document.getElementsByClassName('main-figure-text-container')[0].innerHTML = `<h2>Oops! An error occured while trying to load content. </h2>`;
          });
    },

    //Initiates an ajax get call adn appends the response to list-section.
    startTour: (query,artist,role,yearFrom,yearTo,listIndex,type) => {
      //showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=q7U&format=json&st=OBJECTS`)
      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${role}&type=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=50&key=WU1Jjq7U&format=json&st=OBJECTS`)
      .done(function(response){
        tempList = response.artObjects;
        showRoom.appendResponseToInterface(tempList,listIndex);
        showRoom.appendImgToMainFigure(tempList[0].webImage.url,0);
        showRoom.appendTextToMainTextBox(tempList[0]);
      });
    },

    rembrandtTour: () => {
      showRoom.startTour('','Rembrandt+Harmensz.+van+Rijn','schilder', '', '',0,'');
    },

    selfportraitsTour: () => {
      showRoom.startTour('self portrait','','schilder','','',0,'');
    },

    animalsTour: () => {
      showRoom.startTour('animals','','schilder','','',0),'';
    },

    masterPiecesTour: () => {
      showRoom.startTour('sea','','','','',0,'painting');
    },

    murderTour: () => {
      showRoom.startTour('murder','','','','',0,'');
    },

    flowerTour: () => {
      showRoom.startTour('flowers','','schilder','','',0,'');
    },

    //Main search function that runs startTour with user input-values.
    getFromSearchQuery: function(){

      let query = document.getElementsByClassName('search-input')[0].value;
      let artist = document.getElementById('artist-select').value;
      let type = document.getElementById('type-select').value;
      let yearFrom = document.getElementById('year-from').value;
      let yearTo = document.getElementById('year-to').value;
      let s = '';
        showRoom.startTour(query,artist,type,yearFrom,yearTo,0,s);
    },

    //Appends search-result-respond to html-interface.
    appendResponseToInterface:function(list, index) {
      console.log(list);
      let Html = '';
      let section = document.getElementsByClassName('list-section')[index];
      for (let i = 0; i < list.length; i++) {
        if(list[i].webImage !== null ){
          Html += `<figure class="list-figure">
                          <img class="list-img" src="${list[i].webImage.url}">
                          <h4>${list[i].longTitle}</h4>
                          <p>${list[i].principalOrFirstMaker}</p>
                          <a target="_blank" href="${list[i].webImage.url}">full-sized image</a>
                        </figure>`;
        }
      }
      section.innerHTML = Html;
      showRoom.addEventListenerToListFigure();
    },

    addEventListenerToListFigure: function(){
    let listFigure = document.getElementsByClassName('list-figure');

    for (let i=0; i < listFigure.length; i++){
      listFigure[i].addEventListener('click', showRoom.toggleActive);
      }
    },

    toggleActive: function(){
      this.classList.toggle('active');
    },

    appendImgToMainFigure: (url,index) => {
      let mainImg = document.getElementsByClassName('main-img')[index];
        mainImg.setAttribute('src', url);
    },

    appendTextToMainTextBox: (obj) => {
      let mainTextBox = document.getElementsByClassName('main-figure-text-container')[0];
        mainTextBox.innerHTML = `<h2>${obj.longTitle}</h2><p>${obj.principalOrFirstMaker}</p><a target="_blank" href="${obj.webImage.url}">Full-sized image</a>`;
    },

    changeMainImgOnClickForward: () => {
      let img = document.getElementsByClassName('main-img')[0].src;
      console.log(img);
      console.log(tempList[0].webImage.url);
      for (let i = 0; i < tempList.length; i++) {
        if(tempList[i].webImage.url===img){
          showRoom.appendImgToMainFigure(tempList[i+1].webImage.url,0);
          showRoom.appendTextToMainTextBox(tempList[i+1]);
        }
      }
    },

    changeMainImgOnClickBack: () => {
      let img = document.getElementsByClassName('main-img')[0].src;
      console.log(img);
      console.log(tempList[0].webImage.url);
      for (let i = 0; i < tempList.length; i++) {
        if(tempList[i].webImage.url===img){
          showRoom.appendImgToMainFigure(tempList[i-1].webImage.url,0);
          showRoom.appendTextToMainTextBox(tempList[i+1]);
        }
      }
    },

    /*
    addEventListenerToFigure: function() {
      this.addEventListener('click', showRoom.appendImgToMainFigureOnClick);
    },    */



    /*

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
      }
    },
    */


    //TOURS AJAX https://www.rijksmuseum.nl/en/search?s=objecttype&p=1&ps=12&involvedMaker=Rembrandt%20Harmensz.%20van%20Rijn&st=OBJECTS&ii=0

    //Enables click on search-button when enter-key is pressed.
    enterKey:(key) => {
      key=window.event;
      if(window.event.keyCode == 13){
        document.getElementsByClassName('search-button')[0].click();
        return false;
      }

},
    //funciton that sets eventlisteners on app initiation and runs correct code on each html-site.
    init: function() {
      document.getElementById('rembrandt-main')!==null ? showRoom.rembrandtTour():{};
      document.getElementById('selfportraits-main')!==null ? showRoom.selfportraitsTour():{};
      document.getElementById('animals-main')!==null ? showRoom.animalsTour():{};
      document.getElementById('masterpieces-main')!== null ? showRoom.masterPiecesTour():{};
      document.getElementById('murder-main')!== null ? showRoom.murderTour():{};
      document.getElementById('flower-main')!== null ? showRoom.flowerTour():{};

      document.getElementsByClassName('arrow-right')[0].addEventListener('click', showRoom.changeMainImgOnClickForward);
      document.getElementsByClassName('main-img')[0].addEventListener('click', showRoom.changeMainImgOnClickForward);
      document.getElementsByClassName('arrow-left')[0].addEventListener('click', showRoom.changeMainImgOnClickBack);
      document.getElementsByClassName('search-button')[0] !== undefined ?
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery):{};


    }
};//end showRoom.
})();

showRoom.init();
