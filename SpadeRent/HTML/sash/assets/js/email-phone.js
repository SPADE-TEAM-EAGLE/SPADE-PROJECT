// Email validation
$(document).on('input', 'input[type="email"]', function () {
  var email = $(this).val();
  var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
  var email_span = $(this).siblings('.text-danger');
  if (!emailRegex.test(email)) {
      
      $(this).addClass("border-danger").removeClass("border-green");
      email_span.removeClass('d-none');
  } else {
      $(this).addClass("border-green").removeClass("border-danger");
      email_span.addClass('d-none');
  }
});

// Phone checker
const input = $('input[type="tel"]');
const errorMsg = $("#error-msg");
const validMsg = $("#valid-msg");
const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
const iti = window.intlTelInput(input[0], {
utilsScript: "/intl-tel-input/js/utils.js?1684676252775"
});

const reset = () => {
input.removeClass("error");
errorMsg.html("");
errorMsg.addClass("d-none");
validMsg.addClass("d-none");
};

input.on('input', () => {
reset();
if (input.val().trim()) {
  if (iti.isValidNumber()) {
    validMsg.removeClass("d-none");
    input.removeClass("is-invalid");
    input.addClass("is-valid");
  } else {
    input.addClass("is-invalid");
    input.removeClass("is-valid");
    input.addClass("error");
    const errorCode = iti.getValidationError();
    errorMsg.html(errorMap[errorCode]);
    errorMsg.removeClass("d-none");
  }
}
});
