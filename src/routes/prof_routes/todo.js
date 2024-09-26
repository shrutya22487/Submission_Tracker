import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {get_prof_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the to-dos
router.post("/prof_dashboard/delete_todo", async (req, res) => {
    try {
        console.log(req.body.todo_id);
        await db.query('DELETE FROM todos where id = $1;', [req.body.todo_id]);
        res.status(200).json({ message: "Task deleted successfully" }); // <-- Send a response here
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// Adding the to-dos
router.post("/prof_dashboard/add_todo", async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        await db.query('INSERT INTO todos(prof_id,task) VALUES ($1, $2);', [profId, req.body.task]);
        res.status(200).json({ message: "Task added successfully" }); // <-- Send a response here
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of To-dos to AJAX
router.get('/prof_dashboard/todo', async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        const { rows: data } = await db.query('SELECT * FROM todos WHERE prof_id = $1', [profId]);

        if (data.length !== 0) {
            res.json(data);
        }

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;