$.ajax({
    url: 'http://localhost:3000/api/spade/protected',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function({userName}) {
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    $("#user-name").text(toTitleCase(userName))
    $("#header-user").text(toTitleCase(userName))
    },
    error: function(xhr, status, error) {
        console.log('Error occurred while fetching state and city data.');
        console.log(xhr);
        console.log(error);
        // console.log('Error occurred while fetching state and city data.');
    }
});
function checkFieldsStatus(accordionId) {
    var accordionFields = $('#' + accordionId + ' input[type="text"], #' + accordionId + ' select');
    var imageField = $('#' + accordionId + ' input[type="file"]');
    var hasEmptyFields = false;
    var hasErrorFields = false;
    var hasFilledFields = false;

    accordionFields.each(function () {
        var $field = $(this);
        if ($field.val() === '' || $field.val() === 'Choose...' || $("#zip").val().length!==5) {
            hasEmptyFields = true;
        }
        if ($field.hasClass('border-danger')) {
            hasErrorFields = true;
        }
        if ($field.val() !== '' || $field.val() !== 'Choose...') {
            hasFilledFields = true;
        }
    });
    if (hasEmptyFields && hasErrorFields) {
        return 1;
    } else if (!hasEmptyFields && !hasErrorFields && hasFilledFields) {
        return 2;
    } else if (hasEmptyFields && !hasErrorFields && hasFilledFields) {
        // console.log(2)
        return 3;
    } else {
        return 0;
    }
}
var counter = 0
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
function dropHandler(ev) {
console.log("File(s) dropped");

// Prevent default behavior (Prevent file from being opened)
ev.preventDefault();

if (ev.dataTransfer.items) {
// Use DataTransferItemList interface to access the file(s)
[...ev.dataTransfer.items].forEach((item, i) => {
// If dropped items aren't files, reject them
if (item.kind === "file") {
const file = item.getAsFile();
file.size <= 5 * 1024 * 1024 && selectedFiles.length < 5 ? selectedFiles.push(file) : file.size > 5 * 1024 * 1024 ? $("#size-text").removeClass("d-none") : $("#count-text").removeClass("d-none") // Add each file to the selected files array
updateSelectedFilesContainer()
}
});
} else {
// Use DataTransfer interface to access the file(s)
[...ev.dataTransfer.files].forEach((file, i) => {
console.log(`… file[${i}].name = ${file.name}`);
});
}
}
function dragOverHandler(ev) {
console.log("File(s) in drop zone");

// Prevent default behavior (Prevent file from being opened)
ev.preventDefault();
}

function updateSelectedFilesContainer() {
var selectedFilesContainer = $('.file-grid');
selectedFilesContainer.empty();

selectedFiles.forEach(function (file, index) {
console.log(selectedFiles.length)
console.log(file)
var fileElement = $('<div>')
.addClass('selected-file');

if (file.type && file.type.includes('image')) {
// Handle image files
fileElement.append(
$('<div>').addClass('file-preview')
    .append($('<img style="height:80px">').attr('src', URL.createObjectURL(file)))
);
} else if (file.type && file.type.includes('pdf')) {
// Handle PDF files
fileElement.append(
$('<div>').addClass('file-preview')
    .append($('<i style="font-size:50px">').addClass('fi fi-rs-file-pdf')) // Add your PDF icon class here
);
} else {
// Handle S3 bucket URLs for images and PDFs
if (file?.imageKey?.endsWith('.jpg') || file?.imageKey?.endsWith('.jpeg')|| file?.imageKey?.endsWith('.png')) {
fileElement.append(
    $('<div>').addClass('file-preview')
        .append($('<img style="height:80px">').attr('src', file.Image))
);
} else if (file?.imageKey?.endsWith('.pdf')) {
fileElement.append(
    $('<div>').addClass('file-preview')
        .append($('<i style="font-size:50px">').addClass('fi fi-rs-file-pdf'))
);
} else {
// Handle other files (you can modify this part as needed)
fileElement.append(
    $('<div>').addClass('file-preview')
        .append($('<i>').addClass('fi fi-rs-file')) // Add an appropriate class for other files
);
}
}
if (file instanceof File) {
fileElement
.append(
    $('<div>')
        .addClass('file-details')
        .append($('<span>').text(file.type.includes('pdf') ? "PDF-" + (index + 1) : "Image-" + (index + 1)))
)
.append(
    $('<span>')
        .addClass('delete-file')
        .text('X')
        .attr('data-index', index)
)
.appendTo(selectedFilesContainer);
} else if(file instanceof Object) {
if(file.Image){
fileElement
.append(
    $('<div>')
        .addClass('file-details')
        .append($('<span>').text(file?.imageKey?.includes('pdf') ? "PDF-" + (index + 1) : "Image-" + (index + 1)))
)
.append(
    $('<span>')
        .addClass('delete-file')
        .text('X')
        .attr('data-index', index)
)
.appendTo(selectedFilesContainer);
}
}

});
}
$(document).ready(function () {
    // $("#succesModal").on('hide.bs.modal', function () {
    //     window.location='./properties-all.html'
    // })
    $.ajax({
        // url: 'https://backend.app.spaderent.com/api/spade/getStates',
        url: 'https://backend.app.spaderent.com/api/spade/getStates',
        method: 'GET',
        success: function({data}) {
            // Handle state selection change
            console.log(data)

            var stateDropdown = $('#state');
            var stateDropdown1 = $('#state1');
            // console.log(stateDropdown)
            // var stateupdateDropdown = $('#state_update');
            // states = result.geonames.filter(function(place) {
            //     return place.fcode === "ADM1";
            // });
                states=data
            //   stateDropdown.append($('<option></option>').text("Choose..."));
            data.forEach(function(state) {
                console.log(stateDropdown)
                stateDropdown.append($('<option></option>').text(state.states).val(state.states));
                stateDropdown1.append($('<option></option>').text(state.states).val(state.states));

            });

        },
        error: function(xhr, status, error) {
            console.log('Error occurred while fetching state and city data.');
            console.log(xhr);
            console.log(error);
            // console.log('Error occurred while fetching state and city data.');
        }
    });
    function areAllFieldsFilled() {
        var accordion1Fields = $('#accordion-item1 input[type="text"], #accordion-item1 select');
        var accordion2Fields = $('#accordion-item2 input[type="text"], #accordion-item2 select');
        // var imageInput = $('#fileInput');
        var allFieldsFilled = accordion1Fields.filter(function () {
            return $(this).val() === '' || $(this).val() === 'Choose...';
        }).length === 0 && accordion2Fields.filter(function () {
            return $(this).val() === '' || $(this).val() === 'Choose...';
        }).length === 0;
        var zipField = $('#zip');
        if (zipField?.val()?.length !== 5) {
            allFieldsFilled = false;
        }
        return allFieldsFilled;
    }

    // Function to enable or disable buttons based on field status
    function updateButtonStatus() {
        var accordion1Fields = $('#accordion-item1 input[type="text"], #accordion-item1 select');
        var accordion2Fields = $('#accordion-item2 input[type="text"], #accordion-item2 select');
        // var imageInput = $('#fileInput');

        var isAccordion1FieldsEmpty = accordion1Fields.filter(function () {
            return $(this).val() !== '' || $(this).val() === 'Choose...';
        }).length === 0;

        var isAccordion2FieldsEmpty = accordion2Fields.filter(function () {
            return $(this).val() !== '' || $(this).val() === 'Choose...';
        }).length === 0;

        // var isImageInputEmpty = imageInput.get(0).files.length === 0;

        // Enable or disable the buttons based on the fields' status
        if (!isAccordion1FieldsEmpty || !isAccordion2FieldsEmpty) {
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
        if ($field.attr("id") === "zip") {
            if ($field.val().length !== 5) {
                $field.addClass('border-danger');
                $field.removeClass('border-green');
                $errorMessage.removeClass('d-none');
            } else {
                $field.removeClass('border-danger');
                $field.addClass('border-green');
                $errorMessage.addClass('d-none');
            }
        } else if($field.val() === '' || $field.val() === 'Choose...') {
            $field.addClass('border-danger');
            $field.removeClass('border-green');
            $errorMessage.removeClass('d-none');
        } else {
            $field.removeClass('border-danger');
            $field.addClass('border-green');
            $errorMessage.addClass('d-none');
        }
        updateButtonStatus();
    });
    // Handle change event of checkboxes


    $('#fileInput').on('change', function () {
        
        var files = Array.from($(this)[0].files);
        console.log(files)
        files.forEach(function (file) {
            file.size <= 5 * 1024 * 1024 && selectedFiles.length < 5 ? selectedFiles.push(file) : file.size > 5 * 1024 * 1024 ? $("#size-text").removeClass("d-none") : $("#count-text").removeClass("d-none") // Add each file to the selected files array
        });
        
        updateSelectedFilesContainer(); // Update the selected files container
    });
    $('#fileInput_update').on('change', function () {
        // console.log($(this)[0].files)
        var files = Array.from($(this)[0].files);
        // console.log(files)
        files.forEach(function (file) {
            file.size <= 5 * 1024 * 1024 && selectedFiles.length < 5 ? selectedFiles.push(file) : file.size > 5 * 1024 * 1024 ? $("#size-text").removeClass("d-none") : $("#count-text").removeClass("d-none") // Add each file to the selected files array // Add each file to the selected files array
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
            imageField.siblings('label.custom-file-label').find('.custom-file-text span').first().text('Upload Photo here');
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
$(document).on('click', '#next', function(e) {
    e.preventDefault();

    var propertyName = $("#propertyName").val();
    var address = $("#address").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var zipCode = $("#zip").val();
    var propertyType = $("#propertyType").val();
    var propertySQFT = $("#propertyTotalSF").val();
    var units = $("#units").val();


    if (selectedFiles.length >= 1) {
        var uploadFormData = new FormData();
        for (var i = 0; i < selectedFiles.length; i++) {
            uploadFormData.append('image', selectedFiles[i]);
        }
$("#addModal").modal("hide")
$('#preloader').css('display','flex')
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/upload',
            type: 'POST',
            data: uploadFormData,
            contentType: false,
            processData: false,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function(response) {
                var imageArray = response.images;
                var propertyData = {
                    propertyName: propertyName,
                    address: address,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                    propertyType: propertyType,
                    propertySQFT: propertySQFT,
                    units: units,
                    images: imageArray
                };

                $.ajax({
                    url: 'https://backend.app.spaderent.com/api/spade/property',
                    type: 'POST',
                    data: JSON.stringify(propertyData),
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                    },
                    success: function (response) {
                        // console.log(1)
                        var password = 'your-secret-password';
                        var encryptedPropertyId = sjcl.encrypt(password, response.propertyId.toString());
                        
                        // Include the encrypted value in the URL
                        var encodedPropertyId = encodeURIComponent(encryptedPropertyId);
                                                $("#unit-link").attr("href", `./bank-account.html?property=${encodedPropertyId}`);
                resetAccordions()
                $('#addModal').modal('hide')
                        
                if (response.message === "Property Already Exist") {
                    $('#preloader').fadeOut('slow', function() {
                        $(this).hide();
                    });
                    $('#infoModal').modal('show');
                }else {
                    GetNotification();
                    $('#preloader').fadeOut('slow', function() {
                        $(this).hide();
                    });
                    $('#succesModal').modal('show');
                    localStorage.setItem("property","true")
                }
            
                        // window.location = '../Landlord/properties-all.html';
                    },
                    error: function (xhr, status, error) {
                        if(xhr.responseJSON.error==='Property Already Exist'){
                            $('#addModal').modal('hide');
                            $('#infoModal').modal('show');
                            setTimeout(function() {
                                $('#infoModal').modal('hide');
                            }, 2000);
                        }
                       else{
                        $("#myModal_warning_connection").modal("show");
                        setTimeout(function() {
                            $('#myModal_warning_connection').modal('hide');

                        }, 2000);
                       }
                        console.log('Error: ' + error);
                        console.log(xhr)
                    }
                });
            },
            error: function(xhr, status, error) {
                $("#myModal_warning_connection").modal("show");
                            setTimeout(function() {
                                $('#myModal_warning_connection').modal('hide');

                            }, 2000);
                            console.log('Error: ' + error);
            }
        });
    } else {
        var propertyData = {
            propertyName: propertyName,
            address: address,
            city: city,
            state: state,
            zipCode: zipCode,
            propertyType: propertyType,
            propertySQFT: propertySQFT,
            units: units,
            images: []
        };
        $("#addModal").modal("hide")
        $('#preloader').css('display','flex')
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/property',
            type: 'POST',
            data: JSON.stringify(propertyData),
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function (response) {
                var password = 'your-secret-password';
                var encryptedPropertyId = sjcl.encrypt(password, response.propertyId.toString());
                
                // Include the encrypted value in the URL
                var encodedPropertyId = encodeURIComponent(encryptedPropertyId);
                                        $("#unit-link").attr("href", `./bank-account.html?property=${encodedPropertyId}`);
        resetAccordions()
        $('#addModal').modal('hide')
    
        if (response.message === "Property Already Exist") {
            $('#preloader').fadeOut('slow', function() {
                $(this).hide();
            });
            $('#infoModal').modal('show');
        } else {
            GetNotification();
            $('#preloader').fadeOut('slow', function() {
                $(this).hide();
            });
            $('#succesModal').modal('show');
            localStorage.setItem("property","true")
        }
    
                // window.location = '../Landlord/properties-all.html';
            },
            error: function (xhr, status, error) {
                if(xhr.responseJSON.error==='Property Already Exist'){
                    $('#addModal').modal('hide');
                    $('#infoModal').modal('show');
                    setTimeout(function() {
                        $('#infoModal').modal('hide');
                    }, 2000);
                }else{
                    $('#addModal').modal('hide');
                    $("#myModal_warning_connection").modal("show");
                            setTimeout(function() {
                                $('#myModal_warning_connection').modal('hide');
                            }, 2000);
                }
            }
        });
    }
});
let propertyId;
})