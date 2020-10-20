import passport from 'passport';
import User from '../model/models/user';
import passportGoogle from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import passportNaver from 'passport-naver';
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';
import 'dotenv/config';

const GoogleStrategy = passportGoogle.Strategy;
const NaverStrategy = passportNaver.Strategy;

interface LoginDataI {
  username: string;
  snsId: string;
  provider: string;
  avatarUrl: string;
}

const socialLogin = async (
  loginData: LoginDataI,
  accessToken: string,
  refreshToken: string,
  done: passportGoogle.VerifyCallback
) => {
  const { username, snsId, provider, avatarUrl } = loginData;
  try {
    User.findOrCreate({
      where: {
        snsId,
      },
      defaults: {
        username,
        accessToken,
        refreshToken,
        provider,
        avatarUrl,
      },
    }).then(([user]) => {
      return done(null, user);
    });
  } catch (err) {
    return done(err, false);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const loginData = {
        username: profile.displayName,
        snsId: profile.id,
        provider: 'google',
        avatarUrl: profile._json && profile._json.picture,
      };
      return socialLogin(loginData, accessToken, refreshToken, done);
    }
  )
);

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: '/auth/kakao/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const loginData = {
        username: profile.displayName,
        snsId: profile.id,
        provider: 'kakao',
        avatarUrl: profile._json && profile._json.properties.profile_image,
      };
      return socialLogin(loginData, accessToken, refreshToken, done);
    }
  )
);

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: '/auth/naver/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const loginData = {
        username: profile.displayName,
        snsId: profile.id,
        provider: 'naver',
        avatarUrl: profile._json && profile._json.profile_image,
      };
      return socialLogin(loginData, accessToken, refreshToken, done);
    }
  )
);

const jwtOpts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  'jwt',
  new JWTStrategy(jwtOpts, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({
        where: { snsId: jwtPayload.snsId },
      });

      if (user) {
        done(null, user);
      } else {
        done('User does not exist.', false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);

export default passport;
