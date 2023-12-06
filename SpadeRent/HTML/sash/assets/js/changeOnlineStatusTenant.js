$(document).ready(function() {
    function callAPI() {
      $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/inactiveTenant',
    type: 'PUT',
    contentType: false,
    processData: false,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
        success: function(response) {
        },
        error: function(xhr, status, error) {
          console.error('Error in API call:', error);
        }
      });
    }
    let pageReloaded = false;
    setTimeout(function() {
      pageReloaded = false;
      console.log(pageReloaded)
    }, 5000);
    let navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      pageReloaded = true;
    }
  console.log(pageReloaded)
    $(window).on('unload', function(event) {
      if (!pageReloaded) {
        console.log(pageReloaded)
        callAPI();
        alert('API call made');
      }
    });
  });
