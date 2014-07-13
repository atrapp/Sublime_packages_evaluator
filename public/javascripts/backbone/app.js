// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.initialize = function(){

//************************
// ******   USER    ******
//************************
  var userCollection = new SublimePackagesEvaluatorapp.Collections.UserCollection();

  var userListView = new SublimePackagesEvaluatorapp.Views.UserListView({
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

//****************************
// ******   PACKAGES    ******
//****************************
 var packageCollection = new SublimePackagesEvaluatorapp.Collections.PackageCollection();

  var packageListView = new SublimePackagesEvaluatorapp.Views.PackageListView({
    collection: packageCollection,
    el: $('.packages')  // ==> this connects the collection to the ul in index.html AND puts it on the page !!!! go to 2
  });

  packageCollection.fetch(); // ***   add packageCollection.fetch() for connecting Backbone with Rails   ***

  $('form.package-form').on('submit', function(e){
    e.preventDefault();

    var nameField = $("form.package-form input[name='package-name'")
    var newName = nameField.val();
    nameField.val('');

    // var ratingField = $("form.package-form input[name='package-rating'")
    // var newRating = ratingField.val();
    // ratingField.val('');
    var newRating = "3";    

    // packageCollection.add({name: newName, rating: newRating}); 
    packageCollection.create({name: newName, rating: newRating});    // ***   add --> create for connecting Backbone with Rails   ***
  });

//***************************
// ******   REVIEWS    ******
//***************************
  var reviewCollection = new SublimePackagesEvaluatorapp.Collections.ReviewCollection();

  var reviewListView = new SublimePackagesEvaluatorapp.Views.ReviewListView({
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


//**************************************************

};


$(function(){
  SublimePackagesEvaluatorapp.initialize();
  
})
