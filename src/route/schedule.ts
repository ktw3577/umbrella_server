import express, { Request, Response, NextFunction } from 'express';
import * as scheduleController from '../controller/schedule';
const router = express.Router();

// 유저의 모든 일정 가져오기
router.get('/all', scheduleController.getUserSchedule);
// 새로운 일정 추가
router.post('/', scheduleController.createSchedule);
// 일정 수정
router.patch('/', scheduleController.changeSchedule);
// 일정 삭제
router.delete('/', scheduleController.RemoveSchedule);
// 일정 공유
router.post('/share', scheduleController.shareSchedule);
// 공유 받은 일정
router.get('/friendSchedules', scheduleController.friendSchedule);
export default router;
