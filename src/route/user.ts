import express, { Request, Response, NextFunction } from 'express';
import * as userController from '../controller/user';

const router = express.Router();

// 친구 추가 시 유저 검색
router.get('/search', userController.searchUser);
// 로그인 유저 정보
router.get('/detail', userController.getUserInfo);
// username 변경
router.patch('/username', userController.changeUsername);
// user 프로필 이미지 수정
router.patch('/avatar');
// userId 추가 입력
router.patch('/userId', userController.addUserId);
// 회원 탈퇴
router.delete('/withdraw', userController.withdrawal);
// 로컬 테스트 용 유저 추가
router.post('/testUser', userController.signUp);
export default router;
