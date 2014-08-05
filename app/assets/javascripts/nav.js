var App = {
  Router: null,
  initialize: function(){   
    this.router = new App.Router();   
    Backbone.history.start();
  }
}

App.Router = Backbone.Router.extend({
 
  routes : {   
    'about'     : 'about',
    'search'    : 'search',    
    'contact'   : 'contact'
  },

  about: function(){   
      removeActiveClass();
      $(".about-menu").addClass("active");   
      scrollToAnchor('about');  
  },

  search: function(){   
      removeActiveClass();
      $(".search-menu").addClass("active");   
      scrollToAnchor('search');   
  },

  contact: function(){  
      removeActiveClass();
      $(".contact-menu").addClass("active");   
      scrollToAnchor('contact');   
  }

})
 
function removeActiveClass(){ 
  $(".about-menu").removeClass("active");
  $(".search-menu").removeClass("active"); 
  $(".contact-menu").removeClass("active");
}

function scrollToAnchor(anchor){  
  var aTag = $("#"+ anchor +"-block");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');   
}


$(function(){
  App.initialize();
})
