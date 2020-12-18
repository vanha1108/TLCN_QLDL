import React, { Component } from 'react';
import {Button} from "reactstrap";
import axios from 'axios';
//import download from 'js-file-download';
class TableRowDoc extends Component {
    constructor(props) {
        super(props);
        //this.delete = this.delete.bind(this);
        this.download1 = this.download1.bind(this);
    }
    
    download1() {
        //axios.get('/api/doc/dowload/'+this.props.obj.idDoc);
        axios({
            url:'/api/doc/dowload/'+this.props.obj.idDoc,
            moethod:'GET',
            responseType:'blob',
        }).then((response) => {
            const url =  window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download','file.docx');
            document.body.appendChild(link);
            link.click();
        }).catch(console.log('khong tai dc'));
    }
    render() {
        return (
            <tr>
                <td>
                    {this.props.obj.idDoc}
                </td>
                <td>
                    {this.props.obj.filename}
                </td>
                <td>
                    {this.props.obj.authorname}
                </td>
                <td>
                    {this.props.obj.note}
                </td>
                <td>
                    <Button size="sm" color="info">Edit</Button>
                    <Button size="sm" color="danger">Delete</Button>
                    <Button size="sm" onClick={this.download1} color="success">Download</Button>
                </td>
                
            </tr>
        );
    }
}

export default TableRowDoc;