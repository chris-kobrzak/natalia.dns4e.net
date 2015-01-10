function NumberUtil() {}

NumberUtil.isNumeric = function(string) {
  return ! isNaN( parseFloat( string ) );
};

NumberUtil.formatNumberAsTwoDigits = function(number) {
  if ( number < 10 ) {
    return "0" + number;
  }
  return number;
};
