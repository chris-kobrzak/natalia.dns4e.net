This is a helper directory for symlinks to your JavaScript files.

This is to make it possible to run tests from command line (browser
tests work without any issues anyway).

Once you have symlinked the source files under `./test/src` and
referenced them within `./test/index.html`, you should be able to
execute the following command:

    $ grunt test

And if you want to monitor test results as you write tests:

    $ grunt watch:jstest
