const app = require("../api/app");
const request = require("supertest");
const endpoints = require("../endpoints.json");

describe("/api", () => {
  it("GET:200 responds with an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
      });
  });

  it("GET:200 response object has keys for each endpoint that have the following properties", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        for (const key in endpoints) {
          expect(endpoints[key]).toHaveProperty("description");
          expect(endpoints[key]).toHaveProperty("queries");
          expect(endpoints[key]).toHaveProperty("exampleRequest");
          expect(endpoints[key]).toHaveProperty("exampleResponse");
        }
      });
  });

  it("GET:200 responds with an updated reflection of the endpoints object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
