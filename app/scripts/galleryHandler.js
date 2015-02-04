(function(
    PouchDB,
    GalleryModel,
    GalleryHierarchyModel,
    GalleryViewController,
    GalleryManager,
    RemoteDatabaseManager) {
  var dbName = "natalie_gallery",
    remoteDbUrl = "http://natalie_www:topSecret@127.0.0.1:5984/natalie_gallery",
    db = new PouchDB( dbName ),
    remoteDb = new PouchDB( remoteDbUrl ),
    galleryModel = new GalleryModel( db ),
    galleryHierarchyModel = new GalleryHierarchyModel( db ),
    galleryViewController = new GalleryViewController(),
    galleryManager = new GalleryManager({
      galleryModel: galleryModel,
      galleryHierarchyModel: galleryHierarchyModel,
      galleryViewController: galleryViewController
    }),
    remoteDatabaseManager = new RemoteDatabaseManager( remoteDb, db );
  galleryManager.handleEvents();
  setTimeout( remoteDatabaseManager.replicateDb.bind(remoteDatabaseManager), 1500);
})(
  PouchDB,
  GalleryModel,
  GalleryHierarchyModel,
  GalleryViewController,
  GalleryManager,
  RemoteDatabaseManager
);
