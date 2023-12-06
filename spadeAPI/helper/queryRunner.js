const { createConnection } = require("../config/connection")
exports.queryRunner= async(query,data)=>{
    const connection = await createConnection();
    return await connection.execute(query,data)
}