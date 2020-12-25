
import React from "react";
import axios from "axios";
import TableRowType from "components/TableRow/TableRowType.js";
import { ToastContainer, toast } from 'react-toastify';
import {Redirect } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,  
  FormGroup,
  Input,
  Row,
  Table,
  CardTitle,
  Label,
  Col
} from "reactstrap";
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onChangeValueEdit = this.onChangeValueEdit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitEdit=this.onSubmitEdit.bind(this);
    this.state = {
      data2:[],
      dataedit:[],
      name:'',
      newName:'',
      idtheme:'',
      trangthai:false,
      trangthaiedit:false
      
    }
  }
  
  

  onChangeValue(event){
    var name = event.target.name
    var value = event.target.value
    this.setState({
        [name]: value
    });
  }
  onChangeValueEdit(event){
    this.setState({
      newName:event.target.value
    });
  }

  onSubmit(event){
    event.preventDefault();
    console.log(this.state.idtheme)
    console.log(this.state.name)
    if(this.state.idtheme!==''&&this.state.name!==''){
      const a = { 
        name:this.state.name,
        idtheme:this.state.idtheme
      };
      console.log(a);
      axios.post('/api/theme/addtheme', a)
      .then((res) => {
        if(res.data.success===true)
        {
          console.log(res.data);
          toast.success('create theme success');
          this.setState({
            idtheme:'',
            name:''
          });
          
          this.componentDidMount();
        }
        else
        {
          toast.error('create theme fail');
        }    
      })
      .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
    }
    else{
      alert('please fill all');
    }   
        
  }
  onSubmitEdit(event) {
    event.preventDefault();
    if(this.state.newName!==''){
      const b = {
        newName:this.state.newName
      };
      console.log(b);
      var idedit = this.state.dataedit.idtheme;
      axios.put('/api/theme/edit/'+idedit,b)
      .then((res)=>{
        console.log(res.data.message)
        if(res.data.success===true)
        {
          toast.success(`${res.data.message}`);
          this.componentDidMount();
        }
        else
        {
          toast.error(`${res.data.message}`);
        }
      });
    }
    else
    {
      alert('please fill all');
    }
    
  }

  componentDidMount() {
    axios.get('/api/theme/alltheme',{
        headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then(response => {
            if(response.data.success===true)
            {
              console.log(response.data.listtheme);
              this.setState({data2: response.data.listtheme});
              
            }
            else
            {
              toast.error(`${response.data.message}`);
            }
            
        })
        .catch(function (error) {
            console.log(error);
        })
  }
  onClickEdit=(theme)=>{
    console.log('ket noi ok');
    console.log(theme);
    this.setState({
      dataedit:theme
    });
    
  }
  tabType=()=> this.state.data2.map((object, i) =>(
    
    <TableRowType 
    onTest={()=>this.onClickEdit(object)}
    
    obj={object} key={i}
    onChangEdit={()=>this.thayTrangThaiEdit()}
    />  
  ))
  

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
  thayTrangThaiEdit=()=>{
    this.setState({
      trangthaiedit:!this.state.trangthaiedit
    });
  }
  hienThiFormEdit=()=>{
    if(this.state.trangthaiedit===true){
      return(
        <Card>
                  <CardHeader>
                    <CardTitle>
                      <Label tag="h4">Edit Theme</Label>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                  <FormGroup row>
                    <Label for="exampleEmail" sm={4}>Name</Label>
                    <Col sm={8}>
                      <Input disabled defaultValue={this.state.dataedit.idtheme} onChange={this.onChangeValueEdit} type="text" id="" placeholder="nhập tên theme" />
                    </Col>
                    </FormGroup>            
                    <FormGroup row>
                    <Label for="exampleEmail" sm={4}>Name</Label>
                    <Col sm={8}>
                      <Input defaultValue={this.state.dataedit.name} onChange={this.onChangeValueEdit} type="text" name="newName" id="" placeholder="nhập tên theme" />
                    </Col>
                    </FormGroup>

                    <Button onClick={this.onSubmitEdit} color="primary" > Update </Button>
                    <Button onClick={()=>this.thayTrangThaiEdit()}>Cancel</Button>
              
                  </CardBody>
       
               </Card>
      );
    }
  }
  hienThiForm=()=>{
    if(this.state.trangthai===true){
      return(
        <Card>
        <CardHeader>
          <CardTitle>
            <Label tag="h4">Create theme</Label>
          </CardTitle>
        </CardHeader>
        <CardBody>
        <FormGroup row>
          <Label for="exampleEmail" sm={4}>ID theme</Label>
          <Col sm={8}>
            <Input value={this.state.idtheme} onChange={this.onChangeValue} type="text" name="idtheme" id="" placeholder="ID theme" />
          </Col>
          </FormGroup>             
          <FormGroup row>
          <Label for="exampleEmail" sm={4}>Name</Label>
          <Col sm={8}>
            <Input value={this.state.name} onChange={this.onChangeValue} type="text" name="name" id="" placeholder="Name theme" />
          </Col>
          </FormGroup>

          <Button onClick={this.onSubmit} color="primary" >Add </Button>
    
        </CardBody>
       
      </Card>
      );
    }
  }
  hienThiFormMain=()=>{
    if(this.state.trangthaiedit===false)
    {
      return(
        <Card>
                <CardHeader>
                  <FormGroup row>
                    <Label  md="10" tag="h6">List theme</Label>
                    {this.checkNut()}
                  </FormGroup>
                 
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>ID Theme</th>                                      
                        <th>Name</th>
                        <th>action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.tabType()}                  
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

      );
    }
  }
  render() {
    if (!localStorage.getItem('authorization')) return <Redirect to="/login" />
    return ( 
        <div className="content">
          <Row>
            <ToastContainer/>
            <Col md="4">
              {this.hienThiFormMain()}
              {this.hienThiFormEdit()}
            </Col>
            
            <Col md="4">
              {this.hienThiForm()}
              
            </Col>
          </Row>
        </div>
    );
  }
}

export default UserProfile;
