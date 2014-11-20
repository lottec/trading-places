$( document ).ready(function() {

  $('.navigation-button').click(function () {
    var width = $('.navigation-container').width();
    $('.navigation-container').css('left', -width);
    $('.navigation-container').show();
    $('.navigation-container').animate({
      left: "+="+width
    }, 400, function() {

    });
  });
  
});
