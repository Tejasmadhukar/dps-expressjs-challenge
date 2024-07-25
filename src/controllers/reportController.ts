// ./src/controllers/reportController.ts, To handle request/response related to the report schema
import { Request, Response } from 'express';
import { InternalServerError } from './projectController';
import { NoReportFoundError } from '../models/reportModel';
import {
	createReport,
	deleteReport,
	getReportById,
	getReportsByProject,
	specialSearch,
	updateReport,
} from '../services/report.service';
import { NoProjectFoundError } from '../models/projectModel';

/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Operations related to reports
 */

/**
 * @swagger
 * /api/v1/reports/project/{projectId}:
 *   get:
 *     summary: Get all reports for a project
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reports for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No Project Found for the projectId
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/NoProjectFoundError'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function getReportByProject(req: Request, res: Response) {
	const { projectId } = req.params;
	try {
		const reports = getReportsByProject(projectId);
		res.json(reports);
	} catch (error) {
		if (error instanceof NoProjectFoundError) {
			res.status(404).send(error.message);
		}
		res.status(500).send(new InternalServerError());
	}
}

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function findReportById(req: Request, res: Response) {
	const { id } = req.params;

	if (id.trim().length === 0) {
		return res.status(400).json({ message: 'Id cannot be empty' });
	}

	try {
		const report = getReportById(id);
		res.send(report);
	} catch (error) {
		if (error instanceof NoReportFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
}

/**
 * @swagger
 * /api/v1/reports/project/{projectId}:
 *   post:
 *     summary: Create a new report for a project
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewReport'
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function createNewReport(req: Request, res: Response) {
	const { projectId } = req.params;
	// NOTE: Input is already checked and sanitised by validator
	const { text } = req.body;

	try {
		const newReport = createReport(projectId, text);
		res.status(201).send(newReport);
	} catch (error) {
		res.status(500).send((error as Error).message);
	}
}

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   put:
 *     summary: Update a report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewReport'
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function updateExistingReport(req: Request, res: Response) {
	const { id } = req.params;
	const { text } = req.body;
	try {
		const report = updateReport(id, text);
		res.status(200).send(report);
	} catch (error) {
		if (error instanceof NoReportFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
}

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Deleted Successfully
 *       404:
 *         description: Report not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function deleteReportById(req: Request, res: Response) {
	const { id } = req.params;
	try {
		deleteReport(id);
		res.status(200).send('Deleted Successfully');
	} catch (error) {
		if (error instanceof NoReportFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
}

/**
 * @swagger
 * /api/v1/reports/special:
 *   get:
 *     summary: Special report search
 *     tags: [Reports]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Special report search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *       404:
 *         description: No reports found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function specialReport(req: Request, res: Response) {
	try {
		const reports = specialSearch();
		res.send(reports);
	} catch (error) {
		if (error instanceof NoReportFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
}
