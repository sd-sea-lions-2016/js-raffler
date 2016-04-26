$(function(){

//////////////// ADMIN-SIDE USER REGISTRATION /////////////////////////////////////////

  // We don't want to start until at least one
  $('.entrants').hide();

  $('#new-entrant-form').submit(function(event){
    event.preventDefault();

    console.log("register new entrant");

    var url = $(this).attr('action');
    var data = $(this).serialize();

    $.ajax({
      method: "POST",
      url: url,
      data: data
    })
      .done(function(response){
        console.log(response);
        $('#entrants-list').prepend("<li>" + response.username + "</li>");
        $('.entrants').show();
        $('#new-entrant-form').trigger('reset');
      });
  });

//////////////// USER-SIDE PUBLIC REGISTRATION /////////////////////////////////////////

$('#public-registration-form').submit(function(event){
  event.preventDefault();

  console.log("register new entrant");

  var url = $(this).attr('action');
  var data = $(this).serialize();

  $.ajax({
    method: "POST",
    url: url,
    data: data
  })
    .done(function(response){
      console.log(response);
      $('#public-registration-form').remove();
      $('#public-registration-status').html("Your confirmation number is: " + response.id);
    })
    .fail(function(response){
      $('#public-registration-status').html("There was an issue registering. Try again later: " + response);
    });
});
























});
