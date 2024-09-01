"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = exports.RegisterUserDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address' }),
    tslib_1.__metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'Full name must be at least 5 characters long' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Full name must not exceed 100 characters' }),
    (0, class_validator_1.Matches)(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, { message: 'Full name can only contain Latin or Cyrillic letters' }),
    tslib_1.__metadata("design:type", String)
], RegisterUserDto.prototype, "full_name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    tslib_1.__metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address' }),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map