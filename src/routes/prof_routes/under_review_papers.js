import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//uses /prof_dashboard/add_meeting_notes to add meeting notes
//Main Dashboard
router.get("/student_dashboard/research_projects", check_authentication,async (req, res) => {
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
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes,
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
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes,
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

    res.render("research_projects_student.ejs", {project_details_unarchived : project_details_unarchived,
        project_details_archived : project_details_archived,});
});

export default router;