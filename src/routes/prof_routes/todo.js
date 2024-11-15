import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication, get_prof_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the to-dos
router.post("/prof_dashboard/delete_todo",check_authentication,  async (req, res) => {
    try {
        await db.query('DELETE FROM todos where id = $1;', [req.body.todo_id]);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// Adding the to-dos
router.post("/prof_dashboard/add_todo", check_authentication, async (req, res) => {
    try {
        const profId = await get_prof_id(req, res);
        const result = await db.query(
            'INSERT INTO todos(prof_id, task) VALUES ($1, $2) RETURNING id;',
            [profId, req.body.task]
        );

        const newTodoId = result.rows[0].id; // Get the newly inserted to-do's ID
        res.status(200).json({ message: "Task added successfully", todo_id: newTodoId });
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of To-dos to AJAX
router.get('/prof_dashboard/todo',check_authentication,  async (req, res) => {
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