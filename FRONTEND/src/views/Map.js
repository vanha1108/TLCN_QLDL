
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRowCheck from "components/TableRow/TableRowcheck.js";
import {Redirect } from "react-router-dom";
import history from "history.js";
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
    this.onSaveFile = this.onSaveFile.bind(this);
    this.state = {
      datacheck:[],
      datalist:[],
      filedoc:'',
      authorname:'',
      note:'',
      idsubject:'',
      idDoc:'',
      disabled:true,
      iduser:'',
      regexp : /^[0-9\b]+$/,
      regexp1 :/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/,
      rex: /[0-9]/,
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
    axios.get('/api/theme/alltheme',{
        headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then(response => {
            console.log(response.data.listtheme);
            this.setState({datalist: response.data.listtheme});
            console.log('daaaaaaaaaaaaaaaaaaaaaa');
            console.log(this.getFirstTheme());
            
        })
        .catch(function (error) {
            console.log(error);
        })
  }

  onSubmit(event){
    event.preventDefault()
    if(this.state.idsubject===''){
      this.state.idsubject=this.getFirstTheme();
    }
    if(!this.state.regexp.test(this.state.idDoc)){
      return alert('sai number');
    }
    if(this.state.rex.test(this.state.authorname)||this.state.regexp1.test(this.state.authorname))
    {
      return alert('sai ký tự');
    }
    if(this.state.idDoc!==''&&this.state.filedoc!==''&&this.state.authorname!==''&&this.state.idsubject!==''  ){
      const formData = new FormData()
        formData.append('filedoc', this.state.filedoc)
        formData.append('authorname',this.state.authorname)
        formData.append('note',this.state.note)
        formData.append('idDoc',this.state.idDoc)
        formData.append('idsubject',this.state.idsubject)
        formData.getAll('filedoc','authorname','idsubject','note','idDoc')
        console.log(formData);
        axios.post("/api/doc/upload", formData,{
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then((res) => {
          console.log(res.data.message);
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
    else{
      alert('fill all');
    }
        
     
  }
  onSaveFile(event){
        
    event.preventDefault()
    const formData1 = new FormData()
    formData1.append('filedoc', this.state.filedoc)
    formData1.append('authorname',this.state.authorname)
    formData1.append('note',this.state.note)
    formData1.append('idDoc',this.state.idDoc)
    formData1.append('idsubject',this.state.idsubject)
    formData1.getAll('filedoc','authorname','idsubject','note','idDoc')
    console.log(formData1);
    axios.post("/api/doc/save", formData1,{
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("authorization")),
      },
    })
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
                  <th>ID Document</th>
                  <th>Filename</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                         
                  {this.tabRowCheck()}
                                    
              </tbody>
            </Table>
              <Button disabled={this.state.disabled}  onClick={this.onSaveFile}>Save</Button>
              <Button disabled={this.state.disabled} onClick={()=>this.onCancelField()} >Cancel</Button>
          </CardBody>
        </Card>
      );
    }
  }
  onCancelField(){
    this.setState({disabled:true});
  }
  getFirstTheme=()=>{
  
    for(let i in this.state.datalist){
      return this.state.datalist[i].idtheme;
    }
    return "";
  }
  render() {
    if (!localStorage.getItem('authorization')) return history.push("/login");
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
                    <Input pattern="[0-9]*" value={this.state.idDoc} onChange={this.onchangValue} type="text" name="idDoc" id="" placeholder="Input id document" />
                
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Authorname</Label>
                    <Input value={this.state.authorname} onChange={this.onchangValue} type="text" name="authorname" id="" placeholder="Input authorname" />
                
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Note</Label>
                    <Input value={this.state.note} onChange={this.onchangValue} type="text" name="note" id="" placeholder="Input note" />
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Theme</Label>
                    <Input defaultValue={this.state.datalist.idtheme} onChange={this.onchangValue} type="select" name="idsubject" id="">
                      {this.state.datalist.map((list,i) => (
                          <option key={i} value={list.idtheme}>{list.name}</option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">File upload</Label>
                  </FormGroup>
                  <FormGroup></FormGroup>
                  <CustomInput onChange={this.onchangeFile} type="file" accept=".pdf,.doc,.docx,.txt" id="" name="filedoc" />
                  <FormText color="muted">
                      Select file you want upload
                  </FormText>
                  <Button onClick={this.onSubmit}>Upload</Button>
                  
                
               </CardBody>              
             </Card>
            </Col>
            <Col md="4">
              {this.hienThiFormSave()}
            </Col>
          </Row>
        </div>
    );
  }
}
export default Map;
