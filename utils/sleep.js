const sleep = async (t) => {
  await new Promise(res => setTimeout(res, t));
}

module.exports = sleep;