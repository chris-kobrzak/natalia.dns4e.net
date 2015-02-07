function WindowUtil() {}

WindowUtil.scrollToTop = function(duration) {
  duration = duration || "slow";
  $("html, body").animate({ scrollTop: 0 }, duration);
};
