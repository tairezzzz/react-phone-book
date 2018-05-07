
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import * as React from 'react';
import './MainForm.css';
import PhoneList from '../PhoneList';
import PhoneRecord from '../../../models/phone-record';
import { isEmpty, isMobilePhone } from 'validator';
import Log from '../Log';
import * as moment from 'moment';

interface IsValid {
  firstName?: boolean;
  lastName?: boolean;
  birthday?: boolean;
  phone?: boolean;
}

interface ErrorText {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  phone?: string;
}

interface MainFormState {
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  phone?: string;
  phoneList?: PhoneRecord[];
  errorText?: ErrorText;
  isValid?: IsValid;
  submitted?: boolean;
  index?: number;
  log?: string[];
}

class MainForm extends React.Component<{}, MainFormState> {
  state: MainFormState = {
    birthday: undefined,
    errorText: {
      birthday: 'Required',
      firstName: 'Required',
      lastName: 'Required',
      phone: 'Required',
    },
    firstName: '',
    index: 0,
    isValid: {
      birthday: false,
      firstName: false,
      lastName: false,
      phone: false,
    },
    lastName: '',
    log: [],
    phone: '',
    phoneList: [],
    submitted: false,
  };
  
  inputStyle = {
    display: 'inline-block',
    margin: '0.5rem',
    width: '120px',
    verticalAlign: 'top',
  };
  
  constructor(props: {}) {
    super(props);
    this.handleBirthday = this.handleBirthday.bind(this);
    this.handleValue = this.handleValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleLog = this.handleLog.bind(this);
  }
  
  public render() {
    const { submitted, errorText, isValid, phoneList, log } = this.state;
    return (
      <div>
        <form className="add-record-form">
          <input
            hidden
            value={this.state.index}
          />
          <TextField
            name="firstName"
            floatingLabelText="First Name"
            value={this.state.firstName}
            onChange={this.handleValue}
            errorText={submitted && isValid && !isValid.firstName && errorText && errorText.firstName}
            required={true}
            autoFocus={true}
            style={this.inputStyle}
          />
          <TextField
            name="lastName"
            floatingLabelText="Last Name"
            value={this.state.lastName}
            onChange={this.handleValue}
            errorText={submitted && isValid && !isValid.lastName && errorText && errorText.lastName}
            required={true}
            style={this.inputStyle}
          />
          <DatePicker
            name="birthday"
            floatingLabelText="Date of Birth"
            value={this.state.birthday}
            onChange={this.handleBirthday}
            errorText={submitted && isValid && !isValid.birthday && errorText && errorText.birthday}
            className="add-record-date"
            style={this.inputStyle}
          />
          <TextField
            name="phone"
            floatingLabelText="Phone Number"
            value={this.state.phone}
            onChange={this.handleValue}
            errorText={submitted && isValid && !isValid.phone && errorText && errorText.phone}
            required={true}
            style={this.inputStyle}
          />
          <RaisedButton
            label="Save"
            className="save-record-btn"
            onClick={this.handleSubmit}
            style={{...this.inputStyle, marginTop: '2.5rem'}}
          />
        </form>
        {phoneList && !!phoneList.length &&
          <PhoneList
            list={phoneList}
            editHandler={this.handleEdit}
            logHandler={this.handleLog}
          />
        }
        {log && !!log.length &&
          <Log
            list={log}
            logHandler={this.handleLog}
          />
        }
      </div>
    );
  }
  
  handleBirthday(event: null, date: Date) {
    const {isValid} = this.state;
    const name = 'birthday';
    if (isValid) {
      isValid[name] = !isEmpty(date.toString());
    }
    this.setState({
      isValid,
      birthday: date,
    });
  }
  
  handleValue(event: React.FormEvent<HTMLInputElement>) {
    const {isValid} = this.state;
    const value = (event.target as HTMLInputElement).value;
    const name = (event.target as HTMLInputElement).name;
    if (isValid) {
      switch (name) {
        case 'phone':
          isValid[name] = !isEmpty(value) && isMobilePhone(value, 'any');
          break;
        default:
          isValid[name] = !isEmpty(value);
          break;
      }
    }
    this.setState({
      isValid,
      [name]: (event.target as HTMLInputElement).value,
    });
  }
  
  handleSubmit() {
    const {isValid} = this.state;
    const formValid = isValid && isValid.birthday && isValid.firstName && isValid.lastName && isValid.phone;
    this.setState({
      submitted: true,
    });
    if (formValid) {
      this.setRecord();
    }
  }
  
  setRecord() {
    const index = this.state.index;
    const record = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthday: this.state.birthday,
      phone: this.state.phone,
    } as PhoneRecord;
    this.setState((prevState: MainFormState): MainFormState => {
      if (!index) {
        (prevState.phoneList as PhoneRecord[]).push(record);
      } else {
        (prevState.phoneList as PhoneRecord[])[index - 1] = record;
      }
      return {
        phoneList: prevState.phoneList,
        isValid: {
          firstName: false,
          lastName: false,
          birthday: false,
          phone: false,
        },
        submitted: false,
        firstName: '',
        lastName: '',
        birthday: undefined,
        phone: '',
        index: 0,
      };
    });
    this.handleLog(index ? 'save' : 'create', record);
  }
  
  handleEdit(phoneRecord: PhoneRecord) {
    this.setState({
      firstName: phoneRecord.firstName,
      lastName: phoneRecord.lastName,
      birthday: phoneRecord.birthday,
      phone: phoneRecord.phone,
      isValid: {
        firstName: !!phoneRecord.firstName,
        lastName: !!phoneRecord.lastName,
        birthday: !!phoneRecord.birthday,
        phone: !!phoneRecord.phone,
      },
      index: phoneRecord.index,
    });
  }
  
  handleLog(action: string, record: PhoneRecord) {
    const {log} = this.state;
    if (!log) {
      return;
    }
    log.push(`
      ${moment().format('YYYY MM DD hh:mm:ss')} -
      ${action} record
      '${record.firstName}
      ${record.lastName}
      ${moment(record.birthday).format('YYYY-MM-DD')}
      ${record.phone}'
    `);
    this.setState({log});
  }
}

export default MainForm;