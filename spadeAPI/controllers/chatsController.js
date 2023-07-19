const { insertChat, selectQuery, getFullChat } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");



const chatsController = {
    accessChats: async (req, res) => {
        const senderId = req.user.userId;
        const { recieverId } = req.body;
        try {
            // check if chat already exists
            const isChat = await queryRunner(
                selectQuery("chats", "senderId", "receiverID"),
                [senderId, recieverId]
            );
            const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
            if (isChat[0].length > 0) {
                res.send(isChat[0]);
            } else {
                // insert into chats table
                const insertChats = await queryRunner(
                    insertChat, [senderId, recieverId, created_at]
                );
                res.status(200).json({
                    message: "Chat created successfully",
                    data: insertChats[0]
                })
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    },
    fetchChats: async (req, res) => {
        const senderId = req.user.userId;
        try {
            const getChats = await queryRunner(selectQuery("chats", "senderId"), [senderId]);
            res.status(200).json({
                message: "Chats fetched successfully",
                data: getChats[0]
            })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
}
exports.chatsController = chatsController;