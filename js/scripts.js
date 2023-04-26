//Select Styling
$('.selectpicker').selectpicker({
  width: '100%'
});
//Disabling Search Button
$(document).ready(function () {
   $('.search-input').keyup(function () {
      if ($.trim($(this).val()).length != 0) {
         $(this).parent().next('.search-submit').attr('disabled', false);
     } else {
         $(this).parent().next('.search-submit').attr('disabled', true);
     }
   })
});

//Textarea Auto Height
autosize($('textarea'));

//Sidebar Topic Selection
$(document).ready(function () {
   $('.choose-topic-rel').click(function () {
    $(this).addClass("opacity-100").siblings().removeClass("opacity-100");
   })
});

//Sliding Panel
jQuery(document).ready(function($){
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

  $('.neighbor-buttons').find('.n-view').on('click', function(event){
    event.preventDefault();
    var selected_member = $(this).data('type');
    $('.sliding-panel.'+selected_member+'').addClass('slide-in');

    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if( is_firefox ) {
      $('.wrapper').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').addClass('overflow-hidden');
      });
    } else {
      $('.wrapper').addClass('slide-out');
      $('body').addClass('overflow-hidden');
    }

  });

  $(document).on('click', '.wrap-overlay, .close-sliding-panel', function(event){
    event.preventDefault();
    $('.sliding-panel').removeClass('slide-in');

    if( is_firefox ) {
      $('.wrapper').removeClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').removeClass('overflow-hidden');
      });
    } else {
      $('.wrapper').removeClass('slide-out');
      $('body').removeClass('overflow-hidden');
    }
  });
});

//Tag Activate
$(document).ready(function () {
   $('.sp-ks-tabs .tag').click(function () {
    $(this).toggleClass("active");
   })
});

//Tag Remove
$(document).ready(function () {
   $('.tag-del').click(function () {
    $(this).closest(".tag").remove();
   })
});