import express from 'express';
import * as authController from '../controller/auth';
import 'dotenv/config';

const router = express.Router();

// 카카오 OAuth & callback
router.get('/kakao', authController.kakao);
router.get('/kakao/callback', authController.kakaoCallback);
// // 구글 OAuth & callback
router.get('/google', authController.google);
router.get('/google/callback', authController.googleCallback);
// // 네이버 OAuth & callback
router.get('/naver', authController.naver);
router.get('/naver/callback', authController.naverCallback);

export default router;
