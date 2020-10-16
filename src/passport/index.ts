import passport from 'passport';
import User from '../model/models/user';
import passportGoogle from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import passportNaver from 'passport-naver';
import 'dotenv/config';

const GoogleStrategy = passportGoogle.Strategy;
const NaverStrategy = passportNaver.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ where: { id } })
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existedUser = await User.findOne({
          where: { snsId: profile.id, provider: 'google' },
        });
        if (existedUser) {
          done(null, existedUser);
        } else {
          const { _json, displayName, id } = profile;
          const newUser = await User.create({
            username: displayName,
            snsId: `${id}`,
            provider: 'google',
            avartar_url: _json && _json.picture,
          });
          done(null, newUser);
        }
      } catch (err) {
        console.error(err);
        done(err);
      }
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
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('test');
        const existedUser = await User.findOne({
          where: { snsId: profile.id, provider: 'kakao' },
        });
        if (existedUser) {
          done(null, existedUser);
        } else {
          const newUser = await User.create({
            email: profile._json && profile._json.kakao_account.email,
            username: profile.displayName,
            snsId: `${profile.id}`,
            provider: 'kakao',
            avartar_url:
              profile._json && profile._json.properties.profile_image,
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
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
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existedUser = await User.findOne({
          where: { snsId: profile.id, provider: 'naver' },
        });
        if (existedUser) {
          done(null, existedUser);
        } else {
          const { _json, displayName, id } = profile;
          if (profile.displayName.indexOf('*') === -1) {
          }
          const newUser = await User.create({
            email: _json && _json.email,
            username: displayName,
            snsId: `${id}`,
            provider: 'naver',
            avartar_url: _json && _json.profile_image,
          });
          console.log(profile);
          done(null, newUser);
        }
      } catch (err) {
        console.error(err);
        done(err);
      }
    }
  )
);

export default passport;
