$(function(){
  console.log("happy")

/////////////////////////////////////////////////////////

  $('#new-entrant-form').submit(function(event){
    event.preventDefault();
    console.log("happy happy")

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
        $('#new-entrant-form').trigger('reset');
      });
  });

/////////////////////////////////////////////////////////


























});
