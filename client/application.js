$(function(){

/////////////////////////////////////////////////////////

  // We don't want to start until at least one 
  $('.entrants').hide();

  $('#new-entrant-form').submit(function(event){
    event.preventDefault();

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

/////////////////////////////////////////////////////////


























});
