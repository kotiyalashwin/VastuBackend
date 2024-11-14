"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const uploadImageToCloudinary = (imageBuffer, folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader
                .upload_stream({
                folder: folderPath,
                resource_type: "auto",
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            })
                .end(imageBuffer);
        });
        return {
            result: result,
            url: (result === null || result === void 0 ? void 0 : result.secure_url) || "",
            public_id: (result === null || result === void 0 ? void 0 : result.public_id) || "",
        };
    }
    catch (error) {
        throw new Error(`Error uploading to Cloudinary: ${error}`);
    }
});
exports.uploadImageToCloudinary = uploadImageToCloudinary;
