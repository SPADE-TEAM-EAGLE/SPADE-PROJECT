const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-v2");


// aws_access_key_id =  AKIA5HKBWH6QWJKJ22G2
// aws_secret_access_key =  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




aws.config.update({
    accessKeyId: "AKIA5HKBWH6QSKOLIQXK",
    secretAccessKey: "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"
});
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("audio/") ||
        file.mimetype.startsWith("video/") ||
        file.mimetype.startsWith("image/") ||
        file.mimetype.startsWith("application/")
    ) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type, only image, video and audio is allowed!"),
            false
        );
    }
};

const upload = multer({
    fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 },
    storage: multerS3({
        acl: "public-read-write",
        s3: s3,
        bucket: "spades3bucket",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
        },
        key: function (req, file, cb) {
            cb(
                null,
                Date.now().toString() + "_" + file.originalname
            );
        },
        ContentType: "image/jpeg/png/jpg video/mp4 application/pdf audio/mpeg audio/aac",
    }),
});

module.exports = upload;