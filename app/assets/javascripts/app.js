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
    el: $('.users') 
  });

  userCollection.fetch(); 

  $('form.user-form').on('submit', function(e){
    e.preventDefault();
    var emailField = $("form.user-form input[name='user-email'")
    var newEmail = emailField.val();
    emailField.val('');
  
    userCollection.create({email: newEmail});   
  });

  //***************************
  // ******   REVIEWS    ******
  //***************************
  var reviewCollection = new SublimePackagesEvaluator.Collections.Reviews();

  var reviewListView = new SublimePackagesEvaluator.Views.ReviewListView({
    collection: reviewCollection,
    el: $('.reviews') 
  });

  reviewCollection.fetch(); 

  $('form.review-form').on('submit', function(e){
    e.preventDefault();

    var packageNameField = $("form.review-form input[name='review-package'")
    var newPackageName = packageNameField.val();
    packageNameField.val('');

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
    var newDateTime = dateNow.toString();
    
    var userId = $("form.review-form input[name='author_id']").val();

    reviewCollection.create({package_name: newPackageName, title: newTitle, description: newDescription, platform: newPlatform, rating: newRating, datetime: newDateTime, user_id: userId});

    $('form.review-form').hide()

    packageCollection.fetch(newPackageName);

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
  var that = this;
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
  var reviewsList = $('<ul>').addClass('reviews');
  $.each(this.model.reviews, function(idx, ele){

    var deleteButton = '';
    if (window.currentUser && window.currentUser.id == ele.user_id) { 
      deleteButton = "<p>delete</p>";
    }

    var reviewsItem = $('<li>');
    reviewsItem.html(ele.title + '<br />' +
                     ele.username + '<br />' +
                     ele.description + '<br />' +
                     ele.platform + '<br />' +
                     ele.rating + '<br />' +
                     ele.datetime + '<br />' +
                     deleteButton
                    );       

    reviewsList.append(reviewsItem);
  });

  reviewsList.hide();
  
  var showHideReviewsButton = $('<button>Show/Hide Reviews</button>');
  showHideReviewsButton.on('click', function(){
    reviewForm.hide('slow');
    reviewsList.toggle();
  });  

  newPackage.append(showHideReviewsButton);  

  // *****   write review   ****** 
  if (window.currentUser){
    var writeReviewButton = $('<button>Write a Review</button>');

    writeReviewButton.on('click', function(){  
      reviewForm.show(100, function(){
        $("form.review-form input[name='review-package'").val(that.model.name);
      });
      reviewsList.hide('slow');
      $(this).parent().append(reviewForm);
    });

    newPackage.append(writeReviewButton);
  }  
  
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

  $(this).trigger('addFlare');
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

  reviewForm = $('form.review-form');
  reviewForm.hide();

  var reviewsList = $('.reviews');
  // reviewsList.hide();

  $('.package-form').on('submit', function(e){
    e.preventDefault();
    packageCollection.models = {}
    var newName = $('.package-form input[name="package_name"]').val();
    $('.package-form input[name="package_name"]').val('');
    packageCollection.fetch(newName);
  })
  
  $(packageCollection).on('addFlare', function(){
    clearAndDisplayPackageList();
  })
  
})

