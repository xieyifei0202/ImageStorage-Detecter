const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../config');

aws.config.update({
    secretAccessKey: 'yCz+HsI92ght1MMq0aeghQ2+w5d5SMIK5l7ve8yt',
    accessKeyId: 'ASIASJWQ42I5UJOV2L3H',
    region: 'us-east-1'
})
 
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg') {
    cb(null, true)
  } else {
    cb(new Error('Invalid Mime Type, only JPG'), false);
  }
}
 
const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    s3,
    bucket: 'upload-api-tlei',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload;