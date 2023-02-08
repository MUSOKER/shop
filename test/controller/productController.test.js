// test("GET /api/posts", async () => {
//   const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

//   await supertest(app)
//     .get("/api/posts")
//     .expect(200)
//     .then((response) => {
//       // Check type and length
//       expect(Array.isArray(response.body)).toBeTruthy();
//       expect(response.body.length).toEqual(1);

//       // Check data
//       expect(response.body[0]._id).toBe(post.id);
//       expect(response.body[0].title).toBe(post.title);
//       expect(response.body[0].content).toBe(post.content);
//     });
// });

// test("POST /api/posts", async () => {
//   const data = { title: "Post 1", content: "Lorem ipsum" };

//   await supertest(app)
//     .post("/api/posts")
//     .send(data)
//     .expect(200)
//     .then(async (response) => {
//       // Check the response
//       expect(response.body._id).toBeTruthy();
//       expect(response.body.title).toBe(data.title);
//       expect(response.body.content).toBe(data.content);

//       // Check data in the database
//       const post = await Post.findOne({ _id: response.body._id });
//       expect(post).toBeTruthy();
//       expect(post.title).toBe(data.title);
//       expect(post.content).toBe(data.content);
//     });
// });
///////////////////////////////////////////////////
// const request = require("supertest");
// const app = require("../app");

// describe("GET /users", () => {
//   it("should return a list of users", async () => {
//     const res = await request(app).get("/users");
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toEqual([
//       { id: 1, name: "John Doe" },
//       { id: 2, name: "Jane Smith" },
//     ]);
//   });
// });
////////////////////////////////////////////////////////////////////////////
const app = require("../../app");

const supertest = require("supertest");
const Product = require("../../models/product");

describe("POST /upload", () => {
  const data = {
    name: "iphone",
    description: "legit",
    price: "4000000",
  };
  it("should return the main product image created", async () => {
    await supertest(app)
      .post("/api/v1/products/upload")
      .send(data)
      .expect(200)
      .then(async (res) => {
        //checking the response
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toBe(data.name);
        expect(res.body.description).toBe(data.description);
        expect(res.body.price).toBe(data.price);

        //checking the data in the database
        const product = await Product.findOne({ id: res.body._id });
        expect(product).toBeTruthy();
        expect(product.name).toBe(data.name);
        expect(product.description).toBe(data.description);
        expect(product.price).toBe(data.price);
      });
  });
});
