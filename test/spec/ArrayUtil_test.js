/* global describe, it */

(function () {
  "use strict";

  describe("ArrayUtil", function () {
    describe("sortDescending", function () {
      it("Should sort array of integers", function () {
        var result = ArrayUtil.sortDescending( [9, 0, 3, 25, 7] );
        expect( result.length ).to.equal( 5 );
        expect( result ).to.eql( [25, 9, 7, 3, 0] );
      });
    });
  });
})();
