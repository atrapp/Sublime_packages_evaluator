// *********************************
// *****   global variables   ******
// *********************************

window.SublimePackagesEvaluator = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
};

var packageCollection = new PackageCollection(); 


SublimePackagesEvaluator.initialize = function(){


  //*************************************
  // ******   REVIEWS  (backbone)  ******
  //*************************************
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

  
}; // end of SublimePackagesEvaluator.initialize 


// *********************
// *****   Model   *****
// *********************

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

// ********************
// *****   View   *****
// ********************

function PackageView(model){
  this.model = model;
  this.el = undefined;
}

PackageView.prototype.render = function(){
  var that = this;
  var $package = this;

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

  var reviewsCount = this.model.reviews.length;  
  var reviewsTitleText = reviewsCount + ' Reviews for ' + this.model.name;
  var $reviewsTotal = $('<h4>').addClass(this.model.name.replace(/\s+/g, '-') + "_reviewsTotal").html(reviewsTitleText);
  var $starDiv = $('<div>').addClass(this.model.name.replace(/\s+/g, '-') + "_stars");

  $reviewsTotal.append($starDiv);
  newPackage.append($reviewsTotal);
  
  if (reviewsCount > 0) {

    packageRating(this, $starDiv, reviewsCount);

    $.each(this.model.reviews, function(idx, ele) {

      // *****   add delete button to review (if author) and delete review if button is clicked  ****** 
      deleteButton = '';       
 
      if (window.currentUser && window.currentUser.id == ele.user_id) { 
        deleteButton = $('<button>').attr('data-action', 'release').html("Delete Review");
        
        deleteButton.on('click', function(e){
          var $reviewEl = $(e.target.parentElement);         
          e.preventDefault();        

          $.ajax({   
            url: '/reviews/'+ele.id,
            type: 'DELETE',
            dataType: 'json',
            success: function(data) {
              $reviewEl.hide();

              // get the index of the just deleted review !!
              var indexOfDeletedReview = $package.model.reviews.map(function(el) {
                return el.id;
              }).indexOf(data.id);

              $package.model.reviews.splice(indexOfDeletedReview, 1);               

              var reviewsCount = $package.model.reviews.length;  
              var reviewsTitleText = reviewsCount + ' Reviews for ' + $package.model.name;
              var $reviewsTotal = $('.' + $package.model.name.replace(/\s+/g, '-') + '_reviewsTotal');   

              var $starDiv = $('div.' + $package.model.name.replace(/\s+/g, '-') + "_stars");
              $starDiv.remove(); // remove all stars
              var $starDiv = $('<div>').addClass($package.model.name.replace(/\s+/g, '-') + "_stars");

              $reviewsTotal.html(reviewsTitleText);

              var packageRatingTotal = $('#' + $package.model.name.replace(/\s+/g, '-') + '_packageRatingTotal'); 
              packageRatingTotal.html(0);

              if (reviewsCount > 0) {
                packageRating($package, $starDiv, reviewsCount);
                $reviewsTotal.append($starDiv);
              }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Error in Operation 'Delete Review'");
            }    
          }) // end ajax
        }) // end deleteButton
      } // end if (window.currentUser ...) 

      // *****   create the reviews list   ****** 
      var reviewsItem = $('<li>');
      var reviewAuthor;
      if (ele.username != null) {
        reviewAuthor = ele.username;
      } else {
        reviewAuthor = ele.email;
      };   

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
    
    // *****   show/hide reviews button  ******
    var showHideReviewsButton = $('<button>Show/Hide Reviews</button>').addClass('package-button');
    showHideReviewsButton.on('click', function(){
      reviewForm.hide('slow');
      reviewsList.toggle();
    });
  
    newPackage.append(showHideReviewsButton); 

  }; // end if (reviewsCount > 0)


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


// **************************
// *****   Collection   *****
// **************************

function PackageCollection(){
  this.models = {};
}

// *****   Add Package to Collection   *****

PackageCollection.prototype.add = function(packageJSON){
  var newPackage = new Package(packageJSON);
  this.models[packageJSON.name] = newPackage;
  $(this).trigger('addFlare');
  return this;
}

// *****   Remove all Packages from Collection   *****

PackageCollection.prototype.removeAll = function(){
  $(this).trigger('noFlares');
  return this;
}


// *****************************************
// *****   Get Packages from Sublime   *****
// *****************************************

PackageCollection.prototype.fetch = function(packageName){
  var that = this;
  $.ajax({
    url: '/search?package_name='+packageName,
    dataType: 'json',
    success: function(data){
      if (data == '') {
        that.removeAll();             
      };     
      for (idx in data){         
        that.add(data[idx]);
      };     
      bubbleChart();
      pieChart();
      barChart();
    }
  })
};

PackageCollection.prototype.fetchTop25 = function(){
  var that = this;
  $.ajax({
    url: '/gettop25',
    dataType: 'json',
    success: function(data){         
      for (idx in data){         
        that.add(data[idx]);
      }     
      bubbleChart();
      pieChart();
      barChart();
    }
  })
};


// *************************
// *****   functions   *****
// *************************

function packageRating($package, $starDiv, reviewsCount) {
 
  var packageRating = 0;
 
  $.each($package.model.reviews, function(idx, ele){
    packageRating = packageRating + parseInt(ele.rating);    
  });

  var packageRatingAvg = Math.round((packageRating/reviewsCount) * 100) / 100;
  var packageRatingAvgR = Math.floor(packageRating/reviewsCount);

  var stars = 5;
  
  for (i=0;i< packageRatingAvgR;i++) {      
    var $star = $('<i>').addClass("fa fa-star fa-2x");
    $star.addClass($package.model.name.replace(/\s+/g, '-') + "_star");        
    $starDiv.append($star);  
    stars--;
  };

  if ( (packageRating%reviewsCount) != 0 ) {
    var $star = $('<i>').addClass("fa fa-star-half-o");
    $star.addClass($package.model.name.replace(/\s+/g, '-') + "_star");       
    $starDiv.append($star);  
    stars--;
  };

  while (stars > 0) {
    var $star = $('<i>').addClass("fa fa-star-o");
    $star.addClass($package.model.name.replace(/\s+/g, '-') + "_star");      
    $starDiv.append($star);       
    stars--;
  }
}


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
  
    // *****   D3 Visualization   *****
    packages = new Array;
    Object.keys(packageCollection.models).forEach(function (key) {         
        packages.push(packageCollection.models[key]);       
      });    
}


function clearPackageList(searchPackageName){
  var packagesTotal = 0; 
  packageCollection.models = {};
  
  $('.packages').html('No packages found.');
  $('.packages-total').html('<p>'+packagesTotal+' results for "' + searchPackageName + '"</p>'); 
  
    // *****   D3 Visualization   *****
    packages = new Array;
    Object.keys(packageCollection.models).forEach(function (key) {         
        packages.push(packageCollection.models[key]);       
      });    
}

 
// **********************************************
// *****   Main function (document ready)   *****
//***********************************************

$(function(){

  SublimePackagesEvaluator.initialize();
  packageCollection.fetchTop25();

  reviewForm = $('form.review-form');
  reviewForm.hide();

  var reviewsList = $('.reviews');  

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

  $(packageCollection).on('noFlares', function(){
    clearPackageList(searchPackageName);    
  })

  // ********************************
  // *****   D3 Visualization   *****
  // ********************************
  
  // *****   chart legend   *****
  $chartlegend = $('#d3chartlegend');
  $chartlegend.append($('<h4>').html("Sublime Packages Chart Legend")); 

  $legend = $('<ul>').addClass('legend');
  $legendheader = $('<li>').html("Popularity by unique installs").css({'font-size':'14px','color':'gray'});
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
  buildSvgBubbleChart();

  // *****   piechart   *****
  $('#d3piechart').append($('<h4>').html("Sublime Packages Pie Chart"));
  buildSvgPieChart();
  
  // *****   barchart   *****
  $('#d3barchart').append($('<h4>').html("Sublime Packages Bar Chart"));  
  buildSvgBarChart();

})

