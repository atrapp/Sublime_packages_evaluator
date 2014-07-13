// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Collections.UserCollection = Backbone.Collection.extend({
  model: SublimePackagesEvaluatorapp.Models.User,
  url: '/users'   // ***   add url for connecting Backbone with Rails   ***
});
