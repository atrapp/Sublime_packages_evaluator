// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Views.PackageView = Backbone.View.extend({

  initialize: function(){
    this.listenTo(this.model, 'destroy', this.remove)
    this.listenTo(this.model, 'all', this.render);   
  },

  tagName: 'li',

  template: _.template($('#package-template').html()),
  editTemplate: _.template($('#edit-package-template').html()),
  render: function(){
    this.$el.empty();
    var renderedHTML = this.template(this.model.attributes);
    this.$el.html(renderedHTML);
    return this;
  },

  events: {
    'click [data-action="release"]' : 'releasePackage',
    'click [data-action="edit"]' : 'renderEditForm',   
  },

  releasePackage: function(){
    this.model.destroy();
    return this;
  },

  renderEditForm: function(){
    var that = this;

    this.$el.html( this.editTemplate(this.model.attributes) );
    this.$el.find('form.edit-package-form').on('submit', function(e){
      e.preventDefault();

      var nameField = that.$el.find("#name");
      var newName = nameField.val();
      that.model.set('name', newName);

      // var ratingField = that.$el.find("input[name='package-rating'");
      // var newRating = ratingField.val();
      var newRating = 3;
      that.model.set('rating', newRating);
      
      that.model.save(); // ***   add save() for connecting Backbone with Rails   ***
    })   
    return this;
  },

});

