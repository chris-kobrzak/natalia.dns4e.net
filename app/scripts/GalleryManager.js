function GalleryManager(collaborators) {
  this.galleryModel = collaborators.galleryModel;
  this.galleryViewController = collaborators.galleryViewController;
  this.galleryHierarchyModel = collaborators.galleryHierarchyModel;
  this.galleryNavigationViewController = collaborators.galleryNavigationViewController;
}

GalleryManager.prototype.handleEvents = function( galleryModel ) {
  this.handleUrlChangeEvent();
  this.handleLatestImageSelectedEvent();
  this.handleGalleryReadyEvent();
  this.handleGalleryHierarchyReadyEvent();
//  this.handleGalleryNavigationReadyEvent( galleryModel );
};

GalleryManager.prototype.handleUrlChangeEvent = function() {
  $(window).bind("load hashchange",
    {
      galleryModel: this.galleryModel,
      galleryHierarchyModel: this.galleryHierarchyModel
    },
    function(event) {
      var url = window.location.hash,
        dateParts = GalleryManager.parseGalleryLinkForYearAndMonth( url );
      if (dateParts) {
        event.data.galleryModel.load( dateParts.year, dateParts.month );
        event.data.galleryHierarchyModel.load();
      } else {
        event.data.galleryModel.loadLatestImage();
      }
    }
  );
};

GalleryManager.prototype.handleLatestImageSelectedEvent = function() {
  $(document).on(
    "latestImageLoaded.GalleryModel",
    {
      context: this,
      galleryModel: this.galleryModel,
      galleryHierarchyModel: this.galleryHierarchyModel
    },
    function(event, data) {
      var gallery = data.image.gallery,
        dateParts = gallery.split("-"),
        year = dateParts[0],
        month = dateParts[1];
// TODO Only proceed if the latest image is different from the one stored last time
      event.data.context.setImage( data.image );
      event.data.galleryModel.load( year, month );
      event.data.galleryHierarchyModel.load();
    }
  );
};

GalleryManager.prototype.handleGalleryReadyEvent = function() {
  $(document).on("loaded.GalleryModel",
  {
    galleryViewController: this.galleryViewController
  },
  function(event, data) {
    var galleryViewModel = new GalleryViewModel( data.gallery );
    event.data.galleryViewController.populateTemplate( galleryViewModel );
  });
};

GalleryManager.prototype.handleGalleryHierarchyReadyEvent = function() {
  $(document).on("loaded.GalleryHierarchyModel",
  {
    galleryNavigationViewController: this.galleryNavigationViewController
  },
  function(event, data) {
    var galleryNavigationViewModel = new GalleryNavigationViewModel( data.galleryHierarchy );
    event.data.galleryNavigationViewController.populateTemplate( galleryNavigationViewModel );
  });
};

/*
GalleryManager.handleGalleryNavigationReadyEvent = function( galleryModel ) {
  $(document).on("templatePopulated.GalleryNavigationViewController", function() {
    $("#galleryNavigation").on("click", "a", function( event ) {
      var dateParts = GalleryManager.parseGalleryLinkForYearAndMonth( this.href );
      galleryModel.load( dateParts.year, dateParts.month );
    });
  });
};
*/

GalleryManager.parseGalleryLinkForYearAndMonth = function( link ) {
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

GalleryManager.prototype.setImage = function( image ) {
  this.image = image;
};

GalleryManager.prototype.getImage = function() {
  return this.image;
};
