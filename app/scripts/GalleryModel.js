// TODO Remote sync functionality ought to go to a separate class
// TODO Class should be broken down into gallery and gallery-nav
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

GalleryModel.prototype.replicateDb = function() {
  this.remoteDb.replicate.to( this.db ).on("complete", function () {
    $(document).trigger( "dbReplicated.GalleryModel" );
    console.log( "Replication OK" );
  }).on("error", function (error) {
    console.error( "Could not replicate remote database", error );
  });
};

GalleryModel.prototype.loadLatestImage = function() {
  this.db.allDocs({
    include_docs: true,
    descending: true,
    limit: 1,
    skip: 1,
  }).then( function( response ) {
    var image = GalleryModel.parseDbResponseForImage( response.rows[0] );
    $(document).trigger( "latestImageLoaded.GalleryModel", {
      image: image
    });
  }).catch( function( error ) {
     console.error( "Could not select latest image", error );
  });
};

GalleryModel.prototype.loadGallery = function( year, month ) {
  this.db.allDocs({
    include_docs: true,
    descending: true,
    startkey: GalleryModel.generateDbEndKeyFromYearAndMonth( year, month ),
    endkey: GalleryModel.generateDbKeyFromYearAndMonth( year, month )
  }).then( function( response ) {
    var gallery = GalleryModel.parseDbResponse( response.rows );
    $(document).trigger( "galleryLoaded.GalleryModel", {
      gallery: gallery
    });
  }).catch( function( error ) {
     console.error( "Could not load gallery", error );
  });
};

GalleryModel.prototype.loadNavigation = function() {
  this.db.allDocs().then( function( response ) {
    var galleryHierarchy = GalleryModel.parseDbResponseForNavigation( response.rows );
    $(document).trigger( "navigationLoaded.GalleryModel", {
      galleryHierarchy: galleryHierarchy
    });
  }).catch( function( error ) {
     console.error( "Could not load navigation", error );
  });
};

GalleryModel.generateDbKeyFromYearAndMonth = function(year, month) {
  var yyyyMmDd = ( (parseInt( year, 10 ) * 100) +
    parseInt( month, 10 ) ) * 100 + 1;
  return yyyyMmDd + "000000";
};

GalleryModel.generateDbEndKeyFromYearAndMonth = function(year, month) {
  var beginningOfNextMonth  = new Date(year, month),
    yearNextMonth = beginningOfNextMonth.getFullYear(),
    nextMonth = beginningOfNextMonth.getMonth() + 1;
  return this.generateDbKeyFromYearAndMonth( yearNextMonth, nextMonth );
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
    var photoData = this.parseDbResponseForImage( responseRows[i] );
    gallery.push( photoData );
  }
  return gallery;
};

GalleryModel.parseDbResponseForImage = function(responseRow) {
  var photoData = {};
  for (var dbField in this.imageAttributeMap) {
    if ( ! this.imageAttributeMap.hasOwnProperty( dbField ) ) {
      continue;
    }
    photoData[ this.imageAttributeMap[ dbField ] ] = responseRow.doc[ dbField ];
  }
  return photoData;
};
