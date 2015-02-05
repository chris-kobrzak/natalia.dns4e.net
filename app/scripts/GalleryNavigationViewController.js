function GalleryNavigationViewController(options) {
  var defaults = {
    containerSelector: "#galleryNavigation",
    template: "templates/galleryYear.html",
    innerContainerBaseSelector: "#galleryYear",
    innerTemplate: "templates/galleryMonth.html"
  };
  $.extend(this, defaults, options);
}

GalleryNavigationViewController.prototype.populateTemplate = function(viewModel) {
  var innerContainerBaseSelector = this.innerContainerBaseSelector,
    innerTemplate = this.innerTemplate;
  function populateGallerySubnavigationTemplates() {
    for (var i = 0; i < viewModel.years.length; i++) {
      var isLast = i === viewModel.years.length - 1;
      populateGallerySubnavigationTemplate(
        viewModel.years[i],
        viewModel.yearsData[ i ].monthsData,
        isLast
      );
    }
  }

  function populateGallerySubnavigationTemplate(year, monthsData, isLast) {
    $(innerContainerBaseSelector + year).loadTemplate(
      innerTemplate,
      monthsData,
      {
        success: function() {
          if ( ! isLast ) {
            return;
          }
          $(document).trigger("templatePopulated.GalleryNavigationViewController");
        }
      }
    );
  }

  $(this.containerSelector).loadTemplate(
    this.template,
    viewModel.yearsData,
    {
      success: populateGallerySubnavigationTemplates
    }
  );
};
