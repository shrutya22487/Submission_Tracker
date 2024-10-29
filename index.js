import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import dashboardRouter from "./src/routes/dashboard.js";
import sampleRouter from "./src/routes/sampleboard.js";
import db from "./src/utils/db.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from "googleapis";
import GoogleAuthLibrary from "google-auth-library";

const OAuth2 = google.auth.OAuth2;

const app = express();
const port = 3000;
env.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure OAuth2 client for Gmail API
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/dashboard"
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(dashboardRouter);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/sampleboard", (req, res) => {
    res.render("sampleboard.ejs");
});

app.get("/login", (req, res) => {
    const error = req.query.error;
    if (error === "unauthorized_domain") {
        res.locals.message = "Registration is only allowed for users with a specific domain.";
        res.render("login.ejs");
    } else {
        res.render("login.ejs");
    }
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.readonly"],
    })
);

app.get(
    "/auth/google/dashboard",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login?error=unauthorized_domain",
    })
);

function isStudent(email) {
    const studentEmailPattern = /^[a-zA-Z]+[0-9]{5}@iiitd\.ac\.in$/;
    return studentEmailPattern.test(email);
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/dashboard",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const email = profile.email;
                let user = null;

                if (isStudent(email)) {
                    const studentResult = await db.query(
                        "SELECT * FROM Student WHERE email_id = $1",
                        [email]
                    );

                    if (studentResult.rows.length === 0) {
                        await db.query(
                            "INSERT INTO Student (Name, email_id) VALUES ($1, $2)",
                            [profile.displayName, email]
                        );
                        const newStudentResult = await db.query(
                            "SELECT * FROM Student WHERE email_id = $1",
                            [email]
                        );
                        user = newStudentResult.rows[0];
                    } else {
                        user = studentResult.rows[0];
                    }
                } else {
                    const professorResult = await db.query(
                        "SELECT * FROM Professor WHERE email_id = $1",
                        [email]
                    );

                    if (professorResult.rows.length === 0) {
                        await db.query(
                            "INSERT INTO Professor (Name, email_id) VALUES ($1, $2)",
                            [profile.displayName, email]
                        );
                        const newProfessorResult = await db.query(
                            "SELECT * FROM Professor WHERE email_id = $1",
                            [email]
                        );
                        user = newProfessorResult.rows[0];
                    } else {
                        user = professorResult.rows[0];
                    }
                }

                // Set credentials for OAuth2 client
                oauth2Client.setCredentials({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                // Store tokens and user info in session
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
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

export { oauth2Client };

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
