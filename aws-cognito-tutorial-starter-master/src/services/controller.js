const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')
 
aws.config.update({
    secretAccessKey: 'GP2fNmaSTQ7WnP4PmBZJabVs2PpPL3b+i+nX5gCl',
    accessKeyId: 'ASIASJWQ42I52SGGEC7D',
    region: 'us-east-1'
})

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'some-api',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

function uploadToS3(req, res){
    let downloadUrl = ``
    return new Promise((resolve, reject) => {
        return signleFileUpload(req, res, err=>{
            if(err) return reject(err);
            return resolve()
        })
    })
}

const signleFileUpload = upload.single('image');

module.exports = {
    uploadImageToS3: (req, res) => {
        uploadToS3(req, res)
        .then(downloadUrl => {
            
            return res.status(200).send({ downloadUrl })
        })
        .catch(e => {
            console.log(e)
        })
    }
}