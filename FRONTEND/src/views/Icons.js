
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
import {Redirect } from "react-router-dom";
class Icons extends React.Component {
  
  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectValue = this.onSelectValue.bind(this);
    this.onSubmitEdit = this.onSubmitEdit.bind(this);
    this.state = {
      data1:[],
      dataedituser:[],
      firstsname:'',
      lastname:'',
      sex:'',
      dbo:'',
      idUser:'',
      phonenumber:'',
      address:'',
      email:'',
      password:'',
      role:'1',
      current:'',
      currentPassword:'',
      newPassword:'',
      trangthai:false,
      trangthaiedit:false
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
        username:this.state.email,
        password:this.state.password,
        role:this.state.role,
        idUser:this.state.idUser,
        firstname:this.state.firstname,
        lastname:this.state.lastname,
        sex:this.state.sex,
        dbo:this.state.dbo,
        phonenumber:this.state.phonenumber,
        address:this.state.address
      }
      
      console.log(formData);
      axios.post('/api/user/register',formData)
      .then((res) => {
          if(res.data.success===true)
          {
            toast.success('Upload Successful');
            console.log(res.data);
          }
          console.log(res.data);
          
          
      })
      .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
    }
  // hiển thị list user
  componentDidMount() {
    axios.get('/api/user',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('authorization'))
      }
    })
        .then(response => {   
            console.log('ok')
            console.log(response.data.users);
            this.setState({data1: response.data.users});    
        })
        .catch(function (error) {
            console.log('loi123');
            console.log(error);
        })
  }
  tabUser=()=>this.state.data1.map((object, i)=>(
      <TableRowUser
      onView={()=>this.onClickEdit(object)}
      obj={object} key={i}
      onChangeTT={()=>this.thayDoiTrangThaiEdit()}
      />
  ))
    
  
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
                <CardTitle>
                  <Label tag="h4">Create account</Label>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Label sm={3}>ID user</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="idUser" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>FirstName</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="firstname" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>LastName</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="lastname" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup tag="fieldset" row>
                    <Label sm={4}>Sex</Label>
                    <Col sm={8}>
                      <FormGroup row check>
                        <Label sm={4} check>
                          <Input 
                          type="radio" 
                          name="sex"
                          value="Male"
                          checked={this.state.sex === "Male"}
                          onChange={this.onChangeValue}
                          />{' '}
                          Male
                        </Label>
                        <Label sm={4} check>
                            <Input 
                            type="radio" 
                            name="sex"
                            value="Female"
                            checked={this.state.sex === "Female"}
                            onChange={this.onChangeValue}
                             />{' '}
                          Female
                        </Label>
                      </FormGroup>
                    </Col>                  
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>DOB</Label>
                  <Col sm={9}>
                    <Input
                    type="date"
                    name="dbo"
                    id=""
                    placeholder="date placeholder"
                    onChange={this.onChangeValue}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>Phone Number</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="phonenumber" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>Address</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="address" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm={3}>Email</Label>
                  <Col sm={9}>
                    <Input onChange={this.onChangeValue} type="email" name="email" id="" placeholder="Input email" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={3}>Password</Label>
                    <Col sm={9}>
                      <Input onChange={this.onChangeValue} type="password" name="password" id="" placeholder="Input password" />
                    </Col>
                 </FormGroup>
                 <FormGroup row>
                    <Label sm={3}>Role</Label>
                    <Col sm={9}>
                      <Input value={this.state.role} onChange={this.onChangeValue} type="select" name="role" id="">
                          <option>1</option>
                          <option>2</option>
                      </Input>
                    </Col>
                 </FormGroup>
                  <Button onClick={this.onSubmit} color="primary" >Add user</Button>
                </CardBody>
            </Card>
            </div>
        );
    }
  }
  onClickEdit=(user)=>{
    console.log('ket noi ok');
    console.log(user);
    this.setState({
      dataedituser:user
    }); 
  }
  hienThiFormEdit(){
    if(this.state.trangthaiedit===true){
      return(
        <div>
          <Card>
              <CardHeader>
                <CardTitle>
                    <Label tag="h4">Change Password</Label>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                <Label  sm={5}>Email</Label>
                <Col sm={7}>
                  <Input value={this.state.dataedituser.email} disabled type="email" name="current" id="" placeholder="Nhập địa chỉ Email" />
                </Col>
                </FormGroup>
                <FormGroup row>
                  <Label  sm={5}>Current Password</Label>
                  <Col sm={7}>
                    <Input onChange={this.onChangeValue} type="password" name="currentPassword" id="" placeholder="Input current password" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label  sm={5}>New Password</Label>
                  <Col sm={7}>
                    <Input onChange={this.onChangeValue} type="role" name="newPassword" id="" placeholder="Input new password" />
                    
                    
                  </Col>
                </FormGroup>
                <Button onClick={this.onSubmitEdit} color="primary" >Change User</Button>
                <Button>Cancel</Button>
              </CardBody>
          </Card>
          </div>
      );
    }
  }
  thayDoiTrangThaiEdit(){
    this.setState({
        trangthaiedit:!this.state.trangthaiedit
    });
  }

  onSubmitEdit(event) {
    event.preventDefault();
    const b = {
      current:this.state.dataedituser.email,
      currentPassword:this.state.currentPassword,
      newPassword:this.state.newPassword
    };
    console.log(b);
    axios.post('/api/user/changepass',b)
    .then((res)=>{
      console.log(res.data.message);
    })
    
  }
  render() {
    if (!localStorage.getItem('authorization')) return <Redirect to="/login" />
    return (
      
        <div className="content">
          <Row>
            <Col md="5">
              <Card>
                <CardHeader>
                  <FormGroup row>
                    <Label  md="10" tag="h6">List user</Label>
                    {this.checkNut()}
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Email</th>                                              
                        <th>Role</th>
                        <th>action</th>
                      </tr>
                    </thead>
                    <tbody>
                          {this.tabUser()}                  
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            <Col md ="4">
              {this.hienThiForm()}
              {this.hienThiFormEdit()}
            </Col>
            
              
            
            <ToastContainer />
          </Row>
        </div>
      
    );
  }
}

export default Icons;
