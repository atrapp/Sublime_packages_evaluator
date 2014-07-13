// determines the definite load order of files
var SublimePackagesEvaluatorapp = SublimePackagesEvaluatorapp || { Models: {}, Collections: {}, Views: {} };


SublimePackagesEvaluatorapp.Views.UserView = Backbone.View.extend({

  initialize: function(){
    this.listenTo(this.model, 'destroy', this.remove)
    this.listenTo(this.model, 'all', this.render);   
  },

  tagName: 'li',

  template: _.template($('#user-template').html()),
  editTemplate: _.template($('#edit-user-template').html()),
  render: function(){
    this.$el.empty();

    // EITHER THIS
    // --> corresponds with index.html template ..  <h2><%= user.email %></h2>
    //this.$el.html(this.template({user: this.model.toJSON()}));

    // OR 
    // --> corresponds with index.html template ..  <h2><%= email %></h2>
    var renderedHTML = this.template(this.model.attributes);
    this.$el.html(renderedHTML);

    return this;
  },

  events: {
    // 'click [data-action="release"]' : 'releaseUser',
    'click [data-action="edit"]' : 'renderEditForm',   
  },

  // releaseUser: function(){
  //   this.model.destroy();
  //   return this;
  // },

  renderEditForm: function(){
    var that = this;

    this.$el.html( this.editTemplate(this.model.attributes) );
    this.$el.find('form.edit-user-form').on('submit', function(e){
      e.preventDefault();
      var nameField = that.$el.find("input[name='user-email'");
      var newName = nameField.val();
      that.model.set('name', newName);
      that.model.save(); // ***   add save() for connecting Backbone with Rails   ***
    })   
    return this;
  },

});
