import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {get_prof_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the Deadlines
router.post("/prof_dashboard/delete_deadline", async (req, res) => {
    try {
        const { deadline_id } = req.body;
        await db.query('DELETE FROM deadlines WHERE id = $1;', [deadline_id]);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});


// Adding the to-dos
router.post("/prof_dashboard/add_deadline", async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        await db.query('INSERT INTO deadlines(prof_id,task,date) VALUES ($1, $2, $3);', [profId, req.body.task, req.body.date]);
        res.status(200).json({ message: "Task added successfully" }); // <-- Send a response here
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of To-dos to AJAX
router.get('/prof_dashboard/deadline', async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        const { rows: data } = await db.query('SELECT * FROM deadlines WHERE prof_id = $1', [profId]);

        if (data.length !== 0) {
            res.json(data);
        }

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;