
import React from "react";
import axios from "axios";
import TableRowType from "components/TableRow/TableRowType.js";
import { ToastContainer, toast } from 'react-toastify';

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
      trangthai:false,
      trangthaiedit:false
    }
  }
  
  

  onChangeValue(event){
    
    this.setState({
        name: event.target.value
    });
  }
  onChangeValueEdit(event){
    this.setState({
      newName:event.target.value
    });
  }

  onSubmit(event){
    event.preventDefault();
        const a = { 
          name:this.state.name
        };
        console.log(a);
        axios.post('/api/theme/addtheme', a)
        .then((res) => {
            
            console.log(res.data);
            toast.success('Upload Successful');    
        })
        .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
        
  }
  onSubmitEdit(event) {
    event.preventDefault();
    const b = {
      newName:this.state.newName
    };
    console.log(b);
    axios.post('/api/theme/edit/'+this.state.dataedit._id,b)
    .then((res)=>{
      console.log(res.data.message);
    })
    
  }

  componentDidMount() {
    axios.get('/api/theme/alltheme')
        .then(response => {
            console.log(response.data);
            this.setState({data2: response.data});
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
                    <CardTitle>sửa chủ đề</CardTitle>
                  </CardHeader>
                  <CardBody>                
                    <FormGroup row>
                    <Label for="exampleEmail" sm={4}>Document Type</Label>
                    <Col sm={8}>
                      <Input defaultValue={this.state.dataedit.name} onChange={this.onChangeValueEdit} type="text" name="newName" id="" placeholder="nhập tên theme" />
                    </Col>
                    </FormGroup>

                    <Button onClick={this.onSubmitEdit} color="primary" > Sửa </Button>
                    <Button onClick={()=>this.thayTrangThaiEdit()}>Hủy</Button>
              
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
          <CardTitle>Thêm chủ đề</CardTitle>
        </CardHeader>
        <CardBody>                
          <FormGroup row>
          <Label for="exampleEmail" sm={4}>Document Type</Label>
          <Col sm={8}>
            <Input onChange={this.onChangeValue} type="text" name="name" id="" placeholder="nhập tên theme" />
          </Col>
          </FormGroup>

          <Button onClick={this.onSubmit} color="primary" >Thêm </Button>
    
        </CardBody>
       
      </Card>
      );
    }
  }
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <ToastContainer/>
            <Col md="7">
              <Card>
                <CardHeader>
                  <FormGroup row>
                    <Label  md="10" tag="h6">Danh sách chủ đề</Label>
                    {this.checkNut()}
                  </FormGroup>
                 
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>                                           
                        <th>Loại tài liệu</th>
                        <th>action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {this.tabType()}                  
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            
            <Col md="4">
              {this.hienThiForm()}
              {this.hienThiFormEdit()}
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
