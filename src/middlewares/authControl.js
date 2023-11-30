export const checkAuth = (req, res, next) => {
  if (req.headers.authorization === process.env.DB_KEY) {
    next();
  } else {
    // res.status(401).json({
    //   error: "password sbagliata",
    // });
    const error = new Error("Non autorizzato");
    error.statusCode = 401;
    
    next(error);
  }
};
