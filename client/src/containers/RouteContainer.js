import React, { Component } from "react";

class RouteContainer extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default RouteContainer;
