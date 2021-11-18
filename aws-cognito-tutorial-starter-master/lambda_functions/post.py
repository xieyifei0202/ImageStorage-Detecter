import boto3
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--image", required=True,
	help="image name you want to upload")
ap.add_argument("-s", "--save", required=True,
	help="image name you want to save in aws")
args = vars(ap.parse_args())
S3 = boto3.client('s3')
S3.upload_file(args["image"],'yolov-pack',args["save"])

