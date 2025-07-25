import { getUserByUsername, createUser as createUserModel } from '../models/user.model.js';

export const findByUsername = async (username) => {
  return await getUserByUsername(username);
};

export const createUser = async (userData) => {
  return await createUserModel(userData);
}; 