// Uses express-react-views to render html on the server
var React = require('react');

class TestReact extends React.Component {
	render() {
		const fullHeightStyle = {
			height: '100%'
		};
		return (
      <html style={fullHeightStyle}>
				<head>
					<meta charSet="UTF-8" />
					<title>Hello World</title>
          <link rel='shortcut icon' href='/public/favicon.ico' type='image/x-icon' />
          <link rel="stylesheet" href="/public/css/styles.css" />
					<script src="/public/js/client.js"></script>

					{/* JQuery */}
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

					{/* React */}
					<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
					<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

					{/* Don't use this in production: */}
					<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
				</head>
				<body style={fullHeightStyle}>
          <div id="app" style={fullHeightStyle}></div>
          <script type="text/babel" src="/public/js/components/login.jsx"></script>
          <script type="text/babel" src="/public/js/components/app.jsx"></script>
          {/**
            Note: this page is a great way to try React but it's not suitable for production.
            It slowly compiles JSX with Babel in the browser and uses a large development build of React.

            Read this section for a production-ready setup with JSX:
            http://reactjs.org/docs/add-react-to-a-website.html#add-jsx-to-a-project

            In a larger project, you can use an integrated toolchain that includes JSX instead:
            http://reactjs.org/docs/create-a-new-react-app.html

            You can also use React without JSX, in which case you can remove Babel:
            https://reactjs.org/docs/react-without-jsx.html
          */}
        </body>
      </html>
			);
	}
}

module.exports = TestReact;
