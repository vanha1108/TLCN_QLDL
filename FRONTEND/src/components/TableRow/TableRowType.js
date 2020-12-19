import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
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
    axios
      .get("/api/theme/deletetheme/" + this.props.obj._id)
      .then((res)=>{console.log(res.data.message);})
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <tr>
        <td>{this.props.obj.name}</td>

        <td>
          <Button onClick={()=>this.onClickEdit()} size="sm" color="info">
            Edit
          </Button>
          <Button onClick={this.delete} size="sm" color="danger">
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default TableRowType;
