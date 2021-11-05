import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';
import JWTUtils from '../../utils/jwt-utils';

const router = Router();
const { User, Role, sequelize } = models;

router.post(
  '/register',
  asyncWrapper(async (req, res) => {
    const { email, password, roles } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res
        .status(200)
        .send({ success: false, message: 'User already exists' });
    }

    try {
      const result = await sequelize.transaction(async () => {
        const newUser = await User.create({ email, password });
        const jwtPayload = { email };
        const accessToken = JWTUtils.generateAccessToken(jwtPayload);
        const refreshToken = JWTUtils.generateRefreshToken(jwtPayload);
        // associations - special methods
        await newUser.createRefreshToken({ token: refreshToken });

        if (roles && Array.isArray(roles)) {
          const rolesToSave = [];
          for (const role of roles) {
            const newRole = await Role.create({ role });
            rolesToSave.push(newRole);
          }
          await newUser.addRoles(rolesToSave);
        }

        return { accessToken, refreshToken };
      });

      const { accessToken, refreshToken } = result;

      return res.status(200).send({
        success: true,
        message: 'User successfully registered',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      console.error('Error when registering the user:\n', err.stack);
      return res.status(500).send({ success: false, message: err.message });
    }
  })
);

export default router;
