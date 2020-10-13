import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

// 친구 목록
router.get('/all');
// 친구 요청 보내기
router.post('/waiting');
// 친구 요청 수락
router.post('/accept');
// 친구 요청 거절
router.delete('/reject');
// 친구 삭제
router.delete('/');
export default router;
