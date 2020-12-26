import React, { Component } from 'react';
import {Button} from "reactstrap";
import axios from 'axios';
//import download from 'js-file-download';
import { ToastContainer, toast } from "react-toastify";
class TableRowDoc extends Component {
    constructor(props) {
        super(props);
        //this.delete = this.delete.bind(this);
        this.download1 = this.download1.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    download1() {
        //axios.get('/api/doc/dowload/'+this.props.obj.idDoc);
        var iddowload = this.props.obj.idDoc;
        axios({
            url:'/api/doc/dowload/'+iddowload,
            moethod:'GET',
            responseType:'blob',
        },{
            headers: {
              "Content-Type": "application/json",
              Authorization: JSON.parse(localStorage.getItem("authorization")),
            },
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
    delete() {
        var result = window.confirm("Are you sure you want to delete")
        if(result){
          var iddelete = this.props.obj.idDoc;
          axios
          .delete("/api/doc/delete/" + iddelete,{
            headers: {
              "Content-Type": "application/json",
              Authorization: JSON.parse(localStorage.getItem("authorization")),
            },
          })
          .then((res)=>{
            console.log(res.data.message);
            if(res.data.success===true){
              toast.success('delete success');
              //window.location.reload();
              
            }
            else
            {
              toast.error(`${res.data.message}`);
            }
          })
          .catch((err) => console.log(err));
        }
        else
        {
          console.log('vao day')
        }
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
                <td>{this.props.obj.iduser}</td>
                <td>
                    {this.props.obj.authorname}
                </td>
                <td>
                    {this.props.obj.note}
                </td>
                <td>
                    <Button size="sm" onClick={this.delete} color="danger">Delete</Button>
                    <Button size="sm" onClick={this.download1} color="success">Download</Button>
                    <ToastContainer />
                </td>
                
            </tr>
        );
    }
}

export default TableRowDoc;