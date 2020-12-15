
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
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      data2:[],
      name:'',
      trangthai:false
    }
  }
  


  onChangeValue(event){
    
      this.setState({
        name: event.target.value
    });
  }

  onSubmit(event){
    event.preventDefault();
        const a = { 
          name:this.state.name
        };
        console.log(a);
        axios.post('/api/theme/createtheme', a)
        .then((res) => {
            
            console.log(res.data);
            toast.success('Upload Successful');    
        })
        .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
        
  }
  componentDidMount() {
    axios.get('/api/theme/listall')
        .then(response => {
            console.log(response.data);
            this.setState({data2: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })
  }
  tabType() {
    return this.state.data2.map(function (object, i) {
        return <TableRowType obj={object} key={i}/>;
    });
  }

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
  hienThiForm=()=>{
    if(this.state.trangthai===true){
      return(
        <Card>
        <CardHeader>
          <CardTitle>Thêm user</CardTitle>
        </CardHeader>
        <CardBody>                
          <FormGroup row>
          <Label for="exampleEmail" sm={4}>Document Type</Label>
          <Col sm={8}>
            <Input onChange={this.onChangeValue} type="text" name="name" id="" placeholder="Nhập địa chỉ Email" />
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
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default UserProfile;
