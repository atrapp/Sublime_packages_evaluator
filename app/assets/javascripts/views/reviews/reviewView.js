SublimePackagesEvaluator.Views.ReviewView = Backbone.View.extend({

  initialize: function(){
    this.listenTo(this.model, 'destroy', this.remove)
    this.listenTo(this.model, 'all', this.render);   
  },

  tagName: 'li',

  template: JST['reviews/review'],

  editTemplate: JST['reviews/edit'],

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
    this.$el.find('form.edit-review-form').on('submit', function(e){
      e.preventDefault();

      var packageField = that.$el.find("#package_name");
      var newPackage = packageField.val();

      var titleField = that.$el.find("#title");
      var newTitle = titleField.val();
       
      var descriptionField = that.$el.find("#description");
      var newDescription = descriptionField.val();
               
      var platformField = that.$el.find("input[name='review-platform']:checked");
      switch(platformField.val()) {
        case "win":
          var newPlatform = "win";
          break;
        case "osx":
          var newPlatform = "osx";
          break;
        case "linux":
          var newPlatform = "linux";
          break;
        default:    
      }    
      
      var ratingField = that.$el.find("input[name='review-rating']:checked");  
      switch(ratingField.val()) {
        case "1":
          var newRating = "1";
          break;
        case "2":
          var newRating = "2";
          break;
        case "3":
          var newRating = "3";
          break;
        case "4":
          var newRating = "4";
          break;
        case "5":
          var newRating = "5";
          break;
        default:    
      }  

      var dateNow = new Date();  
      var newDateTime = dateNow.toLocaleDateString();
      
      that.model.set({package_name: newPackage, title: newTitle, description: newDescription, platform: newPlatform, rating: newRating, datetime: newDateTime});

      that.model.save(); // ***   add save() for connecting Backbone with Rails   ***
    })   
    return this;
  },

});


