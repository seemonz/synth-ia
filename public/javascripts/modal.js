

$(function(){
// console.log('wtf')


  // controls keyboard visual 
  var $keys = $(".key")
  function playKeys(){
    $keys.each(function(index,element){
      setTimeout(function(){
        $($keys[index-1]).removeClass('keydown')
        $($keys[index]).addClass('keydown')
      if (index === $keys.length-1){
        playKeys();
      }
      },100 * index);
    });
  };

  playKeys();
});


