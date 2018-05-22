var firebase = require("firebase");
const Discord = require('discord.js'); //เรียก discord.js มาใช้
const botRem = new Discord.Client(); //ประกาศ client ขึ้นมา
var firebase = require("firebase");
var moment = require('moment-timezone');

var config = {
  apiKey: "AIzaSyA4YuIZcLZSTuas1NqN_kqmQsDxcK1L4Ow",
  authDomain: "bdo-boss-37a69.firebaseapp.com",
  databaseURL: "https://bdo-boss-37a69.firebaseio.com",
  projectId: "bdo-boss-37a69",
  storageBucket: "bdo-boss-37a69.appspot.com",
  messagingSenderId: "727772781196"
};
firebase.initializeApp(config);

var database = firebase.database();

var gsbotUserName = [];
var gsbotcommand = ['!gsbot help','!gsbot gs']
var rootRef;

//event นี้ทำงานเมื่อ login สำเร็จ
botRem.on('ready', () => {
    console.log('gsbot ready!');
    rootRef = firebase.database().ref('bot-gsbot');
    rootRef.once("value", function(snapshot) {
      snapshot.forEach(function(data) {
        gsbotUserName.push(data.key);
      });
    });
});

function findclan(name){
  for (var a in gsbotUserName){
    if(gsbotUserName[a] === name) return true;
  }
  return false;
}

//รอรับ event message เวลามีข้อความโผล่มาในแชท function นี้ก็จะทำงาน
botRem.on('message', message => { 
    var command = message.content.replace(/\s\s+/g, ' ');
    if(command === '!gsbot help'){
      var reply = 
      'ชุดคำสั่งทั้งหมดของ gsbot (ช่องว่างคือ เว้นวรรค 1 ครั้ง)\n\n'+
      'เรียกดูคำสั่งทั้งหมด\n'+
      '    พิมพ์ !gsbot help\n\n'+
      'เพิ่มรายชื่อลง gsbot\n'+
      '    พิมพ์    !gsbot add player (ชื่อเล่น) (ตระกูล) (อาชีพ)\n'+
      '    ตัวอย่าง !gsbot add player บอส Odiz ซอเซอร์เรส\n\n'+
      'บันทึก พลังโจมตี พลังโจมตีอเวก พลังป้องกัน (ตัวหลัก) ลง gsbot\n'+
      '    พิมพ์    !gsbot add gs (ตระกูล) (ap) (aap) (dp)\n'+
      '    ตัวอย่าง !gsbot add gs Odiz 192 171 267\n\n'+
      'บันทึก gear item (ตัวหลัก) ลง gsbot\n'+
      '    พิมพ์    !gsbot add gear (ตระกูล) (ชิ้นส่วน) (ไอเทม) (ขั้นตีบวก)\n'+
      '    ตัวอย่าง !gsbot add gear Odiz หมวก กลูนิล 17\n'+
      '    (ชิ้นส่วนมีดังนี้ เสื้อ, มือ, หมวก, เท้า, สร้อย, เข็มขัด, หู1, หู2, แหวน1, แหวน2, วุธหลัก, วุธรอง, วุธอเวก)\n\n'+
      'เรียกดูชื่อตระกูลของผู้เล่นทั้งหมดที่อยู่ในระบบ\n'+
      '    พิมพ์    !gsbot playerlist\n'+
      'เรียกดู พลังโจมตี พลังโจมตีอเวก พลังป้องกัน (ตัวหลัก)\n'+
      '    พิมพ์    !gsbot gs (ตระกูล)\n'+
      '    ตัวอย่าง !gsbot gs Odiz\n\n'+
      'เรียกดูไอเท็มที่ใส่ทั้งหมด (ตัวหลัก)\n'+
      '    พิมพ์    !gsbot gear (ตระกูล)\n'+
      '    ตัวอย่าง !gsbot gear Odiz\n\n'+
      'ขอบคุณสำหรับการใช้งาน gsbot\n'+
      'แจ้งบัคได้ที่ bossodiz (หัวกิลด์ KAPOOCLUB)';
      message.reply("\n"+reply);
    }

    else if(command.substring(0,17) === '!gsbot add player'){
      var valuetext = command.substring(18,command.length).split(' ');
      var gsname = valuetext[1];
      var classname = valuetext[2];
      var nickname = valuetext[0];
      if (findclan(gsname)){
        message.reply(gsname+' มีอยู่ในระบบแล้ว');
      }else{
        rootRef.child(gsname).child('ap').set(0);
        rootRef.child(gsname).child('aap').set(0);
        rootRef.child(gsname).child('dp').set(0)
        rootRef.child(gsname).child('clan').set(gsname);
        rootRef.child(gsname).child('classname').set(classname);
        rootRef.child(gsname).child('warnode').set(0);
        rootRef.child(gsname).child('nickname').set(nickname);
        rootRef.child(gsname).child('gear').child('มือ').set(' ');
        rootRef.child(gsname).child('gear').child('สร้อย').set(' ');
        rootRef.child(gsname).child('gear').child('หมวก').set(' ');
        rootRef.child(gsname).child('gear').child('หู1').set(' ');
        rootRef.child(gsname).child('gear').child('หู2').set(' ');
        rootRef.child(gsname).child('gear').child('เข็มขัด').set(' ');
        rootRef.child(gsname).child('gear').child('เท้า').set(' ');
        rootRef.child(gsname).child('gear').child('เสื้อ').set(' ');
        rootRef.child(gsname).child('gear').child('แหวน1').set(' ');
        rootRef.child(gsname).child('gear').child('แหวน2').set(' ');
        rootRef.child(gsname).child('gear').child('วุธหลัก').set(' ');
        rootRef.child(gsname).child('gear').child('วุธรอง').set(' ');
        rootRef.child(gsname).child('gear').child('วุธอเวก').set(' ');
        message.reply('Add '+gsname+' to gsbot.');
      }
    }

    else if(command.substring(0,13) === '!gsbot add gs'){
      var valuetext = command.substring(14,command.length).split(" ");
      var gsname = valuetext[0];
      var ap = valuetext[1];
      var aap = valuetext[2];
      var dp = valuetext[3];
      rootRef.child(gsname).child('ap').set(ap);
      rootRef.child(gsname).child('aap').set(aap);
      rootRef.child(gsname).child('dp').set(dp);
      message.reply(gsname+' is Record.');
    }

    else if(command.substring(0,15) === '!gsbot add gear'){
      var valuetext = command.substring(16,command.length).split(" ");
      var gsname =  valuetext[0];
      var part =  valuetext[1];
      var item =  valuetext[2];
      var enchant =  valuetext[3];
      var parts = ['มือ','สร้อย','หมวก','หู1','หู2','เข็มขัด','เท้า','เสื้อ','แหวน1','แหวน2','วุธหลัก','วุธรอง','วุธอเวก'];
      var boo = false;
      for (var a in parts){
        if(parts[a] === part){
          boo = true;
          rootRef.child(gsname).child('gear').child(part).set(item+'+'+enchant);
          message.reply(gsname+' add '+part+' '+item+'+'+enchant);
        }
      }
      if(!boo){
        message.reply(gsname+' ใส่ชิ้นส่วนไม่ถูกต้อง (ชิ้นส่วนมีดังนี้ เสื้อ, มือ, หมวก, เท้า, สร้อย, เข็มขัด, หู1, หู2, แหวน1, แหวน2, วุธหลัก, วุธรอง, วุธอเวก)');
      }
    }

    else if (command === '!gsbot playerlist') {
      var reply = 'Player List\n';
      for (var a in gsbotUserName){
        reply += '- '+gsbotUserName[a]+'\n';
      }
      message.reply("\n"+reply);
    }

    else if (command.substring(0,9) === '!gsbot gs') {
      var gsname = command.substring(10,command.length);
      if (findclan(gsname)){
        var bdogs = firebase.database().ref('bot-gsbot/'+gsname);
        bdogs.once('value',function(snapshot){
          var ap = snapshot.val().ap;
          var aap = snapshot.val().aap;
          var dp = snapshot.val().dp;
          var score = ((ap+aap)/2)+dp;
          var reply = 
          'ตระกูล '+gsname+'\n'+
          'พลังโจมตี\t: '+ap+'\n'+
          'พลังโจมตีอเวก\t: '+aap+'\n'+
          'พลังป้องกัน\t: '+dp +'\n'+
          'คะแนนรวม\t: '+score;
          message.reply("\n"+reply);
        });
      }else{
        notdata(message,gsname);
      }
    }else if(command.substring(0,11) === '!gsbot gear'){
      var gsname = command.substring(12,command.length);
      if (findclan(gsname)){
        var bdogs = firebase.database().ref('bot-gsbot/'+gsname+'/gear');
        bdogs.once('value',function(snapshot){
          var gear = snapshot.val();
          var reply = 
          'หมวก : '+gear.หมวก+'\n'+
          'เสื้อ : '+gear.เสื้อ+'\n'+
          'ถุงมือ : '+gear.มือ+'\n'+
          'รองเท้า : '+gear.เท้า+'\n'+
          'ต่างหู : '+gear.หู1+'\n'+
          'ต่างหู : '+gear.หู2+'\n'+
          'แหวน : '+gear.แหวน1+'\n'+
          'แหวน : '+gear.แหวน2+'\n'+
          'สร้อย : '+gear.สร้อย+'\n'+
          'เข็มขัด : '+gear.เข็มขัด+'\n'+
          'อาวุธหลัก : '+gear.วุธหลัก+'\n'+
          'อาวุธรอง : '+gear.วุธรอง+'\n'+
          'อาวุธอเวก : '+gear.วุธอเวก;
          message.reply('\n'+reply);
        });
      }else{
        notdata(message,gsname);
      }
    }
    
});

function notdata(message,gsname){
   message.reply('ตระกูล '+gsname + ' ไม่มีข้อมูลในระบบ gsbot');
}

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

botRem.login('NDQ2NzQwMDIyMzYwNjcwMjM4.Dd9chw.VTP09KMXAS08-wFYF2Za2Yuw9q4');