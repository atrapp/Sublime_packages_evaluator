// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Views.UserListView = Backbone.View.extend({
 
  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  // tagName: 'ul',

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(user){
      // debugger;
      var userView = new SublimePackagesEvaluatorapp.Views.UserView({model: user});
      that.$el.append(userView.render().el);
    });

    return this;
  }

});