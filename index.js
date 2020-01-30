(function ($) {
  var selectors = [];

  var checkBinded = false;
  var checkLock = false;
  var defaults = {
    interval: 250,
    force_process: false,
    once: false,
    marginX: 0,
    marginY: 0
  };
  var $window = $(window);

  function isAppeared() {
    return $(this).is(':appeared');
  }

  function isNotTriggered() {
    return !$(this).data('_appear_triggered');
  }

  function isOnce() {
    return $(this).data('_appear_options').once;
  }

  function process() {
    checkLock = false;

    for (var index = 0; index < selectors.length; index++) {
      var sel = selectors[index];
      var $appeared = $(sel.selector).filter(isAppeared);

      $appeared
        .filter(isNotTriggered)
        .data('_appear_triggered', true)
        .trigger('appear', [$appeared]);

      var $once = $appeared.filter(isOnce);
      if ($once.length) {
        $appeared = $appeared.not($once);
        sel.selector = sel.selector.not($once);
        if (!sel.selector.length) {
          selectors.splice(index--,1);
          continue;
        }
      }

      if (sel.priorAppeared && sel.priorAppeared.length) {
        var $disappeared = sel.priorAppeared.not($appeared);
        $disappeared
          .data('_appear_triggered', false)
          .trigger('disappear', [$disappeared]);
      }
      sel.priorAppeared = $appeared;
    }
  }

  function addSelector(selector) {
    selectors.push({
      selector:selector,
      priorAppeared: null
    });
  }

  // ":appeared" custom filter
  $.expr.pseudos.appeared = $.expr.createPseudo(function (_arg) {
    return function (element) {
      var $element = $(element);

      if (!$element.is(':visible')) {
        return false;
      }

      var windowLeft = $window.scrollLeft();
      var windowTop = $window.scrollTop();
      var windowRight = windowLeft + $window.width();
      var windowBottom = windowTop + $window.height();

      var offset = $element.offset();
      var left = offset.left;
      var top = offset.top;
      var right = offset.left + $element.width();
      var bottom = offset.top + $element.height();

      // Adjust the virtual size of element based on the margins (with appropriate overrides)
      var options = $element.data('_appear_options');
      var marginX = options.marginX;
      if ((v = $element.data('appear-margin-x')) != undefined) marginX = v;
      else if ((v = $element.data('appear-left-offset')) != undefined) marginX = v;

      var marginY = options.marginY;
      if ((v = $element.data('appear-margin-y')) != undefined) marginY = v;
      else if ((v = $element.data('appear-top-offset')) != undefined) marginY = v;

      left -= marginX;
      right += marginX;
      top -= marginY;
      bottom += marginY;

      if (bottom >= windowTop && top <= windowBottom &&
          right >= windowLeft && left <= windowRight) {
        return true;
      }
      return false;
    };
  });

  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function (options) {
      $.appear(this, options);
      return this;
    }
  });

  $.extend({
    appear: function (selector, options) {
      var opts = $.extend({}, defaults, options || {});
      selector = $(selector); // Ensure it's a jQuery object
      selector.data('_appear_options',opts);

      if (!checkBinded) {
        var onCheck = function () {
          if (checkLock) {
            return;
          }
          checkLock = true;

          setTimeout(process, opts.interval);
        };

        $(window).scroll(onCheck).resize(onCheck);
        checkBinded = true;
      }

      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }

      addSelector(selector);
    },
    // force elements's appearance check
    force_appear: function () {
      if (checkBinded) {
        process();
        return true;
      }
      return false;
    }
  });
}(function () {
  if (typeof module !== 'undefined') {
    // Node
    return require('jquery');
  }
  return jQuery;
}()));
