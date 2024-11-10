import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import dashboardRouter from "./src/routes/dashboard.js";
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

app.get("/login", (req, res) => {
    const error = req.query.error;
    if (error === "unauthorized_domain") {
        res.locals.message = "Registration is only allowed for users with a specific domain.";
        res.render("login.ejs");
    }
    else if(req.query.message === 'registration_successful'){
        res.locals.message = "Successfully registered as a student, kindly login again";
        res.render("login.ejs");
    }
    else {
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
    (req, res, next) => {
        passport.authenticate("google", (err, user, info) => {
            if (err) {
                return next(err); // Handle unexpected errors
            }
            const message = info && info.message;

            // Take action based on the message value
            if (message === "unauthorized_domain") {
                return res.redirect("/login?error=unauthorized_domain");
            }
            if (message === "prompt_register") {
                // Store user data in the session if it's needed for registration
                req.session.user = user; // Store user in session explicitly
                return res.redirect("/register?message=not_registered");
            }

            // Successful authentication
            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.redirect("/dashboard");
            });
        })(req, res, next);
    }
);


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
                // const domain = email.split("@")[1]; // Extract the domain from the email
                //
                // if (domain !== "iiitd.ac.in") {
                //     return cb(null, false, { message: "unauthorized_domain" });
                // }

                let user = {};

                // Check if the email belongs to a professor
                const professorResult = await db.query(
                    "SELECT * FROM Professor WHERE email_id = $1",
                    [email]
                );

                if (professorResult.rows.length > 0) {
                    user = professorResult.rows[0];
                    user.student = false; // Set new field indicating the user is not a student
                }
                else {
                    user.student = true; // Set new field indicating the user is a student

                    // Check if the email belongs to a student
                    const studentResult = await db.query(
                        "SELECT * FROM Student WHERE email_id = $1",
                        [email]
                    );

                    if (studentResult.rows.length > 0) {
                        user = studentResult.rows[0];
                        user.student = true; // Set new field indicating the user is a student

                    } else {
                        user.email_id = profile.email;
                        user.name = profile.displayName;

                        // Redirect to register page if email is not found in either table
                        return cb(null, user, { message: "prompt_register" });
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

// Define the /register route to handle student registration
app.get("/register", (req, res) => {
    const user = req.session.user; // Retrieve user from session
    if (!user) {
        return res.redirect("/login?error=not_authenticated"); // Handle case if no user is found in session
    }

    res.render("register.ejs", {
        user: {
            displayName: user.name,
            email: user.email_id || user.email, // Make sure to access the correct field
        },
        error: req.query.error,
    });
});

app.post("/register", async (req, res) => {
    const { name, email, type } = req.body;

    try {
        // Insert new student into the Student table
        await db.query(
            "INSERT INTO Student (Name, email_id, type) VALUES ($1, $2, $3)",
            [name, email, type]
        );

        // Clear the user data from session after registration
        delete req.session.user; // Remove user info from session

        // Redirect to login page to log in with the new registration
        res.redirect("/login?message=registration_successful");
    } catch (err) {
        console.error("Error registering user:", err);
        res.redirect("/register?error=registration_failed");
    }
});


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
