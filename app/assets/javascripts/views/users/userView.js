
SublimePackagesEvaluator.Views.UserView = Backbone.View.extend({

  initialize: function(){
    this.listenTo(this.model, 'destroy', this.remove)
    this.listenTo(this.model, 'all', this.render);   
  },

  tagName: 'li',
  
  template: JST['users/user'],

  editTemplate: JST['users/edit'],

  render: function(){
    this.$el.empty();
    var renderedHTML = this.template(this.model.attributes);
    this.$el.html(renderedHTML);

    return this;
  },

  events: {
    'click [data-action="release"]' : 'releaseUser',
    'click [data-action="edit"]' : 'renderEditForm',   
  },

  releaseUser: function(){
    this.model.destroy();
    return this;
  },

  renderEditForm: function(){
    var that = this;

    this.$el.html( this.editTemplate(this.model.attributes) );
    this.$el.find('form.edit-user-form').on('submit', function(e){
      e.preventDefault();
      var nameField = that.$el.find("input[name='user-email'");
      var newName = nameField.val();
      that.model.set('name', newName);
      that.model.save(); 
    })   
    return this;
  },

});
