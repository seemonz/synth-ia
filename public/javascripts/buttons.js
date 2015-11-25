$(function(){
  var playerInstrumentButtons = $('#instrument-container');
  var synthiaInstrumentButtons = $('#synthia-instruments');
  var synthiaStateButtons = $('.synthia-state');

  // keep current synthia state button clicked down
  synthiaStateButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('.synthia-state > button');
    buttons.removeClass('focus');
    el.addClass('focus');
  });

  $('#off').on('click', function(){
    $('button.synthia-instruments').removeClass('focus');
  });

  // if you click on turns all synthia buttons on
  $('#on').on('click', function(){
    $('button.synthia-instruments').addClass('focus');
  });

  // keep current instrument button clicked down
  playerInstrumentButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('#instrument-container > button');
    buttons.removeClass('focus');
    el.addClass('focus');
    currentInstrument = scene[0].slice(0, 6) + el.text();
  });

  synthiaInstrumentButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('#synthia-instruments > button');
    el.toggleClass('focus');
  });
});
