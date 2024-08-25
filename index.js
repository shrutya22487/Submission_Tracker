import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import dashboardRouter from "./src/routes/dashboard.js";
import db from "./src/utils/db.js";

const app = express();
const port = 3000;
env.config();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());


app.use(dashboardRouter);

///////////////Google Oauth////////////////////////////////////

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    const error = req.query.error;
    if (error === "unauthorized_domain") {
        res.render("login.ejs", { message: "Registration is only allowed for users with a specific domain." });
    } else {
        res.render("login.ejs");
    }
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile","email"],
    })
);

app.get(
    "/auth/google/dashboard",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login?error=unauthorized_domain",
    })
);
app.post(
    "/auth/google/dashboard",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/dashboard",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const email = profile.email;
                const domain = email.split("@")[1]; // Extract the domain from the email

                if (domain !== "iiitd.ac.in") {
                    return cb(null, false, { message: "Kindly login with IIITD Email-ID" });
                }

                const studentEmailPattern = /^[a-zA-Z]+[0-9]{5}@iiitd\.ac\.in$/;
                const isStudent = studentEmailPattern.test(email);

                const user = null;

                if (isStudent) {
                    const studentResult = await db.query(
                        "SELECT * FROM Student WHERE email_id = $1",
                        [email]
                    );

                    if (studentResult.rows.length === 0) {
                        // Insert into 'Student' table
                        await db.query(
                            "INSERT INTO Student (Name,email_id) VALUES ($1, $2)",
                            [profile.displayName,email]
                        );
                    }

                    const user = await db.query(
                        "SELECT * FROM Student WHERE email_id = $1",
                        [email]
                    ).rows[0];
                } else {
                    // Check if user exists in 'Professor' table
                    const professorResult = await db.query(
                        "SELECT * FROM Professor WHERE email_id = $1",
                        [email]
                    );

                    if (professorResult.rows.length === 0) {
                        // Insert into 'Professor' table
                        await db.query(
                            "INSERT INTO Professor (Name, email_id) VALUES ($1)",
                            [profile.displayName,email]
                        );
                    }
                    const user = await db.query(
                        "SELECT * FROM Professor WHERE email_id = $1",
                        [email]
                    ).rows[0];
                }

                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    )
);
passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

///////////////MISC//////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
