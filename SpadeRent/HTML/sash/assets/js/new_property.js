function setColor() {
    const form = document.querySelector('#collapseOne form');
    const inputs = form.querySelectorAll('input, select');
    let isFormValid = true;
    inputs.forEach((input) => {
        console.log(input.value.trim() === '')
      if (input.value.trim() === '') {
        isFormValid = false;
      }
    });
    console.log(isFormValid)
    const accordionButton = document.querySelector('#accordion-button1');
    if (isFormValid) {
      accordionButton.style.backgroundColor = 'green';
    } else {
      accordionButton.style.backgroundColor = '';
    }
  }
  