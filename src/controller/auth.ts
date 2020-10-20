import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

interface UserI<T> {
  snsId: T;
}

const socialLoginResponse = (
  req: Request,
  res: Response,
  err: Error,
  user: UserI<string>
) => {
  if (err) {
    return res.status(400);
  }
  if (!user) {
    return res.status(200).json({
      success: false,
    });
  }
  req.login(user, { session: false }, err => {
    if (err) {
      res.send(err);
    }
    const token = jwt.sign({ id: user.snsId }, process.env.JWT_SECRET);
    return res.status(200).json({ userToken: token, success: true });
  });
};

export const kakao = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('kakao')(req, res, next);
  } catch (e) {
    console.error(e);
  }
};

export const kakaoCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('kakao', (err, user) =>
      socialLoginResponse(req, res, err, user)
    )(req, res, next);
  } catch (e) {
    console.error(e);
  }
};

export const naver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('naver')(req, res, next);
  } catch (e) {
    console.error(e);
  }
};

export const naverCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('naver', (err, user) =>
      socialLoginResponse(req, res, err, user)
    )(req, res, next);
  } catch (e) {
    console.error(e);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('google', { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  } catch (e) {
    console.error(e);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    passport.authenticate('google', (err, user) =>
      socialLoginResponse(req, res, err, user)
    )(req, res, next);
  } catch (e) {
    console.error(e);
  }
};
