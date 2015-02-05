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
  var context = {
   galleryModel: this.galleryModel,
   galleryHierarchyModel: this.galleryHierarchyModel
  };
  $(window).bind("load hashchange",
    context,
    function(event) {
      var url = window.location.hash,
        context = event.data,
        dateParts = GalleryManager.parseGalleryLinkForYearAndMonth( url );
      if (dateParts) {
        context.galleryModel.load( dateParts.year, dateParts.month );
        context.galleryHierarchyModel.load();
      } else {
        context.galleryModel.loadLatestImage();
      }
    }
  );
};

GalleryManager.prototype.handleLatestImageSelectedEvent = function() {
  var context = {
    galleryManager: this,
    galleryModel: this.galleryModel,
    galleryHierarchyModel: this.galleryHierarchyModel
  };
  $(document).on("latestImageLoaded.GalleryModel",
    context,
    function(event, data) {
      var context = event.data,
        gallery = data.image.gallery,
        dateParts = gallery.split("-"),
        year = dateParts[0],
        month = dateParts[1];
// TODO Only proceed if the latest image is different from the one stored last time
      context.galleryManager.setImage( data.image );
      context.galleryModel.load( year, month );
      context.galleryHierarchyModel.load();
    }
  );
};

GalleryManager.prototype.handleGalleryReadyEvent = function() {
  var context = {
    galleryViewController: this.galleryViewController
  };
  $(document).on("loaded.GalleryModel",
  context,
  function(event, data) {
    var galleryViewModel = new GalleryViewModel( data.gallery );
    event.data.galleryViewController.populateTemplate( galleryViewModel );
  });
};

GalleryManager.prototype.handleGalleryHierarchyReadyEvent = function() {
  var context = {
    galleryNavigationViewController: this.galleryNavigationViewController
  };
  $(document).on("loaded.GalleryHierarchyModel",
  context,
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
