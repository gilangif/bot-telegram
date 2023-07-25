require("dotenv").config()


const { account, config, timestamp, oyen, send } = require("./telegraf")
const { shopee, checkShopee } = require("./shopee");
const { youtube } = require("./youtube");

oyen.command('test', (ctx) => {
  console.log(`New command (test) (${timestamp()})\n\n`);
  send("Miaw miaw it's Works!")
});


oyen.command('description', (ctx) => {
  console.log(`New command (decription) (${timestamp()})\n\n`);
  youtube("decription", ctx.message.text)
});


oyen.command('comment', (ctx) => {
  console.log(`New command (comment) (${timestamp()})\n\n`);
  youtube("comment", ctx.message.text)
});


oyen.command('shopee', (ctx) => {
  console.log(`New command (shopee) (${timestamp()})\n\n`);
  checkShopee("status")
});

oyen.command('config', (ctx) => {
  console.log(`New command (config) (${timestamp()})\n\n`);
  config()
});

oyen.command('account', (ctx) => {
  console.log(`New command (account) (${timestamp()})\n\n`);
  account()
});

oyen.command('list', (ctx) => {
  console.log(`New command (list) (${timestamp()})\n\n`);
  send("- shopee\ncek data shoppe tanam\n\n- comment\nambil url dana yang ada di komentar youtube dengan target sesuai config\n\n- description\nambil url dana yang ada di deskripsi youtube\n\n- config\nlihat data config\n\n- account\nlihat data akun terdaftar (jangan dipublish ya datanya)")
});



oyen.launch()
shopee()