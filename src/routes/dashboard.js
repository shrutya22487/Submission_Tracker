import { Router } from "express";
import db from "../utils/db.js";

const router = Router();
// TODO: 1. try n make better code for dashboard
// TODO: 4. make mapping for student and prof

//////////////// STUDENT DASHBOARD ////////////////////////////
function isStudent(email) {
    const studentEmailPattern = /^[a-zA-Z]+[0-9]{5}@iiitd\.ac\.in$/;
    return studentEmailPattern.test(email);
}

async function student_dashboard_get(req, res) {
    const studentResult = await db.query(
        `SELECT id FROM Student WHERE email_id = $1`,
        [req.user.email_id]
    );

    if (studentResult.rows.length === 0) {
        console.log("No student found with the given email.");
        return res.status(404).send("Student not found");
    }

    let student_id = studentResult.rows[0].id;

    const jobsResult = await db.query(
        `SELECT * FROM Job WHERE student_id = $1`,
        [student_id]
    );

    if (jobsResult.rows.length === 0) {
        console.log("No jobs found for the given student.");
        return res.render("dashboard.ejs", { Jobs: [] });
    }
    res.render("dashboard.ejs", { Jobs: jobsResult });
}

async function prof_dashboard_get(req, res) {
    res.locals.prof_flag = true;

    const prof_id = await db.query(
        `SELECT id FROM Professor WHERE email_id = $1`,
        [req.user.email_id]
    );
    // for search bar
    const searchQuery = req.query.search || '';

    try {
        const studentsUnderProf = await db.query(
            "SELECT Student.name, Student.email_id FROM Mapping JOIN Student ON Mapping.student_id = Student.id WHERE Mapping.prof_id = $1",
            [prof_id]
        );

        const studentsNotUnderProf = await db.query(
            "SELECT Student.id, Student.name, Student.email_id FROM Student WHERE Student.id NOT IN (SELECT Mapping.student_id FROM Mapping WHERE Mapping.prof_id = $1) AND Student.name ILIKE $2",
            [prof_id, `%${searchQuery}%`]
        );

        // TODO: Do error handling here
        res.render("prof_dashboard.ejs", {
            studentsUnderProf: studentsUnderProf,
            studentsNotUnderProf: studentsNotUnderProf,
            prof_id: prof_id,
        });
    } catch (err) {
        console.log(err);
        res.send("Error retrieving data");
    }
}

router.get("/dashboard", async (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        try {
            if (isStudent(req.user.email_id)) {
                await student_dashboard_get(req, res);
            }
            else
                await prof_dashboard_get(req, res);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

async function student_dashboard_post(req, res) {
    const studentResult = await db.query(
        `SELECT id FROM Student WHERE email_id = $1`,
        [req.user.email_id]
    );

    if (studentResult.rows.length === 0) {
        console.log("No student found with the given email.");
        return res.status(404).send("Student not found");
    }

    let student_id = studentResult.rows[0].id;

    const { title, prof_name, author, conference, status, link, date } = req.body;

    await db.query(
        `INSERT INTO Job (title, prof_name, author, conference, status, link, date, student_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [title, prof_name, author, conference, status, link, date, student_id]
    );

    res.redirect("/dashboard");

}

async function prof_dashboard_post(req, res) {
    res.locals.prof_flag = true;

    const { prof_id, student_id } = req.body;

    try {
        await db.query(
            "INSERT INTO Mapping (prof_id, student_id) VALUES ($1, $2)",
            [prof_id, student_id]
        );
        res.redirect(`/dashboard`);
    } catch (err) {
        console.log(err);
        res.send("Error adding student");
    }
}

router.post("/dashboard", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            if (isStudent(req.user.email_id)) {
                await student_dashboard_post(req, res);
            }
            else
                await prof_dashboard_post(req, res);

        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

export default router;
