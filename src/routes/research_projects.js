import { Router } from "express";
import db from "../utils/db.js";

const router = Router();

// Route to render the conferences dashboard
router.get('/research_projects', async (req, res) => {
    try {
        // const conferencesResult = await db.query(`SELECT * FROM conferences`);
        res.render("research_projects.ejs");
    } catch (err) {
        console.error("Error fetching sampleboard:", err);
        res.status(500).send("Server error");
    }
});

export default router;


// import express from 'express';
// import { Router } from "express";
// import db from "../utils/db.js";
// const router = Router();
// import bodyParser from "body-parser";
// import * as utils from "../utils/utility_functions.js";

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.json());

// router.post("/research_projects/archive_student", async (req, res) => {
//     try{
//         const {student_id} = req.body;
//         await db.query("UPDATE Mapping SET archived = NOT archived WHERE student_id = $1 AND prof_id = $2", [student_id, await utils.get_prof_id(req, res)]);
//         res.redirect(`/research_projects`);
//     }
//     catch (err) {
//         console.error("Error archiving student:", err);
//         res.status(500).send("Error archiving student");
//     }
// });

// router.post("/research_projects/archive_job", async (req, res) => {
//     try{
//         const {job_id} = req.body;
//         await db.query("UPDATE Job SET archived = NOT ARCHIVED WHERE Job.id = $1", [job_id]);
//         res.redirect(`/research_projects`);
//     }
//     catch (err) {
//         console.error("Error archiving job:", err);
//         res.status(500).send("Error archiving job");
//     }
// });

// router.get('/research_projects', async (req, res) => {
//     let prof_id = await utils.get_prof_id(req, res);

//     try {
//         const unarchived_students = await utils.get_unarchived_students(req, res);
//         const archived_students = await utils.get_archived_students(req, res);

//         const archived_jobs = await utils.get_archived_jobs(req, res);
//         const unarchived_jobs = await utils.get_unarchived_jobs(req, res);

//         res.locals.archived_students = archived_students;
//         res.locals.unarchived_students = unarchived_students;
//         res.locals.archived_jobs = archived_jobs;
//         res.locals.unarchived_jobs = unarchived_jobs;

//         // TODO: Do error handling here
//         res.render("research_projects.ejs", {
//             prof_id: prof_id,
//         });
//     } catch (err) {
//         console.log(err);
//         res.send("Error retrieving data");
//     }

// });

// router.get('/search', async (req, res) => {
//     const {query} = req.query;

//     try {
//         let prof_id = await utils.get_prof_id(req,res);

//         // Get students not mapped to the current professor
//         const data = await db.query(
//             "SELECT Student.name, Student.id FROM Student WHERE Student.id NOT IN (SELECT Mapping.student_id FROM Mapping WHERE Mapping.prof_id = $1)",
//             [prof_id]
//         );

//         // Ensure we are filtering the rows property of the data object
//         const results = data.rows.filter(item =>
//             item.name.toLowerCase().includes(query.toLowerCase())
//         );
//         console.log(results);

//         res.json(results);

//     } catch (error) {
//         console.error("Error executing query:", error);
//         res.status(500).send("Internal server error");
//     }
// });

// router.post('/research_projects', async (req, res) => {
//     try {
//         // console.log(req.body);

//         const {student_id} = req.body;

//         let prof_id = await utils.get_prof_id(req,res);

//         if (!student_id) {
//             return res.status(400).send("Student ID is required");
//         }

//         // Execute the query to add a mapping between professor and student
//         await db.query(
//             "INSERT INTO Mapping (prof_id, student_id) VALUES ($1, $2)",
//             [prof_id, student_id]
//         );

//         res.redirect(`/research_projects`);
//     } catch (err) {
//         console.error("Error adding student:", err);
//         res.status(500).send("Error adding student");
//     }
// });

// export default router;