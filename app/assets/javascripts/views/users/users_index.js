SublimePackagesEvaluator.Views.UsersIndex = Backbone.View.extend({

  template: JST['users/index']

  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  // tagName: 'ul',

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(user){
      // debugger;
      var userView = new SublimePackagesEvaluator.Views.UserView({model: user});
      that.$el.append(userView.render().el);
    });

    return this;
  }

});
