(function(PouchDB, GalleryModel, GalleryHierarchyModel, GalleryManager, RemoteDatabaseManager) {
  var dbName = "natalie_gallery",
    remoteDbUrl = "http://natalie_www:topSecret@127.0.0.1:5984/natalie_gallery",
    db = new PouchDB( dbName ),
    remoteDb = new PouchDB( remoteDbUrl ),
    galleryModel = new GalleryModel( db ),
    galleryHierarchyModel = new GalleryHierarchyModel( db ),
    galleryManager = new GalleryManager( galleryModel, galleryHierarchyModel ),
    remoteDatabaseManager = new RemoteDatabaseManager( remoteDb, db );
  galleryManager.handleEvents();
  setTimeout( remoteDatabaseManager.replicateDb.bind(remoteDatabaseManager), 1500);
})(
  PouchDB,
  GalleryModel,
  GalleryHierarchyModel,
  GalleryManager,
  RemoteDatabaseManager
);
