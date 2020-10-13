import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

// 카카오 OAuth & callback
router.get('/kakao');
router.get('/kakao/callback');
// 구글 OAuth & callback
router.get('/google');
router.get('/google/callback');
// 네이버 OAuth & callback
router.get('/naver');
router.get('/share/callback');
export default router;
