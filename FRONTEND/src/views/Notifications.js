
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRow from "components/TableRow/TableRowDoc.js";
// reactstrap components
import {
  
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Label,
  Input,
  FormGroup,
  FormText,
  CustomInput,
  Table,
  Alert,
  Col
} from "reactstrap";

class Notifications extends React.Component {


  constructor(props) {
    super(props);
    this.onchangeFile = this.onchangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
    this.onCancelField = this.onCancelField.bind(this);
    
    this.state = {
      data:[],
      filedoc:'',
      authorname:'',
      note:'',
      subject:'',
      idDoc:'',
      trangthai:false
    }
  }
  componentDidMount() {
    axios.get('/api/doc/listall')
        .then(response => {
            console.log(response.data);
            this.setState({data: response.data});
        })
        .catch(function (error) {
            console.log(error);
        })
  }
  
  tabRow() {
    return this.state.data.map(function (object, i) {
        return <TableRow obj={object} key={i}/>;
    });
  }
  onCancelField(event){
    this.setState({
      authorname:event.target.reset,
      note:event.target.reset,
      idDoc:event.target.reset
    })
  }
  onchangeFile(event){
    this.setState({
      filedoc:event.target.files[0]
    })
  }
  onchangValue(event){
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value
    })
  }
  onSubmit(event){
    event.preventDefault()
        const formData = new FormData()
        formData.append('filedoc', this.state.filedoc)
        formData.append('authorname',this.state.authorname)
        formData.append('note',this.state.note)
        formData.append('idDoc',this.state.idDoc)
        formData.append('subject',this.state.subject)
        formData.getAll('filedoc','authorname','subject','note','idDoc')
        console.log(formData);
        axios.post("/api/doc/upload", formData,{})
        .then((res) => {
            console.log(res.data);
            toast.success('Upload Successful');
           
        })
        .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
        
  }
  hienThiNut(){
    if(this.state.trangthai===true){
      return <Button md="1" onClick={()=>this.thayDoiTrangThai()} size="sm">-</Button>
    }
    else{
      return <Button md="1" onClick={()=>this.thayDoiTrangThai()} size="sm">+</Button>
    }
  }
  thayDoiTrangThai=()=>{
    this.setState({
      trangthai:!this.state.trangthai
    })
  }
  hienThiForm(){
    if(this.state.trangthai===true){
      return(
        <Card>
              <CardHeader>
                <CardTitle tag="h3">UPLOAD FILE</CardTitle>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label tag="h5">ID Document</Label>
                  <Input onChange={this.onchangValue} type="text" name="idDoc" id="" placeholder="Điền Id Doc" />
              
                </FormGroup>
                <FormGroup>
                  <Label tag="h5">Người đăng</Label>
                  <Input onChange={this.onchangValue} type="text" name="authorname" id="" placeholder="Điền tên người đăng file này lên" />
              
                </FormGroup>
                <FormGroup>
                  <Label tag="h5">Ghi chú</Label>
                  <Input onChange={this.onchangValue} type="text" name="note" id="" placeholder="ghi chú về file muốn upload" />
                </FormGroup>
                <FormGroup>
                  <Label tag="h5">Chủ đề</Label>
                  <Input onChange={this.onchangValue} type="text" name="subject" id="" placeholder="ghi chú về file muốn upload" />
                </FormGroup>
                <FormGroup>
                  <Label tag="h5">File upload</Label>
                </FormGroup>
                <FormGroup></FormGroup>
                <CustomInput onChange={this.onchangeFile} type="file" accept=".pdf,.doc,.docx,.txt" id="" name="filedoc" />
                <FormText color="muted">
                    Chọn file mà bạn muốn upload
                </FormText>
                <Button onClick={this.onSubmit}>Upload</Button>
                <Button onClick={this.onCancelField} type="reset">Clear</Button>
              
            </CardBody>
              
            </Card>
      );
    }

  }
  render() {
    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <ToastContainer />
            <Col md="8">
              <Card>
                <CardBody>
                  <div className="places-buttons">
                    <Row>
                      <Col md="8">
                        <CardTitle>
                          <FormGroup row>
                            <Label  md="11" tag="h6">Danh sách tài liệu</Label>
                            {this.hienThiNut()}
                          </FormGroup>
                        </CardTitle>
                      </Col>
                    </Row>
                    <Table striped>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Filename</th>
                            <th>Authorname</th>
                            <th>Note</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.tabRow()}
                        </tbody>
                      </Table>
                  </div>
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

export default Notifications;
