//  var input = document.querySelector("#phone");
//     window.intlTelInput(input, {
//       utilsScript: "../assets/plugins/intl-tel-input-master/utils.js",
//     });
//     var input2 = document.querySelector("#phone2");
//     window.intlTelInput(input2, {
     
//       utilsScript: "../assets/plugins/intl-tel-input-master/utils.js",
//     });

    // Get all input fields with type="tel"
var telInputs = document.querySelectorAll('input[type="tel"]');
telInputs.forEach(function (input) {
    window.intlTelInput(input, {
        utilsScript: "../assets/plugins/intl-tel-input-master/utils.js"
    });
});
