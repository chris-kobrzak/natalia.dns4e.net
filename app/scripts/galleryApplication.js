(function(
    PouchDB,
    GalleryModel,
    GalleryHierarchyModel,
    GalleryView,
    GalleryNavigationView,
    GalleryController,
    RemoteDatabaseManager) {
  var dbName = "natalie_gallery",
    remoteDbUrl = "http://natalie_www:topSecret@natalia.dns4e.net:5984/natalie_gallery",
    db = new PouchDB( dbName ),
    remoteDb = new PouchDB( remoteDbUrl ),
    remoteDatabaseManager = new RemoteDatabaseManager( remoteDb, db );
  new GalleryController({
    galleryModel: new GalleryModel( db ),
    galleryHierarchyModel: new GalleryHierarchyModel( db ),
    galleryView: new GalleryView(),
    galleryNavigationView: new GalleryNavigationView()
  });
  setTimeout( remoteDatabaseManager.replicateDb.bind(remoteDatabaseManager), 1000);
})(
  PouchDB,
  GalleryModel,
  GalleryHierarchyModel,
  GalleryView,
  GalleryNavigationView,
  GalleryController,
  RemoteDatabaseManager
);
