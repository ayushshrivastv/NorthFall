import rateLimit from 'express-rate-limit';

export default class RateLimit {
    private static readonly SECOND = 1000;
    private static readonly MINUTE = 60 * RateLimit.SECOND;
    private static readonly HOUR = 60 * RateLimit.MINUTE;

    static generate_contract_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 10,
        message: 'Too many contract generation requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static delete_contract_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 15,
        message: 'Too many contract deletion requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static plan_executor_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 15,
        message: 'Too many plan execution requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_chat_rate_limit = rateLimit({
        windowMs: 10 * RateLimit.MINUTE,
        max: 400,
        message: 'Too many chat requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static github_export_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 15,
        message: 'Too many GitHub export requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static github_zip_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 15,
        message: 'Too many zip download requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static github_validate_rate_limit = rateLimit({
        windowMs: 10 * RateLimit.MINUTE,
        max: 50,
        message: 'Too many validation requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static create_order_rate_limit = rateLimit({
        windowMs: 1 * RateLimit.HOUR,
        max: 5,
        message: 'Too many order creation attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static update_subscription_rate_limit = rateLimit({
        windowMs: 1 * RateLimit.HOUR,
        max: 10,
        message: 'Too many subscription update requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_user_plan_rate_limit = rateLimit({
        windowMs: 5 * RateLimit.MINUTE,
        max: 30,
        message: 'Too many plan fetch requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static create_review_rate_limit = rateLimit({
        windowMs: 1 * RateLimit.HOUR,
        max: 10,
        message: 'Too many review submissions, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static public_review_rate_limit = rateLimit({
        windowMs: 10 * RateLimit.MINUTE,
        max: 50,
        message: 'Too many review requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_files_rate_limit = rateLimit({
        windowMs: 5 * RateLimit.MINUTE,
        max: 100,
        message: 'Too many file requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static sync_files_rate_limit = rateLimit({
        windowMs: 10 * RateLimit.MINUTE,
        max: 50,
        message: 'Too many file sync requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static sync_templates_rate_limit = rateLimit({
        windowMs: 1 * RateLimit.HOUR,
        max: 5,
        message: 'Too many template sync requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_templates_rate_limit = rateLimit({
        windowMs: 5 * RateLimit.MINUTE,
        max: 100,
        message: 'Too many template fetch requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_user_contracts_rate_limit = rateLimit({
        windowMs: 5 * RateLimit.MINUTE,
        max: 50,
        message: 'Too many contract fetch requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static get_all_contracts_rate_limit = rateLimit({
        windowMs: 5 * RateLimit.MINUTE,
        max: 50,
        message: 'Too many contract fetch requests, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static sign_in_rate_limit = rateLimit({
        windowMs: 15 * RateLimit.MINUTE,
        max: 5,
        message: 'Too many sign-in attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    static health_check_rate_limit = rateLimit({
        windowMs: 1 * RateLimit.MINUTE,
        max: 100,
        message: 'Too many health check requests.',
        standardHeaders: true,
        legacyHeaders: false,
    });
}
