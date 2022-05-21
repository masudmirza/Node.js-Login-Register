const validateRegister = (req, res, next) => {
  const name =  req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!name || !email || !password || !confirmPassword) {
    return res.render('register',
      { message: "Please enter all fields",
      title: "register"});
  }
        
  if (password.length < 8) {
    return res.render('register',
      { message: "Password must be a least 8 characters long",
      title: "register" });
  }
        
  if (password !== confirmPassword) {
    return res.render('register',
      { message: "Passwords do not match",
      title: "register" });
  }
  next();
}

const validatePassword = (req, res, next) => {
  const password = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (!password || !confirmPassword) {
    return res.render('reset-password',
      { message: "Please enter all fields",
      title: "Reset-password"});
  }
      
  if (password.length < 8) {
    return res.render('reset-password',
      { message: "Password must be a least 8 characters long",
      title: "Reset-password" });
  }
      
  if (password !== confirmPassword) {
    return res.render('reset-password',
      { message: "Passwords do not match",
      title: "Reset-password" });
  }
  
  next();

}

module.exports = {
  validateRegister,
  validatePassword
};