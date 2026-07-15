var viewing_room = {

  init: function() {
      window.galleries.viewing_room.countdown_clock();
  },
  
  countdown_clock: function() {
      
      $('.countdown_clock').each(function() {
          
          var $this = $(this);
          
          // Set the date we're counting down to
          var start_date = $(this).attr('data-target-time');
          var countDownDate = new Date(start_date.replace(/-/g,"/")).getTime();
          
          // Clock is active
          if (!$this.closest('.countdown_clock').hasClass('active')) {
              $this.closest('.countdown_clock').addClass('active');
          }
          
          // Set clock on first load
          $this.html(window.galleries.viewing_room.update_clock_html(countDownDate));
          
          if (window.location.hash && window.location.hash == '#pausecountdown') {
              
          } else {
              // Update the countdown every 1 second
              setInterval(function() {
                  $this.html(window.galleries.viewing_room.update_clock_html(countDownDate));
              }, 1000);
          }
      
      });   
      
  },

  update_clock_html: function(countDownDate) {

        var clock_format = 'full';
        
        // Get today's date and time
        //var now = new Date().getTime();
        // Get in UTC
        var d =new Date();
        var timezone_offset = d.getTimezoneOffset();
        // Reverse timezone offset for the calculation below
        var timezone_offset = timezone_offset - (timezone_offset * 2)
        // Get current time adjusted to UTC
        var now = d.getTime() - (timezone_offset * 1000 * 60);
        
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        
        var _html_ = '';

          
          if (distance <= 0) {
              _html_ = ''
              $('.countdown_container').each(function() {
                  $(this).find('.countdown_text').text('');
                  if ($(this).hasClass('countdown_reload_on_completion')) {
                  //    window.location.reload();
                  } else {
                      if ($(this).hasClass('show_message_on_zero')) {
                          $(this).find('.countdown').remove();
                          $(this).find('.countdown_label_on_zero').removeClass('hidden');
                          $('body').addClass('countdown-clock-status-zero');
                      } else {
                          $(this).remove();
                      }
                  }
              });
          } else {
              
              if (clock_format == 'days') {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.ceil(distance / (1000 * 60 * 60 * 24));
                    _html_ += (days != 0 ? '<span class="numeral">'+ days+ '</span>' : '');
                    _html_ += (days != 0 ? ' <span class="countdown_text">'+ (days > 1 ? 'days' : 'day') + '</span>' : '');
                    
              } else if (clock_format == 'full') {
                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    _html_ += ('<span class="segment' + (days == 0 ? ' segment-expired' : '') + '"><span class="numeral">'+ days+ '</span><span class="period">Days</span></span><span class="segment-divide' + (days == 0 ? ' segment-divide-expired' : '') + '">:</span>' || '');
                    _html_ += ('<span class="segment' + (days == 0 && hours == 0 ? ' segment-expired' : '') + '"><span class="numeral">'+ hours+ '</span><span class="period">Hours</span></span><span class="segment-divide' + (days == 0 && hours == 0 ? ' segment-divide-expired' : '') + '">:</span>' || '');
                    _html_ += ('<span class="segment' + (days == 0 && hours == 0 && minutes == 0 ? ' segment-expired' : '') + '"><span class="numeral">'+ minutes+ '</span><span class="period">Mins</span></span><span class="segment-divide' + (days == 0 && hours == 0 && minutes == 0 ? ' segment-divide-expired' : '') + '">:</span>' || '');
                    _html_ += '<span class="segment' + (days == 0 && hours == 0 && minutes == 0 && seconds == 0 ? ' segment-expired' : '') + '"><span class="numeral">'+ seconds+ '</span><span class="period">Secs</span></span>';
              }
            
          }

        return _html_;
        
  }
  
}

window.galleries = window.galleries || {};
window.galleries.viewing_room = viewing_room;
export default viewing_room;