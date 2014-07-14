window.SublimePackagesEvaluator = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
};



SublimePackagesEvaluator.initialize = function(){
  console.log("initalized");
//************************
// ******   USER    ******
//************************
  var userCollection = new SublimePackagesEvaluator.Collections.Users();

  var userListView = new SublimePackagesEvaluator.Views.UserListView({
    collection: userCollection,
    el: $('.users')  // ==> this connects the collection to the ul in index.html AND puts it on the page !!!! go to 2
  });

  userCollection.fetch(); // ***   add userCollection.fetch() for connecting Backbone with Rails   ***

  $('form.user-form').on('submit', function(e){
    e.preventDefault();
    var emailField = $("form.user-form input[name='user-email'")
    var newEmail = emailField.val();
    emailField.val('');
    // userCollection.add({email: newEmail}); 
    userCollection.create({email: newEmail});    // ***   add --> create for connecting Backbone with Rails   ***
  });



//***************************
// ******   REVIEWS    ******
//***************************
  var reviewCollection = new SublimePackagesEvaluator.Collections.Reviews();

  var reviewListView = new SublimePackagesEvaluator.Views.ReviewListView({
    collection: reviewCollection,
    el: $('.reviews')  // ==> this connects the collection to the ul in index.html AND puts it on the page !!!! go to 2
  });

  reviewCollection.fetch(); // ***   add reviewCollection.fetch() for connecting Backbone with Rails   ***


  $('form.review-form').on('submit', function(e){
    e.preventDefault();

    var titleField = $("form.review-form input[name='review-title'")
    var newTitle = titleField.val();
    titleField.val('');

    var descriptionField = $("form.review-form #description")
    var newDescription = descriptionField.val();
    descriptionField.val('');

    var platformField = $("form.review-form input[name='review-platform']:checked")    
    switch(platformField.val()) {
      case "win":
        var newPlatform = "win";
        break;
      case "osx":
        var newPlatform = "osx";
        break;
      case "linux":
        var newPlatform = "linux";
        break;
      default:    
    }    
    platformField.prop('checked', false);

    var ratingField = $("form.review-form input[name='review-rating']:checked")    
    switch(ratingField.val()) {
      case "1":
        var newRating = "1";
        break;
      case "2":
        var newRating = "2";
        break;
      case "3":
        var newRating = "3";
        break;
      case "4":
        var newRating = "4";
        break;
      case "5":
        var newRating = "5";
        break;
      default:    
    }    
    ratingField.prop('checked', false);

    var dateNow = new Date();  
    var newDateTime = dateNow.toLocaleDateString();
    // var dmy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // var dmy = dateNow.toLocaleDateString();
    // var hh = dateNow.getHours(); 
    // var mm = dateNow.getMinutes();
    // var newDateTime = dmy + ', ' + hh + ':' + mm;

    // reviewCollection.add({title: newTitle, description: newDescription, platform: newPlatform, rating: newRating, datetime: newDateTime});
    // ***   add --> create for connecting Backbone with Rails   ***

    reviewCollection.create({title: newTitle, description: newDescription, platform: newPlatform, rating: newRating, datetime: newDateTime});

});


};
//***************************
// ******   SUBLIME    ******
//***************************


// ************ Model *************
function Package(packageJSON){
  this.name = packageJSON.name;
  this.description = packageJSON.highlighted_description;  
  this.author = packageJSON.author;
  this.platforms = packageJSON.platforms;
  this.downloads = packageJSON.unique_installs;
  this.installs_rank = packageJSON.installs_rank;
  this.reviews = packageJSON.reviews;
  this.rating = "3";  
}
// ************ View *************

function PackageView(model){
  this.model = model;
  this.el = undefined;
}


PackageView.prototype.render = function(){
  var newPackage = $('<li>');
  newPackage.html("<a href=\"https://sublime.wbond.net/packages/" + this.model.name + "\" target=\"_blank\">" + this.model.name + "</a>" + '</br>' + 
                  this.model.description + '</br>' +
                  this.model.author + '</br>' +
                  this.model.platforms + '</br>' +
                  this.model.downloads + '</br>' +
                  this.model.installs_rank + '</br>' +
                  this.model.rating + '</br>'                                  
                  );  

  // *****   show/hide reviews   ******
  var reviewsList = $('<ul>');
  $.each(this.model.reviews, function(idx, ele){
    var reviewsItem = $('<li>');
    reviewsItem.html(ele.title + '<br />' +
                     ele.description + '<br />' +
                     ele.platform + '<br />' +
                     ele.rating + '<br />' +
                     ele.datetime + '<br />' 
                    );    
    reviewsList.append(reviewsItem);
  });

  reviewsList.hide();

  var showHideReviewsButton = $('<button>Show/Hide Reviews</button>');
  showHideReviewsButton.on('click', function(){
    reviewsList.toggle();
  });  

  newPackage.append(showHideReviewsButton);
  

  // *****   edit reviews   ******

  var reviewForm = $('.review-form');
  reviewForm.hide();
  
  var modelName = this.model.name;
  
  var writeReviewButton = $('<button>Write a Review</button>');

  writeReviewButton.on('click', function(){    
    reviewForm[package_name] = modelName;    
    console.log("this reviewForm[package_name]:" + reviewForm[package_name]);    
    reviewForm.toggle();
  });

  newPackage.append(writeReviewButton);
  

  // *****   return this package   *****
  newPackage.append(reviewsList);

  this.el = newPackage;
  return this;
}



// ************ Collection *************
function PackageCollection(){
  this.models = {};
}

// ************ Add Package to Collection *************
PackageCollection.prototype.add = function(packageJSON){
  var that = this;
  var newPackage = new Package(packageJSON);
  this.models[packageJSON.name] = newPackage;

  $(this).trigger('addFlare');     // shoot up in the air that add flare
  return this;
}


// ************ Get Packages from Sublime *************
PackageCollection.prototype.fetch = function(packageName){
  var that = this;
  $.ajax({
    url: '/search?package_name='+packageName,
    dataType: 'json',
    success: function(data){
      console.log(data)
      for (idx in data){         
        that.add(data[idx]);
      }
    }
  })

};

function clearAndDisplayPackageList(){
  $('.packages').html('');
  for(idx in packageCollection.models){
    var package = packageCollection.models[idx];
    var packageView = new PackageView(package);
    $('.packages').append(packageView.render().el);
  }
}

var packageCollection = new PackageCollection(); 

//**************************************************



$(function(){
  SublimePackagesEvaluator.initialize();

  $('.package-form').on('submit', function(e){
    e.preventDefault();
    packageCollection.models = {}
    var newName = $('.package-form input[name="package_name"]').val();
    $('.package-form input[name="package_name"]').val('');
    packageCollection.fetch(newName);
  })

  // If you see the 'addFlare' shot in the sky!!!!
  $(packageCollection).on('addFlare', function(){
    clearAndDisplayPackageList();
  });

  

})

