function generateVotingID() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return "VOTE" + random;
}
module.exports = generateVotingID;
