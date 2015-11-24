
  // scene selection close
$(function(){


  $(document).on('click', '.scenes', function(){
    $('#modal').remove();
    $('#overlay').remove();
  });

  $(document).on('click', '#overlay', function(){
    $('#modal').remove();
    $('#overlay').remove();
  });
});
