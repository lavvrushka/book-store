import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'auth.env' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Проверяем наличие необходимых полей
    const displayName = profile.displayName || "No Name"; // Назначаем значение по умолчанию
    const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : "No Email"; // Проверяем массив email

    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Если пользователь не найден, создаем нового
      user = await User.create({
        name: displayName,
        email: email,
        googleId: profile.id,
      });
    } else {
      // Если пользователь найден, обновляем его данные (если необходимо)
      user.name = displayName; // Обновляем имя, если необходимо
      user.email = email; // Обновляем email, если необходимо
      await user.save(); // Сохраняем изменения
    }
    
    done(null, user); // Передаем пользователя в метод done
  } catch (err) {
    console.error('Error during Google authentication:', err); // Логируем ошибку
    done(err, null); // Передаем ошибку в метод done
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Сохраняем ID пользователя в сессии
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Ищем пользователя по ID
    done(null, user); // Передаем пользователя в метод done
  } catch (err) {
    console.error('Error during deserialization:', err); // Логируем ошибку
    done(err, null); // Передаем ошибку в метод done
  }
});

export default passport;
