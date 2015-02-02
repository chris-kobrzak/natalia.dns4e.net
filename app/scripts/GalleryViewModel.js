function GalleryViewModel(galleryModel) {
  this.galleryModel = galleryModel;
  return this.build();
}

GalleryViewModel.prototype.build = function() {
  var viewModel = [],
    i = 0;
  for ( ; i < this.galleryModel.length; i++) {
    var item = this.galleryModel[ i ];
    viewModel.push( GalleryViewModel.getPhotoDataFromGalleryItem( item ) );
  }
  return viewModel;
};

GalleryViewModel.getPhotoDataFromGalleryItem = function(item) {
  return {
    title: item.titlePl,
    filePath: "/photo/" + item.gallery + "/" + item.thumbnailFileName,
    src: "/thumbnail/" + item.gallery + "/" + item.thumbnailFileName
  };
};
