import express, { Request, Response } from 'express';
import passport from '../passport';

import 'dotenv/config';
const router = express.Router();

// 카카오 OAuth & callback
router.get('/kakao', passport.authenticate('kakao'));
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: process.env.CLIENT_URL,
  }),
  (req: Request, res: Response) => {
    res.redirect(301, process.env.CLIENT_URL);
  }
);
// 구글 OAuth & callback
router.get(
  '/google',
  passport.authenticate('google', {
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL,
  }),
  (req: Request, res: Response) => {
    res.redirect(301, process.env.CLIENT_URL);
  }
);
// 네이버 OAuth & callback
router.get('/naver', passport.authenticate('naver'));
router.get(
  '/naver/callback',
  passport.authenticate('naver', {
    failureRedirect: process.env.CLIENT_URL,
  }),
  (req: Request, res: Response) => {
    res.redirect(301, process.env.CLIENT_URL);
  }
);
export default router;
