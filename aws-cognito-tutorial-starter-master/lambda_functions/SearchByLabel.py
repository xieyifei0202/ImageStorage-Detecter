import boto3
import json
from boto3.dynamodb.conditions import Key,Attr

def lambda_handler(event, context):
    client = boto3.resource('dynamodb')
    table = client.Table('Products')
    productname = event['productname']
    
    response = table.scan(
     FilterExpression=Attr('productname').contains(productname)
    )
    
    items = response['Items']
    #print(items)
    for item in items:
        return items

