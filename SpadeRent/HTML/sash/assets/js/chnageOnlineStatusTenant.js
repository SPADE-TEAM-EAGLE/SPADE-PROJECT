$(document).ready(function() {
    // Function to make API call using jQuery AJAX
    function callAPI() {
      // localStorage.removeItem('authtoken');
      //                           localStorage.clear();
      //                           if($('body').hasClass('dark-mode')){
      //                   localStorage.setItem("sashdarkMode",true)
      //               }else if($('body').hasClass('light-mode')){
      //                   localStorage.setItem("sashlightMode",true)
      //               }
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
  
    // Set pageReloaded to false after a delay (e.g., 500ms)
    setTimeout(function() {
      pageReloaded = false;
      console.log(pageReloaded)
    }, 5000);
  
    // Check for navigation type 'reload'
    let navigationEntries = window.performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      pageReloaded = true;
    }
  console.log(pageReloaded)
    // Execute API call only on tab/browser close
    $(window).on('unload', function(event) {
      if (!pageReloaded) {
        // Perform API call before the window is closed
        console.log(pageReloaded)
        callAPI();
        alert('API call made');
      }
    });
  });
 