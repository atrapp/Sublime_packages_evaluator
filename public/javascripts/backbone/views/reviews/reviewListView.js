// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Views.ReviewListView = Backbone.View.extend({
 
  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  // tagName: 'ul',

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(review){
      // debugger;
      var reviewView = new SublimePackagesEvaluatorapp.Views.ReviewView({model: review});
      that.$el.append(reviewView.render().el);
    });

    return this;
  }

});