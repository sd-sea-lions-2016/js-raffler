setInterval ( "updateEntrantsList()", 1000 );

function updateEntrantsList(){
  var form = $('#new-entrant-form');
  var url = form.attr('action');
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
