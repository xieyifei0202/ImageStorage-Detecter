import React, { Component, Fragment } from 'react';
import Product from './Product';
import axios from "axios";
import ImageUploader from 'react-images-upload';
const config = require('../config.json');

export default class Products extends Component {

  constructor(props){
    super(props);
    this.state = {
      pictures:[]
      ,
      newproduct: { 
        "productname": "", 
        "id": "",
        "url": ""
      },
      products: []
    }  
    this.onDrop = this.onDrop.bind(this);
    this.uploadImages = this.uploadImages.bind(this);
  }

  fetchProducts = async () => {
    // add call to AWS API Gateway to fetch products here
    // then set them in state
    try {
      const res = await axios.get(`${config.api.invokeUrl}/products`);
      const products = res.data;
      this.setState({ products: products });
    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  componentDidMount = () => {
    this.fetchProducts();
  }

  onDrop(picture) {
    this.setState({
        pictures: this.state.pictures.concat(picture),
    });
  }

  uploadImages(){
    console.log(this.state.pictures);
    let uploadPromises = this.state.pictures.map(image => {
      let data = new FormData();
      data.append('image',image, image.name);
      
      return axios.post(`${config.api.invokeUrl}/upload2`, data,{
        headers: {
          'Content-Type': 'image/jpg'
         }
      });
    })

    axios.all(uploadPromises)
    .then(results => {
      console.log("request data:");
      console.log(results);
    })
    .catch(e => {
      console.log("response data:")
      console.log(e)
    })
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Upload images</h1>
            <p className="subtitle is-5">Please select images:</p>
            <br />
            <ImageUploader
                withIcon={true}
                withPreview={true}
                buttonText='Select images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.png']}
                maxFileSize={5242880}
            />
            <button onClick={this.uploadImages} className="button is-primary is-medium">Upload</button>
            
          </div>
        </section>
      </Fragment>
    )
  }
}
