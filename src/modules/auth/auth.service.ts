import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IUserRegisterPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

const registerUserInDB = async (payload: IUserRegisterPayload) => {
  const { name, email, password, phone, role, status } = payload;

  const doUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (doUserExist) {
    throw new Error("User already exist");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      phone,
      role,
      status,
    },
  });

  const result = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

const loginUserInDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isMatchedPassword = await bcrypt.compare(password, user.password);

  if (!isMatchedPassword) {
    throw new Error(
      "The password you have provided is wrong. Please provide a valid password",
    );
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken
  }
};


const getMeFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    });

    return user;
}

export const authService = {
  registerUserInDB,
  loginUserInDB,
  getMeFromDB
};
