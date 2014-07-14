// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Views.PackageListView = Backbone.View.extend({
 
  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  // tagName: 'ul',

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(package){
      // debugger;
      var packageView = new SublimePackagesEvaluatorapp.Views.PackageView({model: package});
      that.$el.append(packageView.render().el);
    });

    return this;
  }

});