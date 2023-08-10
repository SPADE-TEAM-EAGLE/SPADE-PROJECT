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
    return months + (months === 1 ? " month ago" : " months ago");
  } else if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return seconds + (seconds === 1 ? " second ago" : " seconds ago");
  }
}
$.ajax({
  url: "https://backend.app.spaderent.com/api/spade/notify",
  method: "GET",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("authtoken"),
  },
  success: function (response) {
    const notification = [
      ...response.invoiceNotify,
      ...response.propertyNotify,
      ...response.taskNotify,
      ...response.tenantNotify,
    ];
    notification.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    // filter out based on data notification.notify = 0 then unread else read
    const unread = notification.filter((item) => item.notify === 0);
    const read = notification.filter((item) => item.notify === 1);
    console.log(unread.length, "unread.length");
    console.log(read.length, "read.length");

    notification?.forEach((item) => {
      // read-notification-container
      if (item.invoiceID) {
        $("#notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark"> ${item.Address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${0}$ Received</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
          </div></div>`
        );
      } else if (item.propertyID) {
        $("#notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.propertyName
                    }</div> <span class="text-dark"> ${item.address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${
                      item.propertyType
                    }</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
         </div></div>`
        );
      } else if (item.taskID) {
        $("#notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark">${item.priority} | ${
            item.status
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
            
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
        </div></div>`
        );
      }
    });
    read?.forEach((item) => {
      // read-notification-container
      if (item.invoiceID) {
        $("#inbox-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark"> ${item.Address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${0}$ Received</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
          </div></div>`
        );
      } else if (item.propertyID) {
        $("#inbox-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.propertyName
                    }</div> <span class="text-dark"> ${item.address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${
                      item.propertyType
                    }</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
         </div></div>`
        );
      } else if (item.taskID) {
        $("#inbox-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark">${item.priority} | ${
            item.status
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
            
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
        </div></div>`
        );
      }
    });
    unread?.forEach((item) => {
      // read-notification-container
      if (item.invoiceID) {
        if (item.invoiceID) {
          $("#unread-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                    <div class="me-2">
                        <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                          item.Image?.split(",")[0]
                        }"><span
                            class="avatar-status bg-success"></span>
                    </div>
                    <div class="">
                        <a href="javascript:void(0);">
                            <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                              item.firstName
                            }</div> <span class="text-dark"> ${
              item.Address
            } > ${item.city}</span>
                            <p class="mb-0 fw-bold text-dark fs-15 ">${0}$ Received</p>
                        </a>
                    </div>
                </div><div class="">
                <span class="fs-12 text-dark">${convertTimestamp(
                  item.created_at
                )}</span>
                  </div></div>`
          );
        }
      } else if (item.propertyID) {
        $("#unread-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.propertyName
                    }</div> <span class="text-dark"> ${item.address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${
                      item.propertyType
                    }</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
         </div></div>`
        );
      } else if (item.taskID) {
        $("#unread-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark">${item.priority} | ${
            item.status
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
            
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
        </div></div>`
        );
      }
    });
    notification?.forEach((item) => {
      // read-notification-container
      if (item.invoiceID) {
        $("#Archieve-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark"> ${item.Address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${0}$ Received</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
          </div></div>`
        );
      } else if (item.propertyID) {
        $("#Archieve-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.propertyName
                    }</div> <span class="text-dark"> ${item.address} > ${
            item.city
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">${
                      item.propertyType
                    }</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
         </div></div>`
        );
      } else if (item.taskID) {
        $("#Archieve-notification-container").append(
          `<div class="list-group-item d-flex align-items-center justify-content-between dumy" id='${
            item.invoiceID
          }'>
            <div class="d-flex align-items-center">
            <div class="me-2">
                <span class="avatar avatar-md brround cover-image" data-bs-image-src="${
                  item.Image?.split(",")[0]
                }"><span
                    class="avatar-status bg-success"></span>
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.firstName
                    }</div> <span class="text-dark">${item.priority} | ${
            item.status
          }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
            
        </div><div class="">
        <span class="fs-12 text-dark">${convertTimestamp(
          item.created_at
        )}</span>
        </div></div>`
        );
      }
    });
  },
  error: function (xhr, status, error) {
    console.log("Error occurred while fetching state and city data.");
    console.log(xhr);
    console.log(error);
    // console.log('Error occurred while fetching state and city data.');
  },
});
$(document).ready(function () {
  $(".dumy").click(function () {
    // get this.id and update notification table
    console.log($(this).attr("id"));
  });
});
