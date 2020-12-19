import React, { Component } from 'react';
import axios from 'axios';
import { CardTitle,CardText,Row,CardHeader,CardBody,Col,Card } from 'reactstrap';
import Form from "views/form.js";
import history from "history.js";

class Login extends Component {
   
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      token: '',
      redirect: localStorage.getItem('authorization') ? true : false
    }

    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.emailInputChangeHandler = this.emailInputChangeHandler.bind(this);
    this.passwordInputChangeHandler = this.passwordInputChangeHandler.bind(this);
  }

  onSubmitHandler() {
    if (!(this.state.email === '' || this.state.password === '')
      && (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email))) {
      axios.post('/api/user/login', {
        email: this.state.email,
        password: this.state.password
      }).then((res) => {
        
        if(res.data.success===true)
        {
          console.log('success');
            this.setState({
              token: res.headers.authorization            
            });
            console.log(this.state.token);
            const data = this.state.token;
            localStorage.setItem('authorization', JSON.stringify(data));
            this.setState({
              redirect: true
            });
            history.push("/admin/icons");
        }
        
            
      }).catch(err => {
        console.log('lỗi')
      });
    } 
    else {
      alert('Please enter valid details');
    }
  }

  emailInputChangeHandler(event) {
    this.setState({
      email: event.target.value
    });
  }

  passwordInputChangeHandler(event) {
    this.setState({
      password: event.target.value
    });
  }
  
  render() {
      return (
            
            <div className="container mt-5 mr-0" id="content">
                <Row>
                    <Col md="5">
                        <Card className="card-user">
                        <CardHeader>
                            <Col className="ml-auto mr-auto text-center" md="6">
                              
                                
                                <CardTitle  tag="h2">Login</CardTitle>
                                  <img
                                      alt="..."
                                      className="avatar"
                                      src={require("assets/img/emilyz.jpg")}
                                  />
                                
                            </Col>
                        </CardHeader>
                        <CardBody>
                          <Form onSubmit={this.onSubmitHandler.bind(this)}>                            
                            <div className="form-group">
                            <label htmlFor="email" className="text-info">Email:</label><br />
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                name="email"
                                placeholder="example@domain.com"
                                onChange={this.emailInputChangeHandler}
                                required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="password" className="text-info">Password:</label><br />
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="********"
                                onChange={this.passwordInputChangeHandler}
                                required />
                            </div>
                            <div className="d-flex justify-content-between align-items-end">
                            <button onClick={this.onSubmitHandler} className="btn btn-info btn-md" type="button">Submit</button>
                            </div>
                          </Form>
                        
                        </CardBody>
                        </Card>
                        <Card></Card>
                    
                    </Col>
                    <Col md="4">
                      <Card className="card-user">
                        <CardBody>
                          <CardText />
                          <div className="author">
                            <div className="block block-one" />
                            <div className="block block-two" />
                            <div className="block block-three" />
                            <div className="block block-four" />
                            <a href="#pablo" onClick={e => e.preventDefault()}>
                              <img
                                alt="..."
                                className="avatar"
                                src={require("assets/img/james.jpg")}
                              />
                              <h5 className="title">Nguyễn Văn Thắng</h5>
                            </a>
                            <p className="description">Admin</p>
                          </div>
                          <div className="card-description ml-auto mr-auto text-center">
                            Cần hỗ trợ vui lòng liên hệ vơi admin
                            <p className="card-description">Số điện thoại:{' '}0971484530</p>
                            <p className="card-description">Email:{' '}admin@gmail.com</p>
                            <p  className="container mt-3" >---------------</p>                    
                          </div>                  
                        </CardBody>                
                      </Card>
                    </Col>
                </Row>     
            </div>       
        );
    }
}

export default Login;