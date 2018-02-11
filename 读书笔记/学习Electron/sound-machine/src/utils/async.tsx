import * as React from "react";

interface AsyncComponentState {
  component: any;
}

export default function asyncComponent(importComponent: any) :any {
  class AsyncComponent extends React.Component<{}, AsyncComponentState> {
    constructor(props: any) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <div>loading...</div>;
    }
  }

  return AsyncComponent;
}