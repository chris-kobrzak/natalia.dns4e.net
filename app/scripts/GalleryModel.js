function GalleryModel( options ) {
  var defaults = {
    dbName: "",
    remoteDbUrl: ""
  };

  $.extend(this, defaults, options);

  this.db = new PouchDB( this.dbName ),
  this.remoteDb = new PouchDB( this.remoteDbUrl );
}

GalleryModel.imageAttributeMap = {
  _id: "numericDate",
  file_name: "thumbnailFileName",
  thumbnail_name: "fileName",
  title_pl: "titlePl",
  title_en: "titleEn",
  gallery: "gallery"
};

GalleryModel.prototype.syncWithRemoteDb = function() {
  this.remoteDb.replicate.to( this.db ).on("complete", function () {
    $(document).trigger( "replicatedDb.GalleryModel" );
    console.log( "Replication OK" );
  }).on("error", function (error) {
    console.error( "Could not replicate remote database", error );
  });
};

GalleryModel.prototype.loadGallery = function( year, month ) {
  this.db.allDocs({
    include_docs: true,
    descending: true,
    startkey: GalleryModel.getDbEndKeyByYearAndMonth( year, month ),
    endkey: GalleryModel.getDbKeyByYearAndMonth( year, month )
  }).then( function( response ) {
    var gallery = GalleryModel.parseDbResponse( response.rows );
    $(document).trigger( "galleryReady.GalleryModel", {
      gallery: gallery
    });
  }).catch( function( error ) {
     console.error( "Could not load gallery", error );
  });
};

GalleryModel.prototype.loadNavigation = function() {
  this.db.allDocs().then( function( response ) {
    var galleryHierarchy = GalleryModel.parseDbResponseForNavigation( response.rows );
    $(document).trigger( "galleryHierarchyReady.GalleryModel", {
      galleryHierarchy: galleryHierarchy
    });
  }).catch( function( error ) {
     console.error( "Could not load navigation", error );
  });
};

GalleryModel.getDbKeyByYearAndMonth = function(year, month) {
  var yyyyMmDd = ( (parseInt( year, 10 ) * 100) +
    parseInt( month, 10 ) ) * 100 + 1;
  return yyyyMmDd + "000000";
};

GalleryModel.getDbEndKeyByYearAndMonth = function(year, month) {
  var beginningOfNextMonth  = new Date(year, month),
    yearNextMonth = beginningOfNextMonth.getFullYear(),
    nextMonth = beginningOfNextMonth.getMonth() + 1;
  return this.getDbKeyByYearAndMonth( yearNextMonth, nextMonth );
};

GalleryModel.parseDbResponseForNavigation = function(responseRows) {
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

GalleryModel.parseDbResponse = function(responseRows) {
  var gallery = [];
  for (var i = 0; i < responseRows.length; i++) {
    var photoData = {};
    for (var dbField in this.imageAttributeMap) {
      if ( ! this.imageAttributeMap.hasOwnProperty( dbField ) ) {
        continue;
      }
      photoData[ this.imageAttributeMap[ dbField ] ] = responseRows[i].doc[ dbField ];
    }
    gallery.push( photoData );
  }
  return gallery;
};
