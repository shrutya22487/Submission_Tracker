import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication, get_prof_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the conference
router.post("/prof_dashboard/delete_conference", check_authentication,async (req, res) => {
    try {

        await db.query('DELETE FROM Conferences where id = $1;', [req.body.conference_id]);
        res.status(200).json({ message: "conference deleted successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// Adding the conference
router.post("/prof_dashboard/add_conference", check_authentication,async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        await db.query('INSERT INTO Conferences(prof_id,date, title, link) VALUES ($1, $2, $3, $4);', [profId, req.body.date, req.body.title, req.body.link]);
        res.status(200).json({ message: "conference added successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of conferences to AJAX
router.get('/prof_dashboard/conferences', check_authentication,async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        const conferences = await db.query(
            'SELECT * FROM Conferences WHERE prof_id = $1 ORDER BY date ASC',
            [profId]
        );

        const student_conferences = await db.query(`
    SELECT 
        Cs.student_id as student_id, 
        Cs.id as id, 
        Cs.date as date, 
        Cs.title as title, 
        Cs.link as link, 
        S.name as student_name
    FROM 
        Professor p
    JOIN 
        Team ON p.id = Team.prof_id
    JOIN 
        Conferences_student Cs ON Team.student_id = Cs.student_id
    JOIN 
        Student S ON S.id = Cs.student_id
    WHERE 
        p.id = $1
    ORDER BY 
        Cs.date ASC;`,
            [profId]
        );
        res.render("prof_conferences.ejs",{
            conferences: conferences,
            student_conferences: student_conferences
        } );

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;