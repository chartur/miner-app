const express = require('express');
const path = require('path')
const port = process.env.PORT || 9100;
const app = express();

app.use(express.static(path.join(__dirname)))

app.get('*', (req, res) => {
  res.sendFile('index.html',{root: path.join(__dirname)})
});


app.listen(port, () => {
  console.log("Server is listening on port "+port);
});
