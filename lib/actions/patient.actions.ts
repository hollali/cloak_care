"use server";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {
	BUCKET_ID,
	DATABASE_ID,
	ENDPOINT,
	PATIENT_COLLECTION_ID,
	PROJECT_ID,
	databases,
	storage,
	users,
} from "../appwrite.config";

//! CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
	try {
		const newUser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		return parseStringify(newUser);
	} catch (error: any) {
		if (error && error?.code === 409) {
			const documents = await users.list([Query.equal("email", [user.email])]);
			return documents?.users[0];
		}
	}
};
