function GalleryController(collaborators) {
  this.galleryModel = collaborators.galleryModel;
  this.galleryView = collaborators.galleryView;
  this.galleryHierarchyModel = collaborators.galleryHierarchyModel;
  this.galleryNavigationView = collaborators.galleryNavigationView;

  this.setCurrentImage(undefined);
  this.handleEvents();

  return this;
}

GalleryController.prototype.handleEvents = function() {
  this.handleDbReplicatedEvent();
  this.handleUrlChangeEvent();
  this.handleLatestImageSelectedEvent();
  this.handleGalleryReadyEvent();
  this.handleGalleryHierarchyReadyEvent();
  this.handleGalleryViewTemplatePopulatedEvent();
//  this.handleGalleryNavigationReadyEvent( galleryModel );
};

GalleryController.prototype.handleDbReplicatedEvent = function() {
  var context = {
   galleryModel: this.galleryModel
  };
  $(document).on("dbReplicated.RemoteDatabaseManager",
    context,
    function() {
      context.galleryModel.loadLatestImage();
    }
  );
};

GalleryController.prototype.handleUrlChangeEvent = function() {
  var context = {
   galleryModel: this.galleryModel,
   galleryHierarchyModel: this.galleryHierarchyModel
  };
  $(window).bind("load hashchange",
    context,
    function(event) {
      var url = window.location.hash,
        context = event.data,
        dateParts = GalleryController.parseGalleryLinkForYearAndMonth( url );
      if (dateParts) {
        context.galleryModel.load( dateParts.year, dateParts.month );
        context.galleryHierarchyModel.load();
      } else {
        context.galleryModel.loadLatestImage();
      }
    }
  );
};

GalleryController.prototype.handleLatestImageSelectedEvent = function() {
  var objects = {
    galleryController: this,
    galleryModel: this.galleryModel,
    galleryHierarchyModel: this.galleryHierarchyModel
  };
  $(document).on("latestImageLoaded.GalleryModel",
    objects,
    function(event, data) {
      var context = event.data,
        url = window.location.hash,
        urlDateParts = GalleryController.parseGalleryLinkForYearAndMonth( url ),
        gallery = data.image.gallery,
        dateParts = gallery.split("-"),
        year = dateParts[0],
        month = dateParts[1];
      var currentImage = context.galleryController.getCurrentImage();
      if (currentImage && currentImage.numericDate === data.image.numericDate) {
        return;
      }
      context.galleryController.setCurrentImage( data.image );
      if (! urlDateParts.year ||
          urlDateParts.year === year &&
          urlDateParts.month === month ) {
        context.galleryModel.load( year, month );
      }
      context.galleryHierarchyModel.load();
    }
  );
};

GalleryController.prototype.handleGalleryReadyEvent = function() {
  var objects = {
    galleryView: this.galleryView
  };
  $(document).on("loaded.GalleryModel",
    objects,
    function(event, data) {
      var galleryViewModel = new GalleryViewModel( data.gallery );
      event.data.galleryView.populateTemplate( galleryViewModel );
    }
  );
};

GalleryController.prototype.handleGalleryHierarchyReadyEvent = function() {
  var context = {
    galleryNavigationView: this.galleryNavigationView
  };
  $(document).on("loaded.GalleryHierarchyModel",
    context,
    function(event, data) {
      var galleryNavigationViewModel = new GalleryNavigationViewModel( data.galleryHierarchy );
      event.data.galleryNavigationView.populateTemplate( galleryNavigationViewModel );
    }
  );
};

GalleryController.prototype.handleGalleryViewTemplatePopulatedEvent = function() {
  var context = {
    galleryView: this.galleryView
  };
  $(document).on("templatePopulated.GalleryView",
    context,
    function(event) {
      event.data.galleryView.bindImageViewer();
    }
  );
};

/*
GalleryController.handleGalleryNavigationReadyEvent = function( galleryModel ) {
  $(document).on("templatePopulated.GalleryNavigationView", function() {
    $("#galleryNavigation").on("click", "a", function( event ) {
      var dateParts = GalleryController.parseGalleryLinkForYearAndMonth( this.href );
      galleryModel.load( dateParts.year, dateParts.month );
    });
  });
};
*/

GalleryController.parseGalleryLinkForYearAndMonth = function( link ) {
  var galleryRegEx = /gallery\-([0-9]{4})\-([0-9]{2})/i,
    dateParts = link.match( galleryRegEx );
  if (dateParts === null) {
    return false;
  }
  return {
    year: dateParts[1],
    month: dateParts[2]
  };
};

GalleryController.prototype.setCurrentImage = function( image ) {
  this.image = image;
};

GalleryController.prototype.getCurrentImage = function() {
  return this.image;
};
