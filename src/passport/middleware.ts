import passport from 'passport';
import { Response, NextFunction, Request } from 'express';

const isLoggedIn = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).send('You do not have access rights.');
    }
  })(req, res, next);
};

export default isLoggedIn;
