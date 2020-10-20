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

router.get('/signOut', (req: Request, res: Response) => {
  try {
    console.log(req.session.passport.user);
    req.logout();
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      }
    });
    console.log(req.session);
    res.status(302).send('successfully logged out');
  } catch (err) {
    console.error(err);
    res.status(400).send("You're not logged in.");
  }
});

export default router;
