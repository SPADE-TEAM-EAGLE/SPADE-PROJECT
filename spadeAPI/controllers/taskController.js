const user = require("../models/user");
const { sendMail, taskSendMail } = require("../sendmail/sendmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Path = require("path");
const imageToDelete = require("./../middleware/deleteImage");
const { serialize } = require("cookie");
const {
  selectQuery,
  deleteQuery,
  addVendor,
  addTasksQuery,
  insertInTaskImage,
  addVendorList,
  getLandlordTenant,
  Alltasks,
  AlltasksTenantsLandlord,
  taskByIDQuery,
  updateTasksQuery,
  selectVendorCategory,
  getVendors,
  delteImageForTaskImages,
  addVendorCategory,
  updateVendorCategory,
  taskCount,
  updateVendor,
  taskCountId,
  taskIdUpdate
} = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { deleteImageFromS3 } = require("../helper/S3Bucket");


exports.addVendors = async (req, res) => {
  const {
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    state,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId } = req.user;

  try {
    const vendorCheckResult = await queryRunner(
      selectQuery("vendor", "email", "landlordID"),
      [email, userId]
    );
    if (vendorCheckResult[0].length > 0) {
      return res.send("Vendor already exists");
    } else {

      const vendorResult = await queryRunner(addVendor, [
        firstName,
        lastName,
        businessName,
        streetAddress,
        city,
        state,
        zip,
        workPhone,
        phone,
        email,
        categoryID,
        userId,
      ]);
      if (vendorResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }
    }

    res.status(200).json({
      message: " Vendor created successful",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.updateVendor = async (req, res) => {
  const {
    vendId,
    firstName,
    lastName,
    businessName,
    streetAddress,
    city,
    state,
    zip,
    workPhone,
    phone,
    email,
    categoryID,
  } = req.body;
  const { userId } = req.user;

  try {
    const updateVendorResult = await queryRunner(updateVendor, [
      firstName,
      lastName,
      businessName,
      streetAddress,
      city,
      state,
      zip,
      workPhone,
      phone,
      email,
      categoryID,
      vendId,
    ]);
    if (updateVendorResult[0].affectedRows > 0) {
      res.status(200).json({
        message: " Vendor Updated successful",
      });
    }else{
      res.status(400).json({
        message: " Vendor not Updated successful",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.deleteVendor = async (req, res) => {
    try {
      const { vendorID } = req.params;
      const deleteVendorResult = await queryRunner(
        deleteQuery("vendor", "id"),
        [vendorID]
      );
      if (deleteVendorResult[0].affectedRows > 0) {
        res.status(200).json({
          message: "Vendor Deleted successful",
        });
      }else{
        res.status(400).json({
          message: "Vendor not Deleted",
        });
      }     
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
}



exports.getAllVendors = async (req, res) => {
  const { userId, userName } = req.user;

  try {
    const getVendorAPI = await queryRunner(getVendors, [userId]);

    if (getVendorAPI[0].length > 0) {
      res.status(200).json({
        data: getVendorAPI,
        name: userName,
        message: "All vendor retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No data found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "An error occurred while retrieving Vendor.",
      error: error.message,
    });
  }
};




exports.addTasks = async (req, res) => {
  const {
    task,
    assignee,
    property,
    dueDate,
    status,
    priority,
    note,
    notifyTenant,
    notifyVendor,
    images,



  } = req.body;

  const vendorID = assignee;
  const { userId, userName,taskEmail } = req.user;


  const currentDate = new Date();
  try {

    const addTasksCheckResult = await queryRunner(
      selectQuery("task", "taskName", "tenantID"),
      [task, property]
    );
    if (addTasksCheckResult[0].length > 0) {
      return res.send("Task already exists");
    } else {

      const TasksResult = await queryRunner(addTasksQuery, [
        task,
        property,
        dueDate,
        status,
        priority,
        note,
        notifyTenant,
        notifyVendor,
        currentDate,
        userName,
        userId,
      ]);
      if (TasksResult.affectedRows === 0) {
        return res.status(400).send("Error1");
      }

        const tasksID = TasksResult[0].insertId;

        const taskCountIdResult = await queryRunner(taskCountId, [userId]);
        let customTaskId = taskCountIdResult[0][0].count + 1;
        customTaskId = task+customTaskId;
        const taskIdUpdateResult = await queryRunner(taskIdUpdate ,[customTaskId, tasksID]);
        if(images){
      for (let i = 0; i < images.length; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          tasksID,
          image_url,
          image_key,
        ]);

        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }

      for (let i = 0; i < vendorID.length; i++) {
        const Vendorid = vendorID[i];
        const vendorResults = await queryRunner(addVendorList, [
          tasksID,
          Vendorid,
        ]);
        if (vendorResults.affectedRows === 0) {
          return res.send("Error2");
        }
      }

      const tenantLandlordResult = await queryRunner(getLandlordTenant, [
        userId,
        property,
      ]);
      let vendorEmailarr = [];
      let vendorNamearr = [];
      for (let i = 0; i < vendorID.length; i++) {
        const vendorCheckResult = await queryRunner(
          selectQuery("vendor", "id"),
          [vendorID[i]]
        );
        if (vendorCheckResult.length > 0) {
          let vendorName =
            vendorCheckResult[0][0].firstName +
            " " +
            vendorCheckResult[0][0].lastName;
          let vendorEmail = vendorCheckResult[0][0].email;
          vendorNamearr.push(vendorName);
          vendorEmailarr.push(vendorEmail);
        } else {
          return res.send("Vendor not found");
        }
      }

      const tenantName =
        tenantLandlordResult[0][0].firstName +
        " " +
        tenantLandlordResult[0][0].lastName;
      const tenantEmail = tenantLandlordResult[0][0].email;
      const CompanyName = tenantLandlordResult[0][0].companyName;
      const landlordName =
        tenantLandlordResult[0][0].FirstName +
        " " +
        tenantLandlordResult[0][0].LastName;
      const landlordContact = tenantLandlordResult[0][0].Phone;

      const vendorNames = vendorNamearr.toString();

      if (notifyTenant.toLowerCase() === "yes") {
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + task,
        dueDate,
        landlordName,
        task,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        tenantEmail,
        taskEmail
      );
      }
      if (notifyVendor.toLowerCase() === "yes") {
      for (let i = 0; i < vendorEmailarr.length > 0; i++) {

        await taskSendMail(
          tenantName,
          "Property Maintenance: " + task,
          dueDate,
          landlordName,
          task,
          vendorNames,
          priority,
          CompanyName,
          landlordContact,
          userId,
          vendorEmailarr[i],
          taskEmail
        );
        }
      }
    }
    return res.send("Created");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};



exports.getAllTask = async (req, res) => {
  const { userId } = req.user;

  try {
    const allTaskResult = await queryRunner(Alltasks, [userId]);

    if (allTaskResult.length > 0) {
      for (let i = 0; i < allTaskResult[0].length; i++) {
        const taskID = allTaskResult[0][i].id;
        const assignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);

        const vendorData = [];

        for (let j = 0; j < vendorIDs.length; j++) {
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
            };
            vendorData.push(vendor);
          }
        }
        allTaskResult[0][i].AssignTo = vendorData;
      }

      res.status(200).json({
        data: allTaskResult,
        message: "All Tasks",
      });
    } else {
      res.status(400).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get Tasks" + error);
  }
};



exports.taskByID = async (req, res) => {
  const { Id } = req.body;
  try {
    const taskByIDResult = await queryRunner(taskByIDQuery, [Id]);
    if (taskByIDResult.length > 0) {
      const TaskImagesResult = await queryRunner(
        selectQuery("taskimages", "taskID"),
        [Id]
      );
      if (TaskImagesResult[0].length > 0) {
        const taskImages = TaskImagesResult[0].map((image) => image.taskImages);
        taskByIDResult[0][0].taskImages = taskImages;
      } else {
        taskByIDResult[0][0].taskImages = ["No Task Images Found"];
      }
      const TaskAssignToResult = await queryRunner(
        selectQuery("taskassignto", "taskId"),
        [Id]
      );
      const vendorIDs = TaskAssignToResult[0].map(
        (vendorID) => vendorID.vendorId
      );
      const vendorData = [];
      for (let i = 0; i < vendorIDs.length; i++) {
        const vID = vendorIDs[i];
        const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
          vID,
        ]);
        if (vendorResult.length > 0) {
          const categoryIDs = vendorResult[0][0].categoryID;
          const VendorCategoryResult = await queryRunner(
            selectQuery("vendorcategory", "id"),
            [categoryIDs]
          );
          if (VendorCategoryResult.length > 0) {
            const vendorDataObject = {
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              businessName: vendorResult[0][0].businessName,
              streetAddress: vendorResult[0][0].streetAddress,
              workNumber: vendorResult[0][0].workNumber,
              mobileNumber: vendorResult[0][0].mobileNumber,
              email: vendorResult[0][0].email,
              category: VendorCategoryResult[0][0].category,
            };
            vendorData.push(vendorDataObject);
          } else {
            vendorData.push(["No Vendor Data Found"]);
          }
        }
      }
      taskByIDResult[0][0].vendor = vendorData;
      res.status(200).json({
        data: taskByIDResult,
        message: "Task data retrieved successfully",
      });
    } else {
      res.status(400).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get Tasks");
  }
};




exports.getVendorCategory = async (req, res) => {
  try {

    const { userId } = req.user;
    const categoryResult = await queryRunner(
      selectQuery("vendorcategory", "landLordId"),
      [userId]
    );
    if (categoryResult[0].length > 0) {
      res.status(200).json({
        data: categoryResult[0],
        message: "ALL vendor category",
      });
    } else {
      res.status(400).json({
        message: "No vendor category data found",
      });
    }
  } catch (error) {
    res.send("Error Get category ");
    console.log(error);
  }
};




exports.getVendorAssignTo = async (req, res) => {
  try {
    const { userId, userName } = req.user;

    const vendorResult = await queryRunner(
      selectQuery("vendor", "LandlordID"),
      [userId]
    );
    if (vendorResult[0].length > 0) {
      res.status(200).json({
        user: userName,
        data: vendorResult[0],
        message: "ALL vendor Here",
      });
    } else {
      res.status(400).json({
        message: "No vendor data found",
      });
    }
  } catch (error) {
    res.send("Error Get vendor list ");
    console.log(error);
  }
};



exports.updateTasks = async (req, res) => {
  const {
    property,
    taskName,

    taskID,
    dueDate,
    status,
    priority,

    assignee,
    notifyTenant,
    notifyVendor,
    message,
    images,
  } = req.body;

  try {
    const currentDate = new Date();
    const { userId,taskEmail } = req.user;
    const TasksResult = await queryRunner(updateTasksQuery, [
      taskName,
      property,
      dueDate,
      status,
      priority,
      message,
      notifyTenant,
      notifyVendor,
      currentDate,
      taskID,
    ]);
    if (TasksResult[0].affectedRows === 0) {

      res.send("Error1");
    }
    const propertycheckresult = await queryRunner(
      selectQuery("taskimages", "taskID"),
      [taskID]
    );


    if (propertycheckresult[0].length > 0) {
      const propertyImageKeys = propertycheckresult[0].map(
        (image) => image.ImageKey
      );



      const imagesToDelete = propertycheckresult[0].filter(
        (image) => !images.some((img) => img.imageKey === image.ImageKey)
      );


      for (let i = 0; i < imagesToDelete.length; i++) {
        deleteImageFromS3(imagesToDelete[i].ImageKey);
        await queryRunner(delteImageForTaskImages, [
          imagesToDelete[i].ImageKey,
        ]);
      }

      const imagesToInsert = images.filter(
        (image) => !propertyImageKeys.includes(image.imageKey)
      );
      for (let i = 0; i < imagesToInsert.length; i++) {
        const { image_url } = imagesToInsert[i];
        const { image_key } = imagesToInsert[i];
        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);

        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    } else {
      for (let i = 0; i < images.length - 1; i++) {
        const { image_url } = images[i];
        const { image_key } = images[i];


        const propertyImageResult = await queryRunner(insertInTaskImage, [
          taskID,
          image_url,
          image_key,
        ]);

        if (propertyImageResult.affectedRows === 0) {
          throw new Error("data doesn't inserted in property image table");
        }
      }
    }
    const taskVendorDeleteResult = await queryRunner(
      deleteQuery("taskassignto", "taskId"),
      [taskID]
    );
    const vendorID = assignee;
    for (let i = 0; i < vendorID.length; i++) {
      const Vendorid = vendorID[i];
      const vendorResults = await queryRunner(addVendorList, [
        taskID,
        Vendorid,
      ]);
      if (vendorResults.affectedRows === 0) {
        return res.send("Error2");
      }
    }
    console.log( "asdcfrtgh" + property);
    console.log( "frfrf" + userId);

    const tenantLandlordResult = await queryRunner(getLandlordTenant, [
      userId,
      property,
    ]);

    let vendorEmailarr = [];
    let vendorNamearr = [];
    for (let i = 0; i < vendorID.length; i++) {
      const vendorCheckResult = await queryRunner(selectQuery("vendor", "id"), [
        vendorID[i],
      ]);
      if (vendorCheckResult.length > 0) {
        let vendorName =
          vendorCheckResult[0][0].firstName +
          " " +
          vendorCheckResult[0][0].lastName;
        let vendorEmail = vendorCheckResult[0][0].email;
        vendorNamearr.push(vendorName);
        vendorEmailarr.push(vendorEmail);
      } else {
        throw new Error("Vendor not found");
      }
    }
    const tenantName =
      tenantLandlordResult[0][0].firstName +
      " " +
      tenantLandlordResult[0][0].lastName;
    const tenantEmail = tenantLandlordResult[0][0].email;
    const CompanyName = tenantLandlordResult[0][0].companyName;
    const landlordName =
      tenantLandlordResult[0][0].FirstName +
      " " +
      tenantLandlordResult[0][0].LastName;
    const landlordContact = tenantLandlordResult[0][0].Phone;
    const landlordEmail = tenantLandlordResult[0][0].Email;

    const vendorNames = vendorNamearr.toString();


    await taskSendMail(
      tenantName,
      "Property Maintenance: " + taskName,
      dueDate,
      landlordName,
      taskName,
      vendorNames,
      priority,
      CompanyName,
      landlordContact,
      userId,
      tenantEmail,
      taskEmail
    );


    for (let i = 0; i < vendorEmailarr.length > 0; i++) {
      console.log("vendor2");
      await taskSendMail(
        tenantName,
        "Property Maintenance: " + taskName,
        dueDate,
        landlordName,
        taskName,
        vendorNames,
        priority,
        CompanyName,
        landlordContact,
        userId,
        vendorEmailarr[i],
        taskEmail
      );

    }
    return res.status(200).json({
      message: " task updated successful ",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};




exports.deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const deleteTaskResult = await queryRunner(deleteQuery("task", "id"), [
      taskID,
    ]);
    if (deleteTaskResult[0].affectedRows > 0) {
      res.status(200).json({

        message: "task Deleted Successful",
      });
    } else {
      res.status(400).json({
        message: "No task data found",
      });
    }
  } catch (error) {
    res.send("Error Get delete task  ");
    console.log(error);
  }
};

























































exports.addVendorCategory = async (req, res) => {
  const categories = req.body;
 


  const { userId } = req.user;

  let insertedId;

  try {
    const categoryCheckResult = await queryRunner(selectQuery("vendorcategory", "landLordId"), [userId]);
    const existingCategories = categoryCheckResult[0];

    if (!Array.isArray(categories)) {
      console.log("fsdjksdjfksdfksdkjsdkjfksdjjsdfsdjsd")
      console.log(categories);
      const categoryToInsert = existingCategories.find(category => 
        category.categories && category.categories.toLowerCase() === categories.categories.toLowerCase()
      );

      if (!categoryToInsert) {
        insertedId = await queryRunner(addVendorCategory, [
          categories.categories.toLowerCase(),
          userId,
        ]);
        console.log(insertedId[0]?.insertId);

        res.status(200).json({
          message: "Categories added/updated successfully",
          categoryID: insertedId[0]?.insertId,
        });
      } else {
        res.status(200).json({
          message: "Category already exists",
          categoryID: categoryToInsert.id,
        });
      }
    } else if (Array.isArray(categories)) {
      
      const categoryToInsert = categories.filter(category => 
        !existingCategories.some(existingCategory =>
          existingCategory.category && existingCategory.category.toLowerCase() === category.category.toLowerCase()
        )
      );

      const categoryToDelete = existingCategories.filter(existingCategory => 
        !categories.some(category =>
          category.category && category.category.toLowerCase() === existingCategory.category.toLowerCase()
        )
      );
          console.log(categoryToInsert);
          await Promise.all(
            categoryToInsert.map(async (item) => {
              await queryRunner(addVendorCategory, [item.category, userId]);
            })
          );
      if (categoryCheckResult[0].length !== 0) {
        

        await Promise.all(
          categoryToDelete.map(async (item) => {
            console.log(item);
            await queryRunner(deleteQuery("vendorcategory", "id"), [item.id]);
          })
        );
      }

      res.status(200).json({
        message: "Categories added/updated successfully",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
};









exports.taskCount = async (req, res) => {
  try {

    const { userId } = req.user;
    const { startDate, endDate } = req.body;

    const taskCountResult = await queryRunner(taskCount, [
      userId,
      startDate,
      endDate,
    ]);


    res.status(200).json({
      data: taskCountResult,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



exports.getAllTaskTenantRequest = async (req, res) => {

  const { userId } = req.user;
  try {
    const allTaskResult = await queryRunner(AlltasksTenantsLandlord, [userId]);

    if (allTaskResult.length > 0) {
      for (let i = 0; i < allTaskResult[0].length; i++) {
        const taskID = allTaskResult[0][i].id;
        const assignToResult = await queryRunner(
          selectQuery("taskassignto", "taskId"),
          [taskID]
        );
        const vendorIDs = assignToResult[0].map((vendor) => vendor.vendorId);

        const vendorData = [];

        for (let j = 0; j < vendorIDs.length; j++) {
          const vendorResult = await queryRunner(selectQuery("vendor", "id"), [
            vendorIDs[j],
          ]);

          if (vendorResult[0].length > 0) {
            const vendor = {
              ID: vendorResult[0][0].id,
              name:
                vendorResult[0][0].firstName +
                " " +
                vendorResult[0][0].lastName,
              email: vendorResult[0][0].email,
              vendorPhone: vendorResult[0][0].phone,
            };
            vendorData.push(vendor);
          }
        }
        allTaskResult[0][i].AssignTo = vendorData;
      }

      res.status(200).json({
        data: allTaskResult,
        message: "All Tasks",
      });
    } else {
      res.status(400).json({
        message: "No Tasks data found",
      });
    }
  } catch (error) {
    console.log("Error:", error);
    res.send("Error Get Tasks" + error);
  }
};







exports.VendorCheckEmail = async function (req, res) {
  const { email } = req.params;
  try {
    const selectResult = await queryRunner(selectQuery("vendor","email"), [ 
      email,
  ]);

    if (selectResult[0].length > 0) {
      return res.status(201).json({
          message: "Email already exists ",
      });
    } 
    else {
      res.status(200).json({
                 message: "New vendor",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};