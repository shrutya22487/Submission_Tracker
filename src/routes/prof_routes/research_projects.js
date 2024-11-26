import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication} from "../../utils/utility_functions.js";
import {io} from "../../../index.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

//////////////////////////////////// Meeting Notes /////////////////////////////////////

// adding meeting notes
router.post('/prof_dashboard/add_meeting_notes',check_authentication,  async (req, res) => {
    try {
        if (req.prof === true){
            await db.query(
                `INSERT INTO meeting_notes(project_id, prof_id, notes) VALUES ($1, $2, $3)`,[req.body.project_id, await utils.get_prof_id(req, res),req.body.notes]);

            // Emit WebSocket event with meeting note details
            io.emit("meeting_note_update", {
                project_id: req.body.project_id,
                notes: req.body.notes,
                date: new Date().toISOString().split('T')[0]
            });

        }
        else {
            await db.query(
                `INSERT INTO meeting_notes(project_id, prof_id, notes) VALUES ($1, $2, $3)`,[req.body.project_id, null,req.body.notes]);

            // Emit WebSocket event with meeting note details
            io.emit("meeting_note_update", {
                project_id: req.body.project_id,
                notes: req.body.notes,
                date: new Date().toISOString().split('T')[0]
            });

        }

        res.status(200).json({ message: "Meeting Notes added successfully" });

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

//deleting meeting notes
router.post('/prof_dashboard/delete_meeting_notes',check_authentication,  async (req, res) => {
    const { id } = req.body;

    try {
        await db.query("DELETE FROM meeting_notes WHERE id = $1", [id]);
        res.redirect("/prof_dashboard/research_projects");
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

////////////////////////////////////Student Functions/////////////////////////////////////

// for searching students
router.get('/search_students_prof',check_authentication,  async (req, res) => {
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

// add student to project, this uses the search route in the prof_routes/students.js
router.post('/prof_dashboard/add_student_to_project',check_authentication,  async (req, res) => {

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

// deletes student from a project
router.post("/project/:projectId/remove-student", async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;

    try {
        // Find the student by email
        const studentResult = await db.query(
            "SELECT id FROM Student WHERE email_id = $1",
            [email]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const studentId = studentResult.rows[0].id;

        // Delete the student from the project
        await db.query(
            "DELETE FROM Project_Students WHERE project_id = $1 AND student_id = $2",
            [projectId, studentId]
        );

        res.json({ success: true, message: "Student removed from the project" });
    } catch (err) {
        console.error("Error deleting student from project:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


////////////////////////////// Project Functions //////////////////////////////////////////

// Fetch project details to pre-fill the form
router.get('/get_project/:id', check_authentication, async (req, res) => {
    try {
        const project = await db.query("SELECT * FROM Project WHERE id = $1", [req.params.id]);
        res.json(project.rows[0]);
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/edit_project', check_authentication, async (req, res) => {
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

//deleting a project
router.post('/prof_dashboard/delete_project', check_authentication, async (req, res) => {
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
router.post('/add_project',check_authentication, async (req, res) => {
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

//archive project
router.post("/prof_dashboard/archive_project",check_authentication, async (req, res) => {
    try {

        const { project_id } = req.body;

        await db.query("UPDATE Project SET archived = NOT archived WHERE id = $1", [project_id,]);

        res.redirect(`/prof_dashboard/research_projects`);
    } catch (err) {
        console.error("Error archiving project:", err);
        res.status(500).send("Error archiving project");
    }
});

// Archiving a student inside a project
router.post('/project/:projectId/archive-student-in-project', async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;

    try {
        // Find the student ID by email
        const student = await db.query(`SELECT id FROM Student WHERE email_id = $1`, [email]);
        if (student.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const studentId = student.rows[0].id;

        // Update the Project_Students table to mark the student as archived
        await db.query(
            `UPDATE Project_Students SET archived = NOT archived WHERE project_id = $1 AND student_id = $2`,
            [projectId, studentId]
        );

        res.json({ success: true, message: "Student archived successfully" });
    } catch (err) {
        console.error("Error archiving student:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////

//Main Dashboard
router.get("/prof_dashboard/research_projects", check_authentication,async (req, res) => {
    const prof_id = await utils.get_prof_id(req, res);

    const project_details_unarchived = await db.query(`
    SELECT
        p.id AS project_id,
        p.title AS project_title,
        p.deadline_date AS deadline_date,
        p.submitted_date AS submitted_date,
        p.status AS status,
        p.link_1 AS link_1,
        p.link_2 AS link_2,
        p.conference AS project_conference,

        -- Fetch unarchived students
        STRING_AGG(DISTINCT CASE 
            WHEN ps.archived = FALSE THEN CONCAT(s.name, ' (', s.email_id, ')')
            ELSE NULL 
        END, ', ') AS unarchived_students,

        -- Fetch archived students
        STRING_AGG(DISTINCT CASE 
            WHEN ps.archived = TRUE THEN CONCAT(s.name, ' (', s.email_id, ')')
            ELSE NULL 
        END, ', ') AS archived_students,

        -- Fetch meeting notes
        STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')', ' [', mn.id, ']'), '; ') AS meeting_notes
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
    WHERE
        pr.id = $1
        AND p.archived = FALSE
        AND p.sponsored = FALSE
        AND p.paper = FALSE
    GROUP BY
        p.id
    ORDER BY
        p.id;
`, [prof_id]);

    const project_details_archived = await db.query(`SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    p.conference AS project_conference,
    
    STRING_AGG(DISTINCT CONCAT(s.name, ' (', s.email_id, ')'), ', ') AS students, -- Fetch student names and emails
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')', ' [', mn.id, ']'), '; ') AS meeting_notes
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
WHERE pr.id = $1 AND p.archived = TRUE AND p.sponsored = FALSE AND p.paper = FALSE
GROUP BY
    p.id
ORDER BY
    p.id;
`, [prof_id]);

    res.render("research_projects_prof.ejs", {project_details_unarchived : project_details_unarchived,
    project_details_archived : project_details_archived,});
});

export default router;