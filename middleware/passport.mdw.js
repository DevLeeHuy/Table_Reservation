const passport = require('passport');
// const passportFB = require('passport-facebook').Strategy;
// const config = require("../config/config.json");
// const userController = require('../controllers/user.controller');
module.exports = {
    configure: (app) => {
        app.use(passport.initialize());
        app.use(passport.session());

    },
    // fbAuthenticate: () => {
    //     console.log("in1");
    //     passport.authenticate('facebook', { scope: ['email'] }); 
    //     passport.use(new passportFB(config.fbApp),
    //     function (accessToken, refreshToken, profile, cb) {
    //         console.log(profile);
    //     }
    // );
    // },
    // fbAuthenticateCB: (req,res,next) => {
    //     console.log("in2");
    //     passport.authenticate('facebook', {
    //         failureRedirect: '/login', successRedirect: '/'
        // });
        // passport.use(new passportFB(config.fbApp),
        //     function (accessToken, refreshToken, profile, cb) {
        //         console.log(profile);
        //     }
        // );
        // passport.serializeUser((username, done) => {
        //     done(null, user.id);
        // });
        // passport.deserializeUser((username, done) => {
        //     userController.findUser(username)
        // })

    // }
}
