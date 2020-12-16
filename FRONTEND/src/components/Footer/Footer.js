
import React from "react";
// used for making the prop types of this component
//import PropTypes from "prop-types";

// reactstrap components
import { Container,Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/?ref=bdr-user-archive-footer">Creative Tim</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/presentation?ref=bdr-user-archive-footer">About Us</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://www.creative-tim.com/blog?ref=bdr-user-archive-footer">Blog</NavLink>
            </NavItem>
          </Nav>
          <div className="copyright">
           lol
          </div>
        </Container>
      </footer>
    );
  }
}

export default Footer;
