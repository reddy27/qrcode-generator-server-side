const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');

const app = express();

app.use( express.static('qrcodes'));

const generateQR = async (qrcode) => {
    let gotQRcode;

    try {
        gotQRcode =  await QRCode.toDataURL(qrcode);
    } catch (err) {
        console.error(err);
    }
    return gotQRcode
};


app.get('/generate-qrcode/', async (req, res, next) => {

    const { qrcode } = req.query;
    const QRResponse = await generateQR(qrcode);
    const QRimage  = `${qrcode}.png`;

    // To store image.
    let base64Image = QRResponse.split(';base64,').pop();

    fs.writeFile(`./qrcodes/${QRimage}`, base64Image, {encoding: 'base64'}, (err) => {
        if(err) {
            console.log(err)
        }else{
            console.log(`QRcode created for ${qrcode}`);
        }
    });

    res.send(`<img alt="qrcode" src=${QRResponse}>`)
    res.end()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

app.listen(3000);