//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;


const Discord = require('discord.js'); //เรียก discord.js มาใช้
const botRem = new Discord.Client(); //ประกาศ client ขึ้นมา

//คูดาวน์ 8 ชม.
var loopStart = 28800000;
var loopEnd   = 43200000;

var moment = require('moment-timezone');
moment().tz("Asia/Bangkok").format();

var kzarkaDead;
var kzarkarRespawnStart;
var kzarkarRespawnEnd;

//event นี้ทำงานเมื่อ login สำเร็จ
botRem.on('ready', () => {
    console.log('Kzarka ready!');
});
//รอรับ event message เวลามีข้อความโผล่มาในแชท function นี้ก็จะทำงาน
botRem.on('message', message => { 
    if (message.content === 'คจา') {
        message.reply('คจาจะเกิดเวลา '+convertTime(kzarkarRespawnStart)+' น. - ' +  convertTime(kzarkarRespawnEnd) + ' น.'  );
    }else if(message.content === 'คจาตาย'){
        kzarkaDead = new Date(moment.now());
        kzarkarRespawnStart = new Date(moment.now()+loopStart);
        kzarkarRespawnEnd = new Date(moment.now()+loopEnd);
        message.reply('รีเซ็ตลูปเกิด คจาตายเวลา '+convertTime(kzarkaDead)+ ' น.');
    };
});


function convertTime(vardate){
    var hour;
    var minute;
    
    if (vardate.getHours().toString().length == 1){
        hour = '0'+vardate.getHours().toString();
    }else{
        hour = vardate.getHours().toString();
    }

    if (vardate.getMinutes().toString().length == 1){
        minute = '0'+vardate.getMinutes().toString();
    }else{
        minute = vardate.getMinutes().toString();
    }

    return hour+':'+minute;
}



botRem.login('NDQ1NjgxMjg2OTI2MDQxMTE2.Ddu_Eg.HKqcjmXZbGAjppC1Ss3EUEf0oCA');


