const { preprocessing, textfiltering } = require("../utils/textpreprocess");

// middleware to sanitize params
function sanitizeParams(req, res, next) {
  try {
    req.body = sanitizer(req.body);
    // if(req.body['isProfane']) return res.status(403).json({error: "Profanity is not tolerated."});
    next();
  }
  catch(err) {
    return res.status(404).json({error: `Error in sanitizing the input.`});
  }
}

function sanitizer(params) {
  if (!params) return params;
  let checkProfanity = false;
  for (const key in params) {
    if (typeof params[key] === "object") {
      params[key] = sanitizer(params[key]);
    } else if (typeof params[key] === "string") {
      params[key] = preprocessing(params[key]);
      if(textfiltering(params[key])) checkProfanity = true;
    }
  }
  params['isProfane'] = checkProfanity;

  return params;
}

module.exports = sanitizeParams;
