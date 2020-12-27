import React, { Component } from 'react';
//import {Button} from "reactstrap";
import axios from 'axios';
//import download from 'js-file-download';
import { ToastContainer, toast } from "react-toastify";
import {Button} from "reactstrap";
class TableRowcheck extends Component {
    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        
    }
    download() {
        var iddowload = this.props.obj.idDoc;
        axios({
            url:'/api/doc/dowload/'+iddowload,
            moethod:'GET',
            responseType:'blob',
        }).then((response) => {
            const url =  window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','file.docx');
            document.body.appendChild(link);
            link.click();
            toast.success('Download success');
        })
    }
    render() {
        return (
            <tr>
                <td>{this.props.obj.document.idDoc}</td>
                <td>
                    {this.props.obj.document.filename}
                </td>
                <td>{this.props.obj.category}</td>
                <td>
                    {this.props.obj.message}                   
                </td>
                <td>
                    <Button color="success" size="sm" onClick={this.download}>Download</Button>
                    <ToastContainer />
                </td>
            </tr>
        );
    }
}

export default TableRowcheck;