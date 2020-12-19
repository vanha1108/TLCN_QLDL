
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRowCheck from "components/TableRow/TableRowcheck.js";
import {Redirect } from "react-router-dom";
// reactstrap components
//import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
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
  Col,
  FormFeedback,
  Form
} from "reactstrap";
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onchangeFile = this.onchangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
    this.onSaveFile = this.onSaveFile.bind(this);
    this.state = {
      datacheck:[],
      datalist:[],
      filedoc:'',
      authorname:'',
      note:'',
      subject:'alo',
      idDoc:'',
      disabled:true
    }
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
  componentDidMount() {
    axios.get('/api/theme/alltheme')
        .then(response => {
            console.log(response.data);
            this.setState({datalist: response.data});
        })
        .catch(function (error) {
            console.log(error);
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
          if(res.data.arrDuplicate)
          {           
            this.setState({datacheck: res.data.arrDuplicate,disabled:false});
            console.log('yess');          
          }
          else{
            this.setState({idDoc:'',authorname:'',note:''})
            toast.success('Upload Successful')
            window.location.reload();
          } 
        })
        .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
        
  }
  onSaveFile(event){
        
    event.preventDefault()
    const formData1 = new FormData()
    formData1.append('filedoc', this.state.filedoc)
    formData1.append('authorname',this.state.authorname)
    formData1.append('note',this.state.note)
    formData1.append('idDoc',this.state.idDoc)
    formData1.append('subject',this.state.subject)
    formData1.getAll('filedoc','authorname','subject','note','idDoc')
    console.log(formData1);
    axios.post("/api/doc/save", formData1,{})
    .then((res) => {
        this.setState({disabled:true})
        toast.success('Upload Successful')
        console.log('vao day roi ne')
        window.location.reload()
    })
    .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});     
  }
  tabRowCheck(){
    return this.state.datacheck.map(function (object,i){
      return <TableRowCheck obj={object} key={i}/>;
    });
  } 
  hienThiFormSave(){
    if(this.state.disabled===false){
      return(
        <Card>
          <CardBody>
            <Table striped>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                         
                  {this.tabRowCheck()}
                                    
              </tbody>
            </Table>
              <Button disabled={this.state.disabled}  onClick={this.onSaveFile}>save</Button>
              <Button disabled={this.state.disabled} onClick={()=>this.onCancelField()} >clear</Button>
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
            <ToastContainer />
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h3">UPLOAD FILE</CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label tag="h5">ID Document</Label>
                    <Input value={this.state.idDoc} onChange={this.onchangValue} type="text" name="idDoc" id="" placeholder="Điền Id Doc" />
                
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Người đăng</Label>
                    <Input value={this.state.authorname} onChange={this.onchangValue} type="text" name="authorname" id="" placeholder="Điền tên người đăng file này lên" />
                
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Ghi chú</Label>
                    <Input value={this.state.note} onChange={this.onchangValue} type="text" name="note" id="" placeholder="ghi chú về file muốn upload" />
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Chủ đề</Label>
                    <Input value={this.state.subject} onChange={this.onchangValue} type="select" name="subject" id="">
                      {this.state.datalist.map((list,i) => (
                          <option key={i} value={list.name}>{list.name}</option>
                      ))}
                    </Input>
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
                  
                
               </CardBody>              
             </Card>
            </Col>
            <Col md="4">
              {this.hienThiFormSave()}
            </Col>
            <Col md="6">
              <Form>
                <FormGroup>
                  <Label for="exampleEmail">Valid input</Label>
                  <Input valid />
                  <FormFeedback valid>Sweet! that name is available</FormFeedback>
                  <FormText>Example help text that remains unchanged.</FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Invalid input</Label>
                  <Input invalid />
                  <FormFeedback>Oh noes! that name is already taken</FormFeedback>
                  <FormText>Example help text that remains unchanged.</FormText>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
    );
  }
}
export default Map;
