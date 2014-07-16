window.SublimePackagesEvaluator = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
};

SublimePackagesEvaluator.initialize = function(){
 
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


  // *****   create a new review    ******
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

  // *****   delete a review    ******
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
  var newPackage = $('<tr>').append("<td colspan='2'>");
  newPackageTitle = $('<a>').attr("href","https://sublime.wbond.net/packages/" + this.model.name).attr('target','_blank').html(this.model.name).addClass('package-title');

  newPackage.html(
                  "<tr><td colspan='2'>" + this.model.description + '</td></tr>' +
                  '<tr><td class="package-label">Author:</td><td>' + this.model.author + '</td></tr>' +
                  '<tr><td class="package-label">Platforms:</td><td>' + this.model.platforms + '</td></tr>' +
                  '<tr><td class="package-label">Downloads:</td><td>' + this.model.downloads + '</td></tr>' +
                  '<tr><td class="package-label">Rank:</td><td>' + this.model.installs_rank + '</td></tr>'                                                
                  );   
  newPackage.prepend(newPackageTitle);

  // *****   show/hide reviews   ******
  var reviewsList = $('<ul>').addClass('reviews');

  reviewsCount = this.model.reviews.length;

  var reviewsTotal = $('<h3>').html(reviewsCount);
  reviewsList.append(reviewsTotal);
  $.each(this.model.reviews, function(idx, ele){

      deleteButton = '';

    // will be added later
    // if (window.currentUser && window.currentUser.id == ele.user_id) { 
    //   deleteButton = $('<button>').attr('data-action', 'release').html("Delete Review");
    //   deleteButton.on('click', function(e){
    //     e.preventDefault();
    //     console.log("Delete this review: " + ele.title + "(" + ele.id + ")");
    //     console.log("Index: " + idx + " in " + that.model.reviews);
    //     that.model.reviews.splice(idx, 1);
    //   })  
    //  }

    var reviewsItem = $('<li>');
    reviewsItem.html(ele.title + '<br />' +
                     ele.username + '<br />' +
                     ele.description + '<br />' +
                     ele.platform + '<br />' +
                     ele.rating + '<br />' +
                     ele.datetime + '<br />'                     
                    );       
    reviewsItem.append(deleteButton);
    reviewsList.append(reviewsItem);
  });

  reviewsList.hide();
  
  var showHideReviewsButton = $('<button>Show/Hide Reviews</button>').addClass('package-button');
  showHideReviewsButton.on('click', function(){
    reviewForm.hide('slow');
    reviewsList.toggle();
  });  

  newPackage.append(showHideReviewsButton);  

  // *****   write review   ****** 
  if (window.currentUser){
    var writeReviewButton = $('<button>Write a Review</button>').addClass('package-button');

    writeReviewButton.on('click', function(){  
      reviewForm.show(100, function(){
        $("form.review-form span[id='package_name'").html(that.model.name);  
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
      for (idx in data){         
        that.add(data[idx]);
      }
    }
  })
};

function clearAndDisplayPackageList(searchPackageName){
  var packagesTotal = 0;  
  $('.packages').html('');
  for(idx in packageCollection.models){
    packagesTotal += 1;
    var package = packageCollection.models[idx];
    var packageView = new PackageView(package);
    $('.packages').append(packageView.render().el);
  }
  $('.packages-total').html('<p>'+packagesTotal+' results for "' + searchPackageName + '"</p>');
}

var packageCollection = new PackageCollection(); 
 

//**************************************************


$(function(){
  SublimePackagesEvaluator.initialize();

  reviewForm = $('form.review-form');
  reviewForm.hide();

  var reviewsList = $('.reviews');
  // reviewsList.hide();

  var searchPackageName;
  $('.package-search-form').on('submit', function(e){
    e.preventDefault();
    packageCollection.models = {}
    searchPackageName = $('.package-search-form input[name="package_name"]').val();
    $('.package-search-form input[name="package_name"]').val('');
    packageCollection.fetch(searchPackageName);
  })
  
  $(packageCollection).on('addFlare', function(){
    clearAndDisplayPackageList(searchPackageName);
  })
  
})

