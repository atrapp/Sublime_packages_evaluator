SublimePackagesEvaluator.Collections.Users = Backbone.Collection.extend({

  model: SublimePackagesEvaluator.Models.User,
  url: '/users'   // ***   add url for connecting Backbone with Rails   ***
});
