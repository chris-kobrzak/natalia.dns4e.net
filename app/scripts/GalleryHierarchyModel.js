function GalleryHierarchyModel(dbConnection) {
  this.db = dbConnection;
}

GalleryHierarchyModel.prototype.load = function() {
  this.db.allDocs().then( function( response ) {
    var galleryHierarchy = GalleryHierarchyModel.parseDbResponse( response.rows );
    // TODO Event name should be a variable to support multiple galleries
    $(document).trigger( "loaded.GalleryHierarchyModel", {
      galleryHierarchy: galleryHierarchy
    });
  }).catch( function( error ) {
     console.error( "Could not load navigation", error );
  });
};

GalleryHierarchyModel.parseDbResponse = function(responseRows) {
  var navigation = {};
  for (var i = 0; i < responseRows.length; i++) {
    var galleryId = responseRows[i].id;
    if (! NumberUtil.isNumeric( galleryId ) ) {
      continue;
    }
    var year = galleryId.slice(0, 4),
      month = galleryId.slice(4, 6);
    if (! ( year in navigation ) ) {
      navigation[year] = [];
    }
    if (! (~navigation[ year ].indexOf( month ) ) ) {
      navigation[ year ].push( month );
    }
  }
  return navigation;
};
