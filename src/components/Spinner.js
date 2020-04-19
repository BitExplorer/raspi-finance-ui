import React, { Component } from 'react'
//import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import "./spinner.css";

// https://codesandbox.io/s/github/lemoncode/react-promise-tracker/tree/master/examples/00-example-basic?file=/src/common/components/spinner/spinner.js

// export const Spinner = (props) => {
//   const { promiseInProgress } = usePromiseTracker();

//   return (
//     promiseInProgress && (
//       <div className="spinner">
//         <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
//       </div>
//     )
//   );
// };

//  <Loader type="ThreeDots" visible="{type}" color="#2BAD60" height="150" width="150" />

class Spinner extends Component {

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
			<Loader type="{type}" color="#2BAD60" height="150" width="150" />
         {"loadingFlag=" + type}
		</div>
	  );
	}
  }
  
  export default Spinner;