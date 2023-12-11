(function ($) {
  "use strict";
  $("#wizard1").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
  });
  $("#wizard2").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex < newIndex) {
        if (currentIndex === 0) {
          var fname = $("#firstname").parsley();
          var lname = $("#lastname").parsley();
          if (fname.isValid() && lname.isValid()) {
            return true;
          } else {
          }
        }
        if (currentIndex === 1) {
          var email = $("#email").parsley();
          if (email.isValid()) {
            return true;
          } else {
          }
        }
      } else {
        return true;
      }
    },
  });
  $("#wizard3").steps({
    headerTag: "h3",
    bodyTag: "section",
    autoFocus: true,
    titleTemplate:
      '<span class="number">#index#</span> <span class="title">#title#</span>',
    stepsOrientation: 1,
  });
  $(".dropify-clear").on("click", function () {
    $(".dropify-render img").remove();
    $(".dropify-preview").css("display", "none");
    $(".dropify-clear").css("display", "none");
  });
  var options = {
    mode: "wizard",
    autoButtonsNextClass: "btn btn-primary float-end",
    autoButtonsPrevClass: "btn btn-light",
    stepNumberClass: "badge rounded-pill bg-primary me-1",
    onSubmit: function () {
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
  const type =
    password2.getAttribute("type") === "password" ? "text" : "password";
  password2.setAttribute("type", type);
});
//**************************************************************** */
let card1 = document.getElementById("card1");
let card2 = document.getElementById("card2");
let card3 = document.getElementById("card3");
let card4 = document.getElementById("card4");
let card5 = document.getElementById("card5");
let card5_new = document.getElementById("card5-new");
let part1 = document.getElementById("part1");
let part3 = document.getElementById("part3");
let loader = document.getElementById("loader");
document.getElementById("part2").disabled = true;
document.getElementById("part3").disabled = true;
document.getElementById("next1").disabled = true;
var validname = /^[A-Za-z\s]+$/;
let firstname = document.getElementById("firstname1");
firstname.addEventListener("keyup", fnameValidation);
function fnameValidation() {
  if (firstname.value.match(validname)) {
    firstname.classList.remove("is-invalid");
    firstname.classList.add("is-valid");
  } else {
    firstname.classList.add("is-invalid");
    firstname.classList.remove("is-valid");
  }
}
var validname = /^[A-Za-z\s]+$/;
let lastname = document.getElementById("lastname");
lastname.addEventListener("keyup", lnameValidation);
function lnameValidation() {
  if (lastname.value.match(validname)) {
    lastname.classList.remove("is-invalid");
    lastname.classList.add("is-valid");
  } else {
    lastname.classList.add("is-invalid");
    lastname.classList.remove("is-valid");
  }
}
var validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/;
let email = document.getElementById("email");
let email_span = document.getElementById("email-span");
email.addEventListener("keyup", emailValidation);
function emailValidation() {
  if (email.value.match(validEmail)) {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
    email_span.style.display = "none";
  } else {
    email.classList.add("is-invalid");
    email.classList.remove("is-valid");
    email_span.style.display = "block";
  }
}
var validPhone = /^\d{11}$/;
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
let card_btnn1 = document.getElementsByClassName("card-btnn")[0];
let card_btnn2 = document.getElementsByClassName("card-btnn")[1];
let card_btnn3 = document.getElementsByClassName("card-btnn")[2];
let card_btnn4 = document.getElementsByClassName("card-btnn")[3];
let card_btnn5 = document.getElementsByClassName("card-btnn")[4];
let card_btnn6 = document.getElementsByClassName("card-btnn")[5];
let card_btnn7 = document.getElementsByClassName("card-btnn")[6];
let card_btnn8 = document.getElementsByClassName("card-btnn")[7];
let done_new = document.getElementById("done-new");
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
done_new.addEventListener("click", cardbtnchange);
card_btnn2.addEventListener("click", cardbtnchange1);
card_btnn3.addEventListener("click", cardbtnchange1);
card_btnn4.addEventListener("click", cardbtnchange1);
card_btnn5.addEventListener("click", cardbtnchange);
card_btnn6.addEventListener("click", cardbtnchange1);
card_btnn7.addEventListener("click", cardbtnchange1);
card_btnn8.addEventListener("click", cardbtnchange1);
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
  var cardId=this.getAttribute("data-id");
  selectedplan = cardId;
  document.querySelectorAll(".nav-price li a").forEach(function(element) {
    if (element.classList.contains("active")) {
        if ("#annualyear" == element.getAttribute("href")) {
            time = "Year";
        } else {
            time = "Month";
        }
    }
});
console.log(document.getElementById("plan-name"))
document.getElementById("payment-month").innerHTML = time;
console.log(time)
console.log(document.getElementById(cardId))
document.getElementById("plan-name").innerHTML = document.getElementById(cardId).getElementsByClassName("card-headerr")[0].getElementsByTagName("strong")[0].textContent.trim()
document.getElementById("plan-name-card").innerHTML = document.getElementById(cardId).getElementsByClassName("card-headerr")[0].getElementsByTagName("strong")[0].textContent.trim()
var amount = this.closest('.pricing-card').getElementsByClassName('amount-payable')[0].textContent;
seletedPlanID = cardId;
if(time=="Year"){
  amount = parseFloat(amount) * 12;
}
console.log(amount)
document.getElementById("amount").value = amount;
document.getElementById("amount").value = amount;
document.getElementById("payment-amount").innerHTML = amount;
document.getElementById("payment-total").innerHTML = amount;
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card3.classList.add("card-fade");
  card5.classList.add("card-fade");
  card5_new.classList.add("card-fade");
  card4.classList.remove("card-fade");
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
    card5_new.style.display = "none";
    part2.classList.add("shadow-active");
  }}
function cardbtnchange2()
{
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card3.classList.add("card-fade");
  card4.classList.add("card-fade");
  card5.classList.add("card-fade");
  card5_new.classList.remove("card-fade");
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
    card5.style.display = "none";
    card5_new.style.display = "block";
    part2.classList.add("shadow-active");
  }
}
function cardbtnchange() {
  loader.style.display = "block";
  card2.classList.add("card-fade");
  card1.classList.add("card-fade");
  card4.classList.add("card-fade");
  card3.classList.remove("card-fade");
  card5.classList.add("card-fade");
  card5_new.classList.add("card-fade");
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
    card5_new.style.display = "none";
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
    card5_new.classList.add("card-fade");
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
      card5_new.style.display = "none";
      card3.style.display = "block";
    }
  }
}
const checkbox = document.getElementById('check1');
$(document).ready(function() {
  let valid=false
  $("#email").on("input",()=>{
      var email = $("#email").val();
      $.ajax({
          url: "https://backend.app.spaderent.com/api/spade/checkemail",
          type: "GET",
          contentType: "application/json",
          data: {
              email: email
          },
          success: function(response) {
              button1()
              if(response.message == "New user")
              {
                valid=true
               document.getElementById("email-span-invalid").style.display = "none";
               button1()
              }
              else{
                valid=false
               document.getElementById("email-span-invalid").style.display = "block";
               button1()
              }
          },
          error: function(xhr, status, error) {
              document.getElementById("email-span-invalid").style.display = "block";
              valid=false
              button1()
          },
      });
  })
  firstname.addEventListener("keyup", button1);
lastname.addEventListener("keyup", button1);
input.addEventListener("keyup", button1);
input.addEventListener("change", button1);
checkbox.addEventListener("change", button1);
function button1() {
  const emailSpan = document.getElementById('email-span-invalid');
  const computedStyle = window.getComputedStyle(emailSpan);
  const isEmailSpanHidden = computedStyle.display === 'none';
  if(valid){
    if(email.value.match(validEmail)){
      email.classList.add('is-valid')
      email.classList.remove('is-invalid')
    }else{
      email.classList.remove('is-valid')
      email.classList.add('is-invalid')
    }
  }else{
    email.classList.remove('is-valid')
    email.classList.add('is-invalid')
  }
  if (
    email.value.match(validEmail) &&         // Check email validity
    valid &&                     // Check if 'email-span-invalid' is hidden
    lastname.value.match(validname) &&       // Check lastname validity
    firstname.value.match(validname) &&      // Check firstname validity
    checkbox.checked                         // Check if checkbox is checked
  ) {
    document.getElementById("next1").disabled = false;
  } else {
    document.getElementById("next1").disabled = true;
  }
}
})
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
}
let password_validate = /^(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\W]{8,}$/;
var validconfirmPassword = document.getElementById("id_password1");
let confirmPassword = document.getElementById("id_password2");
var next3 = document.getElementById("next3");
confirmPassword.addEventListener('keyup', confirmPasswordValidation);
validconfirmPassword.addEventListener('keyup', confirmPasswordValidation);
var spantag1 = document.getElementById("passnotmatch1");
function confirmPasswordValidation() {
  if(validconfirmPassword.value.match(password_validate))
  {
    validconfirmPassword.classList.add("border-green"); 
    validconfirmPassword.classList.remove("border-red"); 
    spantag1.style.display = "none";
  }
  else
  {
    validconfirmPassword.classList.remove("border-green");
    validconfirmPassword.classList.add("border-red"); 
    spantag1.style.display = "block";
  }
    if (confirmPassword.value == validconfirmPassword.value && validconfirmPassword.value.match(password_validate)) {
      next3.disabled = false;
      confirmPassword.classList.add("border-green");
    } else {
      confirmPassword.classList.remove("border-green");
      next3.disabled = true;
    }
}
var validholdername = /^[A-Za-z\s]+$/;
function holdernamevalidation() {
  if (holdername.value.match(validholdername)) {
    holdername.classList.remove("is-invalid");
    holdername.classList.add("is-valid");
  } else {
    holdername.classList.add("is-invalid");
    holdername.classList.remove("is-valid");
  }
}
var validPhone1 = /^\d{16}$/;
function cardnumbervalidation() {
  if (cardnumber.value.match(validPhone1)) {
    cardnumber.classList.remove("is-invalid");
    cardnumber.classList.add("is-valid");
  } else {
    cardnumber.classList.add("is-invalid");
    cardnumber.classList.remove("is-valid");
  }
}
var validcv = /^\d{3}$/;
function cvvalidation() {
  if (cv.value.match(validcv)) {
    cv.classList.remove("is-invalid");
    cv.classList.add("is-valid");
  } else {
    cv.classList.add("is-invalid");
    cv.classList.remove("is-valid");
  }
}
var validzipcode = /^\d{4}$/;
function zipcodevalidation() {
  if (zipcode.value.match(validzipcode)) {
    zipcode.classList.add("is-valid");
    zipcode.classList.remove("is-invalid");
  } else {
    zipcode.classList.add("is-invalid");
    zipcode.classList.remove("is-valid");
  }
}
function paydatevalidation() {
  if (paydate.value != "") {
    paydate.classList.add("is-valid");
    paydate.classList.remove("is-invalid");
  } else {
    paydate.classList.add("is-invalid");
    paydate.classList.remove("is-valid");
  }
}
