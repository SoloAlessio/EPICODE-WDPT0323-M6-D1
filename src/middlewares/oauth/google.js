import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import Author from "../../models/authors.js"

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackUrl: "http://localhost:5173/api/login/oauth-google",
    },
    async function (_, __, profile, cb) {
        console.log(profile)
        /* let user = Author.findOne({ googleId: profile.id })

        if (!user) {
            user = await Author.create({
                googleId: profile.id,
                name: profile.name,
                surname: profile.surname,
                email: profile.emails[0].value,
            })
        }
        cb(null, profile) */
    }
)

export default googleStrategy
