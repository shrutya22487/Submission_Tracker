import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
// TODO: create functionality to add multiple profs
// TODO: Check if ids are being properly captured

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// add student to project, this uses the search route in the students.js
router.post('/add_student_to_project', async (req, res) => {
    // TODO: create AJAX and HTML
    try {
        await db.query("INSERT INTO project_students (project_id, student_id) VALUES ($1, $2);", [req.project_id, req.student_id]);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//editing a project
router.post('/edit_project', async (req, res) => {
    // TODO: create AJAX and HTML
    try {
        await db.query("UPDATE Project SET\n" +
            "    title = $1,\n" +
            "    conference = $2,\n" +
            "    status = $3,\n" +
            "    link_1 = $4,\n" +
            "    link_2 = $5,\n" +
            "    submitted_date = $6,\n" +
            "    deadline_date = $7,\n" +
            "    archived = $8,\n" +
            "    sponsored = $9\n" +
            "WHERE \n" +
            "    id = $10;", [req.title, req.conference, req.status, req.link_1, req.link_2, req.submitted_date, req.deadline_date,req.archived ,req.sponsored, req.project_id]);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//deleting a project
router.post('/delete_project', async (req, res) => {
    // TODO: create AJAX and HTML
    try {
        await db.query("DELETE FROM Project WHERE id = $1", [req.project_id]);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// adding project
router.post('/add_project', async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);
    // TODO: create AJAX and HTML

    try {

        const result = await db.query(
            `INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored)
            VALUES ($1, NULL, NULL, $2, $3, $4, $5, $6, $7, FALSE, $8)
            RETURNING id;`,
            [req.body.title || null, req.body.conference || null, req.body.status || null, req.body.link_1 || null, req.body.link_2 || null, req.body.submitted_date || null, req.body.deadline_date || null, req.body.sponsored || 'FALSE']
        );

        const new_project_id = result.rows[0].id;

        await db.query("UPDATE Project SET prof_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);
        await db.query("INSERT INTO Project_profs (project_id, prof_id) VALUES ($1, $2);", [new_project_id, prof_id]);

        await db.query("UPDATE Project SET student_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);

        res.redirect("/prof_dashboard/research_projects");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// To add a job by the Professor
router.post('/prof_dashboard/add_job', async (req, res) => {
    // TODO fix the project_id to map to the project

    const prof_id = await utils.get_prof_id(req, res);

    try {
        await db.query(
            `INSERT INTO Job(project_id, prof_id, title, status, link_1, link_2, submitted_date, deadline_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                req.body.project_id || null,
                prof_id,
                req.body.title || null,
                req.body.status || null,
                req.body.link_1 || null,
                req.body.link_2 || null,
                req.body.submitted_date || null,
                req.body.deadline_date || null
            ]
        );
        res.status(200).send("Job added successfully");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//Main Dashboard
router.get("/prof_dashboard/research_projects", async (req, res) => {
    // TODO: create AJAX and HTML

    await utils.check_authentication_prof(req, res);
    const prof_id = await utils.get_prof_id(req, res);

    const project_details = await db.query("SELECT\n" +
        "    p.id AS project_id,\n" +
        "    p.title AS project_title,\n" +
        "    p.conference AS project_conference,\n" +
        "    p.status AS project_status,\n" +
        "    p.link_1 AS project_link_1,\n" +
        "    p.link_2 AS project_link_2,\n" +
        "    p.submitted_date AS project_submitted_date,\n" +
        "    p.deadline_date AS project_deadline_date,\n" +
        "    p.sponsored AS project_sponsored,\n" +
        "    s.id AS student_id,\n" +
        "    s.Name AS student_name,\n" +
        "    s.type AS student_degree,\n" +
        "    j.id AS job_id,\n" +
        "    j.title AS job_title,\n" +
        "    j.status AS job_status,\n" +
        "    j.link_1 AS job_link_1,\n" +
        "    j.link_2 AS job_link_2,\n" +
        "    j.submitted_date AS job_submitted_date,\n" +
        "    j.deadline_date AS job_deadline_date\n" +
        "FROM\n" +
        "    Project p\n" +
        "JOIN\n" +
        "    Project_profs pp ON p.id = pp.project_id\n" +
        "JOIN\n" +
        "    Project_Students ps ON p.id = ps.project_id\n" +
        "JOIN\n" +
        "    Student s ON ps.student_id = s.id\n" +
        "LEFT JOIN\n" +
        "    Job j ON p.id = j.project_id AND s.id = j.student_id\n" +
        "WHERE\n" +
        "    p.archived = FALSE\n" +
        "    AND pp.prof_id = $1\n" +
        "GROUP BY\n" +
        "    p.id,\n" +
        "    s.id,\n" +
        "    j.id\n" +
        "ORDER BY\n" +
        "    p.id, s.id;\n", [prof_id,]);

    res.render("research_projects.ejs", project_details);
});

export default router;