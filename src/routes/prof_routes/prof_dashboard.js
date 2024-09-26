import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import students from "./students.js";
import research_projects from "./research_projects.js";
import under_review_papers from "./under_review_papers.js";
import sponsored_projects from "./sponsored_projects.js";
import reading_list from "./reading_list.js";
import todo from "./todo.js";
import deadlines from "./deadlines.js";
import conferences from "./conferences.js";

const router = Router();

// TODO: make HTML code better with templates
// TODO: Fix Bullets
// TODO: make meeting notes

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(students);
router.use(conferences);
router.use(under_review_papers);
router.use(research_projects);
router.use(sponsored_projects);
router.use(reading_list);
router.use(todo);
router.use(deadlines);

export default router;