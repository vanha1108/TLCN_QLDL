import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";
class TableRowType extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete() {
    axios
      .get("/api/theme/deletetheme/" + this.props.obj._id)
      .then(console.log("Deleted"))
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <tr>
        <td>{this.props.obj.name}</td>

        <td>
          <Button size="sm" color="info">
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
