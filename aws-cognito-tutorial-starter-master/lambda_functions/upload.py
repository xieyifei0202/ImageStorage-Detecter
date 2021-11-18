import json
import base64
import boto3
import time



def lambda_handler(event, context):
    s3 = boto3.resource("s3")
    get_file_content = event["content"]
    decode_content = base64.b64decode(get_file_content)
    fielname = (time.strftime("%Y %m %d %H %M %S", time.localtime())) 
    fielname = fielname + '.jpg'
    a = fielname.replace(" ", "")
    s3.Bucket('yolov-pack').put_object(Key=a,Body=decode_content)
    # TODO implement
    return {
        'statusCode': 200,
        'filename': fielname
}