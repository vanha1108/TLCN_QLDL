
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import 'react-toastify/dist/ReactToastify.css';
import TableRow from "components/TableRow/TableRowDoc.js";
import {Redirect } from "react-router-dom";
import TableRowSearch from "components/TableRow/TableRowSearch.js";
// reactstrap components
import { 
  Card,
  CardBody,
  Row,
  Label,
  Input,
  FormGroup,
  Table,
  CardTitle,
  Col
} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import Button from "reactstrap/lib/Button";

class Notifications extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitTheme = this.onSubmitTheme.bind(this);
    this.onChangeValueTheme = this.onChangeValueTheme.bind(this);
    this.state = {
      data:[] ,
      dataserch:[],
      datatheme:[],
      trangthai:false,
      trangthaiserarch:false,
      idsubjectView:"1"
    }
  }
  // componentDidMount() {
  //   axios.get('/api/doc/all')
  //       .then(response => {
  //           console.log(response.data.listdoc);
  //           this.setState({data: response.data.listdoc});
  //       })
  //       .catch(function (error) {
  //           console.log(error);
  //       })
  // }

  onSubmitTheme(event){
    event.preventDefault();
    
    console.log(this.state.idsubjectView);
    axios.get('/api/doc/subject',{idsubjectView:this.state.idsubjectView})
    .then((res)=>{
      console.log(res.data);
    })
  }
  onChangeValue(event){
    this.setState({
      key:event.target.value
    });
  }
  onChangeValueTheme(event){
    this.setState({
      idsubjectView:event.target.value
    });
  }
  onSubmit(event){
    event.preventDefault();
    //this.setState({key:event.target.value});
    const b ={ 
      key:this.state.key
    };
    console.log(b)
    axios.post('/api/doc/search',b)
    .then((res)=>{
      console.log(res.data.document)
      this.setState({
        dataserch:res.data.document,
        trangthai:true
      });
    })
  }
  tabRow() {
    return this.state.data.map(function (object, i) {
        return <TableRow obj={object} key={i}/>;
    });
  }
  tabRowSearch=()=>this.state.dataserch.map((object,i)=>(
      <TableRowSearch obj={object} key={i}/>
    )
  )
  checkNut(){
    if(this.state.trangthai===false){
      return <Button onClick={()=>this.thayTrangThai()} size="sm" md="2">+</Button>;    
    }
    else{
      return <Button onClick={()=>this.thayTrangThai()} size="sm" md="2">-</Button>
    }
  }
  thayTrangThai=()=>{
    this.setState({
      trangthai: !this.state.trangthai,
      dataserch:[]
    });
  }
  hienThiForm(){
    if(this.state.trangthai===true){
      return(
        <Card>
                <CardHeader>          
                  <FormGroup row>
                    <Label  md="10" tag="h6">Danh sách chủ đề</Label>
                    {this.checkNut()}
                  </FormGroup>
                </CardHeader>
                <CardBody>
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
                          {this.tabRowSearch()}
                        </tbody>
                      </Table>
                </CardBody>
              </Card>
      );
    }
  }

  componentDidMount() {
    axios.get('/api/theme/alltheme')
        .then(response => {
            console.log(response.data.listtheme);
            this.setState({datatheme: response.data.listtheme});
        })
        .catch(function (error) {
            console.log(error);
        })
  }
  tabRowSearch=()=>this.state.dataserch.map((object,i)=>(
    <TableRowSearch obj={object} key={i}/>
  )
)
  

  render() {
    if (!localStorage.getItem('authorization')) return <Redirect to="/login" />
    return (
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="10">
            <Card>
              <CardBody>
              <FormGroup row>
                <Label sm={2} tag="h6">Search document</Label>
                <Col sm={5}>

                  <Input  onChange={this.onChangeValue} type="text" name="key" id="" placeholder="Input name document"/>

                </Col>
                <Col sm={2}>
                  <Button onClick={this.onSubmit}>search</Button>
                 
                </Col>
                
                
              </FormGroup>
              </CardBody>
            </Card> 
            </Col>
            <Col md="10">
              {this.hienThiForm()}
            </Col>
            <Col md="10">
              <Card>               
                <CardHeader>
                  <FormGroup row>
                    <Label md="6"  sm={6} tag="h6">document list</Label>
                      <Col md="6" sm={6}>
                        <Input md="2" value={this.state.idsubjectView} onChange={this.onChangeValueTheme} type="select" name="idsubjectView" id="">
                              {this.state.datatheme.map((list,i) => (
                                  <option key={i} value={list.idtheme}>{list.name}</option>
                              ))}
                        </Input>
                        <Button onClick={this.onSubmitTheme}>Sort</Button>
                      </Col>
                  </FormGroup>
                </CardHeader>   
                  <CardBody>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
    );
  }
}

export default Notifications;
