// Email validation
$(document).on('input', 'input[type="email"]', function () {
  var email = $(this).val();
  var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
  var email_span = $(this).siblings('.text-danger');
  if (!emailRegex.test(email)) {
      // console.log("invalid");
      $(this).addClass("border-danger").removeClass("border-green");
      email_span.removeClass('d-none');
  } else {
      $(this).addClass("border-green").removeClass("border-danger");
      email_span.addClass('d-none');
  }
});

// Phone checker
const input = $('input[type="tel"]');
const errorMsg = input.next("#error-msg").add(input.closest("div").siblings("#error-msg"));
const validMsg = input.next("#valid-msg").add(input.closest("div").siblings("#valid-msg"));

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
console.log("valid phone");
    validMsg.removeClass("d-none");
    input.removeClass("border-danger");
    input.addClass("border-green");
  } else {
console.log("invalid phone");
    input.addClass("border-danger");
    input.removeClass("border-green");
    input.addClass("error");
    const errorCode = iti.getValidationError();
    errorMsg.html(errorMap[errorCode]);
    errorMsg.removeClass("d-none");
  }
}
});
$(document).on('input change', '.modal input[required]:not([type="email"]):not([type="tel"])', function () {
  var inputText = $(this).val();
  var inputText_span = $(this).siblings('.text-danger');
  if (inputText == '') {
      $(this).addClass("border-danger").removeClass("border-green");
      inputText_span.removeClass('d-none');
  } else {
      $(this).addClass("border-green").removeClass("border-danger");
      inputText_span.addClass('d-none');
  }
});

// select field validation
$(document).on('change', '.modal select[required]', function () {
  var selectText = $(this).val();
  var selectText_span = $(this).siblings('.text-danger');
  console.log(selectText);
  if (selectText == 'Choose...') {
      $(this).addClass("border-danger").removeClass("border-green");
      selectText_span.removeClass('d-none');
  } else {
      $(this).addClass("border-green").removeClass("border-danger");
      selectText_span.addClass('d-none');
  }
});
