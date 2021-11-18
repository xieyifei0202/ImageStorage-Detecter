import json
import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
import numpy as np
import cv2
import os
import io
import time
import base64

s3_client = boto3.client('s3')
dynamodb = boto3.client('dynamodb')
TABLE_NAME = 'Products'



def lambda_handler(event, context):
    for record in event['Records']:
        bucket = record['s3']['bucket']['name']
        key = unquote_plus(record['s3']['object']['key'])
       # print("File {0} uploaded to {1} bucket".format(key, bucket))
    
    shabi_file = s3_client.get_object(Bucket='yolov-pack', Key=key)
    emailcontent = shabi_file['Body'].read()#.decode('utf-8')
    na_array = np.fromstring(emailcontent, np.uint8)
    image_np = cv2.imdecode(na_array, cv2.IMREAD_COLOR)
    labels = s3_client.get_object(Bucket='yolov-pack', Key='coco.names')
    label = labels['Body'].read().decode('utf8').strip().split("\n")
    cfg = s3_client.get_object(Bucket='yolov-pack', Key='yolov3-tiny.cfg')
    weights = s3_client.get_object(Bucket='yolov-pack', Key='yolov3-tiny.weights')
   # shabidx =  weights['Body'].read()
    #naocan=shabidx.decode('utf-8','ignore') 
    net = cv2.dnn.readNetFromDarknet(cfg['Body'].read(), weights['Body'].read())
    ln = net.getLayerNames()
    ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    blob = cv2.dnn.blobFromImage(image_np, 1 / 255.0, (416, 416), swapRB=True, crop=False)

    net.setInput(blob)
    list1=[]
    layerOutputs = net.forward(ln)
    confidences = []
    classIDs = []
    
    for output in layerOutputs:
        for detection in output:
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            if confidence > 0.5:
                confidences.append(float(confidence))
                classIDs.append(classID)
    count = 0
    if (len(classIDs) > 0):
        while (count < len(classIDs)):
            textOne = str(label[classIDs[count]])
            textTwo = str(confidences[count])
            count = count + 1
            if textOne not in list1:
            #return jsonify( { 'Object': textOne})
                list1.append(textOne)
             
    else:
        textA = "Detected None Object"
        textB = "zeor confidences due to detect none Object"
        #return jsonify({ 'Object': textA })
        list1.append(textA)
      

    # compute detection tie
    #print("detection time: {:.2f}".format(end_time - start_time))

    
    a=''
    for sbdx in list1:
       a=a+sbdx+','
    # insert record to dynamoDB
    tag = a[:-1]
    data={}
    data['id'] = {'S' : key}
    data['productname'] = {"S" : tag }
    data['url'] = {'S' : 'https://yolov-pack.s3.amazonaws.com/'+ key}
    
    # print(data['tags'])
    response = dynamodb.put_item(TableName=TABLE_NAME, Item=data)

    # check the status
    return {
        'statusCode': 200,
        'body': json.dumps('Records successfully inserted into database...')
    }
    
    
