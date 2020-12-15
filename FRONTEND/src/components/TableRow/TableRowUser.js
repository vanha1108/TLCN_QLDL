import React, { Component } from 'react';
//import axios from 'axios';
import{Button} from "reactstrap";
//import axios from 'axios';
class TableRowUser extends Component {
    
    hienThiRole =()=>{
        if(this.props.obj.role ==="1") {return "admin";}
        else {return "Staff";}
    }
    
    render() {
        return (
            <tr>
                
                <td>
                    {this.props.obj.email}
                </td>
                
                <td>
                    {this.hienThiRole()}                   
                </td>
                <td>
                    <Button size="sm" color="info">Edit</Button>
                    <Button size="sm" color="danger">Delete</Button>
                </td>
                
            </tr>
        );
    }
}

export default TableRowUser;