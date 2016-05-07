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
        $('#raffle-list').prepend("<tr class='raffle-list-item'><td class='raffle-info'>" + response.username + "</td></tr>");
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
      $('#public-registration-container').html("<div class='login-triangle'></div><h2 class='login-header'>Register for Raffle</h2><p style='background: white'>Your ticket number is: " + response.id.split('').splice(0,6).join('') + "</p></div>");
      $('.login-header').html("Registered for Raffle");
    })
    .fail(function(response){
      $('#public-registration-status').html("There was an issue registering. Try again later: " + response);
    });
});
























});
