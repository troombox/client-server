let express = require('express');
let port = process.env.PORT || 3000;
let app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/login.html');
});

app.listen(port, () => {
	console.log('App listening on port %d!', port);
});
