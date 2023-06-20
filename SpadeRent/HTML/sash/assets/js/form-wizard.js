(function ($) {
  "use strict";

  // WIZARD 1
  $("#wizard1").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
  });

  // WIZARD 2
  $("#wizard2").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex < newIndex) {
        // Step 1 form validation
        if (currentIndex === 0) {
          var fname = $("#firstname").parsley();
          var lname = $("#lastname").parsley();
          if (fname.isValid() && lname.isValid()) {
            // if ($('#firstname').val() != "" && $('#lastname').val() != "")
            // {
            //     $('#firstname').removeClass("is-invalid");
            //     $('#lastname').removeClass("is-invalid");
            //     $('#firstname').addClass("is-valid");
            //     $('#lastname').addClass("is-valid");
            // }
            return true;
          } else {
            // if ($('#firstname').val() == "" && $('#lastname').val() == "")
            // {
            //     fname.validate();
            //     lname.validate();
            //     $('#firstname').removeClass("is-valid");
            //     $('#lastname').removeClass("is-valid");
            //     $('#firstname').addClass("is-invalid");
            //     $('#lastname').addClass("is-invalid");
            // }
            // fname.validate();
            // lname.validate();
            // $("#firstname").addClass("is-invalid");
            // $("#lastname").addClass("is-invalid");
          }
        }
        // Step 2 form validation
        if (currentIndex === 1) {
          var email = $("#email").parsley();
          if (email.isValid()) {
            return true;
          } else {
            // email.validate();
          }
        }
        // Always allow step back to the previous step even if the current step is not valid.
      } else {
        return true;
      }
    },
  });

  // WIZARD 3
  $("#wizard3").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
    stepsOrientation: 1,
  });

  // DROPIFY
  $(".dropify-clear").on("click", function () {
    $(".dropify-render img").remove();
    $(".dropify-preview").css("display", "none");
    $(".dropify-clear").css("display", "none");
  });

  // ACCORDION WIZARD
  var options = {
    mode: "wizard",
    autoButtonsNextClass: "btn btn-primary float-end",
    autoButtonsPrevClass: "btn btn-light",
    stepNumberClass: "badge rounded-pill bg-primary me-1",
    onSubmit: function () {
      alert("Form submitted!");
      return true;
    },
  };
  $("#form").accWizard(options);
})(jQuery);

//Function to show image before upload

function readURL(input) {
  "use strict";

  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".dropify-render img").remove();
      var img = $('<img id="dropify-img">'); //Equivalent: $(document.createElement('img'))
      img.attr("src", e.target.result);
      img.appendTo(".dropify-render");
      $(".dropify-preview").css("display", "block");
      $(".dropify-clear").css("display", "block");
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$(document).ready(function () {
  // $("#firstname").on('keyup',function () {
  //   if ($("#firstname").val() != "") {
  //     $("#firstname").removeClass("is-invalid");
  //     $("#firstname").addClass("is-valid");
  //   }
  //   else
  //   {
  //       $("#firstname").removeClass("is-valid");
  //     $("#firstname").addClass("is-invalid");
  //   }
  // });
  // $("#lastname").on('keyup',function () {
  //   if ($("#lastname").val() != "") {
  //     $("#lastname").removeClass("is-invalid");
  //     $("#lastname").addClass("is-valid");
  //   }
  //   else
  //   {
  //       $("#lastname").removeClass("is-valid");
  //     $("#lastname").addClass("is-invalid");
  //   }
  // });
});

//***************************************************************** */
const togglePassword1 = document.querySelector("#togglePassword1");
const password1 = document.querySelector("#id_password1");

togglePassword1.addEventListener("click", function (e) {
  const type =
    password1.getAttribute("type") === "password" ? "text" : "password";
  password1.setAttribute("type", type);
 
});

//**************************************************************** */
//***************************************************************** */
const togglePassword2 = document.querySelector("#togglePassword2");
const password2 = document.querySelector("#id_password2");

togglePassword2.addEventListener("click", function (a) {
  // toggle the type attribute
  const type =
    password2.getAttribute("type") === "password" ? "text" : "password";
  password2.setAttribute("type", type);
  // toggle the eye slash icon

});

//**************************************************************** */

// first name

let card1 = document.getElementById("card1");
let card2 = document.getElementById("card2");
let card3 = document.getElementById("card3");
let card4 = document.getElementById("card4");
let card5 = document.getElementById("card5");
let part1 = document.getElementById("part1");
let part3 = document.getElementById("part3");
// let part4 = document.getElementById("part4");
let loader = document.getElementById("loader");

// document.getElementById("part4").disabled = true;
document.getElementById("part2").disabled = true;
document.getElementById("part3").disabled = true;
document.getElementById("next1").disabled = true;

var validname = /^[A-Za-z\s]+$/;
let firstname = document.getElementById("firstname1");
// let holdernamee = document.getElementById("holdernamee");
firstname.addEventListener("keyup", fnameValidation);
// holdernamee.addEventListener("keyup", holdernameValidation);


// function holdernameValidation (){
//   if (holdernamee.value.match(validname)) {
//     holdernamee.classList.remove("is-invalid");
//     holdernamee.classList.add("is-valid");
//   } else {
//     holdernamee.classList.add("is-invalid");
//     holdernamee.classList.remove("is-valid");
//   }
// }

function fnameValidation() {
  if (firstname.value.match(validname)) {
    // document.getElementById("reg-fname").style.borderColor = "green";
    // return true;
    firstname.classList.remove("is-invalid");
    firstname.classList.add("is-valid");
  } else {
    // document.getElementById("reg-fname").style.borderColor = "red";
    // return false;
    firstname.classList.add("is-invalid");
    firstname.classList.remove("is-valid");
  }
}
// first name
// last name
var validname = /^[A-Za-z\s]+$/;
let lastname = document.getElementById("lastname");
lastname.addEventListener("keyup", lnameValidation);

function lnameValidation() {
  if (lastname.value.match(validname)) {
    // document.getElementById("reg-fname").style.borderColor = "green";
    // return true;
    lastname.classList.remove("is-invalid");
    lastname.classList.add("is-valid");
  } else {
    // document.getElementById("reg-fname").style.borderColor = "red";
    // return false;
    lastname.classList.add("is-invalid");
    lastname.classList.remove("is-valid");
  }
}

// last name
// email name
var validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
let email = document.getElementById("email");
let email_span = document.getElementById("email-span");
email.addEventListener("keyup", emailValidation);
// console.log("valid email");
function emailValidation() {
  if (email.value.match(validEmail)) {
    // console.log("valid email");
    // document.getElementById("register").disabled = false;
    // document.getElementById("email").style.borderColor = "green";
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
    email_span.style.display = "none";
    // return true;
  } else {
    email.classList.add("is-invalid");
    email.classList.remove("is-valid");
    email_span.style.display = "block";

    // return false;
  }
}
// email name
// phone name

var validPhone = /^\d{11}$/;
// let phone = document.getElementById("phone1");
// phone.addEventListener("keyup", PhoneValidation);

// function PhoneValidation() {
//   if (phone.value.match(validPhone)) {
//     phone.classList.remove("is-invalid");
//     phone.classList.add("is-valid");
//   } else {
//     phone.classList.add("is-invalid");
//     phone.classList.remove("is-valid");
//   }
// }

var input = document.querySelector("#phone1");
const errorMsg = document.querySelector("#error-msg");
const validMsg = document.querySelector("#valid-msg");

const errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];


const reset = () => {
  input.classList.remove("error");
  errorMsg.innerHTML = "";
  errorMsg.classList.add("hide");
  validMsg.classList.add("hide");
};


input.addEventListener('keyup', () => {
  reset();
  if (input.value.trim()) {
    if (iti.isValidNumber()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    }
  }
});

input.addEventListener('change', reset);
input.addEventListener('keyup', reset);
// phone name

let card_btnn1 = document.getElementsByClassName("card-btnn")[0];
let card_btnn2 = document.getElementsByClassName("card-btnn")[1];
let card_btnn3 = document.getElementsByClassName("card-btnn")[2];
let card_btnn4 = document.getElementsByClassName("card-btnn")[3];

let card_btnn5 = document.getElementsByClassName("card-btnn")[4];
let card_btnn6 = document.getElementsByClassName("card-btnn")[5];
let card_btnn7 = document.getElementsByClassName("card-btnn")[6];
let card_btnn8 = document.getElementsByClassName("card-btnn")[7];

let done = document.getElementById("done");


// let card_btnn9 = document.getElementsByClassName("btnt")[0];
let card_btnn9 = document.getElementsByClassName("card-btnn")[8];
let card_btnn10 = document.getElementsByClassName("card-btnn")[9];
let card_btnn11 = document.getElementsByClassName("card-btnn")[10];
let card_btnn12 = document.getElementsByClassName("card-btnn")[11];
let card_btnn13 = document.getElementsByClassName("card-btnn")[12];
let card_btnn14 = document.getElementsByClassName("card-btnn")[13];
let card_btnn15 = document.getElementsByClassName("card-btnn")[14];
let card_btnn16 = document.getElementsByClassName("card-btnn")[15];


let nextpayment = document.getElementById("nextpayment");
nextpayment.addEventListener("click", cardbtnchange2);


card_btnn1.addEventListener("click", cardbtnchange);
done.addEventListener("click", cardbtnchange);
card_btnn2.addEventListener("click", cardbtnchange1);
card_btnn3.addEventListener("click", cardbtnchange1);
card_btnn4.addEventListener("click", cardbtnchange1);

card_btnn5.addEventListener("click", cardbtnchange);
card_btnn6.addEventListener("click", cardbtnchange1);
card_btnn7.addEventListener("click", cardbtnchange1);
card_btnn8.addEventListener("click", cardbtnchange1);
// card_btnn9.addEventListener("click", cardbtnchange);
card_btnn9.addEventListener("click", cardbtnchange);
card_btnn10.addEventListener("click", cardbtnchange1);
card_btnn11.addEventListener("click", cardbtnchange1);
card_btnn12.addEventListener("click", cardbtnchange1);
card_btnn13.addEventListener("click", cardbtnchange);
card_btnn14.addEventListener("click", cardbtnchange1);
card_btnn15.addEventListener("click", cardbtnchange1);
card_btnn16.addEventListener("click", cardbtnchange1);

function cardbtnchange1()
{
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card3.classList.add("card-fade");
  card5.classList.add("card-fade");
  card4.classList.remove("card-fade");
  // part4.classList.add("shadow-active");
  part3.classList.remove("shadow-active");
  part2.classList.remove("shadow-active");
  part1.classList.remove("shadow-active");
  setTimeout(delay3, 2500);
  function delay3() {
    loader.style.display = "none";
    card2.style.display = "none";
    card1.style.display = "none";
    card3.style.display = "none";
    card4.style.display = "block";
    card5.style.display = "none";
    // part4.classList.add("active1");
    part2.classList.add("shadow-active");
    // part2.classList.add("complete1");
  }
  // part3.addEventListener("click", thirdBtnChange);
  // function thirdBtnChange() {
  // loader.style.display = "block";
  //   card2.classList.add("card-fade");
  //   card1.classList.add("card-fade");
  //   card3.classList.add("card-fade");
  //   card4.classList.remove("card-fade");
  //   part3.classList.add("shadow-active");
  //   part2.classList.remove("shadow-active");
  //   part1.classList.remove("shadow-active");

  //   setTimeout(delay3, 2500);
  //   function delay3() {
  //     loader.style.display = "none";
  //     card2.style.display = "none";
  //     card1.style.display = "none";
  //     card3.style.display = "none";
  //     card4.style.display = "block";
  //   }
  // }
  document.getElementById("top-h1-heading").innerHTML = "Technology for all Real Estate <span>Professionals</span>";
}

function cardbtnchange2()
{
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card3.classList.add("card-fade");
  card4.classList.add("card-fade");
  card5.classList.remove("card-fade");
  // part4.classList.add("shadow-active");
  part3.classList.remove("shadow-active");
  part2.classList.remove("shadow-active");
  part1.classList.remove("shadow-active");
  setTimeout(delay3, 2500);
  function delay3() {
    loader.style.display = "none";
    card2.style.display = "none";
    card1.style.display = "none";
    card3.style.display = "none";
    card4.style.display = "none";
    card5.style.display = "block";
    // part4.classList.add("active1");
    part2.classList.add("shadow-active");
    // part2.classList.add("complete1");
  }
  // part3.addEventListener("click", thirdBtnChange);
  // function thirdBtnChange() {
  // loader.style.display = "block";
  //   card2.classList.add("card-fade");
  //   card1.classList.add("card-fade");
  //   card3.classList.add("card-fade");
  //   card4.classList.add("card-fade");
  //   card5.classList.remove("card-fade");
  //   // part3.classList.add("shadow-active");
  //   part2.classList.remove("shadow-active");
  //   part1.classList.remove("shadow-active");

  //   setTimeout(delay3, 2500);
  //   function delay3() {
  //     loader.style.display = "none";
  //     card2.style.display = "none";
  //     card1.style.display = "none";
  //     card3.style.display = "none";
  //     card4.style.display = "none";
  //     card5.style.display = "block";
  //   }
  // }
}



function cardbtnchange() {
  document.getElementById("paymentform").reset();
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card4.classList.add("card-fade");
  card3.classList.remove("card-fade");
  card5.classList.add("card-fade");
  part3.classList.add("shadow-active");
  part2.classList.remove("shadow-active");
  part1.classList.remove("shadow-active");
  setTimeout(delay2, 2500);
  function delay2() {
    loader.style.display = "none";
    card2.style.display = "none";
    card1.style.display = "none";
    card4.style.display = "none";
    card5.style.display = "none";
    card3.style.display = "block";
    part3.classList.add("active1");
    part3.classList.add("shadow-active");
    part2.classList.add("complete1");
  }
  part3.addEventListener("click", thirdBtnChange);
  function thirdBtnChange() {
  loader.style.display = "block";
    card2.classList.add("card-fade");
    card1.classList.add("card-fade");
    card4.classList.add("card-fade");
    card5.classList.add("card-fade");
    card3.classList.remove("card-fade");
    part3.classList.add("shadow-active");
    part2.classList.remove("shadow-active");
    part1.classList.remove("shadow-active");

    setTimeout(delay2, 2500);
    function delay2() {
      loader.style.display = "none";
      card2.style.display = "none";
      card1.style.display = "none";
      card4.style.display = "none";
      card5.style.display = "none";
      card3.style.display = "block";
    }
  }
}

firstname.addEventListener("keyup", button1);
email.addEventListener("keyup", button1);
lastname.addEventListener("keyup", button1);
input.addEventListener("keyup", button1);
input.addEventListener("change", button1);
function button1() {
  if (
    email.value.match(validEmail) &&
    lastname.value.match(validname) &&
    firstname.value.match(validname) &&
    iti.isValidNumber()
    // &&
    // phone.value.match(validPhone)
  ) {
    document.getElementById("next1").disabled = false;
    // part2.disabled = false;
  } else {
    document.getElementById("next1").disabled = true;
  }
}

let next1 = document.getElementById("next1");
let part2 = document.getElementById("part2");

next1.addEventListener("click", card1_switch);
function card1_switch() {
  if (
    email.value.match(validEmail) &&
    lastname.value.match(validname) &&
    firstname.value.match(validname)
  ) {
    card1.classList.add("card-fade");
    card3.classList.add("card-fade");
    card4.classList.add("card-fade");
    card5.classList.add("card-fade");
    loader.style.display = "block";
    // loader.classList.add("card-fadein-loader");
    card2.classList.remove("card-fade");
    part2.classList.add("shadow-active");
    part1.classList.remove("shadow-active");
    part3.classList.remove("shadow-active");
    setTimeout(delay20, 2500);
    function delay20() {
      loader.style.display = "none";
      card2.style.display = "block";
      card1.style.display = "none";
      card3.style.display = "none";
      card4.style.display = "none";
      card5.style.display = "none";
      part1.classList.add("complete1");
      part2.classList.add("active1");
      part2.classList.add("shadow-active");
    }

    part2.addEventListener("click", secondBtnChange);
    function secondBtnChange() {
  loader.style.display = "block";
      card1.classList.add("card-fade");
      card3.classList.add("card-fade");
      card4.classList.add("card-fade");
      card5.classList.add("card-fade");
      card2.classList.remove("card-fade");
      part2.classList.add("shadow-active");
      part1.classList.remove("shadow-active");
      part3.classList.remove("shadow-active");

      setTimeout(delay2, 2500);
      function delay2() {
        loader.style.display = "none";

        card2.style.display = "block";
        card1.style.display = "none";
        card3.style.display = "none";
        card4.style.display = "none";
        card5.style.display = "none";
      }
      // part1.classList.add("complete1");
    }
  }
}

part1.addEventListener("click", firstBtnChange);
function firstBtnChange() {
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card3.classList.add("card-fade");
  card4.classList.add("card-fade");
  card5.classList.add("card-fade");
  card1.classList.remove("card-fade");
  part1.classList.add("shadow-active");
  
  part2.classList.remove("shadow-active");
  part3.classList.remove("shadow-active");

  setTimeout(delay1, 2500);
  function delay1() {
  loader.style.display = "none";

    card2.style.display = "none";
    card1.style.display = "block";
    card3.style.display = "none";
    card4.style.display = "none";
    card5.style.display = "none";
  }
  // part1.classList.add("complete1");
}


// ****************************************************************************************************************
let password_validate = /^(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\W]{8,}$/;
var validconfirmPassword = document.getElementById("id_password1");
let confirmPassword = document.getElementById("id_password2");
var next3 = document.getElementById("next3");
confirmPassword.addEventListener('keyup', confirmPasswordValidation);
validconfirmPassword.addEventListener('keyup', confirmPasswordValidation);
var spantag1 = document.getElementById("passnotmatch1");

function confirmPasswordValidation() {
  alert("1");
  if(validconfirmPassword.value.match(password_validate))
  {
    validconfirmPassword.classList.add("border-green");
    spantag1.style.display = "none";
  }
  else
  {
    validconfirmPassword.classList.remove("border-green");
    spantag1.style.display = "block";

  }
    if (confirmPassword.value == validconfirmPassword.value && validconfirmPassword.value.match(password_validate)) {
      next3.disabled = false;
      confirmPassword.classList.add("border-green");
      // next3.addEventListener('click', GoHome);
    } else {
      confirmPassword.classList.remove("border-green");

      next3.disabled = true;
    }
}





// payment validation start 

var validholdername = /^[A-Za-z\s]+$/;
let holdername = document.getElementById("holdernamee");
holdername.addEventListener("keyup", holdernamevalidation);

function holdernamevalidation() {

  if (holdername.value.match(validholdername)) {

    // document.getElementById("reg-fname").style.borderColor = "green";
    // return true;
    holdername.classList.remove("is-invalid");
    holdername.classList.add("is-valid");
  } else {
    // document.getElementById("reg-fname").style.borderColor = "red";
    // return false;
    holdername.classList.add("is-invalid");
    holdername.classList.remove("is-valid");
  }
}
// first name

// last name
var validPhone1 = /^\d{16}$/;
let cardnumber = document.getElementById("cardnumber");
cardnumber.addEventListener("keyup", cardnumbervalidation);

function cardnumbervalidation() {
  if (cardnumber.value.match(validPhone1)) {
    cardnumber.classList.remove("is-invalid");
    cardnumber.classList.add("is-valid");
  } else {
    cardnumber.classList.add("is-invalid");
    cardnumber.classList.remove("is-valid");
  }
}

// last name

var validcv = /^[A-Za-z]+$/;
let cv = document.getElementById("cv");
cv.addEventListener("keyup", cvvalidation);

function cvvalidation() {
  if (cv.value.match(validcv)) {
    // document.getElementById("reg-fname").style.borderColor = "green";
    // return true;
    cv.classList.remove("is-invalid");
    cv.classList.add("is-valid");
  } else {
    // document.getElementById("reg-fname").style.borderColor = "red";
    // return false;
    cv.classList.add("is-invalid");
    cv.classList.remove("is-valid");
  }
}
// first name

// phone name

var validzipcode = /^\d{4}$/;
let zipcode = document.getElementById("zipcode");
zipcode.addEventListener("keyup", zipcodevalidation);

function zipcodevalidation() {
  if (zipcode.value.match(validzipcode)) {
    zipcode.classList.add("is-valid");
    zipcode.classList.remove("is-invalid");
  } else {
    zipcode.classList.add("is-invalid");
    zipcode.classList.remove("is-valid");
  }
}
let paydate = document.getElementById("payment-date"); 
paydate.addEventListener("change", paydatevalidation);

function paydatevalidation() {
  if (paydate.value != "") {
    paydate.classList.add("is-valid");
    paydate.classList.remove("is-invalid");
  } else {
    paydate.classList.add("is-invalid");
    paydate.classList.remove("is-valid");
  }
}


holdername.addEventListener("keyup", button2);
cardnumber.addEventListener("keyup", button2);
cv.addEventListener("keyup", button2);
paydate.addEventListener("change", button2);
zipcode.addEventListener("keyup", button2);
function button2() {
  if (
    holdername.value.match(validholdername) &&
    cardnumber.value.match(validPhone1) &&
    cv.value.match(validcv) &&
    zipcode.value.match(validzipcode) &&
    paydate.value != ""
  ) {
    document.getElementById("nextpayment").disabled = false;
    // part2.disabled = false;
  } else {
    document.getElementById("nextpayment").disabled = true;
  }
}
// phone name