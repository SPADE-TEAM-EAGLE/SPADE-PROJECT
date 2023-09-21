const { insertMessage, selectQuery, getMessages, getMessageCount, updateMessageCount } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");




const messageClt = {
    createNewMessage: async (req, res) => {
        try {
            const sender = req.user.userId;
            const { chatId, message, messageType,userType, receiverID } = req.body;
            const isRead = 1;
            const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (!chatId || !message || !messageType) {
                throw new Error("Please provide all required fields");
            }
            // message,chatId,messageType, created_at
            const sendMessage = await queryRunner(
                insertMessage, [message, chatId, messageType, created_at,sender,userType, receiverID,isRead ]
            );
            if (sendMessage[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Message sent successfully",
                    data: sendMessage[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    createNewMessageTenant: async (req, res) => {
        try {
            const sender = req.user.userId;
            const { chatId, message, messageType ,userType, receiverID } = req.body;
            const isRead = 1;
            const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (!chatId || !message || !messageType) {
                throw new Error("Please provide all required fields");
            }
            // message,chatId,messageType, created_at
            const sendMessage = await queryRunner(
                insertMessage, [message, chatId, messageType, created_at,sender,userType, receiverID,isRead ]
            );
            if (sendMessage[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Message sent successfully",
                    data: sendMessage[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    getAllMessages: async (req, res) => {
        try {
            const { chatId } = req.params;
            if (!chatId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  getAllMessages = await queryRunner(getMessages, [chatId])
            if (getMessages[0].length > 0) {
                res.status(200).json({
                    message: "Messages fetched successfully",
                    data: getAllMessages[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },

    // get (Message) Number of count
    getMessagesCount : async (req, res) => {
        try {
            const { receiverId } = req.body;
            if (!receiverId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  getAllMessagesCount = await queryRunner(getMessageCount, [receiverId])
            if (getAllMessagesCount[0].length > 0) {
                res.status(200).json({
                    message: "Messages fetched successfully",
                    Count: getAllMessagesCount[0][0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    },


     // get update Messages Count
     updateMessagesCount : async (req, res) => {
        try {
            const { receiverId } = req.body;
            // const isread = 0;
            if (!receiverId) {
                throw new Error("Please provide all required fields");
            }
            // const getMessages = await queryRunner(selectQuery("messages", "chatId"), [chatId]);
            const  updateAllMessagesCount = await queryRunner(updateMessageCount, [receiverId])
            if (updateAllMessagesCount[0].affectedRows > 0) {
                res.status(200).json({
                    message: "Messages Updated successfully",
                    // Count: getAllMessagesCount[0][0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    } 
}


module.exports = messageClt;