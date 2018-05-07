import Paper from 'material-ui/Paper';
import * as React from 'react';
import MainForm from './MainForm';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Phonebook</h1>
        </header>
        <Paper zDepth={3} className="main">
          <MainForm />
        </Paper>
      </div>
    );
  }
}

export default App;
