
  // bring up modal box
// function modalRender() {
//   $('body').append('<div id="overlay"></div>');
//   $('body').append('<div id="modal"><h1>Choose your Scene!</h1><button class="scenes">earth</button><button class="scenes">space</button><button class="scenes">night</button><button class="scenes">diego</button><button class="scenes">boats</button></div>');
// }
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
