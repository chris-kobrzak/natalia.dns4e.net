function GalleryNavigationViewModel(galleryNavigationModel) {
  this.galleryNavigationModel = galleryNavigationModel;
  return this.build();
}

GalleryNavigationViewModel.prototype.build = function() {
  var years = Object.keys( this.galleryNavigationModel ),
    i = 0,
    viewModel = [];

  years = ArrayUtil.sortDescending( years );

  for ( ; i < years.length; i++) {
    var galleryMonthsData = [],
      year = years[i],
      months = ArrayUtil.sortDescending( this.galleryNavigationModel[ year ] );
    for (var k = 0; k < months.length; k++) {
      var month = [ months[k] ];
      galleryMonthsData.push( GalleryNavigationViewModel.getMonthsDataForYearAndMonth( year, month ) );
    }
    viewModel.push( GalleryNavigationViewModel.getYearsData( year, galleryMonthsData ) );
  }
  return {
    years: years,
    yearsData: viewModel
  };
};

GalleryNavigationViewModel.getMonthsDataForYearAndMonth = function(year, month) {
  return {
    galleryId: this.getIdByYearAndMonth(year, month),
    galleryUrl: this.getUrlByYearAndMonth(year, month),
    galleryTitle: this.getNameByMonth( month )
  };
};

GalleryNavigationViewModel.getYearsData = function(year, monthsData) {
  return {
    year: year,
    yearMonths: "galleryYear" + year,
    monthsData: monthsData
  };
};

GalleryNavigationViewModel.getIdByYearAndMonth = function(year, month) {
  return "showGallery" + year + "-" + month;
};

GalleryNavigationViewModel.getUrlByYearAndMonth = function(year, month) {
  return "#gallery-" + year + "-" +month;
};

GalleryNavigationViewModel.getNameByMonth = function(month) {
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
