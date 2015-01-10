function ArrayUtil() {}

ArrayUtil.sortDescending = function( array ) {
  return array.sort( function(a, b) {return b-a;} );
};
