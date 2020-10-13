import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

// 유저의 모든 일정 가져오기
router.get('/all');
// 새로운 일정 추가
router.post('/');
// 일정 수정
router.patch('/');
// 일정 삭제
router.delete('/');
// 일정 공유
router.patch('/share/:friendId');
export default router;
