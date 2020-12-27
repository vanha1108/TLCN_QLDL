
import React from "react";
// used for making the prop types of this component
//import PropTypes from "prop-types";

// reactstrap components
import { Container,Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer style={{background: 'Gainsboro'}} className="footer">
        <Container fluid>
          <Nav style={{color: 'Black'}}>
            <NavItem>
              <NavLink style={{color: 'Black'}} href="#">17110230 - Nguyen Van Thang</NavLink>
            </NavItem>
            <NavItem>
              <NavLink style={{color: 'Black'}} href="#">17110130 - Nguyen Van Ha</NavLink>
            </NavItem>
          </Nav>
          <div  style={{color: 'Black'}} className="copyright">
           MD COMPANY
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
