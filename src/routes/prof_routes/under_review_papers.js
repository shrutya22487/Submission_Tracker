import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// adding project
router.post('/add_paper', async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);

    try {
        const result = await db.query(
            `INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored, paper)
            VALUES ($1, NULL, NULL, $2, $3, $4, $5, $6, $7, FALSE, FALSE, TRUE)
            RETURNING id;`,
            [req.body.title || null, req.body.conference || null, req.body.status || null, req.body.link_1 || null, req.body.link_2 || null, req.body.submitted_date || null, req.body.deadline_date || null,]
        );

        const new_project_id = result.rows[0].id;

        await db.query("UPDATE Project SET prof_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);
        await db.query("INSERT INTO Project_profs (project_id, prof_id) VALUES ($1, $2);", [new_project_id, prof_id]);

        await db.query("UPDATE Project SET student_table_id = $1 WHERE id = $2;", [new_project_id, new_project_id]);

        res.redirect("/prof_dashboard/under_review_papers");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//Main Dashboard
router.get("/prof_dashboard/under_review_papers", async (req, res) => {
    await utils.check_authentication_prof(req, res);

    const prof_id = await utils.get_prof_id(req, res);
    const prof_name = await utils.get_prof_name(req, res, prof_id);

    const project_details_unarchived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    STRING_AGG(DISTINCT s.name, ', ') AS students,
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes
FROM
    Project p
LEFT JOIN
    Project_Students ps ON p.id = ps.project_id
LEFT JOIN
    Student s ON ps.student_id = s.id
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Professor pr ON pp.prof_id = pr.id
LEFT JOIN
    meeting_notes mn ON p.id = mn.project_id
WHERE pr.id = $1 AND p.archived = FALSE AND p.sponsored =FALSE AND p.paper = TRUE
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
    STRING_AGG(DISTINCT s.name, ', ') AS students,
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes
FROM
    Project p
LEFT JOIN
    Project_Students ps ON p.id = ps.project_id
LEFT JOIN
    Student s ON ps.student_id = s.id
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Professor pr ON pp.prof_id = pr.id
LEFT JOIN
    meeting_notes mn ON p.id = mn.project_id
WHERE pr.id = $1 AND p.archived = TRUE AND p.sponsored =FALSE AND p.paper = TRUE
GROUP BY
    p.id
ORDER BY
    p.id;`, [prof_id]);

    console.log(project_details_unarchived.rows);

    res.render("under_review_papers.ejs", {prof_name : prof_name,project_details_unarchived : project_details_unarchived,
        project_details_archived : project_details_archived,});
});

export default router;