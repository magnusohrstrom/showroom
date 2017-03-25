
const showRoom = (function(){
  let tempList = [];
  let fullList = [];
  let test = [];

  const ArtWork = {
    create: function (title, long, maker, url){
      var newArtWork = Object.create(this);

      newArtWork.title = title;
      newArtWork.longTitle = long;
      newArtWork.principalOrFirstMaker = maker;
      newArtWork.url = url;
      return newArtWork;
    },
    getImgSrc: function() {
      console.log(this.url);
    }

  };

  return {
    ArtWork: ArtWork,

    createNewArtWorkFromResponseList: function(list) {
          for (var i = 0; i < list.length; i++) {
            var title = list[i].title;
            var longTitle = list[i].longTitle;
            var maker = list[i].principalOrFirstMaker;
            var url = list[i].webImage.url;
            var artWork = showRoom.ArtWork.create(title,longTitle,maker,url);

            fullList.push(artWork);
          }
          console.log(fullList);
          //console.log(tempList);

    },

    createListOfObjectsFromFactory: function(artwork){
      fullList.push(artwork);
    },
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
            console.log('though shit!');
          });
    },

    //Tours ///////////////////////////////
    startTour: (query,artist,type,yearFrom,yearTo,listIndex) => {
      //showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=WU1Jjq7U&format=json&st=OBJECTS`)
      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=50&key=WU1Jjq7U&format=json&st=OBJECTS`)
      .done(function(response){
        tempList = response.artObjects;
        showRoom.appendResponseToInterface(tempList,listIndex);
        showRoom.appendImgToMainFigure(tempList[0].webImage.url,0);
      });
    },


    rembrandtTour: () => {
      showRoom.startTour('','Rembrandt+Harmensz.+van+Rijn','schilder', '', '',0);
    },

    selfportraitsTour: () => {
      showRoom.startTour('self portraits','','schilder','','',0);
    },

    animalsTour: () => {
      showRoom.startTour('animals','','schilder','','',0);
    },

    masterPeicesTour: () => {
      showRoom.startTour('masterpeice','','schilder','','',0);
    },

    shungaTour: () => {
      showRoom.startTour('intercourse','','schilder','','',0)
    },

    //Main search function/////////////////////////////////////////
    getFromSearchQuery: function()  {

      let query = document.getElementsByClassName('search-input')[0].value;
      let artist = document.getElementById('artist-select').value;
      let type = document.getElementById('type-select').value;
      let yearFrom = document.getElementById('year-from').value;
      let yearTo = document.getElementById('year-to').value;
      let s = '';

      //showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=50&key=WU1Jjq7U&format=json&st=OBJECTS`)
        //.then(function(response){
          showRoom.startTour(query,artist,type,yearFrom,yearTo,0);
          /*
  console.log(response);
          tempList = response.artObjects;
          //showRoom.checkArtistSpecified(tempList,artist);
          showRoom.appendResponseToInterface(tempList,1);
          */






    },

    checkArtistSpecified: (list, artist) => {

     tempList = list.filter((elem)=>{
        return elem.principalOrFirstMaker === artist;
      });
      console.log('hejhej'+tempList);
      return tempList;
    },

    //Appends search-result-respond to html-interface.
    appendResponseToInterface:function(list, index) {
      console.log(list);
      let Html = '';
      let section = document.getElementsByClassName('list-section')[index];
      for (let i = 0; i < list.length; i++) {
        if(list[i].webImage !== null ){
          Html += `<figure class="list-figure">
                          <img src="${list[i].webImage.url}">
                          <h4>${list[i].longTitle}</h4>
                          <p>${list[i].principalOrFirstMaker}</p>
                        </figure>`;
        }
      }
      section.innerHTML = Html;
      showRoom.addEvents();
    },
    testApi:()=>{
      showRoom.getShort('https://www.rijksmuseum.nl/api/en/collection/RP-T-1979-45?key=WU1Jjq7U&format=json');

    },

    addEvents: function(){
    let listFigure = document.getElementsByClassName('list-figure');

    for (let i=0; i < listFigure.length; i++){
      listFigure[i].addEventListener('click', showRoom.toggleActive);
      }
    },

     getThisImageUrl: function(){
       return this.children[0].src;
     },

    toggleActive: function(){
      console.log(this);
      this.classList.toggle('active');
    },

    appendImgToMainFigure: (url,index) => {
      let mainImg = document.getElementsByClassName('main-img')[index];
        mainImg.setAttribute('src', url);
      let mainFigure =  mainImg.parentNode;
      console.log(mainFigure);
    },

    changeMainImgOnClickForward: () => {
      let img = document.getElementsByClassName('main-img')[0].src;
      console.log(img);
      console.log(tempList[0].webImage.url);

      for (let i = 0; i < tempList.length; i++) {
        if(tempList[i].webImage.url===img){
          showRoom.appendImgToMainFigure(tempList[i+1].webImage.url,0);
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
        }
      }
    },

    getListOfObjectNumbers:(response) => {
      let list = response.artObjects;
      return tempList = list.map(function(val){ return val.objectNumber; });
    },

    addEventListenerToFigure: function() {
      this.addEventListener('click', showRoom.appendImgToMainFigureOnClick);
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
    //TOURS AJAX https://www.rijksmuseum.nl/en/search?s=objecttype&p=1&ps=12&involvedMaker=Rembrandt%20Harmensz.%20van%20Rijn&st=OBJECTS&ii=0
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
    init: function() {
      document.getElementById('rembrandt-main')!==null ? showRoom.rembrandtTour():{};
      document.getElementById('selfportraits-main')!==null ? showRoom.selfportraitsTour():{};
      document.getElementById('animals-main')!==null ? showRoom.animalsTour():{};
      document.getElementById('masterpieces-main')!== null ? showRoom.masterPiecesTour():{};
      document.getElementById('murder-main')!== null ? showRoom.murderTour():{};
      document.getElementById('masterpieces-main')!== null ? showRoom.masterPiecesTour():{};

      document.getElementsByClassName('arrow-right')[0].addEventListener('click', showRoom.changeMainImgOnClickForward);
      document.getElementsByClassName('arrow-left')[0].addEventListener('click', showRoom.changeMainImgOnClickBack);
      document.getElementsByClassName('search-button')[0] !== undefined ?
        document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery):{};


    }
};//end showRoom.
})();

showRoom.init();

//showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=rembrandt&type=painting&imgonly=True&ps=100&key=WU1Jjq7U&format=json`);
showRoom.testApi();
