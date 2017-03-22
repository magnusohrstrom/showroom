
const showRoom = (function(){
  let tempList = [];
  let fullList = [];
  let test = [
    {title:'hej'},
    {title:'hej2'},
    {title:'hej3'},
    {title:'hej4'}
  ];

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

    //Main search function/////////////////////////////////////////
    getFromSearchQuery: function()  {

      let query = document.getElementsByClassName('search-input')[0].value;
      let artist = document.getElementById('artist-select').value;
      let type = document.getElementById('type-select').value;
      let yearFrom = document.getElementById('year-from').value;
      let yearTo = document.getElementById('year-to').value;

      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=${query}&involvedMaker=${artist}&type=${type}&imgonly=True&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=WU1Jjq7U&format=json&st=OBJECTS`)
        .then(function(response){
          console.log(response);
          tempList = response.artObjects;

          showRoom.appendResponseToInterface(tempList);
          console.log(tempList);
          showRoom.createNewArtWorkFromResponseList(tempList);
        }).done(function(){showRoom.appendImgToMainFigure(tempList);});

      },



    //Appends search-result-respond to html-interface.
    appendResponseToInterface:function(list) {
      let Html = '';
      let section = document.getElementsByClassName('list-section')[0];
      for (let i = 0; i < list.length; i++) {
        if(list[i].webImage !== null){
          Html += `<figure class="list-figure" onClick="showRoom.appendImgToMainFigureOnClick(this);">
                          <img src="${list[i].webImage.url}">
                          <h4>${list[i].longTitle}</h4>
                          <p>${list[i].principalOrFirstMaker}</p>
                        </figure>`;
        }
      }
      section.innerHTML = Html;
    },

    appendImgToMainFigure: (list) => {
      let mainImg = document.getElementsByClassName('main-figure')[0];

      //console.log(list);
      mainImg.innerHTML = `<img src="${list[0].webImage.url}">`;
    },

    appendImgToMainFigureOnClick: function(img) {

    var name = img.src;
    alert(name);


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
      //document.getElementsByClassName('search-input')[0].addEventListener('input',showRoom.getFromSearchQuery);
      document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery);
      //document.getElementsByClassName('search-input')[0].addEventListener('onkeypress','return showRoom.enterKey(event);');
    }
};//end showRoom.
})();

showRoom.init();

//showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection/?q=rembrandt&type=painting&imgonly=True&ps=100&key=WU1Jjq7U&format=json`);
