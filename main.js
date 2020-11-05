const wa = require('@open-wa/wa-automate');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const winston = require("winston");
 
const serverOption = {
	headless: true,
	qrTimeout: 40,
	authTimeout: 40,
	autoRefresh: true,
	qrRefreshS: 15,
	devtools: false,
	cacheEnabled: false,
	chromiumArgs: [
	  '--no-sandbox',
	  '--disable-setuid-sandbox'
	]
  }
  
  const opsys = process.platform;
  if (opsys == "win32" || opsys == "win64") {
	serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  } else if (opsys == "linux") {
	serverOption['browserRevision'] = '737027';
  } else if (opsys == "darwin") {
	serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}
  
wa.create(serverOption).then(async client => await start(client))
.catch(e => {
  console.log('Error', e.message);
});

const PORT = process.env.PORT;

const start = async (client) => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.get("/", (req, res) => res.send("Hello"));
  app.post("/kirim-pesan", (req, res) => {
    client.sendText(req.body.no_hp + "@c.us", req.body.pesan);
    //send images
    // client.sendImage(req.body.no_hp + '@c.us', req.body.gambar);
    //send video / foto
    // client.sendFileFromUrl(req.body.no_hp + '@c.us','https://i.giphy.com/media/oYtVHSxngR3lC/200w.mp4','nama_file');
    // send file pdf /doc
    // client.sendFile(
    //     req.body.no_hp + "@c.us",
    //     "https://www.lyfemarketing.com/blog/wp-content/uploads/2017/12/Digital-Marketing-Strategy-eBook.pdf",
    //     "nama_file"
    //   );
    // client.sendYoutubeLink(req.body.no_hp + '@c.us','https://www.youtube.com/watch?v=_bSB6Ed2Fnk','Ytube');
    res.send(["berhasil"]);
  });

  // app.listen(4000, () => console.log('listenig on localhost:4000'));
  const port = 4000 || 3753;
  app.listen(port, () => winston.info(`Listening on port ${port}...`));
  client.onMessage((message) => {
    wa.msgHandler(client, message, mqttClient);
  });
}
 

