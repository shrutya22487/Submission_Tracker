import express from 'express';
import { Router } from "express";
import db from "../utils/db.js";
const router = Router();
import bodyParser from "body-parser";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get('/prof_dashboard', async (req, res) => {
    const prof_id_result = await db.query(
        `SELECT id FROM Professor WHERE email_id = $1`,
        [req.user.email_id]
    );

    if (prof_id_result.rows.length === 0) {
        console.log("No Professor found with the given email.");
        return res.status(404).send("Professor not found");
    }

    let prof_id = prof_id_result.rows[0].id;

    try {
        const studentsUnderProf = await db.query(
            "SELECT Student.name, Student.email_id FROM Mapping JOIN Student ON Mapping.student_id = Student.id WHERE Mapping.prof_id = $1",
            [prof_id]
        );

        const jobsResult = await db.query(
            `SELECT * FROM Job WHERE student_id IN (SELECT student_id FROM Mapping WHERE prof_id = $1)`,
            [prof_id]
        );

        // TODO: Do error handling here
        res.render("prof_dashboard.ejs", {
            studentsUnderProf: studentsUnderProf,
            prof_id: prof_id,
            Jobs: jobsResult,
        });
    } catch (err) {
        console.log(err);
        res.send("Error retrieving data");
    }

});

router.get('/search', async (req, res) => {
    const {query} = req.query;

    try {
        // Find the professor ID using the provided email
        const prof_id_result = await db.query(
            `SELECT id FROM Professor WHERE email_id = $1`,
            [req.user.email_id]
        );

        if (prof_id_result.rows.length === 0) {
            console.log("No Professor found with the given email.");
            return res.status(404).send("Professor not found");
        }

        let prof_id = prof_id_result.rows[0].id;

        // Get students not mapped to the current professor
        const data = await db.query(
            "SELECT Student.name, Student.id FROM Student WHERE Student.id NOT IN (SELECT Mapping.student_id FROM Mapping WHERE Mapping.prof_id = $1)",
            [prof_id]
        );

        // Ensure we are filtering the rows property of the data object
        const results = data.rows.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json(results);

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/prof_dashboard', async (req, res) => {
    try {
        // console.log(req.body);

        const {student_id} = req.body;
        const prof_id_result = await db.query(
            `SELECT id FROM Professor WHERE email_id = $1`,
            [req.user.email_id]
        );

        if (prof_id_result.rows.length === 0) {
            console.log("No Professor found with the given email.");
            return res.status(404).send("Professor not found");
        }

        let prof_id = prof_id_result.rows[0].id;

        if (!student_id) {
            return res.status(400).send("Student ID is required");
        }

        // Execute the query to add a mapping between professor and student
        await db.query(
            "INSERT INTO Mapping (prof_id, student_id) VALUES ($1, $2)",
            [prof_id, student_id]
        );

        res.redirect(`/prof_dashboard`);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).send("Error adding student");
    }
});

export default router;