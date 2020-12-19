import React, { Component } from 'react';
import{Button} from "reactstrap";
import axios from 'axios';
class TableRowSearch extends Component {
    constructor(props) {
        super(props);
        //this.delete = this.delete.bind(this);
        this.download = this.download.bind(this);
    }
    download() {
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
                    
                    <Button onClick={this.download} size="sm"  color="success">Download</Button>
                </td>
                
           
                
            </tr>
        );
    }
}

export default TableRowSearch;