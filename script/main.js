
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
            console.log('error!');
          });
    },

    //Tours ///////////////////////////////
    startTour: (query,artist,type,yearFrom,yearTo) => {
      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=WU1Jjq7U&format=json&st=OBJECTS`)
      .then(function(response){
        tempList = response;
        console.log(tempList);
        showRoom.appendResponseToInterface(tempList,1);
      });
    },


    rembrandtTour: () => {
      showRoom.startTour('','Rembrandt+Harmensz.+van+Rijn','schilder', '1200', '2000');
    },

    selfportraitsTour: () => {
      showRoom.startTour('self portraits','','schilder','','');
    },

    //Main search function/////////////////////////////////////////
    getFromSearchQuery: function()  {

      let query = document.getElementsByClassName('search-input')[0].value;
      let artist = document.getElementById('artist-select')[1].value;
      let type = document.getElementById('type-select').value;
      let yearFrom = document.getElementById('year-from').value;
      let yearTo = document.getElementById('year-to').value;
      let s = '';

      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=50&key=WU1Jjq7U&format=json&st=OBJECTS`)
        .then(function(response){
          console.log(response);
          tempList = response.artObjects;
          //showRoom.checkArtistSpecified(tempList,artist);
          showRoom.appendResponseToInterface(tempList,1);
          console.log(tempList);
          //showRoom.createNewArtWorkFromResponseList(tempList);
        }).done(function(){
          showRoom.appendImgToMainFigure(tempList);
          console.log(tempList);
          });

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

    appendImgToMainFigure: (index) => {
      let mainImg = document.getElementsByClassName('main-img')[index];
        mainImg.setAttribute('src', url);
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
      document.getElementsByClassName('tours-square')[0].addEventListener('click',showRoom.rembrandtTour);
      //document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchQuery);
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery);
      //document.getElementsByClassName('search-input')[0].addEventListener('onkeypress','return showRoom.enterKey(event);');
    }
};//end showRoom.
})();

showRoom.init();

//showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=rembrandt&type=painting&imgonly=True&ps=100&key=WU1Jjq7U&format=json`);
showRoom.selfportraitsTour();
