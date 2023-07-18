

function convertTimestamp(timestamp) {
    var date = new Date(timestamp);
    var now = new Date();
  
    var timeDifference = now.getTime() - date.getTime();
    var seconds = Math.floor(timeDifference / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);
  
    if (months > 0) {
      return months + (months === 1 ? ' month ago' : ' months ago');
    } else if (days > 0) {
      return days + (days === 1 ? ' day ago' : ' days ago');
    } else if (hours > 0) {
      return hours + (hours === 1 ? ' hour ago' : ' hours ago');
    } else if (minutes > 0) {
      return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
    } else {
      return seconds + (seconds === 1 ? ' second ago' : ' seconds ago');
    }
  }
$.ajax({
    url: 'http://localhost:3000/api/spade/notify',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function(response) {
    //     function toTitleCase(str) {
    //         return str.replace(/\w\S*/g, function(txt) {
    //             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    //         });
    //     }
    // $("#user-name").text(toTitleCase(user))
    // $("#header-user").text(toTitleCase(user))
    console.log(response)
    const notification = [
        ...response.invoiceNotify,
        ...response.propertyNotify,
        ...response.taskNotify,
        ...response.tenantNotify
      ];
      console.log(notification)
    notification?.forEach((item) => {
        if(item.invoiceID){
            $("#notification-container").append(
                `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${item.Image?.split(",")[0]}"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${item.firstName}</div> <span class="text-dark"> ${item.Address} > ${item.city}</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${item.totalAmount}$ Received</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(item.created_at)}</span>
    </div></div>`
               )
        }else if(item.propertyID){
            $("#notification-container").append(
                `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${item.Image?.split(",")[0]}"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${item.propertyName}</div> <span class="text-dark"> ${item.address} > ${item.city}</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${item.propertyType}</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(item.created_at)}</span>
    </div></div>`
               )
        }else if(item.taskID){
            $("#notification-container").append(
                `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${item.Image?.split(",")[0]}"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${item.firstName}</div> <span class="text-dark">${item.priority} | ${item.status}</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
            
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(item.created_at)}</span>
    </div></div>`
               )
        }
      
    });
        

    },
    error: function(xhr, status, error) {
        console.log('Error occurred while fetching state and city data.');
        console.log(xhr);
        console.log(error);
        // console.log('Error occurred while fetching state and city data.');
    }
});