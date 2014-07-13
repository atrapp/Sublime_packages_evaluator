window.SublimePackagesEvaluator = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    alert('Hello from Backbone!');
  }
};

$(document).ready(function(){
  SublimePackagesEvaluator.initialize();
});
