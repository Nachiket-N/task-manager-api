const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should Signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Nachiket1",
			email: "abc@example.com",
			password: "abcpass123",
			age: 21,
		})
		.expect(201);

	//Assert that DB was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	//Assertions about the response
	expect(response.body).toMatchObject({
		user: {
			name: "Nachiket1",
			email: "abc@example.com",
		},
		token: user.tokens[0].token,
	});

	expect(user.password).not.toBe("abcpass123");
});

test("Should Login Existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should NOT Login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: "wrongEmail@example.com",
			password: "wrongPassword",
		})
		.expect(400);
});

test("Should Get profile for user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Should Delete Account for User", async () => {
	await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const deletedUser = await User.findById(userOneId);
	expect(deletedUser).toBeNull();
});

test("Should NOT Delete Account for unauthenticated User", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("Should Upload Avatar Image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/profile-pic.jpg")
		.expect(200);
	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should Update Valid user Fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: "NewName",
		})
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user.name).toEqual("NewName");
});

test("Should Not Update Invalid user Fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: "Mumbai",
		})
		.expect(400);
});

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
