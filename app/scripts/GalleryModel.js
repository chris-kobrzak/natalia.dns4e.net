// TODO Remote sync functionality ought to go to a separate class
// TODO Class should be broken down into gallery and gallery-nav
function GalleryModel(dbConnection) {
  this.db = dbConnection;
}

GalleryModel.imageAttributeMap = {
  _id: "numericDate",
  file_name: "thumbnailFileName",
  thumbnail_name: "fileName",
  title_pl: "titlePl",
  title_en: "titleEn",
  gallery: "gallery"
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

GalleryModel.prototype.load = function( year, month ) {
  this.db.allDocs({
    include_docs: true,
    descending: true,
    startkey: GalleryModel.generateDbEndKeyFromYearAndMonth( year, month ),
    endkey: GalleryModel.generateDbKeyFromYearAndMonth( year, month )
  }).then( function( response ) {
    var gallery = GalleryModel.parseDbResponse( response.rows );
    $(document).trigger( "loaded.GalleryModel", {
      gallery: gallery
    });
  }).catch( function( error ) {
     console.error( "Could not load gallery", error );
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

GalleryModel.parseDbResponse = function(responseRows) {
  var gallery = [];
  for (var i = 0; i < responseRows.length; i++) {
    var photoData = this.parseDbResponseForImage( responseRows[i] );
    gallery.push( photoData );
  }
  return gallery;
};
