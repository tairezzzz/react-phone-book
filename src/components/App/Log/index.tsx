import * as React from 'react';
import List, { ListItem } from 'material-ui/List';

interface LogProps {
  list: string[];
  logHandler: Function;
}
class Log extends React.Component<LogProps, {}> {
  render() {
    return (
      <List style={{textAlign: 'left'}}>
        {this.props.list && this.props.list.map((logRecord: string, i: number) =>
          <ListItem
            key={i}
            primaryText={logRecord}
          />
        )}
      </List>
    );
  }
  
}

export default Log;