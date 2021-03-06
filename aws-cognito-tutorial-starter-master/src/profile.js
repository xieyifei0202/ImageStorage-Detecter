const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require( 'multer' );
const path = require( 'path' );

const router = express.Router();

const s3 = new aws.S3({
    accessKeyId: 'ASIASJWQ42I52SGGEC7D',
    secretAccessKey: 'GP2fNmaSTQ7WnP4PmBZJabVs2PpPL3b+i+nX5gCl',
    Bucket: 'upload-api-tlei'
})

/**
 * Single upload
 */
const profileImagUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'upload-api-tlei',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, path.basename( file.originalname, path.extname( 
                file.originalname ) ) + '-' + Date.now() +path.extname(
                    file.originalname ) )
        }
    }),
    limits: {
        fileSize: 2000000  //2MB
    },
    fileFilter: function( req, file, cb){
        checkFileType( file, cb);
    }
}).single('profileImage');

/**
 * 
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
    //Allow ext
    const filetypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase() );
    // Check mime
    const mimetype = filetypes.test( file.mimetype );

    if ( mimetype && extname ){
        return cb (null, true)
    } else {
        cb( 'Error: Image Only!' );
    }
}

// router.post( '/profile-img-upload', ( req, res ) => {
//     profileImgUpload( req, res, ( error ) => {
//       // console.log( 'requestOkokok', req.file );
//       // console.log( 'error', error );
//       if( error ){
//        console.log( 'errors', error );
//        res.json( { error: error } );
//       } else {
//        // If File not found
//        if( req.file === undefined ){
//         console.log( 'Error: No File Selected!' );
//         res.json( 'Error: No File Selected' );
//        } else {
//         // If Success
//         const imageName = req.file.key;
//         const imageLocation = req.file.location;
//     // Save the file name into database into profile model
//     res.json( {
//          image: imageName,
//          location: imageLocation
//         } );
//        }
//       }
//      });
//     });

module.exports = router;
