
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
        email:this.state.email,
        password:this.state.password,
        role:this.state.role
      }
      
      console.log(formData);
      axios.post('/api/user/register',formData)
      .then((res) => {
          
          console.log(res.data);
          toast.success('Upload Successful');
          
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
                    <Label tag="h4">Thêm tài khoản</Label>
                </CardTitle>
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
                      <Input value={this.state.role} onChange={this.onChangeValue} type="select" name="role" id="">
                          <option>1</option>
                          <option>2</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <Button onClick={this.onSubmit} color="primary" >Thêm User</Button>
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
                    <Label tag="h4">Đổi Password</Label>
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
                  <Label  sm={5}>currentPassword</Label>
                  <Col sm={7}>
                    <Input onChange={this.onChangeValue} type="password" name="currentPassword" id="" placeholder="Nhập mật khẩu cũ" />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label  sm={5}>newPassword</Label>
                  <Col sm={7}>
                    <Input onChange={this.onChangeValue} type="role" name="newPassword" id="" placeholder="nhâp mật khẩu mới" />
                    
                    
                  </Col>
                </FormGroup>
                <Button onClick={this.onSubmitEdit} color="primary" >Sửa User</Button>
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
