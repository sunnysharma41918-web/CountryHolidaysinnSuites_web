import validator from 'validator'

export const validateLogin = (req, res, next) => {
  const credential = req.body?.username || req.body?.email
  const { password } = req.body || {}

  const errors = []

  if (!credential || String(credential).trim().length === 0) {
    errors.push('Username is required')
  }

  if (!password || String(password).length < 4) {
    errors.push('Password is required and must be at least 4 characters')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  next()
}

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body || {}

  if (!email || !validator.isEmail(String(email).trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid registered email address',
    })
  }

  next()
}

export const validateResetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body || {}

  const errors = []

  if (!password || String(password).length < 8) {
    errors.push('New password must be at least 8 characters long')
  }

  if (password !== confirmPassword) {
    errors.push('Password and confirmation password do not match')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  next()
}
