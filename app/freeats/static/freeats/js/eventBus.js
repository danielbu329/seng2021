define('eventBus', [
],
function () {
  var eventBus = (function () {
    var callback = {};

    return {
      on: function (event, cb) {
        if (!callback[event]) callback[event] = [];
          callback[event].push(cb);
      },

      emit: function (event, data) {
        if (!callback[event]) {
          console.warn('No listeners for event `'+event+'`');
        } else {
          callback[event].forEach(function (cb) {
            cb(data);
          });
        }
      }
    };

  })();
  
  return eventBus;
});