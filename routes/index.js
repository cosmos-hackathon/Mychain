var express = require('express');
var router = express.Router();
var spawn = require('child_process').spawn;
const exec = require('child_process').exec;

function getBalance(name) {
  return new Promise(res => {
      exec(`nscli query account $(nscli keys show ${name} -a) | grep amount`, (err, stdout) => {
          const result = stdout.split('"');
          const balance = result[3];
          
          return res({'name': name, 'balance': balance});
      });
  });
}

async function getBalance2(){
  const result1 = await getBalance('jack');
  const result2 = await getBalance('alice');

  return [result1, result2]
}


/* GET home page. */
router.post('/pay', (req, res, next)  => {
  const name = req.body['name'];
  const name_arr = {'jack': 'alice', "alice": 'jack'}
  const new_namne = name_arr[name]
  
  // const name_arr2 = ['alice', 'jack']
  // const new_namne2 = name_arr2[~~(name != 'jack')]
  
  child = spawn('nscli', ['tx', 'nameservice', 'buy-name', 'mac', '200nametoken', '-y', '--from', new_namne])
  
  child.stdin.write("ghksdl77\n");
  
  child.on('exit', async () => {
    console.log('exit');

    return res.send({'users': await getBalance2()});
  })
});

module.exports = router;
