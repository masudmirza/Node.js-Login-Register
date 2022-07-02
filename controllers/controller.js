require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const { client } = require('../database')


// Here we are configuring our SMTP Server details.
// STMP is mail server which is responsible for sending and recieving email.
let smtpTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.YOUR_EMAIL, // Your email address
    pass: process.env.YOUR_PASSWORD // Your password
  },
  tls: {
    rejectUnauthorized: false
  }
})

const addUser = async (req, res) => {
    try {
      const { name, email, password } = req.body
      const token  = jwt.sign({ name, email, password }, process.env.ACTIVATE_TOKEN_SECRET, { expiresIn: '20m' })

      // Mail details
      let mailOptions  = {
        from : process.env.YOUR_EMAIL, // Sender address (you)
        to: req.body.email, // Receiver address
        subject: 'Hello', // Subject line
        html: `
        <h2> Please click on given link to activate your account</h2>
        <p>${process.env.CLIENT_URL}/register/email-activate/${token}</p>
        `  // HTML body
      }

      // Send mail with defined transport object
      smtpTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
          res.status(401).render('register', {
            title: 'register',
            message: 'Something went wrong'
          })
        }
        console.log(info)
        res.status(201).send('Email verification has sended your email account, please check up your email address'); 
      })
    } catch (error) {
      console.log(error)
      res.redirect('register', {
        title: 'Register',
        message: 'Something went wrong'
      })
    }
  };

const activateAccount = (req, res) => {
  const token = req.params.token
  if (token) {
    jwt.verify(token, process.env.ACTIVATE_TOKEN_SECRET, async (err, decodedToken) => {
      if (err) console.log(err)
      try {
      const { name, email, password } = decodedToken
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await client.query(
      'INSERT INTO usersinfo (users_name,users_email,users_password) VALUES ($1,$2,$3) RETURNING *',
      [name,email, hashedPassword])
      return res.render('login', {
        title: 'login',
        message: 'You registered successfully'
      })
      } catch (err) {
      console.log(err);
      return res.render('register', {
        title: 'register',
        message: 'Email did not verify'
      })
     }
    })
  }
}


const loginUser =  async (req, res) => {
  try{
    const { email, password } = req.body;
    const users = await client.query('SELECT * FROM usersinfo WHERE users_email = $1', [email])
    if (!password || !email) {
      return res.render('login', {
        title: 'login',
        message: 'Please enter your email address and password'
      })
    }
    if (users.rows.length === 0){
      return res.render('login', {
        title: 'login',
        message: 'Email is incorrect'
      })
    }

    const validPassword = await bcrypt.compare(password, users.rows[0].users_password)
    if (!validPassword) {
      return res.render('login', {
        title: 'login',
        message: 'Password is incorrect'
      })
    }

    const accessToken =  jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 5 * 1000
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000
    })
    res.redirect('/dashboard')
  } catch (err) {
    if (err) console.log(err)
    return res.render('login', {
      title: 'login',
      message: 'Something went wrong'
    })
  }
}



const forgotPassword = (req, res) => {
  const { email } = req.body;
  const users = client.query('SELECT * FROM usersinfo WHERE users_email = $1', [email], (err, user) => {
    if (user.rows.length === 0){
      return res.render('forgot-password', {
        title: 'Forgot-password',
        message: 'This email does not exists'
      })
    }
    const token  = jwt.sign({ email }, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m' })

    // Mail details
    let mailOptions  = {
      from : process.env.YOUR_EMAIL, // Sender address
      to: req.body.email, // Receiver address
      subject: 'Hello', // Subject line
      html: `
      <h2> Please click on given link to reset your password</h2>
      <p>${process.env.CLIENT_URL}/login/reset-password/${token}</p>
      `  //HTML body
    }

    // Send mail with defined transport object
    smtpTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err)
        res.status(401).render('forgot-password', {
          title: 'Forgot-password',
          message: 'Something went wrong'
        })
      }
      console.log(info)
      res.status(201).send('Reset-password link has sended your email account, please check up your email account')
    })
  })
}

const resetPassword  = (req, res) => {
  const token  = req.params.token
  const newPassword = req.body.newPassword
  if (token) {
    jwt.verify(token, process.env.RESET_PASSWORD_KEY, async (err, decodedToken) => {
      try {
        const { email } = decodedToken
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newPass = await client.query(
        'UPDATE usersinfo SET users_password = $1 where users_email = $2',
        [hashedPassword, email])
        return res.render('login', {
          title: 'login',
          message: 'You reseted password successfully, please login'
        })
      } catch (err) {
        console.log(err);
        req.flash('error_message',)
        return res.render('forgot-password', {
        title: 'Forgot-password',
        message : 'Something went wrong'
        })
      }
    })
  }
}


const logoutUser = (req, res) => {
  res.cookie('refresh_token', '', { maxAge: 1 })
  res.redirect('/')
}


  module.exports = {
      addUser,
      activateAccount,
      loginUser,
      forgotPassword,
      resetPassword,
      logoutUser
  }

  