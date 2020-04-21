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
      <div><ReactLoading type={type} color="green" height="50%" width="50%" /></div>
    <div>status={type}</div>
      
      </div>
    );
  }
}

export default LoadingData;