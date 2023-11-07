const sleep = async (t) => {
  const randomMs = Math.floor(Math.random() * t)
  await new Promise(res => setTimeout(res, randomMs));
}

module.exports = sleep;