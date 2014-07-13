SublimePackagesEvaluator.Views.PackagesIndex = Backbone.View.extend({

  template: JST['packages/index']
 
  initialize: function(){
    this.listenTo(this.collection, 'all', this.render);   
  },

  // tagName: 'ul',

  render: function(){
    var that = this;
    this.$el.empty();

    _.each(this.collection.models, function(package){
      // debugger;
      var packageView = new SublimePackagesEvaluator.Views.PackageView({model: package});
      that.$el.append(packageView.render().el);
    });

    return this;
  }

});

});
