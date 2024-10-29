import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import {check_authentication, get_student_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Deleting the to-dos
router.post("/student_dashboard/delete_todo",check_authentication,  async (req, res) => {
    try {
        console.log(req.body.todo_id);
        await db.query('DELETE FROM todos_student where id = $1;', [req.body.todo_id]);
        res.status(200).json({ message: "Task deleted successfully" }); // <-- Send a response here
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// Adding the to-dos
router.post("/student_dashboard/add_todo",check_authentication,  async (req, res) => {
    try {
        const studentId = await get_student_id(req, res);
        await db.query('INSERT INTO todos_student(student_id,task) VALUES ($1, $2);', [studentId, req.body.task]);
        res.status(200).json({ message: "Task added successfully" }); // <-- Send a response here
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

// sending the list of To-dos to AJAX
router.get('/student_dashboard/todo',check_authentication,  async (req, res) => {
    try {
        const studentId = await get_student_id(req, res);
        const { rows: data } = await db.query('SELECT * FROM todos_student WHERE student_id = $1', [studentId]);

        if (data.length !== 0) {
            res.json(data);
        }

    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;