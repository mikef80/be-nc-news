require("jest-sorted");
require("jest-extended");
const app = require("../api/app");
const request = require("supertest");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("/api/topics", () => {
  it("GET:200 sends an array to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });

  it("GET:200 return array is populated with objects that have the required properties - 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  it("GET:200 returns an array of the correct length", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
      });
  });
});

describe.skip("/api/articles/:article_id/comments", () => {
  it("POST:201 responds with the correct comment object", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "mikef80",
        body: "This is the greatest comment.  EVER.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "mikef80",
          body: "This is the greatest comment.  EVER.",
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("GET:200 responds with correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article.article_id).toBe(1);
      });
  });

  it("GET:200 response object has the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.article_id).toBe("number");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.topic).toBe("string");
        expect(new Date(body.article.created_at)).toBeInstanceOf(Date);
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });

  it("GET:404 responds with 'not found' if provided with a valid article_id but doesn't exist", () => {
    return request(app)
      .get("/api/articles/14")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });

  it("GET:400 responds with 'bad request' if article if provided with an invalid article_id", () => {
    return request(app)
      .get("/api/articles/chickens")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/articles", () => {
  it("GET:200 responds with an array of the correct length", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles).toHaveLength(13);
      });
  });

  it("GET:200 responds with articles with the correct properties, sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        body.articles.forEach((article) => {
          const requestedKeys = [
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
          ];

          expect(article).toContainKeys(requestedKeys);

          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(new Date(article.created_at)).toBeInstanceOf(Date);
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article).not.toContainKey("body");
        });
      });
  });
});

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
