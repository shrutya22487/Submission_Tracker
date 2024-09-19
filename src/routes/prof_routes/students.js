import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {fileURLToPath} from "url";
import path from "path";
const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// For searching a student to add in the projects
router.get('/search_students', async (req, res) => {
    const {query} = req.query;

    try {
        let prof_id = await utils.get_prof_id(req,res);

        // Get students not mapped to the current professor
        const data = await db.query(
            "SELECT Student.name, Student.id FROM Student WHERE Student.id NOT IN (SELECT Team.student_id FROM Team WHERE Team.prof_id = $1)",
            [prof_id]
        );

        // Ensure we are filtering the rows property of the data object
        const results = data.rows.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log(results);

        res.json(results);

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// for deleting student
router.post('/delete_student', async (req, res) => {
    const {student_id} = req.student_id;

    try {
        let prof_id = await utils.get_prof_id(req,res);

        // Get all students in the database
        await db.query(
            "DELETE FROM Team WHERE student_id = $1 AND prof_id = $2;", [student_id, prof_id]);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});
router.post("/prof_dashboard/archive_student", async (req, res) => {
    try{
        const {student_id} = req.body;
        await db.query("UPDATE Mapping SET archived = NOT archived WHERE student_id = $1 AND prof_id = $2", [student_id, await utils.get_prof_id(req, res)]);
        res.redirect(`/prof_dashboard`);
    }
    catch (err) {
        console.error("Error archiving student:", err);
        res.status(500).send("Error archiving student");
    }
});

router.get("/prof_dashboard/students", async (req, res) => {
    await utils.check_authentication_prof(req, res);
    const prof_id = await utils.get_prof_id(req, res);

    const student_details = await db.query("SELECT\n" +
        "    s.id AS student_id,\n" +
        "    s.Name AS student_name,\n" +
        "    s.type AS degree,\n" +
        "    p.title AS project_title,\n" +
        "    p.id    AS project_id \n" +
        "FROM \n" +
        "    Project AS p \n" +
        "JOIN \n" +
        "    Project_Students AS ps ON p.id = ps.project_id \n" +
        "JOIN \n" +
        "    Student AS s ON ps.student_id = s.id \n" +
        "JOIN \n" +
        "    Project_profs AS pp ON pp.project_id = p.id \n" +
        "WHERE \n" +
        "    pp.prof_id = $1 \n" +
        "GROUP BY \n" +
        "    s.type, s.Name, p.title, s.id, p.id \n" +
        "ORDER BY \n" +
        "    s.type, s.Name;", [prof_id,]);

    res.render("prof_dashboard.ejs", {
        student_details : student_details.rows
    });
});

export default router;