import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../../src/models/user';
import {
  loginUserService,
  registerUserService,
  verifyEmailTokenService,
  logoutUserService,
  forgetPasswordService,
  resetPasswordService
} from '../../src/services/authServices';
import { sendVerificationEmail, sendForgetPasswordEmail } from '../../src/utils/email';


// implementation of these two packages is not really import
// Jest only simulates the behavior of these external dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/email');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn((size) => Buffer.alloc(size))
}));

describe('authServices', () => {
  let mongoServer: MongoMemoryServer;

  // mock a mongoDB and connect before all test
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // clean all data after every test
  afterEach(async () => {
    await User.deleteMany();
  });

  // disconnect MongoDB Memory Server after all test finished
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  /**
   * @loginUserService
   * Test goal: Test loginUserService to ensure that users can log in correctly and handle errors correctly
   * Test scope: Test user login function, including situations where email does not exist, password does not match, account is not verified, etc
   * Does not test JWT signatures or the actual encryption behavior of bcrypt, only simulates the behavior of external dependencies
   */
  describe('loginUserService', () => {
    it('should return a JWT token if the login is successful', async () => {
      // Mock bcrypt.compare return true, indicates password matching
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mock bcrypt.hash to return a valid hash
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Mock jwt.sign, return JWT token
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');


      console.log(new mongoose.Types.ObjectId());

      // Simulate a user profile stored in the database
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        passwordHash: "hashedPassword",
        username: 'testuser',
        isVerified: true,
      });
      await user.save();

      const token = await loginUserService('test@example.com', 'hashedPassword');

      // Check whether the returned token is correct
      expect(token).toBe('fake-jwt-token');

      // focus on business logic, not encryption process
      // Check if bcrypt.compare was called correctly
      expect(bcrypt.compare).toHaveBeenCalledWith('hashedPassword', user.passwordHash);

      // Check whether jwt.sign correctly generates JWT token
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user._id },
        process.env.JWT_SECRET || '',
        { expiresIn: '7d' }
      );
    });

    it('should throw an error if the email is not found', async () => {
      // wrong email login
      await expect(loginUserService('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow('Invalid email or password');
    });

    it('should throw an error if the password does not match', async () => {
      // Mock bcrypt.compare returns false, indicating that the passwords do not match
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // simulate a user stored in the database
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        passwordHash: "hashedPassword",
        username: 'testuser',
        isVerified: true,
      });
      await user.save();

      // use wrong password
      await expect(loginUserService('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Invalid email or password');
    });

    it('should throw an error if the account is not verified', async () => {
      // simulate a user not verified
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        passwordHash: "hashedPassword",
        username: 'testuser',
        isVerified: false, // not verified
      });
      await user.save();

      await expect(loginUserService('test@example.com', 'password123'))
        .rejects
        .toThrow('Account not verified yet, please check your email');
    });
  });


  // /**
  //  * @registerUserService
  //  * Test goal: Test registerUserService to ensure that logic such as password encryption and verification email sending operates normally during the user registration process
  //  * Test scope: Test user registration functions, including email checking, password encryption, generating verification tokens and sending verification emails
  //  * Does not test specific implementations of password encryption or email sending
  //  */
  // describe('registerUserService', () => {
  //   it('should register a new user and send verification email', async () => {

  //     (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

  //     // simulate sending verification email function
  //     (sendVerificationEmail as jest.Mock).mockResolvedValue(true);

  //     await registerUserService('test@example.com', 'password123', 'testuser');

  //     // query the database to check whether the user has registered
  //     const user = await User.findOne({ email: 'test@example.com' });

  //     // check if user data is stored correctly
  //     expect(user).toBeTruthy();
  //     expect(user?.username).toBe('testuser');
  //     expect(user?.passwordHash).toBe('hashedPassword');
  //     expect(user?.isVerified).toBe(false);
  //     expect(user?.verificationToken).toBeTruthy();

  //     /// check whether a verification email was sent
  //     expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', user?.verificationToken);
  //   });

  //   it('should throw an error if the email is already registered', async () => {
  //     (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

  //     const existingUser = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'hashedPassword',
  //       username: 'existinguser',
  //       isVerified: true,
  //     });
  //     await existingUser.save();

  //     // test repeated registration
  //     await expect(registerUserService('test@example.com', 'password123', 'newuser'))
  //       .rejects
  //       .toThrow('This email has been registered');
  //   });
  // });


  // /**
  //  * @verifyEmailTokenService
  //  * Test goal: Verify that the email token is correct and not expired, and complete user verification
  //  * Test scope: Test the email verification function, including whether the token is valid and not expired
  //  * The specific implementation of token generation is not tested
  //  */
  // describe('verifyEmailTokenService', () => {
  //   it('should verify the token and update the user as verified', async () => {
  //     const user = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'hashedPassword',
  //       username: 'testuser',
  //       isVerified: false,
  //       verificationToken: 'validToken',
  //       verificationTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
  //     });
  //     await user.save();

  //     await verifyEmailTokenService('validToken');

  //     const updatedUser = await User.findOne({ email: 'test@example.com' });
  //     expect(updatedUser?.isVerified).toBe(true);
  //   });

  //   it('should throw an error if the token is invalid or expired', async () => {
  //     const user = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'hashedPassword',
  //       username: 'testuser',
  //       isVerified: false,
  //       verificationToken: 'expiredToken',
  //       verificationTokenExpiresAt: new Date(Date.now() - 1000 * 60),
  //     });
  //     await user.save();

  //     await expect(verifyEmailTokenService('expiredToken'))
  //       .rejects
  //       .toThrow('Invalid or expired verification link');
  //   });
  // });

  // /**
  //  * @logoutUserService
  //  * Test goal: Test whether the user can log out successfully and remove the token from the session
  //  * Test scope: Test the logout function to ensure that the user's sessionTokens are cleared
  //  */
  // describe('logoutUserService', () => {
  //   it('should remove the token from the user\'s sessionTokens', async () => {
  //     (jwt.verify as jest.Mock).mockReturnValue({ userId: 'mockedUserId' });

  //     const user = new User({
  //       _id: 'mockedUserId',
  //       email: 'test@example.com',
  //       passwordHash: 'hashedPassword',
  //       sessionTokens: 'validToken',
  //     });
  //     await user.save();

  //     await logoutUserService('validToken');

  //     const updatedUser = await User.findById('mockedUserId');
  //     expect(updatedUser?.sessionTokens).toBe('');
  //   });
  // });

  // /**
  //  * @forgetPasswordService
  //  * Test goal: Test the process of users forgetting their passwords and ensure that password reset emails are sent correctly
  //  * Test scope: Test whether the password reset token is correctly generated and sent
  //  * The specific generation process of the token is not tested
  //  */
  // describe('forgetPasswordService', () => {
  //   it('should generate a password reset token and send an email', async () => {
  //     const user = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'hashedPassword',
  //       username: 'testuser',
  //     });
  //     await user.save();

  //     await forgetPasswordService('test@example.com');

  //     const updatedUser = await User.findOne({ email: 'test@example.com' });
  //     expect(updatedUser?.passwordResetToken).toBe('mocked_token');
  //     expect(sendForgetPasswordEmail).toHaveBeenCalledWith('test@example.com', 'mocked_token');
  //   });

  //   it('should throw an error if the email is not found', async () => {
  //     await expect(forgetPasswordService('nonexistent@example.com'))
  //       .rejects
  //       .toThrow('There is no account for this email');
  //   });
  // });

  // /**
  //  * @resetPasswordService
  //  * Test goal: Test the password reset function to ensure that users can successfully reset their password.
  //  * Test scope: Test the password reset function, including token verification and new password encryption. 
  //  * The encryption process of bcrypt is not tested.
  //  */
  // describe('resetPasswordService', () => {
  //   it('should reset the password if the token is valid', async () => {
  //     (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

  //     const user = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'oldHashedPassword',
  //       username: 'testuser',
  //       passwordResetToken: 'validToken',
  //       passwordResetExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
  //     });
  //     await user.save();

  //     await resetPasswordService('validToken', 'newPassword123');

  //     const updatedUser = await User.findOne({ email: 'test@example.com' });
  //     expect(updatedUser?.passwordHash).toBe('newHashedPassword');
  //   });

  //   it('should throw an error if the token is invalid or expired', async () => {
  //     const user = new User({
  //       email: 'test@example.com',
  //       passwordHash: 'oldHashedPassword',
  //       username: 'testuser',
  //       passwordResetToken: 'expiredToken',
  //       passwordResetExpiresAt: new Date(Date.now() - 1000 * 60),
  //     });
  //     await user.save();

  //     await expect(resetPasswordService('expiredToken', 'newPassword123'))
  //       .rejects
  //       .toThrow('Invalid or expired password reset link');
  //   });
  // });

})