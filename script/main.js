var jsonex = (function(){
  return {
    get: () => {
      $.ajax({
        method: 'GET',
        dataType:'json',
        //url:"http://www.rijksmuseum.nl/api/oai2/[mvBTcUjC]/",
        url:"http://www.rijksmuseum.nl/api/oai2/mvBTcUjC/?verb=ListRecords&set=collectie_online&metadataPrefix=oai_dc",


        success: (response) => {

          console.log(response);
        },
        error:() => { console.log("error");}
    });
  }
};
})();

jsonex.get();
