const fs = require('fs');

function calculateAvg(user) {
  let ppAvg = {};

  const file = fs.readFileSync('ppCheck.log', function(err, data) {
    console.log(data);
  })

  const fileArr = file.toString().split(`\n`);
  fileArr.pop();

  for (let i = 0; i < fileArr.length; i++) {
    
    const cur = fileArr[i];
    const curArr = cur.split(' ');
    
    if (curArr[1] === user) {
      if (ppAvg[curArr[1]]) {
        ppAvg[curArr[1]].count++;
        ppAvg[curArr[1]].total += parseInt(curArr[3]);
      } else {
        let curObj = {
          total: parseInt(curArr[3]),
          count: 1
        }
  
        ppAvg[curArr[1]] = curObj;
      }
    }
  }
}