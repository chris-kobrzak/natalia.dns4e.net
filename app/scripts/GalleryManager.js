function GalleryManager() {}

GalleryManager.handleEvents = function( galleryModel ) {
  this.handleGalleryReadyEvent();
  this.handleGalleryHierarchyReadyEvent();
  this.handleGalleryNavigationReadyEvent( galleryModel );
};

GalleryManager.handleGalleryReadyEvent = function() {
  $(document).on("galleryReady.GalleryModel", function(event, data) {
    GalleryManager.setGallery( data.gallery );
    GalleryManager.buildGallery();
  });
};

GalleryManager.handleGalleryHierarchyReadyEvent = function() {
  $(document).on("galleryHierarchyReady.GalleryModel", function(event, data) {
    GalleryManager.setGalleryHierarchy( data.galleryHierarchy );
    GalleryManager.buildGalleryNavigation();
  });
};

GalleryManager.handleGalleryNavigationReadyEvent = function( galleryModel ) {
  $(document).on("galleryNavigationReady.GalleryManager", function() {
    $("#galleryNavigation").on("click", "a", function( event ) {
      var dateParts = GalleryManager.exractYearAndMonthFromGalleryLink( this.href );
      galleryModel.loadGallery( dateParts.year, dateParts.month );
    });
  });
};

GalleryManager.buildGallery = function() {
  var photosData = [],
    i = 0;
  for ( ; i < this.gallery.length; i++) {
    var item = this.gallery[ i ];
    photosData.push( this.getPhotoDataFromGalleryItem( item ) );
  }

  this.populateGalleryTemplate( photosData );
};

GalleryManager.buildGalleryNavigation = function() {
  var years = Object.keys( this.galleryHierarchy ),
    i = 0,
    galleryYearsData = [];

  years = ArrayUtil.sortDescending( years );

  for ( ; i < years.length; i++) {
    var galleryMonthsData = [],
      year = years[i],
      months = ArrayUtil.sortDescending( this.galleryHierarchy[ year ] );
    for (var k = 0; k < months.length; k++) {
      var month = [ months[k] ];
      galleryMonthsData.push( this.getMonthsDataForYearAndMonth( year, month ) );
    }
    galleryYearsData.push( this.getYearsData( year, galleryMonthsData ) );
  }

  this.populateGalleryNavigationTemplate( years, galleryYearsData );
};

GalleryManager.getPhotoDataFromGalleryItem = function(item) {
  return {
    title: item.titlePl,
    filePath: "/photo/" + item.gallery + "/" + item.thumbnailFileName,
    src: "/thumbnail/" + item.gallery + "/" + item.thumbnailFileName
  };
};

GalleryManager.getMonthsDataForYearAndMonth = function(year, month) {
  return {
    galleryId: this.getIdByYearAndMonth(year, month),
    galleryUrl: this.getUrlByYearAndMonth(year, month),
    galleryTitle: this.getNameByMonth( month )
  };
};

GalleryManager.getYearsData = function(year, monthsData) {
  return {
    year: year,
    yearMonths: "galleryYear" + year,
    monthsData: monthsData
  };
};

GalleryManager.getIdByYearAndMonth = function(year, month) {
  return "showGallery" + year + "-" + month;
};

GalleryManager.getUrlByYearAndMonth = function(year, month) {
  return "#gallery-" + year + "-" +month;
};

GalleryManager.getNameByMonth = function(month) {
  var galleryNames = [
    "Styczeń / January",
    "Luty / February",
    "Marzec / March",
    "Kwiecień / April",
    "Maj / May",
    "Czerwiec / June",
    "Lipiec / July",
    "Sierpień / August",
    "Wrzesień / September",
    "Październik / October",
    "Listopad / November",
    "Grudzień / December"
  ];
  month = parseInt( month, 10 );
  return galleryNames[ --month ];
};

GalleryManager.populateGalleryTemplate = function(photosData) {
  $("#gallery").loadTemplate( "templates/galleryItem.html", photosData );
};

GalleryManager.populateGalleryNavigationTemplate = function(years, galleryYearsData) {
  function populateGallerySubnavigationTemplates() {
    for (var i = 0; i < years.length; i++) {
      var isLast = i === years.length - 1;
      populateGallerySubnavigationTemplate(
        years[i],
        galleryYearsData[ i ].monthsData,
        isLast
      );
    }
  }

  function populateGallerySubnavigationTemplate(year, monthsData, isLast) {
    $("#galleryYear" + year ).loadTemplate(
      "templates/galleryMonth.html",
      monthsData,
      {
        success: function() {
          if ( ! isLast ) {
            return;
          }
          $(document).trigger("galleryNavigationReady.GalleryManager");
        }
      }
    );
  }

  $("#galleryNavigation").loadTemplate(
    "templates/galleryYear.html",
    galleryYearsData,
    {
      success: populateGallerySubnavigationTemplates
     }
  );
};

GalleryManager.exractYearAndMonthFromGalleryLink = function( link ) {
  var yyyyDashMm = link.substr( link.length -7 ),
    dateParts = yyyyDashMm.split("-");
  return {
    year: dateParts[0],
    month: dateParts[1]
  };
};

GalleryManager.setGallery = function( gallery ) {
  this.gallery = gallery;
};

GalleryManager.getGallery = function() {
  return this.gallery;
};

GalleryManager.setGalleryHierarchy = function( galleryHierarchy ) {
  this.galleryHierarchy = galleryHierarchy;
};

GalleryManager.getGalleryHierarchy = function() {
  return this.galleryHierarchy;
};
