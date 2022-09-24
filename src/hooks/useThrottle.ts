export default function throttle(callback: Function, limit: number) {
  var waiting = false;
  return function () {
    if (!waiting) {
      // @ts-ignore
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}

function useThrottle(callback: Function, limit: number) {
  let lastTime = 0;
  return function () {
    const now = Date.now();
    if (now - lastTime >= limit) {
      callback();
      lastTime = now;
    }
  };
}
