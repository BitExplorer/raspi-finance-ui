import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import axios from 'axios';
import LoadingData from './LoadingData';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DialogDeleteConfirm from './DialogDeleteConfirm';
import DialogFormUpdate from './DialogFormUpdate';
import delete_logo from '../images/delete-24px.svg';
import { setAccount, setTransaction, setTransactionLoadStatus, } from '../store/account/actionCreator';
import DialogFormTransactionAdd from './DialogFormTransactionAdd';
import DialogFormAccountAdd from './DialogFormAccountAdd';
//import Pagination from 'react-paginating';
//import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'
//https://stackoverflow.com/questions/35537229/how-to-update-parents-state-in-react

export class TransactionTable extends Component {
  constructor(props) {
    super(props);
    this.loadingIconNow = 'bars';
    this.notLoadingIcon = 'none';
    this.state = {
      rows: [],
      totals: 0.0,
      totals_cleared: 0.0,
      limit: 2,
      pageCount: 3,
      total: 6,
      currentPage: 1,
      clickOpenDelete: false,
      columns: [
        'action',
        'date',
        'description',
        'category',
        'amount',
        'cleared',
        'notes',
      ],
      guidToDelete: null,
      guidToUpdate: null,
      accountNameOwnerList: null,
    };
    this.handleClickDelete.bind(this);
    this.handleClickUpdate.bind(this);
    this.handler = this.handler.bind(this);
  }

  handleClickDelete = guid => {
    this.setState({
      clickOpenDelete: true,
      guidToDelete: guid,
    });
  };

  handlePageChange = page => {
    this.setState({
      currentPage: page,
    });

    let endpoint = 'http://localhost:8080/transaction/account/select/' + this.props.accountNameOwner;
    // let endpoint =
    //   'http://localhost:8080/findall?pageSize=5&pageNumber=' +
    //   (this.state.currentPage - 1);
    let payload = '';

    axios
      .get(endpoint, payload, {
        timeout: 0,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        alert(JSON.stringify(response.data.content));
        alert(JSON.stringify(response.data.pageable));
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  };

  handleEpochDate = epoch => {
    if (isNaN(epoch) === true) {
      return 'invalid epoch'
    }

    if( epoch.toString().length === 10 ) {
      var epochWithMillis = epoch * 1000;
      var epochMillisToDate = new Date(epochWithMillis);
      return epochMillisToDate.toLocaleDateString('en-US');
    }

    return new Date(epoch).toLocaleDateString('en-US');
  };

  handleClickUpdate = guid => {
    this.setState({clickOpenUpdate: true, guidToUpdate: guid});
  };

  handler = e => {
    if (
      this.props.accountNameOwner !== '' &&
      this.props.accountNameOwner !== null &&
      this.props.accountNameOwner.length !== 0
    ) {
      this.props.setAccount(false, this.props.accountNameOwner);
    }
  };

  handleCloseUpdate = value => {
    this.setState({selectedUpdateValue: value, clickOpenUpdate: false});
  };

  handleCloseDelete = value => {
    this.setState({selectedDeleteValue: value, clickOpenDelete: false});
  };

  handleClearedStatus = cleared => {
    if( cleared === 1) {
      return 'cleared';
    } else if( cleared === 0) {
      return 'outstanding';
    } else {
      return 'future';
    }
  };

  fromEpochDate(utcSeconds) {
    var transactionDate = new Date(0);
    transactionDate.setUTCSeconds(utcSeconds);
    return transactionDate.toLocaleDateString('en-US');
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.notificationIsShown === false) {
      this.props.setTransactionLoadStatus(this.loadingIconNow);
      this.props.setAccount(true, this.props.accountNameOwner);

      let endpoint =
        'http://localhost:8080/transaction/account/select/' +
        this.props.accountNameOwner;
        alert("endpoint=" + endpoint);
      let payload = '';

      axios
        .get(endpoint, payload, {
          timeout: 0,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          this.props.setTransaction(this.notLoadingIcon, response.data);
          this.setState({rows: response.data});
        })
        .catch(error => {
          console.log(error);
          alert(error);
        });

      endpoint =
        'http://localhost:8080/transaction/account/totals/' +
        this.props.accountNameOwner;
      payload = '';

      axios
        .get(endpoint, payload, {
          timeout: 0,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          this.setState({
            totals_cleared: response.data.totalsCleared,
            totals: response.data.totals,
          });
        })
        .catch(error => {
          console.log(error);
          alert(error);
        });
    }
  }

  componentDidMount() {
    this.props.setAccount(true, []);
    this.props.setTransaction('none', []);

    let endpoint = 'http://localhost:8080/account/select/active';
    let payload = '';
    console.log("endpoint = " + endpoint);

    axios
      .get(endpoint, payload, {
        timeout: 0,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({accountNameOwnerList: response.data});
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {

    return (
      <div>
        <div className={this.props.classes.column}>
          <DialogFormTransactionAdd
            handler={this.handler}
            accountNameOwnerList={this.state.accountNameOwnerList}
          />
        </div>
        <div className={this.props.classes.column}>
          <DialogFormAccountAdd handler={this.handler} />
        </div>
        <div className={this.props.classes.column}>
        <b>Cleared:</b> {this.state.totals_cleared.toFixed(2)}
        </div>
        <div className={this.props.classes.column}>
          <b>Totals:</b> {this.state.totals.toFixed(2)}
        </div>
        <div className={this.props.classes.column}>
        <LoadingData className="" type={this.props.loadingStatus} />
        </div>
        <div className={this.props.classes.showTable}>
          <Table id="transactionTable" key="transactionTable">
            <TableHead>
              <TableRow>
                <CustomTableCell>action</CustomTableCell>
                <CustomTableCell>date</CustomTableCell>
                <CustomTableCell>description</CustomTableCell>
                <CustomTableCell>category</CustomTableCell>
                <CustomTableCell>amount</CustomTableCell>
                <CustomTableCell>cleared</CustomTableCell>
                <CustomTableCell>notes</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map(row => {
                return (
                  <TableRow
                    className={this.props.classes.row}
                    key={row.guid}
                    id={row.guid}
                    hover={true}>
                    <TableCell>
                      <div>
                        <Button
                          className={this.props.classes.button}
                          onClick={() => this.handleClickDelete(row.guid)}>
                          <img
                            src={delete_logo}
                            className=""
                            alt="delete_logo"
                          />
                        </Button>
                        {/*<Button className={this.props.classes.button} onClick={() => this.handleClickUpdate(row.guid)}><img src={edit_logo} className="" alt="edit_logo" /></Button> */}
                        <DialogFormUpdate
                          handler={this.handler}
                          transaction={row}
                          accountNameOwnerList={this.state.accountNameOwnerList}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {this.handleEpochDate(row.transactionDate)}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className={this.props.classes.currency}>
                      {row.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{this.handleClearedStatus(row.cleared)}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <DialogDeleteConfirm
            guid={this.state.guidToDelete}
            selectedValue={this.state.selectedDeleteValue}
            open={this.state.clickOpenDelete}
            onClose={this.handleCloseDelete}
            handler={this.handler}
          />
        </div>
      </div>
    );
  }
}

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    display: '',
    fontSize: 20,
  },
}))(TableCell);

const styles = theme => ({
  row: {
    //not working
    '&:nth-of-type(odd)': {
      //backgroundColor: theme.palette.background.default,
      backgroundColor: theme.palette.common.red,
    },
  },
  button: {
    //in use
    display: '',
    padding: 0,
    border: 'none',
    background: 'none',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
  },
  showTable: {
    //in use
    display: '',
  },
  hideTable: {
    //in use
    display: 'none',
  },
  head: {
    //not working
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 20,
  },
  currency: {
    '&:after': {
      content: '.00',
    },
    '&:before': {
      content: '$',
      textAlign: 'right',
    },
  },
  column: {
    float: 'left',
    padding: '10px',
    bottom: 0,
  },
});

const mapStateToProps = state => {
  const {account} = state;
  const {isShown, transactions, viewStatus} = account;

  return {
    notificationIsShown: isShown,
    transactionList: transactions,
    loadingStatus: viewStatus,
  };
};

const mapDispatchToProps = {
  setAccount,
  setTransaction,
  setTransactionLoadStatus,
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TransactionTable),
);