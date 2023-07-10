//  ############################# landlord verify Mail Check Start  ############################################################

const { selectAnyQuery } = require("../constants/queries");
const { queryRunner } = require("./queryRunner");

const verifyMailCheck = async (email) => {
  try {
    const selectLandlordResult = await queryRunner(selectAnyQuery("users", "email"), [email]);
    if (selectLandlordResult[0].length > 0) {
      const createdDate = selectLandlordResult[0][0].created_at;
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate - createdDate;
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const differenceInDays = Math.floor(differenceInHours / 24);
      if (differenceInDays > 0) {
        return {
          message: `Your remaining days is ${differenceInDays} please verify your email otherwise your account will be locked after ${differenceInDays} days`,
        };
      } else if (differenceInDays === 0) {
        return {
          message: `Today is your last day, so kindly verify your email otherwise your account will be locked tomorrow`,
        };
      } else {
        return {
          message: `Your account is locked due to email verification. Firstly verify your email.`,
        };
      }
    } else {
      throw new Error('Landlord does not exist');
    }
  } catch (error) {
    throw new Error("Error occurred in verifying the landlord email: " + error);
  }
};

module.exports = {
  verifyMailCheck,
};

  
  //  ############################# landlord verify Mail Check END  ############################################################
  