import React, { Component, Fragment } from 'react';
import Product from './Product';
import axios from "axios";

const config = require('../config.json');
//const profile = require('../profile');

export default class ProductAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newproduct: { 
        "productname": "", 
        "id": "",
        "url": ""
      },
      products: []
    }
    this.onAddProductNameChange = this.onAddProductNameChange.bind(this);
}

  handleGetLabel = async () => {
    //event.preventDefault();
    // add call to AWS API Gateway query product endpoint here
    try {
      const params = {
        "productname": this.state.newproduct.productname
      };
      
      const res = await axios.get(`${config.api.invokeUrl}/products/getname`, params);
      const products = res.data;
      this.setState({ products: products });
      
    }catch (err) {
      console.log(`Error query product: ${err}`);
    }
  }

  fetchProducts = async () => {
    // add call to AWS API Gateway to fetch products here
    // then set them in state
    try {
      
      const p = this.state.newproduct.productname;
      const res = await axios.get(`https://6ifnsr2wii.execute-api.us-east-1.amazonaws.com/prod/products/getname?productname=` + p);
      if(res.data == null){
        alert("Can't find the label!");
      }else{
        const products = res.data;
        this.setState({ products: products });
      }
      
    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onAddProductNameChange = event => this.setState({ newproduct: { ...this.state.newproduct, "productname": event.target.value } });

  componentDidMount = () => {
    this.fetchProducts();
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Search Images</h1>
            <p className="subtitle is-5">Please input your key words:</p>
            <br />            
            <div className="columns">
              <div className="column is-one-third">
                  <div className="field has-addons">
                    <div className="control">
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter label name"
                        value={this.state.newproduct.productname}
                        onChange={this.onAddProductNameChange}
                      />
                    </div>
                    <div className="control">
                      <button onClick={() => this.fetchProducts()} className="button is-primary is-medium">                      
                        Search
                      </button>
                    </div>
                  </div>
              </div>
              <div className="column is-two-thirds">
                <div className="tile is-ancestor">
                  <div className="tile is-4 is-parent  is-vertical">
                    { 
                      this.state.products.map((product, index) => 
                        <Product 
                          isAdmin={true}
                          handleUpdateProduct={this.handleUpdateProduct}
                          handleDeleteProduct={this.handleDeleteProduct} 
                          url={product.url}
                          name={product.productname} 
                          id={product.id}
                          key={product.id}
                        />)
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}
