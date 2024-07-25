// ./src/controllers/projectController.ts, To handle request/response related to the project schema
import { Request, Response } from 'express';
import {
	createProject,
	deleteProjectById,
	getAllProjects,
	getProjectById,
	updateProject,
} from '../services/project.service';
import { NoProjectFoundError } from '../models/projectModel';

export class InternalServerError extends Error {
	constructor() {
		super('INTERNAL SERVER ERROR OCCURED');
		this.name = 'InternalServerError';
	}
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Endpoint related to projects
 */

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function getProjects(req: Request, res: Response) {
	try {
		const projects = getAllProjects();
		res.json(projects);
	} catch (error) {
		res.status(500).send(new InternalServerError());
	}
}

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projects]
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
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Project not found
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
export function getProject(req: Request, res: Response) {
	const id = req.params.id;

	if (id.trim().length === 0) {
		return res.status(400).json({ message: 'Id cannot be empty' });
	}

	try {
		const project = getProjectById(id);
		res.send(project);
	} catch (error) {
		if (error instanceof NoProjectFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
}

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProject'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
export function createNewProject(req: Request, res: Response) {
	// NOTE: Input is already checked and sanitised by validator
	const { name, description } = req.body;

	try {
		const newProject = createProject(name, description);
		res.status(201).send(newProject);
	} catch (error) {
		res.status(500).send((error as Error).message);
	}
}

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/NewProject'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
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
export const updateExistingProject = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, description } = req.body;
	try {
		updateProject(id, name, description);
		res.status(200).send('Successfully Updated');
	} catch (error) {
		if (error instanceof NoProjectFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
};

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Deleted Successfully
 *       404:
 *         description: Project not found
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
export const deleteProject = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		deleteProjectById(id);
		res.status(200).send('Deleted Successfully');
	} catch (error) {
		if (error instanceof NoProjectFoundError) {
			res.status(404).send(error.message);
		} else {
			res.status(500).send(new InternalServerError());
		}
	}
};
