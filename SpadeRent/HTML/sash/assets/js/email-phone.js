// Email validation
var emailRegex =/^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
$(document).on('input', 'input[type="email"]', function () {
  var email = $(this).val();
  var email_span = $(this).siblings('.text-danger');
  if (!emailRegex.test(email)) {
    console.log('email not ok');
      $(this).addClass("border-danger").removeClass("border-green");
      email_span.removeClass('d-none');
  } else {
    console.log('email  ok');

      $(this).addClass("border-green").removeClass("border-danger");
      email_span.addClass('d-none');
  }
});
$(document).on('input change', 'input:not([type="tel"]):not(.modal *):not(#typehead,#typehead1,#typehead2,#search_input,#typehead_users), select:not(#lengthSelectBox, #lengthSelectBox1, #lengthSelectBox2, #lengthSelectBox3, #lengthSelectBox4, #lengthSelectBox5):not(.modal *)', function () {
  var input_select_value = $(this).val();
  var input_select_value_span = $(this).siblings('.text-danger');
  if (input_select_value === '') {
    console.log('input or select is empty');
    $(this).addClass("border-danger").removeClass("border-green");
  } else {
    console.log('input or select is filled');
    $(this).addClass("border-green").removeClass("border-danger");
  }
});

const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

$('input[type="tel"]').each(function () {
  const input = $(this);
  const errorMsg = input.next(".error-msg").add(input.closest("div").siblings(".error-msg"));
  const validMsg = input.next(".valid-msg").add(input.closest("div").siblings(".valid-msg"));

  const iti = window.intlTelInput(this, {
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
});

// $(document).on('input change', '.modal input[required]:not([type="email"]):not([type="tel"])', function () {
//   var inputText = $(this).val();
//   var inputText_span = $(this).siblings('.text-danger');
//   if (inputText == '') {
//       $(this).addClass("border-danger").removeClass("border-green");
//       inputText_span.removeClass('d-none');
//   } else {
//       $(this).addClass("border-green").removeClass("border-danger");
//       inputText_span.addClass('d-none');
//   }
// });

// select field validation
// $(document).on('change', '.modal select[required]', function () {
//   var selectText = $(this).val();
//   var selectText_span = $(this).siblings('.text-danger');
//   console.log(selectText);
//   if (selectText == 'Choose...') {
//       $(this).addClass("border-danger").removeClass("border-green");
//       selectText_span.removeClass('d-none');
//   } else {
//       $(this).addClass("border-green").removeClass("border-danger");
//       sel  ectText_span.addClass('d-none');
//   }
// });
$(document).ready(function(){

  var modalOpen = false;
  
  $('.modal').on('shown.bs.modal', function () {
    modalOpen = true;
  });
  
  $('.modal').on('hidden.bs.modal', function () {
    modalOpen = false;
  });
  
  $('.modal input[required]:not([type="tel"]), .modal select[required]').on('input change', function () {
    if (modalOpen) {
      var modalValid = $(this).val();
      var modalValid_span = $(this).siblings('.text-danger');
      if (
        ($(this).is('input') && modalValid === '') || 
        ($(this).is('select') && modalValid === 'Choose...') || 
        ($(this).is('input[type="email"]') && !emailRegex.test(modalValid)) ||
        ($(this).is('input[name="zip"]') && modalValid.length !== 5) 
      ) {
        console.log("checker not Ok");
        $(this).removeClass("border-green").addClass("border-danger");
        modalValid_span.text('This field is required!');
        modalValid_span.removeClass('d-none');
      } else {
        console.log("checker Ok");
        $(this).removeClass("border-danger").addClass("border-green");
        modalValid_span.text('This field is required!');
        modalValid_span.addClass('d-none');
      }
    }
  });
})


// $('input[type="date"]').on('change',function(){
//   var dateValue = $(this).val().split('-');
//   var assignDateValue = dateValue[1] + '-' +  dateValue[2] + '-' +  dateValue[0]
//   alert(assignDateValue)
// $(this).val(assignDateValue)
// })

$('#addModal, #myModal_edit,#add-user-permissions,#edit-user-permissions').on('hidden.bs.modal', function() {
  $("#error-msg").addClass('d-none')
  $("#valid-msg").addClass('d-none')
  for (var indexx = 0; indexx < 10; indexx++) {
    $("#error-msg"+ indexx).addClass('d-none')
    $("#valid-msg" +indexx).addClass('d-none')
  }
  // var selectedFiles = [];
  // console.log($(this).find(".file-grid"));
  $(this).find('input, select,textarea').each(function(){
   if($(this).is('select')) {
    $(this).val('Choose...');
    $(this).removeClass('border-green').removeClass('border-danger')
    $(this).siblings('span').addClass('d-none')
    console.log($(this).siblings('span'));

   }else{
     $(this).val("")
     $(this).removeClass('border-green').removeClass('border-danger')
   }
  })
});



