import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//archive project
router.post("/prof_dashboard/archive_project_sponsored", async (req, res) => {
    try {
        console.log("MEOW");
        const { project_id } = req.body;

        await db.query("UPDATE Project SET archived = NOT archived WHERE id = $1", [project_id,]);

        res.status(200).json({ message: "Meeting Notes added successfully" });
    } catch (err) {
        console.error("Error archiving project:", err);
        res.status(500).send("Error archiving project");
    }
});

// for editing the project
router.post('/edit_project_sponsored', async (req, res) => {
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

        res.redirect("/prof_dashboard/sponsored_projects");
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).send("Internal server error");
    }
});

// adding project
router.post('/add_project_sponsored', async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);

    try {
        const result = await db.query(
            `INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored)
            VALUES ($1, NULL, NULL, $2, $3, $4, $5, $6, $7, FALSE, TRUE)
            RETURNING id;`,
            [req.body.title || null, req.body.conference || null, req.body.status || null, req.body.link_1 || null, req.body.link_2 || null, req.body.submitted_date || null, req.body.deadline_date || null,]
        );

        const new_project_id = result.rows[0].id;

        await db.query("UPDATE Project SET prof_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);
        await db.query("INSERT INTO Project_profs (project_id, prof_id) VALUES ($1, $2);", [new_project_id, prof_id]);

        await db.query("UPDATE Project SET student_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);

        res.redirect("/prof_dashboard/sponsored_projects");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//Main Dashboard
router.get("/prof_dashboard/sponsored_projects", async (req, res) => {
    await utils.check_authentication_prof(req, res);

    const prof_id = await utils.get_prof_id(req, res);

    const project_details_unarchived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    STRING_AGG(DISTINCT s.name, ', ') AS students, -- Grouping students
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes -- Grouping notes with date
FROM
    Project p
JOIN
    Project_Students ps ON p.id = ps.project_id
JOIN
    Student s ON ps.student_id = s.id
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Professor pr ON pp.prof_id = pr.id
LEFT JOIN
    meeting_notes mn ON p.id = mn.project_id
WHERE pr.id = $1 AND p.archived = FALSE AND p.sponsored = TRUE
GROUP BY
    p.id
ORDER BY
    p.id;`, [prof_id]);

    const project_details_archived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    STRING_AGG(DISTINCT s.name, ', ') AS students, -- Grouping students
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes -- Grouping notes with date
FROM
    Project p
JOIN
    Project_Students ps ON p.id = ps.project_id
JOIN
    Student s ON ps.student_id = s.id
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Professor pr ON pp.prof_id = pr.id
LEFT JOIN
    meeting_notes mn ON p.id = mn.project_id
WHERE pr.id = $1 AND p.archived = TRUE AND p.sponsored = TRUE
GROUP BY
    p.id
ORDER BY
    p.id;`, [prof_id]);

    res.render("sponsored_projects.ejs", {project_details_unarchived : project_details_unarchived,
        project_details_archived : project_details_archived,});
});

export default router;