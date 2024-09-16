import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
const router = Router();
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

export default router;