const AWS = require("aws-sdk");
const logger = require("../core/logger");

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_DEFAULT_REGION,
// });

AWS.config.update({
  accessKeyId: "AKIAWWPOZUPGSQQRIGKO",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

module.exports.send = async (toemail, subject, htmlbody, textbody) => {
  try {
    logger.data("Email-id =>", toemail);
    logger.data("Subject =>", subject);
    logger.data("Htmlbody =>", htmlbody);
    logger.data("Textbody =>", textbody);
    logger.data("Platform =>", process.env.PLATFORM);
    
    const params = {
      Destination: {
        ToAddresses: [toemail], // Email address/addresses that you want to send your email
      },
      ConfigurationSetName: "farm-mobi" || process.env.EMAIL_CONFIGURATION_SET,
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data: htmlbody,
          },
          Text: {
            Charset: "UTF-8",
            Data: textbody,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: "ashit1540@gmail.com",
    };

    const sendEmail = await ses.sendEmail(params).promise();
    logger.success("Email ", sendEmail);
    return { type: "Email", response: sendEmail };
  } catch (error) {
    logger.error("Email Failed ", error);
    return { type: "Email", error };
  }
};
