import ActionEdit from 'material-ui/svg-icons/image/edit';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import * as _ from 'lodash';
import IconButton from 'material-ui/IconButton';
import * as moment from 'moment';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import PhoneRecord from '../../../models/phone-record';
import SearchPhone from '../SearchPhone';

interface PhoneListProps {
  list: PhoneRecord[];
  editHandler: Function;
  logHandler: Function;
}

interface PhoneListState {
  list?: PhoneRecord[];
  sortBy?: string;
}

function sortBy(list: PhoneRecord[], fieldName: string = 'firstName') {
  list.sort((prev: PhoneRecord, next: PhoneRecord) => {
    if (prev[fieldName] < next[fieldName]) return -1;
    if (prev[fieldName] > next[fieldName]) return 1;
    return 0;
  });
}

class PhoneList extends React.Component<PhoneListProps, PhoneListState> {
  state: PhoneListState = {
    list: [],
    sortBy: 'firstName',
  };
  
  static getDerivedStateFromProps(nextProps: PhoneListProps, prevState: PhoneListState) {
    if (!nextProps.list) {
      return null;
    }
    sortBy(nextProps.list, prevState.sortBy);
    if (prevState.list && _.isEqual(nextProps.list, prevState.sortBy)) {
      return null;
    }
    return {
      list: nextProps.list
    };
  }
  
  constructor(props: PhoneListProps) {
    super(props);
    this.sortBy = this.sortBy.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEditRecord = this.handleEditRecord.bind(this);
    this.handleDeleteRecord = this.handleDeleteRecord.bind(this);
  }
  
  render() {
    const {list} = this.state;
    return (
      <div>
        <SearchPhone
          searchHandler={this.handleSearch}
        />
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>
                <a href="#" onClick={() => this.sortBy('firstName')}>First Name</a>
              </TableHeaderColumn>
              <TableHeaderColumn>
                <a href="#" onClick={() => this.sortBy('lastName')}>Last Name</a>
              </TableHeaderColumn>
              <TableHeaderColumn>
                <a href="#" onClick={() => this.sortBy('birthday')}>Date of Birth</a>
              </TableHeaderColumn>
              <TableHeaderColumn>
                <a href="#" onClick={() => this.sortBy('phone')}>Phone Number</a>
              </TableHeaderColumn>
              <TableHeaderColumn>
                Actions
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {list && list.length && list.map((phoneRecord: PhoneRecord, i: number) => {
              return <TableRow key={i}>
                <TableRowColumn>{phoneRecord.firstName}</TableRowColumn>
                <TableRowColumn>{phoneRecord.lastName}</TableRowColumn>
                <TableRowColumn>{moment(phoneRecord.birthday).format('YYYY-MM-DD')}</TableRowColumn>
                <TableRowColumn>{phoneRecord.phone}</TableRowColumn>
                <TableRowColumn>
                  <IconButton
                    className="edit-record-btn"
                    onClick={() => this.handleEditRecord(i)}
                  >
                    <ActionEdit />
                  </IconButton>
                  <IconButton
                    className="delete-record-btn"
                    onClick={() => this.handleDeleteRecord(i)}
                  >
                    <ActionDelete />
                  </IconButton>
                </TableRowColumn>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  sortBy(fieldName: string) {
    this.setState({
      sortBy: fieldName,
    });
    sortBy(this.props.list, fieldName);
  }
  
  handleSearch(value?: RegExp) {
    let {list} = this.state;
    if (!list) {
      return;
    }
    list = !value ? this.props.list : this.props.list.filter((phone: PhoneRecord) =>
      phone.firstName.search(value) + 1 ||
      phone.lastName.search(value) + 1 ||
      moment(phone.birthday).format('YYYY-MM-DD').search(value) + 1 ||
      phone.phone.search(value) + 1
    );
    this.setState({list});
  }
  
  handleEditRecord(i: number) {
    if (!this.state.list) return;
    this.props.logHandler('edit', this.state.list[i]);
    this.props.editHandler({...this.state.list[i], index: i + 1});
  }
  
  handleDeleteRecord(i: number) {
    if (!this.props.list) return;
    const {list} = this.props;
    const deletedRecord = list[i];
    list.splice(i, 1);
    this.setState({list});
    this.props.logHandler('delete', deletedRecord);
  }
}

export default PhoneList;