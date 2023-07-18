const { selectQuery, getTenantNotify, getPropertyNotify, getTaskNotify, getInvoiceNotify } = require("../constants/queries");
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
            const getTenantsNotify = await queryRunner(getTenantNotify, [
                userId
            ]);
            const property = await queryRunner(getPropertyNotify, [
                userId
            ]);
            
            // get data from task table
            const task =  await queryRunner(getTaskNotify, [
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
                taskNotify:task[0],
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