(function(GalleryManager, GalleryModel) {
  var galleryModel = new GalleryModel({
      dbName: "natalie_gallery",
      remoteDbUrl: "http://natalie_www:topSecret@127.0.0.1:5984/natalie_gallery"
    }),
    galleryManager = new GalleryManager( galleryModel );
  galleryManager.handleEvents();
  setTimeout( galleryManager.replicateDb.bind(galleryManager), 1500);
})(GalleryManager, GalleryModel);
