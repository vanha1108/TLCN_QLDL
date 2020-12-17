
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRowCheck from "components/TableRow/TableRowcheck.js";
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
  Col
} from "reactstrap";
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.onchangeFile = this.onchangeFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
    this.state = {
      datacheck:[],
      datalist:[],
      filedoc:'',
      authorname:'',
      note:'',
      subject:'alo',
      idDoc:''
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
            this.setState({datacheck: res.data});
            console.log('yess')
          }
          else{
            toast.success('Upload Successful');

          } 
        })
        .catch(err => {toast.error(`Upload Fail with status: ${err.statusText}`);});
        
  }
  tabRowCheck(){
    return this.state.datacheck.map(function (object,i){
      return <TableRowCheck obj={object} key={i}/>;
    });
  }
  render() {
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
                    <Input value={this.state.subject} onChange={this.onchangValue} type="select" name="subject" id="">
                      {this.state.datalist.map((list) => (
                          <option value={list.name}>{list.name}</option>
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
                         
                          
                        </tbody>
                      </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}
export default Map;
