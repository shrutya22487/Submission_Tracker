import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication, get_prof_id, get_student_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the conference
router.post("/student_dashboard/delete_conference",check_authentication, async (req, res) => {
    try {
        await db.query('DELETE FROM Conferences_student where id = $1;', [req.body.conference_id]);
        res.status(200).json({ message: "conference deleted successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// Adding the conference
router.post("/student_dashboard/add_conference", check_authentication,async (req, res) => {
    try {
        const student_id = await get_student_id(req, res);
        await db.query('INSERT INTO Conferences_student(student_id,date, title, link) VALUES ($1, $2, $3, $4);', [student_id, req.body.date, req.body.title, req.body.link]);
        res.status(200).json({ message: "conference added successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of conferences to AJAX
router.get('/student_dashboard/conferences', check_authentication,async (req, res) => {
    try {
        const student_id = await get_student_id(req, res);
        const data = await db.query('SELECT * FROM Conferences_student WHERE student_id = $1 ORDER BY date ASC', [student_id]);

        res.render("student_conferences.ejs",{
            conferences: data,
        } );

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;