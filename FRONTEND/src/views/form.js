import React from 'react';
//import './form.css';
const form = props => {
  return (    
      <div className="container">
        
              <form
                id="login-form"
                className="form"
                method="post"
                onSubmit={props.onSubmit}>
                {props.children}
              </form>
            </div>
  );
}

export default form;