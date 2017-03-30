
const showRoom = (function(){
  let tempList = [];
  let fullList = [];

  return {

    //Get function for all get requests including error handler and loading icon.
    getShort: (url) => {
      document.getElementsByClassName('loading-container')[0].classList.toggle('active');
      return $.ajax({
        method: 'GET',
        dataType:'json',
        url:url
      })
        .always(function(res){
          document.getElementsByClassName('loading-container')[0].classList.toggle('active');
        })
          .fail((error)=>{
            document.getElementsByClassName('main-figure-text-container')[0].innerHTML = `<h2>Oops! An error occured while trying to load content. </h2>`;
          });
    },

    //Initiates an ajax get call adn appends the response to list-section.
    startTour: (query,artist,role,yearFrom,yearTo,listIndex,type) => {
      //showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=100&key=q7U&format=json&st=OBJECTS`)
      showRoom.getShort(`https://www.rijksmuseum.nl/api/en/collection?q=${query}&involvedMaker=${artist}&role=${role}&type=${type}&imgonly=True&s=objecttype&toppieces=True&yearfrom=${yearFrom}&yearto=${yearTo}&ps=60&key=WU1Jjq7U&format=json&st=OBJECTS`)
      .done(function(response){
        tempList = response.artObjects;
        artist !== '' ? showRoom.filterTempListOnArtist(artist):false;
        showRoom.appendResponseToInterface(tempList,listIndex);
        showRoom.appendImgToMainFigure(tempList[0].webImage.url,0);
        showRoom.appendTextToMainTextBox(tempList[0]);
      });
    },

    filterTempListOnArtist: (artist) => {
      let arr = tempList.filter(function(elem){
        return elem.principalOrFirstMaker.indexOf(artist.substring(0,4))!==-1;
      });
      tempList = arr;
      return tempList;
    },

    rembrandtTour: () => {
      showRoom.startTour('','Rembrandt+Harmensz.+van+Rijn','schilder', '', '',0,'');
    },

    selfportraitsTour: () => {
      showRoom.startTour('self portrait','','schilder','','',0,'');
    },

    animalsTour: () => {
      showRoom.startTour('animals','','schilder','','',0,'');
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
      showRoom.lazyLoadImages();
      let Html = '';
      let section = document.getElementsByClassName('list-section')[index];

      if(tempList.length>0){
        for (let i = 0; i < list.length; i++) {
          if(list[i].webImage !== null ){
            Html += `<figure class="list-figure">
                            <img class="list-img" data-original="${list[i].webImage.url}">
                            <h4>${i+1}. ${list[i].longTitle}</h4>
                            <p>${list[i].principalOrFirstMaker}</p>
                            <a target="_blank" href="${list[i].webImage.url}">full-sized image</a>
                          </figure>`;
          }
        }
        section.innerHTML = Html;
        showRoom.addEventListenerToListFigure();
      }//If search shows no results append error message in section instead.
      else{
        showRoom.showEmptySearchMessage(section);
      }
      section.style.background = "white";
    },

    showEmptySearchMessage: (section) => {
      section.innerHTML = '<h2>Unfortunatly no results were found for your search.</h2>';
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
        mainImg !== undefined ? mainImg.setAttribute('src', url):{};
    },

    appendTextToMainTextBox: (obj) => {
      let mainTextBox = document.getElementsByClassName('main-figure-text-container')[0];
      mainTextBox !== undefined ? mainTextBox.innerHTML =
      `<h2>${obj.longTitle}</h2>
      <p>${obj.principalOrFirstMaker}</p>
      <a target="_blank" href="${obj.webImage.url}">Full-sized image</a>`:{};
    },

    changeMainImgOnClickForward: () => {
      let img = document.getElementsByClassName('main-img')[0].src;
      for (let i = 0; i < tempList.length; i++) {
        if(tempList[i].webImage.url===img){
          showRoom.appendImgToMainFigure(tempList[i+1].webImage.url,0);
          showRoom.appendTextToMainTextBox(tempList[i+1]);
        }
      }
    },

    changeMainImgOnClickBack: () => {
      let img = document.getElementsByClassName('main-img')[0].src;
      for (let i = 0; i < tempList.length; i++) {
        if(tempList[i].webImage.url===img){
          showRoom.appendImgToMainFigure(tempList[i-1].webImage.url,0);
          showRoom.appendTextToMainTextBox(tempList[i+1]);
        }
      }
    },
   //Only loads images that are visibil in the window + 400px down.
    lazyLoadImages: () => {
      $(function() {
        $("img.list-img").lazyload({threshold : 400});
      });
    },

    //Smooth scrolling
    smoothScrollAhref: () => {
      $('a[href*=\\#]').on('click', function(event){
          event.preventDefault();
          $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
      });
  },

    //Enables click on search-button when enter-key is pressed.
    enterKey:(e) => {
      e = window.event;
      if(e.keyCode == 13){
        document.getElementsByClassName('search-button')[0].click();
        return false;
      }
    },
    //Hides and shows header on scroll up/down.
    detectUpScrollAndToggleHeader: () => {
      var lastScrollTop = 0;
      $(window).on('scroll', function() {
        st = $(this).scrollTop();
        st > lastScrollTop ? document.getElementsByTagName('header')[0].classList.add('active'):
          document.getElementsByTagName('header')[0].classList.remove('active');

        lastScrollTop = st;
      });
    },

    //funciton that sets eventlisteners on app initiation and runs correct code on each html-site.
    init: function() {
      document.getElementById('rembrandt-main')!==null ? showRoom.rembrandtTour():{};
      document.getElementById('selfportraits-main')!==null ? showRoom.selfportraitsTour():{};
      document.getElementById('animals-main')!==null ? showRoom.animalsTour():{};
      document.getElementById('masterpieces-main')!== null ? showRoom.masterPiecesTour():{};
      document.getElementById('murder-main')!== null ? showRoom.murderTour():{};
      document.getElementById('flower-main')!== null ? showRoom.flowerTour():{};
      showRoom.detectUpScrollAndToggleHeader();
      showRoom.testScroll();
      //showRoom.smoothScrollAhref();
      document.getElementsByClassName('arrow-right')[0]!== undefined ? document.getElementsByClassName('arrow-right')[0].addEventListener('click', showRoom.changeMainImgOnClickForward):{};
      document.getElementsByClassName('main-img')[0]!== undefined ? document.getElementsByClassName('main-img')[0].addEventListener('click', showRoom.changeMainImgOnClickForward):{};
      document.getElementsByClassName('arrow-left')[0]!== undefined ? document.getElementsByClassName('arrow-left')[0].addEventListener('click', showRoom.changeMainImgOnClickBack):{};
      document.getElementsByClassName('search-button')[0] !== undefined ? document.getElementsByClassName('search-button')[0].addEventListener('click',showRoom.getFromSearchQuery):{};
      document.getElementsByClassName('search-input')[0] !== undefined ? document.getElementsByClassName('search-input')[0].addEventListener('keypress', function(){showRoom.enterKey(window.event);}):{};
    }
};//end showRoom.
})();

showRoom.init();
