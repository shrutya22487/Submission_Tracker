import {Router} from "express";
import {router} from "express/lib/application.js";
import db from "../utils/db.js";

const router = Router();

//TODO: 1. Make proper routes for HTML for student and prof dashboard
//TODO: 2. make distinction for the above as well
// TODO: 3. find a way to make distinct screens for prof n student
// TODO: 4. make mapping for student and prof

////////////////STUDENT DASHBOARD////////////////////////////

router.get("/dashboard", async (req, res) => {
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

router.post("/dashboard", async (req, res) => {
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

export default router;