import passport from "passport";
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy
import bcrypt from 'bcryptjs'
import db from '../models/index.cjs'
const User = db.User;

export default (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({where: {email}})
      .then(user => {
        if(!user){
          return done(null, false, {message: 'That email is not registered!'})
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if(!isMatch){
            return done(null, false, {message: 'Email or Password incorrect.'})
          }
          return done(null, user)
        })
      })
      .catch(error => done(error, false))
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(error => done(error, null))
  })
}