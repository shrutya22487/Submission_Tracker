import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//archive project
router.post("/prof_dashboard/archive_project", async (req, res) => {
    try {

        const { project_id } = req.body;

        await db.query("UPDATE Project SET archived = NOT archived WHERE id = $1", [project_id,]);

        res.redirect(`/prof_dashboard/research_projects`);
    } catch (err) {
        console.error("Error archiving project:", err);
        res.status(500).send("Error archiving project");
    }
});

// for searching students
router.get('/search_students_prof', async (req, res) => {
    const {query} = req.query;
    try {
        let prof_id = await utils.get_prof_id(req, res);

        // Get students not mapped to the current professor
        const data = await db.query(
            "SELECT Student.name, Student.id FROM Student WHERE Student.id IN (SELECT Team.student_id FROM Team WHERE Team.prof_id = $1)",
            [prof_id,]
        );

        const results = data.rows.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        // console.log(results);
        res.json(results);

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// add student to project, this uses the search route in the students.js
router.post('/prof_dashboard/add_student_to_project', async (req, res) => {

    try {
        await db.query(`
            INSERT INTO project_students (project_id, student_id) 
            VALUES ($1, $2)
            ON CONFLICT (project_id, student_id) DO NOTHING;
        `, [req.body.project_id, req.body.student_id]);
        res.redirect("/prof_dashboard/research_projects");

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

////////////////////////////// for editing the project //////////////////////////////////////////

// Fetch project details to pre-fill the form
router.get('/get_project/:id', async (req, res) => {
    try {
        const project = await db.query("SELECT * FROM Project WHERE id = $1", [req.params.id]);
        res.json(project.rows[0]);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/edit_project', async (req, res) => {
    try {

        const currentProject = await db.query("SELECT * FROM Project WHERE id = $1", [req.body.project_id]);

        const project = currentProject.rows[0];

        await db.query(`
            UPDATE Project SET
                title = $1,
                conference = $2,
                status = $3,
                link_1 = $4,
                link_2 = $5,
                submitted_date = $6,
                deadline_date = $7,
                archived = $8
            WHERE id = $9
        `, [
            req.body.title || project.title,
            req.body.conference || project.conference,
            req.body.status || project.status,
            req.body.link_1 || project.link_1,
            req.body.link_2 || project.link_2,
            req.body.submitted_date || project.submitted_date,
            req.body.deadline_date || project.deadline_date,
            project.archived,
            req.body.project_id
        ]);

        res.redirect("/prof_dashboard/research_projects");
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Internal server error");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//deleting a project
router.post('/prof_dashboard/delete_project', async (req, res) => {
    const { project_id } = req.body;

    try {
        await db.query("DELETE FROM Project WHERE id = $1", [project_id]);
        res.redirect("/prof_dashboard/research_projects");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// adding project
router.post('/add_project', async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);

    try {

        const result = await db.query(
            `INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored)
            VALUES ($1, NULL, NULL, $2, $3, $4, $5, $6, $7, FALSE, FALSE)
            RETURNING id;`,
            [req.body.title || null, req.body.conference || null, req.body.status || null, req.body.link_1 || null, req.body.link_2 || null, req.body.submitted_date || null, req.body.deadline_date || null,]
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

//TODO To add a job by the Professor for future uses
router.post('/prof_dashboard/add_job', async (req, res) => {
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
        res.redirect("/prof_dashboard/research_projects");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//Main Dashboard
router.get("/prof_dashboard/research_projects", async (req, res) => {
    await utils.check_authentication_prof(req, res);
    const prof_id = await utils.get_prof_id(req, res);
    const project_details_unarchived = await db.query(`
    SELECT P.id             AS project_id,
       P.title          AS project_title,
       P.conference     AS project_conference,
       P.status         AS project_status,
       P.link_1         AS project_link_1,
       P.link_2         AS project_link_2,
       P.submitted_date AS project_submitted_date,
       P.deadline_date  AS project_deadline_date,
       J.id             AS job_id,
       J.title          AS job_title,
       J.status         AS job_status,
       J.link_1         AS job_link_1,
       J.link_2         AS job_link_2,
       J.submitted_date AS job_submitted_date,
       J.deadline_date  AS job_deadline_date,
       PS.student_id    AS student_id,
       S.Name           AS student_name
FROM Project_profs
         JOIN Project P ON P.id = Project_profs.project_id
         LEFT JOIN Project_Students PS ON P.id = PS.project_id
         LEFT JOIN Student S ON S.id = PS.student_id
         LEFT JOIN Job J ON P.id = J.project_id AND J.student_id = S.id
WHERE Project_profs.prof_id = $1
  AND P.archived = FALSE AND P.sponsored = FALSE
GROUP BY P.id, PS.student_id, S.Name, J.id, P.conference, P.status, P.link_1, P.link_2, P.submitted_date,
         P.deadline_date,
         J.title, J.status, J.link_1, J.link_2, J.submitted_date, J.deadline_date
ORDER BY P.id, PS.student_id;`, [prof_id]);

    const project_details_archived = await db.query(`
    SELECT P.id             AS project_id,
       P.title          AS project_title,
       P.conference     AS project_conference,
       P.status         AS project_status,
       P.link_1         AS project_link_1,
       P.link_2         AS project_link_2,
       P.submitted_date AS project_submitted_date,
       P.deadline_date  AS project_deadline_date,
       J.id             AS job_id,
       J.title          AS job_title,
       J.status         AS job_status,
       J.link_1         AS job_link_1,
       J.link_2         AS job_link_2,
       J.submitted_date AS job_submitted_date,
       J.deadline_date  AS job_deadline_date,
       PS.student_id    AS student_id,
       S.Name           AS student_name
FROM Project_profs
         JOIN Project P ON P.id = Project_profs.project_id
         LEFT JOIN Project_Students PS ON P.id = PS.project_id
         LEFT JOIN Student S ON S.id = PS.student_id
         LEFT JOIN Job J ON P.id = J.project_id AND J.student_id = S.id
WHERE Project_profs.prof_id = $1
  AND P.archived = TRUE AND P.sponsored = FALSE
GROUP BY P.id, PS.student_id, S.Name, J.id, P.conference, P.status, P.link_1, P.link_2, P.submitted_date,
         P.deadline_date,
         J.title, J.status, J.link_1, J.link_2, J.submitted_date, J.deadline_date
ORDER BY P.id, PS.student_id;`, [prof_id]);

    res.render("research_projects.ejs", {project_details_unarchived : project_details_unarchived,
    project_details_archived : project_details_archived,});
});

export default router;