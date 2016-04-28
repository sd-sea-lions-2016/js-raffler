setInterval ( "updateEntrantsList()", 1000 );

function updateEntrantsList(){
  var form = $('#start-first-round');
  var url = "api" + form.attr('action') + "/entrants";
  console.log("Updating Entrants List");
  $.ajax({
    method: "GET",
    url: url
  })
    .done(function(response){
      console.log(response);
      var entrants = response;
      $('#entrants-list').html('');
      for (var i = 0; i < entrants.length; i++) {
        $('#entrants-list').prepend("<li>" + entrants[i].username + "</li>");
      }
    });
}
