
import React from "react";
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
  FormGroup,
  Button,
  Label
} from "reactstrap";
// reactstrap components
//import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import TableRowUser from "components/TableRow/TableRowUser.js";
import { ToastContainer, toast } from 'react-toastify';

class Icons extends React.Component {
  
  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectValue = this.onSelectValue.bind(this);
    this.state = {
      data1:[],
      email:'',
      password:'',
      role:'',
      trangthai:false
    }
  }

  // thêm user
 onChangeValue(event){
  var name = event.target.name;
  var value = event.target.value;
  this.setState({
    [name]: value
  })
}
onSelectValue(event){
  this.setState({
    role:event.target.select
  })
}
onSubmit(event){
  event.preventDefault()
      const formData = {
        email:this.state.email,
        password:this.state.password,
        role:this.state.role
      }
      
      console.log(formData);
      axios.post('/api/auth/register',formData)
      .then((res) => {
          
          console.log(res.data);
          toast.success('Upload Successful');
          
      })
      .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
    }
  // hiển thị list user
  componentDidMount() {
    axios.get('/api/user')
        .then(response => {
            console.log(response.data);
            this.setState({data1: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })
  }
  tabUser() {
    return this.state.data1.map(function (object, i) {
        return <TableRowUser obj={object} key={i}/>;
    });
  }
  // Check trạng thái thay đổi button
  checkNut(){
    if(this.state.trangthai===false){
      return <Button onClick={()=>this.thayTrangThai()} size="sm" md="2">+</Button>;    
    }
    else{
      return <Button onClick={()=>this.thayTrangThai()} size="sm" md="2">-</Button>
    }
  }
  // click thay đổi trạng thái
  thayTrangThai=()=>{
    this.setState({
      trangthai: !this.state.trangthai
    });
  }
  // click trang thái thay đổi form
  hienThiForm(){
    if(this.state.trangthai===true){
        return(
          <div>
            <Card>
                <CardHeader>
                  <CardTitle>Thêm user</CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                  <Label for="exampleEmail" sm={3}>Email</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="email" id="" placeholder="Nhập địa chỉ Email" />
                  </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="examplePassword" sm={3}>Password</Label>
                    <Col sm={9}>
                      <Input onChange={this.onChangeValue} type="password" name="password" id="" placeholder="Nhập mật khẩu" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect" sm={3}>Role</Label>
                    <Col sm={9}>
                      <Input onChange={this.onChangeValue} type="role" name="role" id="" />
                      
                      
                    </Col>
                  </FormGroup>
                  <Button onClick={this.onSubmit} color="primary" >Thêm user</Button>
                </CardBody>
            </Card>
            </div>
        );
    }
  }
 
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md={7}>
              <Card>
                <CardHeader>
                  <FormGroup row>
                    <Label  md="10" tag="h6">Danh sách user</Label>
                    {this.checkNut()}
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Email</th>                                              
                        <th>Quyền</th>
                        <th>action</th>
                      </tr>
                    </thead>
                    <tbody>
                          {this.tabUser}                  
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col md ="4">
              {this.hienThiForm()}
            </Col>
            <ToastContainer />
          </Row>
        </div>
      </>
    );
  }
}

export default Icons;
