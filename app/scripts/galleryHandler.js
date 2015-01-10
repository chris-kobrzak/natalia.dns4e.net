var galleryModel = new GalleryModel({
  dbName: "natalie_gallery",
  remoteDbUrl: "http://natalie_www:topSecret@127.0.0.1:5984/natalie_gallery"
});

(function($, galleryModel, GalleryManager, date) {
  GalleryManager.handleEvents( galleryModel );

  var year = date.getFullYear(),
    month = date.getMonth() + 1;

  galleryModel.loadGallery( year, month );
  galleryModel.loadNavigation();

  setTimeout( function() {
    galleryModel.syncWithRemoteDb();
  }, 2000);
})(jQuery, galleryModel, GalleryManager, new Date() );
