import express from 'express';
import * as userController from '../controller/user';
import AWS = require('aws-sdk');
import path = require('path');
import multer = require('multer');
import multerS3 = require('multer-s3');
const router = express.Router();

const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'umbrellauseravatar', // 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
    acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension); // userid.파일이름
    },
  }),
});

// 친구 추가 시 유저 검색
router.get('/search', userController.searchUser);
// 로그인 유저 정보
router.get('/detail', userController.getUserInfo);
// username 변경
router.patch('/username', userController.changeUsername);
// userId 추가 입력
router.patch('/userId', userController.addUserId);
// 회원 탈퇴
router.delete('/withdraw', userController.withdrawal);
// 로컬 테스트 용 유저 추가
router.post('/testUser', userController.signUp);
//user 프로필 이미지 수정
router.post('/avatar', upload.single('avatar'), userController.changeAvatar);

export default router;
