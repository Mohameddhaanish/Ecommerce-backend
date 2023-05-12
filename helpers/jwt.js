const { expressjwt: Dhaanish } = require("express-jwt");

function authjwt() {
  const secret = process.env.SECRET_KEY;
  return Dhaanish({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      //USING REGULAR EXPRESSION
      { url: /\public\/\uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\api\/category(.*)/, methods: ["GET", "OPTIONS"] },
      { url: "/api/user/login" },
      { url: "/api/user/register" },
    ],
  });
}
async function isRevoked(req, token) {
  console.log("Token : ", token);
  if (!token.payload.isAdmin) {
    return true;
  }
}
module.exports = authjwt();
