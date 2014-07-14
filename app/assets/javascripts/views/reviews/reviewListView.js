SublimePackagesEvaluator.Views.ReviewListView = Backbone.View.extend({

  template: JST['reviews/index'], 

  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(review){
      // debugger;
      var reviewView = new SublimePackagesEvaluator.Views.ReviewView({model: review});
      that.$el.append(reviewView.render().el);
    });

    return this;
  },

});

