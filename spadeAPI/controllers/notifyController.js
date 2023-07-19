const { selectQuery, getTenantNotify, getPropertyNotify, getTaskNotify, getInvoiceNotify, insertNotify, updateNotify } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");

const notifyController = {
    updateNotifyData: async (req, res) => {
        const { isEmailNotify, isPushNotify, textNotification } = req.body;
        const { userId } = req.user;
        try {
            // find notifTable by userId
            const getNotifyResult = await queryRunner(selectQuery("notification", "landlordID"), [
                userId
            ]);
            if (getNotifyResult[0].length > 0) {
                // update notifTable
                const updateNotifyResult = await queryRunner(updateNotify, [
                    isEmailNotify,
                    isPushNotify,
                    textNotification,
                    userId
                ]);
                if (updateNotifyResult[0].affectedRows > 0) {
                    return res.status(200).json({
                        email: isEmailNotify === "yes" ? "Email notifications enabled" : "Email notifications disabled",
                        push: isPushNotify === "yes" ? "push notifications enabled" : "push notifications disabled",
                    });
                }
            } else {
                // create notifTable and insert data
                const insertNotifyResult = await queryRunner(insertNotify, [
                    userId,
                    isEmailNotify,
                    isPushNotify,
                    textNotification
                ]);
                if (insertNotifyResult[0].affectedRows > 0) {
                    return res.status(200).json({
                        email: isEmailNotify === "yes" ? "Email notifications enabled" : "Email notifications disabled",
                        push: isPushNotify === "yes" ? "push notifications enabled" : "push notifications disabled",
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    getCheckedNotify: async (req, res) => {
        try {
            // find notifTable by userId
            const { userId } = req.user;
            const getNotifyResult = await queryRunner(selectQuery("notification", "landlordID"), [
                userId
            ]);
            if (getNotifyResult[0].length > 0) {
                return res.status(200).json({
                    email: getNotifyResult[0][0].emailNotification,
                    push: getNotifyResult[0][0].pushNotification,
                });
            }
            res.status(400).json({
                message: "No data found"
            })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    getNotify: async (req, res) => {
        //get property , tenants , task invoice from tables individually
        const { userId } = req.user;
        try {
            // get data from property table
            const getTenantsNotify = await queryRunner(getTenantNotify, [
                userId
            ]);
            const property = await queryRunner(getPropertyNotify, [
                userId
            ]);

            // get data from task table
            const task = await queryRunner(getTaskNotify, [
                userId
            ]);

            // get data from invoice table
            const invoice = await queryRunner(getInvoiceNotify, [
                userId
            ]);
            res.status(200).json({
                tenantNotify: getTenantsNotify[0],
                // {
                //     count: tenants[0].length,
                //     userCreatedId: tenants[0].map((item) => item.landlordID),
                //     tenantCreated_at: tenants[0].map((item) => item.tenantCreated_at),
                // },
                propertyNotify: property[0],
                taskNotify: task[0],
                invoiceNotify: invoice[0]
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }

}

module.exports = notifyController;