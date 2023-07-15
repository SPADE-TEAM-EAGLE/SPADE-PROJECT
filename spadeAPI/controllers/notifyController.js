const { selectQuery } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");

const notifyController = {
    updateNotify: async (req, res) => {
        const { isEmailNotify, isPushNotify } = req.body;
        const { userId } = req.user;
        try {
            const updateNotifyResult = await queryRunner(updateNotify, [
                isEmailNotify,
                isPushNotify,
                userId
            ]);
            if (updateNotifyResult[0].affectedRows > 0) {
                return res.status(200).json({
                    email: isEmailNotify === "yes" ? "Email notifications enabled" : "Email notifications disabled",
                    push: isPushNotify === "yes" ? "push notifications enabled" : "push notifications disabled",
                });
            }
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
            const tenants = await queryRunner(selectQuery("tenants", "landlordID"), [
                userId,
            ]);
            // get data from tenants table
            const property = await queryRunner(selectQuery("property", "landlordID"), [
                userId,
            ]);
            // get data from task table
            const task = await await queryRunner(selectQuery("task", "landlordID"), [
                userId,
            ]);
            // get data from invoice table
            const invoice = await queryRunner(selectQuery("invoice", "landlordID"), [
                userId,
            ]);
            

            res.status(200).json({
                tenantNotify: {
                    count: tenants[0].length,
                    userCreatedId: tenants[0].map((item) => item.landlordID),
                    tenantCreated_at: tenants[0].map((item) => item.tenantCreated_at),
                },
                propertyNotify: {
                    count: property[0].length,
                    userCreatedId: property[0].map((item) => item.landlordID),
                    propertyCreated_at: property[0].map((item) => item.created_at),
                },
                taskNotify: {
                    count: task[0].length,
                    userCreatedId: task[0].map((item) => item.landlordID),
                    taskCreated_at: task[0].map((item) => item.created_at),
                },
                invoiceNotify: {
                    count: invoice[0].length,
                    userCreatedId: invoice[0].map((item) => item.landlordID),
                    invoiceCreated_at: invoice[0].map((item) => item.created_at),
                }
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }

}

module.exports = notifyController;