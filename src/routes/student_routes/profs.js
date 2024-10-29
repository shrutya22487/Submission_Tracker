import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {fileURLToPath} from "url";
import path from "path";
import {parse} from "dotenv";
import {check_authentication} from "../../utils/utility_functions.js";
const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

router.get("/student_dashboard/profs",check_authentication,  async (req, res) => {
    const student_id = await utils.get_student_id(req, res);

    const prof_details_unarchived = await db.query(`SELECT
    STRING_AGG(DISTINCT p.title, ', ') AS project_titles,
    pr.name AS professor_name,
    pr.email_id AS professor_email
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
WHERE s.id = $1 AND p.paper = FALSE AND p.archived = FALSE
GROUP BY
    pr.name, pr.email_id
ORDER BY
    pr.name;
`,[student_id]);

    const prof_details_archived = await db.query(`SELECT
    STRING_AGG(DISTINCT p.title, ', ') AS project_titles,
    pr.name AS professor_name,
    pr.email_id AS professor_email
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
WHERE s.id = $1 AND p.paper = FALSE AND p.archived = TRUE
GROUP BY
    pr.name, pr.email_id
ORDER BY
    pr.name;
`,[student_id]);

    res.render("profs.ejs", {
        prof_details_unarchived : prof_details_unarchived.rows,
        prof_details_archived : prof_details_archived.rows ,});
});

export default router;


