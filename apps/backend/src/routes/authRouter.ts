import { Router } from 'express';
import { validateBody } from '../middlewares/validationHandler.js';
import { registerInputSchema } from '@gsb/types/schemas';
import { handlePostVisiteur } from '../controllers/visiteurController.js';

const authRouter = Router();

authRouter.post(
    '/register',
    validateBody(registerInputSchema),
    handlePostVisiteur
);

export default authRouter;
