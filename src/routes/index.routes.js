const {Router} = require('express');
const router = Router();
const {QuickDB} = require('quick.db');
const db = new QuickDB();
require('dotenv').config();

router.get('/', (req, res) => {
  const { msg,type } = req.query;
  res.render('index', { alert: {type, msg} });
})

router.post('/submit', async (req, res) => {
  // Get post data
  const { username, verifyCode } = req.body;
  console.log(username, verifyCode);
  // Check username
  if (!username) {
    res.redirect('/?type=danger&msg=Username is required');
    return;
  }
  // Check code
  if (!verifyCode) {
    res.redirect('/?type=danger&msg=Code is required');
    return;
  }
  
  const code = await db.get(`code_${verifyCode}`) || null;
  // Search code in database
  // Check code
  if (!code) {
    res.redirect('/?type=danger&msg=Code is incorrect. Please copy exactly the code gived after the payment.');
    return;
  }
  
  // Send request to api
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer  ptlc_j13hk4G7r4cFyyVdY5XnL1prMepEOhqFF4R2FRs5llJ',
      Accept: 'application/json'
    },
    body: `{"command":"whitelist add ${username}"}`
  };
  
  fetch('https://thexhosting.com/api/client/servers/01944812/command', options)
    .then(response => {
      res.redirect('/?type=success&msg=Your account has been whitelisted.')
      db.delete(`code_${verifyCode}`);
    })
    .catch(err => res.redirect('/?type=danger&msg=Something went wrong while whitelisting your account.'));
})

router.post('/new-code', async (req, res) => {
  // Get post data
  const { authpass, code } = req.body;
  if(authpass != process.env.AUTH_PASS) {
    res.status(401).send('Unauthorized');
    return;
  }
  // Check code
  if (!code) {
    res.status(400).send('Code is required');
    return;
  }

  // Search code in database
  const code_db = await db.get(`code_${code}`) || null;
  // Check code
  if (code_db) {
    res.status(400).send('Code is already created.');
    return;
  }
  // Create code
  await db.set(`code_${code}`, code);
  res.status(200).send('Code created.');
})

module.exports = router;