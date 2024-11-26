import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get("/get_professors", check_authentication, async (req, res) => {
    try {
        const student_id = await utils.get_student_id(req, res);
        const result = await db.query(
            `SELECT DISTINCT p.id, p.name 
             FROM Professor p
             JOIN Team t ON p.id = t.prof_id
             WHERE t.student_id = $1;`,
            [student_id]
        );

        res.json({ professors: result.rows });
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).send("Internal server error");
    }
});

//adding a paper through the student side
router.post("/add_paper_student", check_authentication, async (req, res) => {
    const student_id = await utils.get_student_id(req, res);
    const {
        title,
        professor,
        conference,
        status,
        link_1,
        link_2,
        submitted_date,
        deadline_date,
    } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored, paper)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, FALSE, TRUE)
            RETURNING id;`,
            [
                title || null,
                professor || null,
                student_id,
                conference || null,
                status || null,
                link_1 || null,
                link_2 || null,
                submitted_date || null,
                deadline_date || null,
            ]
        );

        const new_project_id = result.rows[0].id;

        console.log(new_project_id);
        // Link project with professor in Project_profs table
        await db.query(
            `INSERT INTO Project_profs (project_id, prof_id) VALUES ($1, $2);`,
            [new_project_id, professor]
        );
        await db.query(
            `INSERT INTO Project_students (project_id, student_id) VALUES ($1, $2);`,
            [new_project_id, student_id]
        );
        res.status(200).send("Project added successfully.");
    } catch (error) {
        console.error("Error adding project:", error);
        res.status(500).send("Internal server error");
    }
});


//uses /prof_dashboard/add_meeting_notes to add meeting notes
//Main Dashboard

router.get("/student_dashboard/under_review_papers", check_authentication,async (req, res) => {
    const student_id = await utils.get_student_id(req, res);
    const project_details_unarchived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    p.conference AS project_conference,
    STRING_AGG(DISTINCT pr.name, ', ') AS professor_names,
    STRING_AGG(CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes,
    STRING_AGG(DISTINCT s_other.name, ', ') AS students
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
LEFT JOIN
    Project_Students ps_other ON p.id = ps_other.project_id
LEFT JOIN
    Student s_other ON ps_other.student_id = s_other.id AND s_other.id != $1
WHERE s.id = $1 AND p.paper = TRUE AND p.archived= FALSE
GROUP BY
    p.id
ORDER BY
    p.id;
`, [student_id]);

    const project_details_archived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    p.conference AS project_conference,
    STRING_AGG(DISTINCT pr.name, ', ') AS professor_names,
    STRING_AGG(CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes,
    STRING_AGG(DISTINCT s_other.name, ', ') AS students
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
LEFT JOIN
    Project_Students ps_other ON p.id = ps_other.project_id
LEFT JOIN
    Student s_other ON ps_other.student_id = s_other.id AND s_other.id != $1
WHERE s.id = $1 AND p.paper = TRUE AND p.archived= TRUE
GROUP BY
    p.id
ORDER BY
    p.id;
`, [student_id]);

    res.render("under_review_papers_student.ejs", {project_details_unarchived : project_details_unarchived,
        project_details_archived : project_details_archived,});
});

export default router;