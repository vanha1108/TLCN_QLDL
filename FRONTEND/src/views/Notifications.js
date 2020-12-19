
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRow from "components/TableRow/TableRowDoc.js";
// reactstrap components
import {
  
 
  Card,
  
  CardBody,
  CardTitle,
  Row,
  Label,
  Input,
  FormGroup,
  
  Table,
  Col
} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";

class Notifications extends React.Component {


  constructor(props) {
    super(props); 
    this.state = {
      data:[]  
    }
  }
  componentDidMount() {
    axios.get('/api/doc/all')
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
  render() {
    return (
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <Row>
            <Col md="8">
            <Card>
              <CardBody>
              <FormGroup>
                <Label tag="h6">Tìm kiếm</Label>
                <Input type="text" name="search" id="" placeholder="tài liệu muốn tìm kiếm"/>
              </FormGroup>
              </CardBody>
            </Card> 
            </Col>
          </Row>
          <Row>
            <ToastContainer />           
            <Col md="10">
              <Card>               
                    <CardHeader>
                          <FormGroup row>
                            <Label md="6"  sm={6} tag="h6">Danh sách tài liệu</Label>
                            <Col md="6" sm={6}>
                            <Input md="2" value={this.state.subject} onChange={this.onchangValue} type="select" name="subject" id="">
                              {this.state.data.map((list) => (
                                  <option value={list.filename}>{list.filename}</option>
                              ))}
                            </Input>
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
