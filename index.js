import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";

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

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

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

////////////////STUDENT DASHBOARD////////////////////////////

app.get("/dashboard", async (req, res) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
        try {
            let student_id = await db.query(
                `SELECT id FROM Student WHERE email_id = $1`,
                [req.user.email]
            ).rows[0];

            const result = await db.query(
                `SELECT * FROM Job WHERE student_id = $1`,
                [student_id]
            );
            res.render("dashboard.ejs", {Jobs: result});
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect("/login");
    }
});

app.post("/dashboard", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Retrieve the student ID based on the logged-in user's email
            let student_id = await db.query(
                `SELECT id FROM Student WHERE email_id = $1`,
                [req.user.email]
            ).then(result => result.rows[0].id);

            const { title, prof_name, author, conference, status, link, date } = req.body;

            await db.query(
                `INSERT INTO Job (title, prof_name, author, conference, status, link, date, student_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [title, prof_name, author, conference, status, link, date, student_id]
            );

            // Redirect to the dashboard after successful insertion
            res.redirect("/dashboard");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});


///////////////MISC//////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
