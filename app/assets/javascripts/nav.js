$(function(){
 
  $(".home-menu").addClass("active");

  function scrollToAnchor(anchor){
   // var aTag = $("div[name='"+ anchor +"']");
   var aTag = $("#"+ anchor +"-block");
   $('html,body').animate({scrollTop: aTag.offset().top},'slow');   
  };

  function removeActiveClass(){
    $(".home-menu").removeClass("active");   
    $(".search-menu").removeClass("active");
    $(".contact-menu").removeClass("active");
  };

  $(".home-menu").click(function() {
    removeActiveClass();
    $(".home-menu").addClass("active");   
    scrollToAnchor('home');
  });

  $(".search-menu").click(function() {
    removeActiveClass();
    $(".search-menu").addClass("active");   
    scrollToAnchor('search');
  });

})
