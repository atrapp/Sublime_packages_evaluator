// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require backbone
//= require sublime_packages_evaluator
//= require_tree ../templates
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers
//= require_tree .

// determines the definite load order of files


SublimePackagesEvaluator.initialize = function(){


// ******   USER    ******
  var userCollection = new SublimePackagesEvaluator.Collections.Users();

  var userListView = new SublimePackagesEvaluator.Views.UsersIndex({
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

// ******   PACKAGES    ******
 var packageCollection = new SublimePackagesEvaluator.Collections.Packages();

  var packageListView = new SublimePackagesEvaluatorapp.Views.PackagesIndex({
    collection: packageCollection,
    el: $('.packages')  // ==> this connects the collection to the ul in index.html AND puts it on the page !!!! go to 2
  });

  packageCollection.fetch(); // ***   add packageCollection.fetch() for connecting Backbone with Rails   ***


   $('form.package-form').on('submit', function(e){
    e.preventDefault();
    var nameField = $("form.package-form input[name='package-name'")
    var newName = nameField.val();
    nameField.val('');
    // packageCollection.add({name: newName}); 
    packageCollection.create({name: newName});    // ***   add --> create for connecting Backbone with Rails   ***
  });


};


$(function(){
  SublimePackagesEvaluator.initialize();
  
})
