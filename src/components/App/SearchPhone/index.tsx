
import * as React from 'react';
import TextField from 'material-ui/TextField';

interface SearchPhoneProps {
  searchHandler: Function;
}

class SearchPhone extends React.Component<SearchPhoneProps, {}> {
  constructor(props: SearchPhoneProps) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }
  
  render() {
    return (
      <TextField
        name="search"
        floatingLabelText="Search"
        onChange={this.handleSearch}
        style={{
          margin: '0.5rem',
          width: '100%',
        }}
      />
    );
  }
  
  handleSearch(event: React.FormEvent<HTMLInputElement>) {
    const searchString = new RegExp((event.target as HTMLInputElement).value, 'i');
    this.props.searchHandler(searchString);
  }
  
}

export default SearchPhone;