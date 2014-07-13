
// ************ Model *************
function Package(packageJSON){
  this.name = packageJSON.name;
  this.description = packageJSON.highlighted_description;  
  this.author = packageJSON.author;
  this.platforms = packageJSON.platforms;
  this.downloads = packageJSON.unique_installs;
  this.installs_rank = packageJSON.installs_rank;
  this.rating = "3";  
}

// ************ View *************
function PackageView(model){
  this.model = model;
  this.el = undefined;
}

PackageView.prototype.render = function(){
  var newElement = $('<li>').html("<a href=\"https://sublime.wbond.net/packages/" + this.model.name + "\" target=\"_blank\">" + this.model.name + "</a>" + '</br>' + 
                                  this.model.description + '</br>' +
                                  this.model.author + '</br>' +
                                  this.model.platforms + '</br>' +
                                  this.model.downloads + '</br>' +
                                  this.model.installs_rank + '</br>' +
                                  this.model.rating + '</br>');
  this.el = newElement;
  return this;
}

// ************ Collection *************
function PackageCollection(){
  this.models = {};
}

// ************ Add Package to Collection *************
PackageCollection.prototype.add = function(packageJSON){
  var newPackage = new Package(packageJSON);
  this.models[packageJSON.name] = newPackage;
  $(this).trigger('addFlare');     // shoot up in the air that add flare
  return this;
}

// PackageCollection.prototype.create = function(paramObject){
//   var that = this;
//    $.ajax({
//     url: '/search',
//     method: 'post',
//     dataType: 'json',
//     data: {package: paramObject},
//     success: function(data){
//       that.add(data);
//     }
//    })
// }

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

function clearAndDisplayPackageList(){
  $('.packages').html('');
  for(idx in packageCollection.models){
    var package = packageCollection.models[idx];
    var packageView = new PackageView(package);
    $('.packages').append(packageView.render().el);
  }
}

var packageCollection = new PackageCollection(); 

$(function(){

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


