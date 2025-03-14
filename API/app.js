const express = require('express');
const app = express();
const port = 3001;
//const phone = req.phone
const {Token,Message} = require('sms-ir')
const token = new Token();
const message = new Message();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working');
});
app.get('/send', async (req, res) => {
    const tokenResult = await token.get('f39b005ce36d425bc915005c', 'it66)%#Zhinga@*&') // don't forget to write await
    const messageResult = await message.send(tokenResult, [9185326583], ['به ژینگه خوش آمدید'], '30002128054665') // don't forget to write await
    res.send(messageResult)
} )


app.listen(port, () => {
  console.log(`سرور در پورت ${port} در حال اجراست`);
});
