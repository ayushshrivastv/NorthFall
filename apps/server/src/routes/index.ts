import { Request, Response, Router } from 'express';
// controllers
import signInController from '../controllers/user-controller/signInController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';
import githubCodePushController from '../controllers/github-deploy-controller/githubCodePushController';
import githubRepoNameValidatorController from '../controllers/github-deploy-controller/githubRepoNameValidatorController';
import syncTemplate from '../controllers/template-controller/syncTemplates';
import githubProjectZipController from '../controllers/github-deploy-controller/githubProjectZipController';
import getUserContracts from '../controllers/contract-controller/getUserContracts';
import getAllContracts from '../controllers/contract-controller/getAllContracts';
import getAllTemplates from '../controllers/template-controller/getAllTemplates';
import plan_executor_controller from '../controllers/chat-controller/plan_executor_controller';
import generate_contract_controller from '../controllers/gen/generate_contract_controller';
import get_chat_controller from '../controllers/chat-controller/get_chat_controller';
import get_public_reviews_controller from '../controllers/review-controller/get_public_reviews_controller';
import create_public_review_controller from '../controllers/review-controller/create_public_review_controller';
import create_contract_review_controller from '../controllers/review-controller/create_contract_review_controller';
import getContractMessages from '../controllers/contract-controller/getContractMessages';
import delete_contract_controller from '../controllers/contract-controller/delete_contract_controller';

// <------------------------- MIDDLEWARES ------------------------->
import authMiddleware from '../middlewares/middleware.auth';
import subscriptionMiddleware from '../middlewares/middleware.subscription';
import githubMiddleware from '../middlewares/middleware.github';
import RateLimit from '../class/rate_limit';
import DailyRateLimit from '../middlewares/middleware.dailyRateLimit';

const router: Router = Router();

// <------------------------- SIGNIN-ROUTE ------------------------->
router.post('/sign-in', RateLimit.sign_in_rate_limit, signInController);

// <------------------------- HEALTH-CHECK-ROUTE ------------------------->
router.get('/health', RateLimit.health_check_rate_limit, async (_req: Request, res: Response) => {
    await new Promise((t) => setTimeout(t, 5000));
    res.status(200).json({ message: 'Server is running' });
});

// <------------------------- CONTRACT-ROUTES ------------------------->
router.post(
    '/generate',
    RateLimit.generate_contract_rate_limit,
    authMiddleware,
    DailyRateLimit.generate_contract_daily_limit,
    DailyRateLimit.contract_messages_limit,
    generate_contract_controller,
);
router.post(
    '/contract/get-chat',
    RateLimit.get_chat_rate_limit,
    authMiddleware,
    get_chat_controller,
);
router.post('/plan', RateLimit.plan_executor_rate_limit, authMiddleware, plan_executor_controller);
router.post('/get-contract-messages', authMiddleware, getContractMessages);

// <------------------------- GITHUB-ROUTES ------------------------->
router.post(
    '/github/export-code',
    RateLimit.github_export_rate_limit,
    authMiddleware,
    githubMiddleware,
    githubCodePushController,
);
router.post(
    '/github/get-zip-file',
    RateLimit.github_zip_rate_limit,
    authMiddleware,
    githubMiddleware,
    githubProjectZipController,
);
router.post(
    '/github/validate-repo-name',
    RateLimit.github_validate_rate_limit,
    authMiddleware,
    githubMiddleware,
    githubRepoNameValidatorController,
);

// <------------------------- SUBSCRIPTION-ROUTES ------------------------->
router.post(
    '/subscription/create-order',
    RateLimit.create_order_rate_limit,
    authMiddleware,
    createOrderController,
);
router.get(
    '/subscription/get-plan',
    RateLimit.get_user_plan_rate_limit,
    authMiddleware,
    getUserPlanController,
);
router.post(
    '/subscription/update',
    RateLimit.update_subscription_rate_limit,
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);

// <------------------------- REVIEW-ROUTES ------------------------->
router.post(
    '/contract-review',
    RateLimit.create_review_rate_limit,
    authMiddleware,
    create_contract_review_controller,
);
router.post(
    '/public-review',
    RateLimit.public_review_rate_limit,
    authMiddleware,
    create_public_review_controller,
);
router.get('/get-reviews', get_public_reviews_controller);

// <------------------------- TEMPLATE-ROUTES ------------------------->
router.post('/templates/sync-templates', RateLimit.sync_templates_rate_limit, syncTemplate);
router.get('/template/get-templates', RateLimit.get_templates_rate_limit, getAllTemplates);

// <------------------------- MARKETPLACE-ROUTES ------------------------->
router.get(
    '/contracts/get-user-contracts',
    RateLimit.get_user_contracts_rate_limit,
    authMiddleware,
    getUserContracts,
);
router.get(
    '/contracts/get-all-contracts',
    RateLimit.get_all_contracts_rate_limit,
    authMiddleware,
    getAllContracts,
);
router.delete(
    '/contracts/:contractId',
    RateLimit.delete_contract_rate_limit,
    authMiddleware,
    delete_contract_controller,
);

// <------------------------- FILE-ROUTES ------------------------->
// [this was made for syncing files updating in web IDE to the pod]
router.get(
    '/files/:contractId',
    RateLimit.get_files_rate_limit,
    authMiddleware,
    getFilesController,
);
router.get('/files/sync', RateLimit.sync_files_rate_limit, authMiddleware, syncFilesController); // use this or write a ws layer to share directly to kubernetes

export default router;
