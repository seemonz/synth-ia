$(function(){
  var playerInstrumentButtons = $('#instrument-container');
  var synthiaInstrumentButtons = $('#synthia-instruments');
  var synthiaStateButtons = $('.synthia-state');

  // keep current synthia state button clicked down
  synthiaStateButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('.synthia-state > button');
    buttons.removeClass('focus');
    $('#synthia-instruments > button').removeClass('focus'); // resets instrument buttons if synthia is turned off
    el.addClass('focus');
  });

  // keep current instrument button clicked down
  playerInstrumentButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('#instrument-container > button');
    buttons.removeClass('focus');
    el.addClass('focus');
    currentInstrument = el.text();
  });

  synthiaInstrumentButtons.delegate('button', 'click', function(){
    var el = $(this);
    var buttons = $('#synthia-instruments > button');
    buttons.removeClass('focus');
    el.addClass('focus');
  });
});