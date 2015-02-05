function GalleryView(options) {
  var defaults = {
    containerSelector: "#gallery",
    template: "templates/galleryItem.html"
  };
  $.extend(this, defaults, options);
}

GalleryView.prototype.populateTemplate = function(viewModel) {
  $( this.containerSelector ).loadTemplate(
    this.template,
    viewModel,
    {
      success: function() {
        $(document).trigger("templatePopulated.GalleryView");
      }
    }
  );
};

GalleryView.prototype.bindImageViewer = function() {
  $( this.containerSelector + " a" ).addClass("swipebox");
  $( ".swipebox" ).swipebox();
};
