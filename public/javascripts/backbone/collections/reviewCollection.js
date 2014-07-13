// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Collections.ReviewCollection = Backbone.Collection.extend({
  model: SublimePackagesEvaluatorapp.Models.Review,
  url: '/reviews'   // ***   add url for connecting Backbone with Rails   ***
});
