// Use frontend React components to build a single-page webapp
class App extends React.Component {
  render() {
    return (
      <div>
        Successfully rendered your homepage!
      </div>
    );
  }
}

ReactDOM.render(
 <App />,
 document.getElementById('app')
);
