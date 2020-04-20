import React, { Component } from 'react'
import ReactLoading from 'react-loading'
//import { LoadingSpinnerComponent} from './loadingSpinner';

class LoadingData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingFlag: false,
    };
  }

  componentDidMount() {
  }

  render() {
    const { type } = this.props;
    return (
      <div>
      <ReactLoading type={type} color="green" height="10%" width="10%" />
      {"type=" + type}
      </div>
    );
  }
}

export default LoadingData;