export const checkAuth = (req, res, next) => {
  if (req.headers.authorization === "password molto sicura") {
    next();
  } else {
    // res.status(401).json({
    //   error: "password sbagliata",
    // });
    const error = new Error("password sbagliata");
    error.statusCode = 401;
    
    next(error);
  }
};
