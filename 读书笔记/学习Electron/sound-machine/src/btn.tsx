import * as React from "react";
import "./App.css";
export interface  Props {
  wav: string;
}

class Btn extends React.Component<Props,any> {

  render() {
    let { wav } = this.props;
    return (
      <section className="btn-s" data-wav={wav}>
        <span className="button-icon"/>
      </section>
    );
  }
}

export default Btn;
