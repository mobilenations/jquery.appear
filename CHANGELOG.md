jquery-appear-original CHANGELOG
======================

0.5.1
-----
- Add eslint

0.5.0
-----
- Publish to npm. Rename to jquery-appear-original because of jquery.appear name is taken.

0.4
-----
- Support latest jQuery. To track arbitrary selectors instead of $(selector).appear() now it must be called as $.appear(selector).

0.3.3
-----
- IE8 compatibility fix.

0.3.2
-----
- Code cleanups. Appear now supports not only jQuery selectors but also raw DOM nodes wrapped in jQuery.

0.3.1
-----
- Added "disappear" event. Removed first argument (callback function) from $.fn.appear function. "appear" event is now triggered for each appeared element (before it was triggered only for a first element in selector).