var React = require('react');

class TestReactVsEJS extends React.Component {
	render() {
		const fullHeightStyle = {
			height: '100%'
		};
		return (
      <html style={fullHeightStyle}>
        <head>
        </head>
        <body>
            I am the test page using react
        </body>
      </html>
    );
  }
}

module.exports = TestReactVsEJS;
