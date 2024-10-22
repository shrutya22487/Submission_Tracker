import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {fileURLToPath} from "url";
import path from "path";
import {parse} from "dotenv";
import {check_authentication_prof} from "../../utils/utility_functions.js";
const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// For searching a student to add in the projects
router.get('/search_students',check_authentication_prof,  async (req, res) => {
    const {query} = req.query;

    try {
        let prof_id = await utils.get_prof_id(req,res);

        // Get students not mapped to the current professor
        const data = await db.query(
            "SELECT Student.name, Student.id FROM Student WHERE Student.id NOT IN (SELECT Team.student_id FROM Team WHERE Team.prof_id = $1)",
            [prof_id,]
        );

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

router.post('/prof_dashboard/add_student', check_authentication_prof, async (req, res) => {
    try {
        // console.log(req.body);
        const {student_id} = req.body;

        let prof_id = await utils.get_prof_id(req,res);

        if (!student_id) {
            return res.status(400).send("Student ID is required");
        }

        // Execute the query to add a mapping between professor and student
        await db.query(
            "INSERT INTO Team (prof_id, student_id) VALUES ($1, $2)",
            [prof_id, student_id]
        );

        res.redirect(`/prof_dashboard/students`);
    } catch (err) {
        console.error("Error adding student:", err);
        res.status(500).send("Error adding student");
    }
});

// for deleting student
router.post('/delete_student',check_authentication_prof,  async (req, res) => {
    const { student_id } = req.body;

    try {
        await db.query(
            "DELETE FROM Team WHERE student_id = $1 AND prof_id = $2;", [student_id, await utils.get_prof_id(req,res)]);
        res.redirect(`/prof_dashboard/students`);

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

router.post("/prof_dashboard/archive_student",check_authentication_prof,  async (req, res) => {
    try {

        const { student_id } = req.body;

        await db.query("UPDATE Team SET archived = NOT archived WHERE student_id = $1 AND prof_id = $2", [student_id, await utils.get_prof_id(req, res)]);

        res.redirect(`/prof_dashboard/students`);
    } catch (err) {
        console.error("Error archiving student:", err);
        res.status(500).send("Error archiving student");
    }
});


router.get("/prof_dashboard/students",check_authentication_prof,  async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);

    const student_details_unarchived = await db.query("SELECT\n" +
        "    s.id AS student_id,\n" +
        "    s.Name AS student_name,\n" +
        "    s.type AS degree,\n" +
        "    COALESCE(p.title, 'No Project Assigned') AS project_title\n" +
        "\n" +
        "FROM\n" +
        "    Student s\n" +
        "LEFT JOIN\n" +
        "    Project_Students ps ON s.id = ps.student_id\n" +
        "LEFT JOIN\n" +
        "    Project p ON ps.project_id = p.id\n" +
        "JOIN\n" +
        "    Team t ON s.id = t.student_id\n" +
        "WHERE\n" +
        "    t.prof_id = $1 AND t.archived = FALSE\n" +
        "GROUP BY\n" +
        "    s.id, s.Name, s.type, p.title, p.id\n" +
        "ORDER BY\n" +
        "    s.type, s.Name;",[prof_id]);

    const student_details_archived = await db.query("SELECT\n" +
        "    s.id AS student_id,\n" +
        "    s.Name AS student_name,\n" +
        "    s.type AS degree,\n" +
        "    COALESCE(p.title, 'No Project Assigned') AS project_title\n" +
        "\n" +
        "FROM\n" +
        "    Student s\n" +
        "LEFT JOIN\n" +
        "    Project_Students ps ON s.id = ps.student_id\n" +
        "LEFT JOIN\n" +
        "    Project p ON ps.project_id = p.id\n" +
        "JOIN\n" +
        "    Team t ON s.id = t.student_id\n" +
        "WHERE\n" +
        "    t.prof_id = $1 AND t.archived = TRUE\n" +
        "GROUP BY\n" +
        "    s.id, s.Name, s.type, p.title, p.id\n" +
        "ORDER BY\n" +
        "    s.type, s.Name;",[prof_id]);

    res.render("prof_students.ejs", {
        student_details_unarchived : student_details_unarchived,
        student_details_archived : student_details_archived
    });
});

export default router;


