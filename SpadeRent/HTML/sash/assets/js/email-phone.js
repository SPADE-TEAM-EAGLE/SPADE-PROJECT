var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
$(document).on("input", 'input[type="email"]', function () {
  var email = $(this).val();
  var email_span = $(this).siblings(".text-danger");
  if (!emailRegex.test(email)) {
  // console.log("email not ok");
    $(this).addClass("border-danger").removeClass("border-green");
    email_span.removeClass("d-none");
  } else {
  // console.log("email  ok");
    $(this).addClass("border-green").removeClass("border-danger");
    email_span.addClass("d-none");
  }
});
$(document).on(
  "input change",
  'input:not([type="tel"]):not(.modal *):not(#typehead,#typehead1,#typehead2,#search_input,#typehead_users), select:not(#lengthSelectBox, #lengthSelectBox1, #lengthSelectBox2, #lengthSelectBox3, #lengthSelectBox4, #lengthSelectBox5):not(.modal *)',
  function () {
    var input_select_value = $(this).val();
    var input_select_value_span = $(this).siblings(".text-danger");
    if (input_select_value === "") {
    // console.log("input or select is empty");
      $(this).addClass("border-danger").removeClass("border-green");
    } else {
    // console.log("input or select is filled");
      $(this).addClass("border-green").removeClass("border-danger");
    }
  }
);
const errorMap = [
  "Invalid Phone Number. Please enter a different number",
  "Invalid country code",
  "Too short",
  "Too long",
  "Invalid Phone Number. Please enter a different number",
];
$('input[type="tel"]').each(function () {
  const input = $(this);
  const errorMsg = input
    .siblings(".error-msg");
  const validMsg = input
    .siblings(".valid-msg");
  const iti = window.intlTelInput(this, {
    utilsScript: "/intl-tel-input/js/utils.js?1684676252775",
  });
  const reset = () => {
    input.removeClass("error");
    errorMsg.html("");
    errorMsg.addClass("d-none");
    validMsg.addClass("d-none");
  };
  input.on("input", () => {
    reset();
    if (input.val().trim()) {
      if (iti.isValidNumber()) {
        const formattedNumber = intlTelInputUtils.formatNumber(
          iti.getNumber(),
          iti.getSelectedCountryData().iso2,
          intlTelInputUtils.numberFormat.NATIONAL
        );
        input.val(formattedNumber);
        // validMsg.removeClass("d-none");
        input.removeClass("border-danger");
        input.addClass("border-green");
      } else {
        input.addClass("border-danger");
        input.removeClass("border-green");
        input.addClass("error");
        const errorCode = iti.getValidationError();
        errorMsg.html(errorMap[errorCode]);
        errorMsg.removeClass("d-none");
      }
    }
  });
});
$(document).ready(function () {
  var modalOpen = false;
  $(".modal").on("shown.bs.modal", function () {
    modalOpen = true;
  });
  $(".modal").on("hidden.bs.modal", function () {
    modalOpen = false;
  });
  $('.modal input[required]:not([type="tel"]), .modal select[required]').on(
    "input change",
    function () {
      if (modalOpen) {
        var modalValid = $(this).val();
        var modalValid_span = $(this).siblings(".text-danger");
        if (
          ($(this).is("input") && modalValid === "") ||
          ($(this).is("select") && modalValid === "Choose...") ||
          ($(this).is('input[type="email"]') && !emailRegex.test(modalValid)) ||
          ($(this).is('input[name="zip"]') && modalValid.length !== 5)
        ) {
          $(this).removeClass("border-green").addClass("border-danger");
          modalValid_span.text("This field is required!");
          modalValid_span.removeClass("d-none");
        } else {
          $(this).removeClass("border-danger").addClass("border-green");
          modalValid_span.text("This field is required!");
          modalValid_span.addClass("d-none");
        }
      }
    }
  );
});
$("#addModal, #myModal_edit,#add-user-permissions,#edit-user-permissions").on(
  "hidden.bs.modal",
  function () {
    $("#error-msg").addClass("d-none");
    $("#valid-msg").addClass("d-none");
    for (var indexx = 0; indexx < 10; indexx++) {
      $("#error-msg" + indexx).addClass("d-none");
      $("#valid-msg" + indexx).addClass("d-none");
    }
    $(this)
      .find('input:not([type="radio"]), select:not(#assignee_update),textarea')
      .each(function () {
        if ($(this).is("select")) {
          $(this).val("Choose...");
          $(this).removeClass("border-green").removeClass("border-danger");
          $(this).siblings("span").addClass("d-none");
        } else {
          $(this).val("");
          $(this).removeClass("border-green").removeClass("border-danger");
        }
      });
  }
);
