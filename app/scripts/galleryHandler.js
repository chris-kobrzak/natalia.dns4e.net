(function(
    PouchDB,
    GalleryModel,
    GalleryHierarchyModel,
    GalleryView,
    GalleryNavigationView,
    GalleryManager,
    RemoteDatabaseManager) {
  var dbName = "natalie_gallery",
    remoteDbUrl = "http://natalie_www:topSecret@127.0.0.1:5984/natalie_gallery",
    db = new PouchDB( dbName ),
    remoteDb = new PouchDB( remoteDbUrl ),
    galleryModel = new GalleryModel( db ),
    galleryHierarchyModel = new GalleryHierarchyModel( db ),
    galleryView = new GalleryView(),
    galleryNavigationView = new GalleryNavigationView(),
    galleryManager = new GalleryManager({
      galleryModel: galleryModel,
      galleryHierarchyModel: galleryHierarchyModel,
      galleryView: galleryView,
      galleryNavigationView: galleryNavigationView
    }),
    remoteDatabaseManager = new RemoteDatabaseManager( remoteDb, db );
  galleryManager.handleEvents();
  setTimeout( remoteDatabaseManager.replicateDb.bind(remoteDatabaseManager), 1500);
})(
  PouchDB,
  GalleryModel,
  GalleryHierarchyModel,
  GalleryView,
  GalleryNavigationView,
  GalleryManager,
  RemoteDatabaseManager
);
