 var input = document.querySelector("#phone");
    window.intlTelInput(input, {
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      // placeholderNumberType: "MOBILE",
      // preferredCountries: ['cn', 'jp'],
      // separateDialCode: true,
      utilsScript: "../assets/plugins/intl-tel-input-master/utils.js",
    });
    var input2 = document.querySelector("#phone2");
    window.intlTelInput(input2, {
     
      utilsScript: "../assets/plugins/intl-tel-input-master/utils.js",
    });

    // Get all input fields with type="tel"
var telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(function (input) {
    window.intlTelInput(input, {
        utilsScript: "../assets/plugins/intl-tel-input-master/utils.js"
    });
});
