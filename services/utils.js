// =========================================== //
//    returnParams(request) return[:id1,:id2]  //
// =========================================== //
//
// in the case of a url like /users/123/entries
// returns the first param 123
// in the case of an url like
// /users/123/entries/456
// returns an array with the two params [123, 456]
// returned value is a string, need to be
// parseInt if you want to use it as integer

const returnParams = (req) => {
  const URL = req.originalUrl.split("/");
  return URL[4] ? [URL[2], URL[4]] : [URL[2]];
};

module.exports = {
  returnParams,
};
