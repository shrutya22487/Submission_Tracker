import { Router } from "express";
import db from "../utils/db.js";
const router = Router();

router.get('/student_dashboard', async (req, res) => {
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
        return res.render("student_dashboard.ejs", { Jobs: [] });
    }
    res.render("student_dashboard.ejs", { Jobs: jobsResult });

});

router.post('/student_dashboard', async (req, res) => {
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

    res.redirect("/student_dashboard");

});

router.post('/delete_job/:id', async (req, res) => {
    const jobId = req.params.id;

    try {
        await db.query(
            `DELETE FROM job WHERE id = $1`,
            [jobId]
        );
        res.redirect("/student_dashboard");
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).send("Server error");
    }
});


export default router;
