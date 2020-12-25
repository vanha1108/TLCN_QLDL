import React, { Component } from 'react';
//import axios from 'axios';
import{Button} from "reactstrap";
//import axios from 'axios';
class TableRowUser extends Component {
    
    onClickChangePassword=()=>{
        this.props.onView();
        this.props.onChangeTT();
    }
    
    onClickEdit=()=>{
        this.props.onView();
        this.props.onCHangeEdit();
    }
    hienThiRole =()=>{
        if(this.props.obj.role ===1) {return "admin";}
        else {return "Staff";}
    }
    hienThiSex=()=>{
        if(this.props.obj.sex === true) return "Male";
        else {return "Female"}
    }
    hienThiNgay=()=>{
        var date = new Date(this.props.obj.dob);
        return date.toLocaleDateString();
    }
    render() {
        return (
            <tr>
                
                <td>
                    {this.props.obj.iduser}
                </td>
                <td>
                    {this.props.obj.firstname}
                </td>
                <td>
                    {this.props.obj.lastname}
                </td>
                <td>
                    {this.hienThiSex()}
                </td>
                <td>
                    {this.hienThiNgay()}
                </td>
                <td>
                    {this.props.obj.phonenumber}
                </td>
                <td>
                    {this.props.obj.address}
                </td>
                <td>
                    {this.props.obj.username}
                </td>
                
                <td>
                    {this.hienThiRole()}    
                </td>
                <td>
                   
                        <Button onClick={()=>this.onClickChangePassword()} size="sm" color="info">change</Button>
                        <Button size="sm" color="danger">Delete</Button>
                        <Button onClick={()=>this.onClickEdit()} size="sm" color="info">Edit</Button>
                    
                   
                </td>
                
            </tr>
        );
    }
}

export default TableRowUser;