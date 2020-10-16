import express from 'express';
const router = express.Router();

// 친구 추가 시 유저 검색
router.get('/search');
// 로그인 유저 정보
router.get('/detail');
// username 변경
router.patch('/username');
// user 프로필 이미지 수정
router.patch('/avatar');
// userId 추가 입력
router.patch('/userId');
export default router;
