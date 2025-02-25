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
    return (seconds<=0?1:seconds) + (seconds === 1 ? " second ago" : " seconds ago");
  }
}
function GetNotification(){
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/notify",
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
    // console.log(response);
    let notification = [];
    if(response?.userTaskNotify){
      notification = [
        ...response.invoiceNotify,
        ...response.propertyNotify,
        ...response.taskNotify,
        ...response.tenantNotify,
        ...response?.userTaskNotify
      ];
    }else{
      notification = [
        ...response.invoiceNotify,
        ...response.propertyNotify,
        ...response.taskNotify,
        ...response.tenantNotify,
        // ...response?.userTaskNotify
      ];
    }
      
      notification.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      const unread = notification.filter((item) => item.notify === 0);
      const read = notification.filter((item) => item.notify === 1);
    // console.log(unread, "unread");
    // console.log(read, "read");
    // console.log(notification, "all");
      $(".all_span").text(`(${notification.length})`);
      $(".inbox_span").text(`(${read.length})`);
      $(".Unread_span").text(`(${unread.length})`);
      $("#count_unread").text(unread.length > 0 ? unread.length : '0');
      $(".archive_span").text(`(${notification.length})`);
      $("#notification-container").empty();
      notification?.forEach((item) => {
        if (item.invoiceID) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass}  justify-content-between notification-item invoice" data-id="${
              item.invoiceID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10346.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.firstName
                      }</div> <span class="text-dark"> ${item.Address? item.Address : "N/A"} > ${
              item.city
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">$ ${item.totalAmount} </p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
            </div></div>`
          );
        } else if (item.propertyID) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass}  justify-content-between notification-item property" data-id="${
              item.propertyID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
                  <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                   ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10341.png' )
                  }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
           </div></div>`
          );
        } 
        else if (item.taskID && item.propertyName) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass} justify-content-between notification-item user_task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.taskName
                      }</div> <span class="text-dark">${item.priority} | ${
              item.status
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
        }
        else if (item.taskID) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass} justify-content-between notification-item task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
        }
       
        else if (item.tenantID) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass} justify-content-between notification-item tenant" data-id="${
              item.tenantID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10344.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.firstName
                      }</div> <span class="text-dark">${item.propertyName} | ${
              item.propertyType
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.tenantCreated_at
          )}</span> 
          </div></div>`
          );
          
        }
      }
      );
      $("#inbox-notification-container").empty();
      read?.forEach((item) => {
        if (item.invoiceID) {
          $("#inbox-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item invoice" data-id="${
              item.invoiceID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
                   <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10346.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.firstName
                      }</div> <span class="text-dark"> ${item.Address? item.Address : "N/A"} > ${
                        item.city
                      }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">$ ${item.totalAmount} </p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
            </div></div>`
          );
        } else if (item.propertyID) {
          $("#inbox-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item property" data-id="${
              item.propertyID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
                   <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                   ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10341.png' )
                  }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
           </div></div>`
          );
        } 
        else if (item.taskID && item.propertyName) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass} justify-content-between notification-item user_task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.taskName
                      }</div> <span class="text-dark">${item.priority} | ${
              item.status
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
        }
        else if (item.taskID) {
          $("#inbox-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "task");
          // });
        } else if (item.tenantID) {
          $("#inbox-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item tenant" data-id="${
              item.tenantID
            }">
            <div class="d-flex align-items-center">
            <div class="me-2">
            <span class="avatar avatar-md brround cover-image" style="background-image:url('${
              ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10344.png' )
             }')!important; ">
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.propertyName
                    }</div> <span class="text-dark">${item.propertyName} | ${
              item.propertyType
            }</span>
                    <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(item.created_at)}</span>
        </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "task");
          // });
        }
      });
      $("#unread-notification-container").empty();
      unread?.forEach((item) => {
        if (item.invoiceID) {
          $("#unread-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item invoice" data-id="${
              item.invoiceID
            }">
                      <div class="d-flex align-items-center">
                      <div class="me-2">
                           <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10346.png' )
               }')!important; ">
                      </div>
                      <div class="">
                          <a href="javascript:void(0);">
                              <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                                item.firstName
                              }</div> <span class="text-dark"> ${item.Address? item.Address : "N/A"} > ${
                                item.city
                              }</span>
                              <p class="mb-0 fw-bold text-dark fs-15 ">$ ${item.totalAmount} </p>
                          </a>
                      </div>
                  </div><div class="">
                  <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
                    item.created_at
                  )}</span>
                    </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "invoice");
          // });
        } else if (item.propertyID) {
          $("#unread-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item property" data-id="${
              item.propertyID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
                   <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                   ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10341.png' )
                  }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
           </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "property");
          // });
        } 
        else if (item.taskID && item.propertyName) {
          const colorClass = item.notify === 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass} justify-content-between notification-item user_task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.taskName
                      }</div> <span class="text-dark">${item.priority} | ${
              item.status
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
        }
        else if (item.taskID) {
          $("#unread-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item task" data-id="${
              item.taskID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10350.png' )
               }')!important; ">
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
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.created_at
          )}</span>
          </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "task");
          // });
        } else if (item.tenantID) { 
          $("#unread-notification-container").append(
            `<div class="list-group-item d-flex align-items-center justify-content-between notification-item tenant" data-id="${
              item.tenantID
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item.Image? item.Image.split(",")[0] : '../assets/images/icons/Group 10344.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.firstName
                      }</div> <span class="text-dark">${item.propertyName} | ${
              item.propertyName
            }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 ">Task Assigned</p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.tenantCreated_at
          )}</span>
          </div></div>`
          );
          // $(".notification-item").on("click", function () {
          //   const itemId = $(this).data("id");
          // // console.log("itemId", itemId);
          //   updateDataNotify(itemId, "tenant");
          // });
        }
      });
    },
    error: function (xhr, status, error) {
    // console.log("Error occurred while fetching state and city data.");
    // console.log(xhr);
    // console.log(error);
    },
  });
}  
GetNotification();

  $(document).on("click", ".notification-item", function () {
  const itemId = $(this).data("id");
  let type = "";
  
  if($(this).hasClass("invoice")){
    type = "invoice";
  }
  else if($(this).hasClass("property")){
    type = "property";
  }
  else if($(this).hasClass("task")){
    type = "task";
  }
  else if($(this).hasClass("user_task")){
    type = "userTask";
  }
  else if($(this).hasClass("tenant")){
    type = "tenant";
  }
  console.log($(this))
  updateDataNotify(itemId, type);
});
$("#updateAllNotifyRead").on("click", function () {
  updateAllNotifyRead();
  GetNotification();
});
function getNotifyData(){
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/notify",
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
    },
    error: function (xhr, status, error) {
    // console.log("Error occurred while fetching state and city data.");
    // console.log(xhr);
    // console.log(error);
    },
  });
}
function updateAllNotifyRead() {
  getNotifyData()
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/updateAllNotifyRead",
    type: "PUT",
    data: JSON.stringify({
      notify: 1,
    }),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
    // console.log(response);
    },
    error: function (xhr, status, error) {
    // console.log("Error: " + error);
    },
  });
}
function updateDataNotify(notificationId, type) {
  console.log(notificationId, type);
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/updateReadUnRead",
    type: "PUT",
    data: JSON.stringify({
      notify: 1,
      id: notificationId,
      type: type,
    }),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      if(type == "property"){
        window.location.href="./properties-all.html";
      }else if(type == "task"){
        window.location.href="./maintenance-requests.html";
      }
      else if(type == "userTask"){
        window.location.href="./user-tasks.html";
      }
      else if(type == "invoice"){
        window.location.href="./create-invoicing.html";
      }else if(type == "tenant"){
        window.location.href="./add-tenant.html";
      }
    // console.log(response);
    },
    error: function (xhr, status, error) {
    // console.log("Error: " + error);
    },
  });
}
