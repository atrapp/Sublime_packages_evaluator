// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Collections.PackageCollection = Backbone.Collection.extend({
  model: SublimePackagesEvaluatorapp.Models.Package,
 // url: '/packages'   // ***   add url for connecting Backbone with Rails   ***
  //url: '/search?package_name='+packageName
});


// var collection = new SublimePackagesEvaluatorapp.Collections.PackageCollection()
// collection.url = '/search?package_name='+packageName

// collection.fetch()