function GalleryViewController(options) {
  var defaults = {
    containerSelector: "#gallery",
    template: "templates/galleryItem.html"
  };
  $.extend(this, defaults, options);
}

GalleryViewController.prototype.populateTemplate = function(viewModel) {
  $( this.containerSelector ).loadTemplate(
    this.template,
    viewModel
  );
};
