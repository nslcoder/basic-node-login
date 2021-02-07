const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./models/User");

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: "email"
    }, 
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if(err) { return done(err); }
            if(!user) { return done(null, false, { message: "Email isn't registered."}); }

            bcrypt.compare(password, user.password, (err, result) => {
                if(err) throw err;

                if(result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Authentication failed."});
                }
            })
        })
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
};