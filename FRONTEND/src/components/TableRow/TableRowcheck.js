import React, { Component } from 'react';
//import {Button} from "reactstrap";
//import axios from 'axios';
class TableRowcheck extends Component {
    render() {
        return (
            <tr>  
                <td>
                    {this.props.obj.document}
                </td>
                
                <td>
                    {this.props.obj.message}                   
                </td>
                
            </tr>
        );
    }
}

export default TableRowcheck;