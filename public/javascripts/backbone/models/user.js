// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Models.User = Backbone.Model.extend({
  defaults:{
    
    email: 'user1@test.com',
    password: 'pw',
    username: 'user1'   
 
  }
});
