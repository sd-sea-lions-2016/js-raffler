var function_name = "updateEntrantsList()";
setInterval ( function_name, 10000 );

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
      $('#raffle-list').html('');
      for (var i = 0; i < entrants.length; i++) {
        $('#raffle-list').prepend("<tr class='raffle-list-item'><td class='raffle-info'>" + entrants[i].username + "</td></tr>");
      }
    });
}
