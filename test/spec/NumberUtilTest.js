/* global describe, it */
/*jshint expr: true*/

(function () {
  "use strict";

  describe("NumberUtil", function () {

    describe("isNumeric", function () {
      it("Confirms a positive integer is numeric", function () {
        var result = NumberUtil.isNumeric( 7 );
        expect( result ).to.be.true;
      });
      it("Confirms a negative integer is numeric", function () {
        var result = NumberUtil.isNumeric( -1 );
        expect( result ).to.be.true;
      });
      it("Confirms zero is numeric", function () {
        var result = NumberUtil.isNumeric( 0 );
        expect( result ).to.be.true;
      });
      it("Confirms a numeric string is numeric", function () {
        var result = NumberUtil.isNumeric( "07" );
        expect( result ).to.be.true;
      });
      it("Confirms a string is not numeric", function () {
        var result = NumberUtil.isNumeric( "fooBar" );
        expect( result ).to.be.false;
      });
      it("Confirms undefined is not numeric", function () {
        var result = NumberUtil.isNumeric( undefined );
        expect( result ).to.be.false;
      });
      it("Confirms null is not numeric", function () {
        var result = NumberUtil.isNumeric( null );
        expect( result ).to.be.false;
      });
    });

    describe("formatNumberAsTwoDigits", function () {
      it("Prepends zero to number in range 0-9", function () {
        var result = NumberUtil.formatNumberAsTwoDigits( 7 );
        expect( result ).to.equal("07");
      });
    });

  });
})();
