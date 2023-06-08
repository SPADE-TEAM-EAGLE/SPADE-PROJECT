function checkFieldsStatus(accordionId) {
    var accordionFields = $('#' + accordionId + ' input[type="text"], #' + accordionId + ' select');
    var imageField = $('#' + accordionId + ' input[type="file"]');
    var hasEmptyFields = false;
    var hasErrorFields = false;
    var hasFilledFields = false;

    accordionFields.each(function () {
        var $field = $(this);
        if ($field.val() === '' || $field.val() === 'Choose...') {
            hasEmptyFields = true;
        }
        if ($field.hasClass('border-danger')) {
            hasErrorFields = true;
        }
        if ($field.val() !== '' || $field.val() !== 'Choose...') {
            hasFilledFields = true;
        }
    });
    if (imageField.length && imageField.get(0).files.length === 0) {
        hasEmptyFields = true;
    }
    if (hasEmptyFields && hasErrorFields) {
        return 1;
    } else if (!hasEmptyFields && !hasErrorFields && hasFilledFields) {
        return 2;
    } else if (hasEmptyFields && !hasErrorFields && hasFilledFields) {
        console.log(2)
        return 3;
    } else {
        return 0;
    }
}

let counter = 0
function checkFieldsFilled(id) {
    const status = checkFieldsStatus(id)
    if (id === "accordion-item2" && counter === 0) {
        counter += 1
        return
    }
    const accordionItem = document.getElementById(id);
    const formFields = accordionItem.querySelectorAll("input, select");
    let allFieldsFilled = true;
    formFields.forEach(function (field) {
        if (field.value === "" || field.value === "Choose...") {
            allFieldsFilled = false;
        }

    });
    const chevronIcon = accordionItem.querySelector(".icon");
    switch (status) {
        case 0:

            break;
        case 1:
            chevronIcon.classList.remove("fi-rs-check-circle");
            chevronIcon.classList.remove("chevron");
            chevronIcon.classList.add("fi-rs-exclamation");
            chevronIcon.classList.add("cross");
            break;
        case 2:
            chevronIcon.classList.remove("fi-rs-exclamation");
            chevronIcon.classList.remove("chevron");
            chevronIcon.classList.add("fi-rs-check-circle");
            chevronIcon.classList.remove("cross");
            chevronIcon.classList.add("tick");
            break;
        case 3:
            console.log(2)
            chevronIcon.classList.remove("fi-rs-exclamation");
            chevronIcon.classList.add("chevron");
            // chevronIcon.classList.add("fi-rs-check-circle");
            chevronIcon.classList.remove("cross");
            chevronIcon.classList.remove("tick");
            break;
        default:
            break;
    }
}
var selectedFiles = [];
$(document).ready(function () {
    $("#succesModal").on('hide.bs.modal', function () {
        window.location='./properties-all.html'
    })
    $.ajax({
        url: 'http://api.geonames.org/searchJSON',
        method: 'GET',
        data: {
            country: 'PK',
            maxRows: 500,
            username: 'developedmatz',
            style: 'full'
        },
        success: function (result) {
            // Handle state selection change
            $('#state').change(function () {
                var selectedState = $(this).val();
                if (selectedState === "KPK") {
                    selectedState = "Khyber Pakhtunkhwa"
                }

                var cityDropdown = $('#city');

                // Clear existing options
                cityDropdown.empty();
                cityDropdown.append($('<option></option>').text("Choose..."));
                cities = []
                if (selectedState !== "Choose...") {
                    // Populate city options based on selected state
                    count = 0
                    data = result.geonames
                    for (item of data) {
                        if (item.adminName1 === selectedState) {
                            cities.push(item.name)
                            count++
                        }
                        if (count === 10) {
                            break
                        }
                    }


                    cities.forEach(function (city) {
                        cityDropdown.append($('<option></option>').text(city));
                    });

                }
            })}})
    function areAllFieldsFilled() {
        var accordion1Fields = $('#accordion-item1 input[type="text"], #accordion-item1 select');
        var accordion2Fields = $('#accordion-item2 input[type="text"], #accordion-item2 select');
        var imageInput = $('#fileInput');
        var allFieldsFilled = accordion1Fields.filter(function () {
            return $(this).val() === '' || $(this).val() === 'Choose...';
        }).length === 0 && accordion2Fields.filter(function () {
            return $(this).val() === '' || $(this).val() === 'Choose...';
        }).length === 0 && imageInput.get(0).files.length > 0;

        return allFieldsFilled;
    }

    // Function to enable or disable buttons based on field status
    function updateButtonStatus() {
        var accordion1Fields = $('#accordion-item1 input[type="text"], #accordion-item1 select');
        var accordion2Fields = $('#accordion-item2 input[type="text"], #accordion-item2 select');
        var imageInput = $('#fileInput');

        var isAccordion1FieldsEmpty = accordion1Fields.filter(function () {
            return $(this).val() !== '' || $(this).val() === 'Choose...';
        }).length === 0;

        var isAccordion2FieldsEmpty = accordion2Fields.filter(function () {
            return $(this).val() !== '' || $(this).val() === 'Choose...';
        }).length === 0;

        var isImageInputEmpty = imageInput.get(0).files.length === 0;

        // Enable or disable the buttons based on the fields' status
        if (!isAccordion1FieldsEmpty || !isAccordion2FieldsEmpty || !isImageInputEmpty) {
            $('#draft').removeAttr('disabled');
        } else {
            $('#draft').attr('disabled', 'disabled');
        }

        var allFieldsFilled = areAllFieldsFilled();

        // Enable or disable the buttons based on the fields' status
        if (allFieldsFilled) {
            $('#next').removeClass("disabled");
            //   $('#draft').removeAttr("disabled");
        } else {
            $('#next').addClass("disabled");
            //   $('#draft').removeAttr("disabled");

        }
    }

    // Call the updateButtonStatus function when any field in the accordions is changed
    $('#accordion-item1 input, #accordion-item1 select, #accordion-item2 input, #accordion-item2 select').on('input change', function () {
        var $field = $(this);
        var $errorMessage = $field.next('.text-danger');

        if ($field.val() === '' || $field.val() === 'Choose...') {
            $field.addClass('border-danger');
            $errorMessage.removeClass('d-none');
        } else {
            $field.removeClass('border-danger');
            $errorMessage.addClass('d-none');
        }
        updateButtonStatus();
    });
    // Handle change event of checkboxes


    $('#fileInput').on('change', function () {
        var files = Array.from($(this)[0].files);
        // console.log(files)
        files.forEach(function (file) {
            selectedFiles.push(file); // Add each file to the selected files array
        });

        updateSelectedFilesContainer(); // Update the selected files container
    });
    $('#fileInput_update').on('change', function () {
        // console.log($(this)[0].files)
        var files = Array.from($(this)[0].files);
        // console.log(files)
        files.forEach(function (file) {
            selectedFiles.push(file); // Add each file to the selected files array
        });

        updateSelectedFilesContainer(); // Update the selected files container
    });

    $(document).on('click', '.delete-file', function () {
        var index = $(this).data('index');
        selectedFiles.splice(index, 1); // Remove the selected file from the array
        updateSelectedFilesContainer(); // Update the selected files container
    });

function resetAccordions() {
    // Reset all accordions
    $('.accordion-item').each(function () {
        var accordionId = $(this).attr('id');
        var accordionFields = $('#' + accordionId + ' input[type="text"], #' + accordionId + ' select');
        var imageField = $('#' + accordionId + ' input[type="file"]');
        var accordionButton = $('#' + accordionId + ' button.accordion-button');

        // Empty input fields
        accordionFields.val('');

        // Remove border-danger class
        accordionFields.removeClass('border-danger');

        // Hide error spans
        accordionFields.siblings('span.text-danger').addClass('d-none');

        // Reset image input
        if (imageField.length) {
            imageField.val('');
            imageField.siblings('label.custom-file-label').find('.custom-file-text span').first().text('Upload Photo or drag and drop here');
            imageField.siblings('.selected-files').find('.file-grid').empty();
        }
        $('#accordion-item1').find('.file-grid').empty();
        // Reset accordion button icons
        accordionButton.find('.fi-rs-exclamation').addClass('fi-rs-angle-circle-down').addClass("chevron").removeClass('fi-rs-exclamation').removeClass("cross");
        accordionButton.find('.fi-rs-check-circle').addClass('fi-rs-angle-circle-down').addClass("chevron").removeClass('fi-rs-check-circle').removeClass("tick");
        $('#next').addClass("disabled");
        $('#draft').attr("disabled", "disabled");
    });
}

$('#close,#top-close').on('click', function (e) {
    e.preventDefault()
    resetAccordions()
    $('#addModal').modal('hide');
})
$(document).on('click', '#next', function (e) {
    e.preventDefault()
    selectedFiles=[]
    $('#addModal').modal('hide');
    // resetAccordions()
    // $("#largemodal").addClass("hide");
    var formData = new FormData();

    // Get the form data
    var propertyName = $("#propertyName").val();
    var address = $("#address").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zipCode = $("#zip").val();
    var propertyType = $("#propertyType").val();
    var propertySQFT = $("#propertyTotalSF").val();
    var units = $("#units").val();

    // Add the form data to the FormData object
    formData.append('propertyName', propertyName);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('zipCode', zipCode);
    formData.append('propertyType', propertyType);
    formData.append('propertySQFT', propertySQFT);
    formData.append('units', units);

    // Get the selected files
    var files = $('#fileInput')[0].files;

    // Add the files to the FormData object
    for (var i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
    }

    // Send the form data to the server using AJAX
    $.ajax({
        url: 'http://localhost:3000/api/spade/property',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
        },

        success: function (response) {
            // console.log(1)
    resetAccordions()

            $('#succesModal').modal('show')

            // window.location = '../Landlord/properties-all.html';
        },
        error: function (xhr, status, error) {
            window.alert('Error: ' + error);
        }
    });


});
let propertyId;

function updateSelectedFilesContainer() {
    var selectedFilesContainer = $('.file-grid');
    selectedFilesContainer.empty();
    console.log(selectedFiles)
    selectedFiles.forEach(function (file, index) {

        var fileElement = $('<div>')
            .addClass('selected-file')
            .append(
                $('<img>')
                    .addClass('file-preview')
                    .attr('src', typeof file === "object" ? URL.createObjectURL(file) : '../../../../spadeAPI/uploads/' + file)
            )
            .append(
                $('<div>')
                    .addClass('file-details')
                    .append($('<span>').text("Image-" + (index + 1)))
                // .append($('<span>').text(fileSize))
            )
            .append(
                $('<p>')
                    .addClass('delete-file')
                    .text('X')
                    .attr('data-index', index)
            )
            .appendTo(selectedFilesContainer);

    });

}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function truncateFileName(fileName) {
    var maxFileNameLength = 10; // Define the maximum length of the file name
    if (fileName.length > maxFileNameLength) {
        return fileName.substring(0, maxFileNameLength) + '...'; // Truncate the file name
    }

    return fileName;
}})