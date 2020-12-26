import React from "react";
import axios from "axios";
import history from "history.js";
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
  Label,
} from "reactstrap";
// reactstrap components
//import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import TableRowUser from "components/TableRow/TableRowUser.js";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
class Icons extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectValue = this.onSelectValue.bind(this);
    this.onSubmitEdit = this.onSubmitEdit.bind(this);
    this.onChangeNewName= this.onChangeNewName.bind(this);
    this.onSubmitEditUser=this.onSubmitEditUser.bind(this);
    this.state = {
      data1: [],
      dataedituser: [],
      firstsname: "",
      lastname: "",
      sex: "",
      dob: "",
      iduser: "",
      phonenumber: "",
      address: "",
      username: "",
      password: "",
      role: "1",
      currentPassword: "",
      newPassword: "",
      trangthai: false,
      trangthaiedit: false,
      trangthaiedit1: false,
      newSex:"",
      newfirst:"",
      newlast:"",
      newsex:"",
      newdob:"",
      newphone:"",
      newaddress:"",
    };
  }

  // thêm user
  onChangeValue(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value,
    });
  }
  onSelectValue(event) {
    this.setState({
      role: event.target.select,
    });
  }
  onSubmit(event) {
    event.preventDefault();
    if(this.state.iduser!==''&&this.state.firstname!==''&&this.state.lastname!==''
    &&this.state.sex!==''&&this.state.dob!==''&&this.state.phonenumber!==''&&this.state.address!==''
    &&this.state.username!==''&&this.state.password!=='')
    {
      const formData = {
        username: this.state.username,
        password: this.state.password,
        role: this.state.role,
        iduser: this.state.iduser,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        sex: this.state.sex,
        dob: this.state.dob,
        phonenumber: this.state.phonenumber,
        address: this.state.address,
      };
  
      console.log(formData);
      axios
        .post("/api/user/register", formData)
        .then((res) => {
          if (res.data.success === true) {
            toast.success("add user success");
            setTimeout(function () {
              window.location.reload(1);
            },1000);
          }
          else
          {
            toast.error("username already exists!");
          }
          
        })
        .catch((err) => {
          toast.error(`Upload Fail with status: ${err.statusText}`);
        });
    }
    else
    {
      alert('please fill out all information');
    }
    
  }
  // hiển thị list user
  componentDidMount() {
    axios
      .get("/api/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((response) => {
        this.setState({ data1: response.data.users });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  tabUser = () =>
    this.state.data1.map((object, i) => (
      <TableRowUser
        onView={() => this.onClickEdit(object)}
        obj={object}
        key={i}
        onChangeTT={() => this.thayDoiTrangThaiEdit()}
        onCHangeEdit={() => this.thayDoiTrangThaiEdit1()}
      />
    ));

  // Check trạng thái thay đổi button
  checkNut() {
    if (this.state.trangthai === false) {
      return (
        <Button onClick={() => this.thayTrangThai()} size="sm" md="2">
          +
        </Button>
      );
    } else {
      return (
        <Button onClick={() => this.thayTrangThai()} size="sm" md="2">
          -
        </Button>
      );
    }
  }
  // click thay đổi trạng thái
  thayTrangThai = () => {
    this.setState({
      trangthai: !this.state.trangthai,
    });
  };
  // click trang thái thay đổi form
  hienThiForm() {
    if (this.state.trangthai === true) {
      return (
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
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="iduser"
                    id=""
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>FirstName</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="firstname"
                    id=""
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>LastName</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="lastname"
                    id=""
                    placeholder="Input email"
                  />
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
                      />{" "}
                      Male
                    </Label>
                    <Label sm={4} check>
                      <Input
                        type="radio"
                        name="sex"
                        value="Female"
                        checked={this.state.sex === "Female"}
                        onChange={this.onChangeValue}
                      />{" "}
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
                    name="dob"
                    id=""
                    placeholder="date placeholder"
                    onChange={this.onChangeValue}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Phone Number</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="phonenumber"
                    id=""
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Address</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="address"
                    id=""
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>UserName</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="username"
                    id=""
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Password</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="password"
                    name="password"
                    id=""
                    placeholder="Input password"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Role</Label>
                <Col sm={9}>
                  <Input
                    value={this.state.role}
                    onChange={this.onChangeValue}
                    type="select"
                    name="role"
                    id=""
                  >
                    <option>1</option>
                    <option>2</option>
                  </Input>
                </Col>
              </FormGroup>
              <Button onClick={this.onSubmit} color="primary">
                Add user
              </Button>
            </CardBody>
          </Card>
      );
    }
  }
  onClickEdit = (user) => {
    console.log("ket noi ok");
    console.log(user);
    this.setState({
      dataedituser: user,
    });
  };
  hienThiFormChangePassword() {
    if (this.state.trangthaiedit === true) {
      return (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Label tag="h4">Change Password</Label>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <FormGroup row>
                <Label sm={5}>UserName</Label>
                <Col sm={7}>
                  <Input
                    value={this.state.dataedituser.iduser||''}
                    disabled
                    type="text"
                    name="iduser"
                    id=""
                    placeholder=""
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={5}>Current Password</Label>
                <Col sm={7}>
                  <Input
                    onChange={this.onChangeValue}
                    type="password"
                    name="currentPassword"
                    id=""
                    placeholder="Input current password"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={5}>New Password</Label>
                <Col sm={7}>
                  <Input
                    onChange={this.onChangeValue}
                    type="role"
                    name="newPassword"
                    id=""
                    placeholder="Input new password"
                  />
                </Col>
              </FormGroup>
              <Button onClick={this.onSubmitEdit} color="primary">
                Change User
              </Button>
              <Button onClick={()=>this.thayDoiTrangThaiEdit()} >Cancel</Button>
            </CardBody>
          </Card>
        </div>
      );
    }
  }
  thayDoiTrangThaiEdit() {
    this.setState({
      trangthaiedit: !this.state.trangthaiedit
    });
  }
  thayDoiTrangThaiEdit1(){
    this.setState({
      trangthaiedit1: !this.state.trangthaiedit1
    });
  }
  hienThiFormEdit(){
    if(this.state.trangthaiedit1===true)
    {
      return(
        <Card>
            <CardHeader>
              <CardTitle>
                <Label tag="h4">Edit User</Label>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <FormGroup row>
                <Label sm={3}>FirstName</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeNewName}
                    type="text"
                    name="newfirst"
                    id=""
                    defaultValue={this.state.dataedituser.firstname ||''}
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>LastName</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="newlast"
                    id=""
                    defaultValue={this.state.dataedituser.lastname ||''}
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup tag="fieldset" row>
                <Label sm={4}>Sex</Label>
                <Col sm={8}>
                  <FormGroup row check>
                    <Label sm={4} check>
                      <Input
                        id="rMale"
                        type="radio"
                        name="newsex"
                        value="Male"
                        //checked={this.state.newsex==="Male"}
                        defaultChecked={this.state.newSex=this.hienThiSexMale()||this.state.newSex==="Male"}
                        onChange={this.onChangeValue}
                      />{" "}
                      Male
                    </Label>
                    <Label sm={4} check>
                      <Input
                        id="rFemale"
                        type="radio"
                        name="newsex"
                        value="Female"
                        //checked={this.state.newsex==="Female"}
                        defaultChecked={this.state.newSex=this.hienThiSexFemale()||this.state.newSex==="Female"}
                        onChange={this.onChangeValue}
                      />{" "}
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
                    name="newdob"
                    id=""
                    value={this.hienThiDate() ||''}
                    placeholder="date placeholder"
                    onChange={this.onChangeValue}
                  
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Phone Number</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="newphone"
                    id=""
                    defaultValue={this.state.dataedituser.phonenumber ||''}
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Address</Label>
                <Col sm={9}>
                  <Input
                    onChange={this.onChangeValue}
                    type="text"
                    name="newaddress"
                    id=""
                    defaultValue={this.state.dataedituser.address ||''}
                    placeholder="Input email"
                  />
                </Col>
              </FormGroup>
              <Button onClick={this.onSubmitEditUser} color="primary">
                Update user
              </Button>
              <Button onClick={()=>this.thayDoiTrangThaiEdit1()}>Cancel</Button>
            </CardBody>
          </Card>
      );
    }
  }
  hienThiFormMain(){
    if(this.state.trangthaiedit===false&&this.state.trangthaiedit1===false){
      return(
        <Col md="12">
            <Card>
              <CardHeader>
                <FormGroup row>
                  <Label md="10" tag="h6">
                    List user
                  </Label>
                  {this.checkNut()}
                </FormGroup>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>ID User</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Sex</th>
                      <th>Date of birth</th>
                      <th>Phone Number</th>
                      <th>Address</th>
                      <th>UserName</th>
                      <th>Role</th>
                      <th>action</th>
                    </tr>
                  </thead>
                  <tbody>{this.tabUser()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
      );
    }
  }
  onSubmitEdit(event) {
    event.preventDefault();
    if(this.state.currentPassword!==''&&this.state.newPassword!=='') {
      const b = {
        iduser: this.state.dataedituser.iduser,
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
      };
      console.log(b);
      axios.post("/api/user/changepass", b).
      then((res) => {
        if(res.data.success===true) {
          toast.success('change password success');
        }
        else
        {
          toast.error('current password is incorrect');
        }
      });
    }
    else
    {
      alert('Please fill out all information');
    }
    
  }
  hienThiDate=()=>{
    //document.getElementsByName('dob').value=this.state.dataedituser.dob;

    var d = new Date(this.state.dataedituser.dob),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

      return [year, month, day].join('-');
    
  }
  hienThiSex1=()=>{
    
    if(this.state.dataedituser.sex===true) {
      
      
      return "Male";
    }  else if(this.state.dataedituser.sex===false) {
      
      return "Female";
    }
  }
  onSubmitEditUser(event){
    event.preventDefault();
    // if(this.state.newfirst!==''&&this.state.newlast!==''&&this.state.newSex!==''
    // &&this.state.newdob!==''&&this.state.newphone!==''&&this.state.newaddress!==''){
      // const formEdit={
      //   newfirst:this.state.newfirst,
      //   newlast:this.state.newlast,
      //   newsex:this.state.newsex,
      //   newdob:this.state.newdob,
      //   newphone:this.state.newphone,
      //   newaddress:this.state.newaddress
      // };
    const formEdit={
      newfirst:'',
      newlast:'',
      newsex:'',
      newdob:'',
      newphone:'',
      newaddress:''
    };
      if(this.state.newfirst!==''){
        formEdit.newfirst= this.state.newfirst;
      }
      else{
        formEdit.newfirst=this.state.dataedituser.firstname;
      }
      if(this.state.newlast!==''){
        formEdit.newlast= this.state.newlast;
      }
      else{
        formEdit.newlast=this.state.dataedituser.lastname;
      }
      if(this.state.newsex!==''){
        formEdit.newsex= this.state.newsex;
      }
      else{
        formEdit.newsex=this.hienThiSex1();
      }
      if(this.state.dob!==''){
        formEdit.newdob= this.state.newdob;
      }
      else{
        formEdit.newdob=this.hienThiDate();
      }
      if(this.state.newphone!==''){
        formEdit.newphone= this.state.newphone;
      }
      else{
        formEdit.newphone=this.state.dataedituser.phonenumber;
      }
      if(this.state.newaddress!==''){
        formEdit.newaddress= this.state.newaddress;
      }
      else{
        formEdit.newaddress=this.state.dataedituser.address;
      }
      console.log(formEdit)
      axios.put('/api/user/edit/'+this.state.dataedituser.iduser,formEdit)
      .then((res)=>{
        if(res.data.success===true)
        {
          toast.success(`${res.data.message}`);
          this.componentDidMount();
        }
        else
        {
          toast.error(`${res.data.message}`);
        }
      })
    } 
  onChangeNewName(event){
    this.setState({
      newfirst:event.target.value
    });
  }
  hienThiSexMale=()=>{
    if(this.state.dataedituser.sex == null)
      return "";
      console.log("'DDD");
    if(this.state.dataedituser.sex===true) {
      console.log("MMMMM");
      return "Male";
    }
    // else if (this.state.dataedituser.sex===false) { 
    //   console.log("RRRRRRMMM");
    //   return "";}
  
  }
  hienThiSexFemale=()=>{

    if(this.state.dataedituser.sex==null) {
      console.log(this.state.dataedituser.sex);
      return "";
    }
    if(this.state.dataedituser.sex===false) {
      console.log("FFFFFFFF");
      return "Female";
    } 
  //   else if(this.state.dataedituser.sex===true) {console.log("RRRRRRRRRFFFMMM");
  // return "";}
    
  }
  render() {
    if (!localStorage.getItem("authorization")) return history.push("/login"); 
    return (
      <div className="content">
        <Row>
          {this.hienThiFormMain()}
          <Col md="4">
            {this.hienThiForm()}
            {this.hienThiFormChangePassword()}
            {this.hienThiFormEdit()}
          </Col>
          <Col md="4">
          
          </Col>

          <ToastContainer />
        </Row>
      </div>
    );
  }
}

export default Icons;
