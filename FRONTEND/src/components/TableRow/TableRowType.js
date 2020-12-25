import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
class TableRowType extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }
  onClickEdit=()=>{
    this.props.onTest();
    this.props.onChangEdit();
  }
  delete() {
    var result = window.confirm("Are you sure you want to delete")
    if(result){
      var iddelete = this.props.obj.idtheme;
      axios
      .delete("/api/theme/deletetheme/" + iddelete)
      .then((res)=>{
        console.log(res.data.message);
        if(res.data.success===true){
          toast.success('delete success');
          window.location.reload();}
        else
        {
          toast.error('delete failed');
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
        
        <td>{this.props.obj.idtheme}</td>
        <td>{this.props.obj.name}</td>

        <td>
          <Button onClick={()=>this.onClickEdit()} size="sm" color="info">
            Edit
          </Button>
          <Button onClick={this.delete} size="sm" color="danger">
            Delete
          </Button>
          <ToastContainer/>
        </td>
        
      </tr>
      
      
    );
  }
}

export default TableRowType;
