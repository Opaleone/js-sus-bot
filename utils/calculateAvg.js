const fs = require('fs');

let ppAvg = {};

const file = fs.readFileSync('ppCheck.log', function(err, data) {
  console.log(data);
})

const fileArr = file.toString().split(`\n`);
fileArr.pop();

for (let i = 0; i < fileArr.length; i++) {
  const cur = fileArr[i];
  const curArr = cur.split(' ');

  let curObj = {
    total: parseInt(curArr[3]),
    count: 1
  }

  if (ppAvg[curArr[1]]) {
    ppAvg[curArr[1]].count++;
    ppAvg[curArr[1]].total += parseInt(curArr[3]);
  } else {
    ppAvg[curArr[1]] = curObj;
  }
}

module.exports = ppAvg;