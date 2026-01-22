function initDrag() {
  var $content = $(".content-container");
  var $left = $(".left-container");
  var $divider = $(".divider-container");
  var $body = $("body");
  var $document = $(document);
  var $leftDoubleArrow = $(".left-double-arrow");
  var $rightDoubleArrow = $(".right-double-arrow");
  var $exitFullScreen = $(".exit-full-screen");
  var $dragHandle = $divider.find(".drag-handle");

  var isDragging = false; // 是否正在拖拽
  var IS_HOVERED = "is-hovered";
  var ANIMATING = "animating";

  var setLeftContainerWidth = function (width) {
    var contentWidth = $content.width();
    var dividerWidth = $divider.width();
    var maxLeftWidth = contentWidth - dividerWidth;
    width = Math.min(width, maxLeftWidth);
    $left.width(width);
  };

  $left.on("transitionend", function (e) {
    if (e.originalEvent.propertyName === "width") {
      $left.removeClass(ANIMATING);
    }
  });

  function recoverWidth() {
    $left.width($content.width() / 2);
  }

  // 拖拽按钮点击
  $dragHandle.on("click", function (e) {
    e.preventDefault();
    $divider.removeClass(IS_HOVERED);
    recoverWidth();
  });

  // 键盘按下 ESC 键
  $document.on("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      recoverWidth();
    }
  });

  // 退出全屏提示
  function showExitFullScreen() {
    $exitFullScreen
      .show()
      .fadeTo(500, 1) // 透明度从 0 变成 1
      .delay(1300) // 延迟 1300 毫秒
      .fadeTo(500, 0) // 透明度从 1 变成 0
      .fadeOut();
  }

  function isDragHandleButton(dom) {
    return $(dom).closest(".drag-handle").length > 0;
  }

  function debounc(fn, delay) {
    var timer = null;
    function cancle() {
      if (timer) clearTimeout(timer);
    }
    function debounced() {
      cancle();
      var args = arguments;
      timer = setTimeout(
        function () {
          fn.apply(this, args);
        }.bind(this),
        delay
      );
    }
    debounced.cancle = cancle;
    return debounced;
  }

  // 点击左侧双箭头
  $leftDoubleArrow.on("click", function () {
    $left.addClass(ANIMATING);
    setLeftContainerWidth(0);
    showExitFullScreen();
  });

  // 点击右侧双箭头
  $rightDoubleArrow.on("click", function () {
    $left.addClass(ANIMATING);
    setLeftContainerWidth($content.width());
    showExitFullScreen();
  });

  // 鼠标悬停在分割线上
  var dividerMouseLeave = debounc(function (e) {
    e.preventDefault();
    if (isDragging) return;
    $divider.removeClass(IS_HOVERED);
  }, 200);

  $divider.on("mouseenter", function (e) {
    e.preventDefault();
    if (isDragging) return;
    dividerMouseLeave.cancle();
    $divider.addClass(IS_HOVERED);
  });

  // 鼠标离开分割线
  $divider.on("mouseleave", dividerMouseLeave);

  // 开始拖拽
  var startDragging = function () {
    isDragging = true;
    $divider.removeClass(IS_HOVERED);
    $body.addClass("dragging");
  };

  // 停止拖拽
  var stopDragging = function () {
    isDragging = false;
    $body.removeClass("dragging");
  };

  // 拖拽中间的分割线
  $divider.on("mousedown", function (e) {
    e.preventDefault(); // 阻止默认行为，因为它可能触发页面的其它元素的拖拽效果
    if (isDragHandleButton(e.target)) return;
    startDragging(); // 开始拖拽

    var startX = e.clientX;
    var leftWidth = $left.width();
    var isMouseDown = true;

    var onMousemove = function (e) {
      e.preventDefault();
      if (!isMouseDown) return;
      setLeftContainerWidth(leftWidth + e.clientX - startX);
    };

    var onMouseup = function (e) {
      e.preventDefault();
      stopDragging();
      $document.off("mousemove", onMousemove);
      $document.off("mouseup mouseleave", onMouseup);
    };

    $document.on("mousemove", onMousemove);
    $document.on("mouseup mouseleave", onMouseup);
  });
}

(function ($) {
  if (!$) return;
  $(initDrag);
})(window.jQuery);
