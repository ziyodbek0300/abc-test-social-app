"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("controllers");
const router = (0, express_1.Router)();
router.post('/register', controllers_1.register);
router.post('/login', controllers_1.login);
router.get('/verify-email', controllers_1.verifyEmail);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map