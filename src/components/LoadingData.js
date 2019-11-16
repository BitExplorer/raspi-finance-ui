import React, { Component } from 'react'
import ReactLoading from 'react-loading'

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
      {/*<ReactLoading type="cylon" color="green" height="20%" width="20%" />
       <ReactLoading display='inline' type='spin' color='green' height={'20%'} width={'20%'} />
      <ReactLoading display='inline' type='spokes' color='purple' height={'20%'} width={'20%'} />  */}
      </div>
    );
  }
}

export default LoadingData;
//export default withStyles(styles)(LoadingData1);

