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
  if (packageJSON.highlighted_description) {
    this.description = packageJSON.highlighted_description;  
  } else {
    this.description = packageJSON.description; 
  };
  this.author = packageJSON.author;
  this.platforms = packageJSON.platforms;  
  this.unique_installs = packageJSON.unique_installs;
  this.installs_rank = packageJSON.installs_rank;
  this.reviews = packageJSON.reviews;
  // this.rating = "";  
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
                  '<tr><td class="package-label">Unique installs:</td><td>' + this.model.unique_installs + '</td></tr>' +
                  '<tr><td class="package-label">Rank:</td><td>' + this.model.installs_rank + '</td></tr>'                                                
                  );   
  newPackage.prepend(newPackageTitle);

  // *****   Package reviews   ******
  var reviewsList = $('<ul>').addClass('reviews');

  reviewsCount = this.model.reviews.length;  
  var reviewsTitleText = reviewsCount + ' Reviews for ' + this.model.name;

  // var reviewsTotal = $('<h3>').html(reviewsTitleText);
  // reviewsList.append(reviewsTotal);
  var reviewsTotal = $('<h4>').html(reviewsTitleText);
  newPackage.append(reviewsTotal);

  if (reviewsCount > 0) { 
  
    var packageRating = 0
    $.each(this.model.reviews, function(idx, ele){
      packageRating = packageRating + parseInt(ele.rating);    
    });

    var packageRatingAvg = Math.round((packageRating/reviewsCount) * 100) / 100;
    var packageRatingAvgR = Math.floor(packageRating/reviewsCount);

    var stars = 5;
    for (i=0;i< packageRatingAvgR;i++) {
      // newPackage.append('<i class="fa fa-star fa-2x"></i>');
      newPackage.append('<i class="fa fa-star"></i>');
      stars--;
    };

    if ( (packageRating%reviewsCount) != 0 ) {
      newPackage.append('<i class="fa fa-star-half-o"></i>');
      stars--;
    };

    while (stars > 0) {
      newPackage.append('<i class="fa fa-star-o"></i>');
      stars--;
    }

    var packageRatingText = packageRatingAvg.toString();
    var packageRatingTotal = $('<h4>').html(packageRatingText);
    //var packageRatingTotal = $('<span>').html(packageRatingText);
    newPackage.append(packageRatingTotal);


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

      // *****   create the reviews list   ****** 
      var reviewsItem = $('<li>');
      var reviewAuthor;
      if (ele.username != null) {
        reviewAuthor = ele.username;
      } else {
        reviewAuthor = ele.email;
      };   
debugger;
      reviewsItem.html('<p>' + reviewAuthor + '   (Rating: ' + ele.rating + ')</p>' +
                       '<p> wrote on <span>' + ele.datetime + '</span></p>' +
                       '<h4>' + ele.title + '</h4>' +                     
                       '<p>' + ele.description + '</p>' +
                       '<p>Platform: ' + ele.platform + '</p>'                                      
                      );  
      reviewsItem.addClass('reviewListItem');     
      reviewsItem.append(deleteButton);
      reviewsList.append(reviewsItem);
    });

    reviewsList.hide();
    
    // *****   show/hide reviews   ******
    var showHideReviewsButton = $('<button>Show/Hide Reviews</button>').addClass('package-button');
    showHideReviewsButton.on('click', function(){
      reviewForm.hide('slow');
      reviewsList.toggle();
    });
  
    newPackage.append(showHideReviewsButton); 

  }; // if (reviewsCount > 0)

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

PackageCollection.prototype.fetchTop25 = function(){
  console.log("in fetchTop25");
  var that = this;
  $.ajax({
    url: '/gettop25',
    dataType: 'json',
    success: function(data){      
      for (idx in data){         
        that.add(data[idx]);
      }
    }
  })
};

function clearAndDisplayPackageList(searchPackageName){

  resultsText = searchPackageName || '';

  var packagesTotal = 0; 
  
  $('.packages').html('');
  for(idx in packageCollection.models){
    packagesTotal += 1;
    var package = packageCollection.models[idx];
    var packageView = new PackageView(package);
    $('.packages').append(packageView.render().el);
  };

  if (resultsText == '') {
    $('.packages-total').html('<p>Top 25 Sublime Packages</p>');
  } else {
    $('.packages-total').html('<p>'+packagesTotal+' results for "' + resultsText + '"</p>');
  };
  
    // ************   D3 Visualization ************
    packages = new Array;
    Object.keys(packageCollection.models).forEach(function (key) {         
        packages.push(packageCollection.models[key]);       
      });   

    // removeSvg();    
    // buildSvg();
    // bubbleChart();
    // // bubbleChartRadius();
    // barChart();

    // removeSvgBubbleChart(); 
    // buildSvgBubbleChart();
   bubbleChart2();

    // removeSvgBubbleChartRadius();
    // buildSvgBubbleChartRadius();
    // bubbleChartRadius2();

    // removeSvgBarChart();
    // buildSvgBarChart();
    barChart2();
    // ********************************************
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
      //   removeSvg();
      // buildSvg();  
      //   bubbleChart();

    // removeSvgBubbleChart(); 
    // buildSvgBubbleChart();
    // bubbleChart2();
  })

  // *******************************
  // *****  D3 Visualization   *****
  // *******************************
  
  packageCollection.fetchTop25();

  // *****   chart legend   *****
  $chartlegend = $('#d3chartlegend');
  $chartlegend.append($('<h4>').html("Sublime Packages Chart Legend")); 

  $legend = $('<ul>').addClass('legend');
  $legendheader = $('<li>').html("Unique installs").css({'font-size':'14px','color':'gray'});
  $legend.append($legendheader);
  $legend1 = $('<li>').html("<span style='background-color:red'>red:</span> > 2,000,000");
  $legend.append($legend1);
  $legend2 = $('<li>').html("<span style='background-color:#ff7070'>light red:</span> > 100,000 & <= 2,000,000");
  $legend.append($legend2);
  $legend3 = $('<li>').html("<span style='background-color:blue'>blue:</span> > 10,000 & <= 100,000");
  $legend.append($legend3);
  $legend4 = $('<li>').html("<span style='background-color:steelblue'>steelblue:</span> > 5,000 & <= 10,000");
  $legend.append($legend4);
  $legend5 = $('<li>').html("<span style='background-color:lightblue'>light blue:</span> > 1,000 & <= 5,000");
  $legend.append($legend5);
  $legend6 = $('<li>').html("<span style='background-color:orange'>orange:</span> > 500 & <= 1,000");
  $legend.append($legend6);
  $legend7 = $('<li>').html("<span style='background-color:#fc6'>light orange:</span> <= 500");
  $legend.append($legend7);

  $chartlegend.append($legend);

  // *****   bubblechart   *****
  $('#d3bubblechart').append($('<h4>').html("Sublime Packages Bubble Chart"));

  // *****   bubblechartradius   *****
  $('#d3bubblechartradius').append($('<h4>').html("Sublime Packages Bubble Chart by Radius"));

  // *****   barchartchart   *****
  $('#d3barchart').append($('<h4>').html("Sublime Packages Bar Chart"));

  // buildSvg();
  buildSvgBubbleChart();
  buildSvgBubbleChartRadius();
  buildSvgBarChart();
  
})

