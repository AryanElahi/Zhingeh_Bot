const express = require('express');
const {sendSms, registerUser} = require('./Services');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working');
});
app.post('/send', async (req, res) => {
  const user = registerUser(req.body.name , req.body.phone, req.body.birthday)
  const send = sendSms(req.body.phone)
  res.send("Done!")
})


app.listen(port, () => {
  console.log(`سرور در پورت ${port} در حال اجراست`);
});
