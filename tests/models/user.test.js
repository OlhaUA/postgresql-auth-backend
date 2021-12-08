import TestsHelpers from '../tests-helpers';
import models from '../../src/models';

describe('User', () => {
  beforeAll(async () => {
    await TestsHelpers.startDb();
  });

  afterAll(async () => {
    await TestsHelpers.stopDb();
  });

  beforeEach(async () => {
    await TestsHelpers.syncDb();
  });

  describe('static methods', () => {
    describe('hashPassword', () => {
      it('should encrypt the password correctly', async () => {
        const { User } = models;
        const password = 'Test123';
        const hashedPassword = await User.hashPassword(password);
        expect(hashedPassword).toEqual(expect.any(String));
        expect(hashedPassword).not.toEqual(password);
      });
    });

    describe('createNewUser', () => {
      it('should error if we create a new user with an invalid email', async () => {
        const { User } = models;
        const data = {
          email: 'test',
          password: 'Test123',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Not a valid email address');
        expect(errorObj.path).toEqual('email');
      });

      it('should error if we do not pass an email', async () => {
        const { User } = models;
        const data = {
          password: 'Test123',
        };
        let error;
        try {
          await User.createNewUser(data);
        } catch (err) {
          error = err;
        }
        expect(error).toBeDefined();
        expect(error.errors.length).toEqual(1);
        const errorObj = error.errors[0];
        expect(errorObj.message).toEqual('Email is required');
        expect(errorObj.path).toEqual('email');
      });
    });
  });

  describe('instance methods', () => {
    describe('comparePasswords', () => {
      it('should return true if the hashed password is the same as the original one', async () => {
        const { User } = models;
        const email = 'test@example.com';
        const password = 'Test123';
        const user = await User.create({ email, password });
        const hashedPassword = await User.hashPassword(password);
        const arePasswordsEqual = await user.comparePasswords(
          password,
          hashedPassword
        );
        expect(arePasswordsEqual).toEqual(true);
      });

      it('should return false if if the hashed password is not the same as the original one', async () => {
        const { User } = models;
        const email = 'test@example.com';
        const password = 'Test123';
        const user = await User.create({ email, password });
        const hashedPassword = await User.hashPassword(password);
        const arePasswordsEqual = await user.comparePasswords(
          'test123!',
          hashedPassword
        );
        expect(arePasswordsEqual).toEqual(false);
      });
    });
  });

  describe('hooks', () => {
    beforeEach(async () => {
      await TestsHelpers.syncDb();
    });

    it('should create a user with a hashed password', async () => {
      const { User } = models;
      const email = 'test@example.com';
      const password = 'Test123';
      await User.create({ email, password });
      const users = await User.findAll();
      expect(users.length).toBe(1);
      expect(users[0].email).toEqual(email);
      expect(users[0].password).not.toEqual(password);
    });
  });
});
