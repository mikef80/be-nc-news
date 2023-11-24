require("jest-sorted");
require("jest-extended");
const app = require("../app");
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
  describe("GET", () => {
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
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    it("GET:200 returns an array of the correct length", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments).toHaveLength(11);
        });
    });

    it("GET:200 returns elements that each have the correct properties and sorted by most recent first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment, index) => {
            expect(comment).toContainKeys([
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body",
              "article_id",
            ]);
          });

          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("GET:404 responds with 'article not found' when passed an article_id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/14/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });

    it("GET:400 responds with 'bad request' when passed an invalid article_id", () => {
      return request(app)
        .get("/api/articles/chickens/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("GET:200 responds with an empty array if an article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
  });

  describe("POST", () => {
    it("POST:201 responds with the correct comment object", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: "lurker",
          body: "This is the greatest comment.  EVER.",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            author: "lurker",
            body: "This is the greatest comment.  EVER.",
            votes: 0,
          });
          expect(body.comment).toHaveProperty("comment_id");
        });
    });

    it("POST:400 responds with 'bad request' if provided with invalid article_id", () => {
      return request(app)
        .post("/api/articles/chickens/comments")
        .send({
          username: "lurker",
          body: "This is the greatest comment.  EVER.",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("POST:404 responds with 'article not found' if provided with a non-existent article_id", () => {
      return request(app)
        .post("/api/articles/27/comments")
        .send({
          username: "lurker",
          body: "This is the greatest comment.  EVER.",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });

    it("POST:400 responds with 'bad request' if missing a field in the request body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ body: "This comment shouldn't work" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("POST:404 responds with 'user not found' if user doesn't exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "mikef80", body: "This comment also shouldn't work" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user not found");
        });
    });

    it("POST:201 responds with the correct comment object and ignores additional fields passed in", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: "lurker",
          body: "I'm ignoring extra fields",
          chickens: 7,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            author: "lurker",
            body: "I'm ignoring extra fields",
          });
          expect(body.comment).toHaveProperty("comment_id");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
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

    it("GET:404 responds with 'article not found' if provided with a valid article_id but doesn't exist", () => {
      return request(app)
        .get("/api/articles/14")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
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

    it("GET:200 includes 'comment_count' in the article body", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("comment_count");
        });
    });
  });

  describe("PATCH", () => {
    it("PATCH:200 returns the correct updated article and increments  the article votes property by the correct amount", () => {
      return request(app)
        .patch("/api/articles/8")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(8);
          expect(body.article.votes).toBe(5);
        });
    });

    it("PATCH:200 decrements the article votes when passed a negative number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(90);
        });
    });

    it("PATCH:400 returns 'bad request' if provided with an invalid article_id", () => {
      return request(app)
        .patch("/api/articles/chickens")
        .send({ inc_votes: -10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("PATCH:404 responds with 'article not found' if provided with a valid article_id but doesn't exist", () => {
      return request(app)
        .patch("/api/articles/14")
        .send({ inc_votes: -10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });

    it("PATCH:400 returns 'bad request' if passed a non-numeric value for 'inc_votes' property", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "test" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("PATCH:400 returns 'bad request' if not passed a request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send()
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    it("GET:200 responds with an array of the correct length", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles).toHaveLength(13);
        });
    });

    it("GET:200 responds with articles with the correct properties, sorted by 'created_at' in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          body.articles.forEach((article) => {
            const requestedKeys = [
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "article_img_url",
              "comment_count",
            ];

            expect(article).toContainKeys(requestedKeys);

            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(new Date(article.created_at)).toBeInstanceOf(Date);
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(article).not.toContainKey("body");
          });
        });
    });
    describe("OPTIONAL QUERY", () => {
      it("GET:200 should take an optional 'topic' query which filters the resulting articles by the topic value", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(1);
            body.articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });

      it("GET:200 returns an empty array if provided with a topic that does exist but has no associated articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            // console.log(body);
            expect(body.articles).toEqual([]);
          });
      });

      it("GET:404 should return 'topic not found' if provided with a topic that doesn't exist in the database", () => {
        return request(app)
          .get("/api/articles?topic=dogs")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("topic not found");
          });
      });
    });
  });

  describe("ADVANCED", () => {
    it("GET:200 accepts an optional 'sort_by' query which returns the result sorted by the selected column", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });

    it("GET:400 returns a 'bad request' error when passed an invalid 'sort_by' argument", () => {
      return request(app)
        .get("/api/articles?sort_by=chickens")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("GET:200 returns a query sorted by the default 'created_at' when passed an empty 'sort_by' argument", () => {
      return request(app)
        .get("/api/articles?sort_by=")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("GET:200 accepts an optional 'order' query which returned the results sorted accordingly", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: false,
          });
        });
    });

    it("GET:200 returns an array sorted by the 'sort_by' query and ordered by the 'order' query", () => {
      return request(app)
        .get("/api/articles?order=asc&sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("article_id", {
            descending: false,
          });
        });
    });

    it("GET:400 returns a 'bad request' error when passed an invalid 'order' argument", () => {
      return request(app)
        .get("/api/articles?order=chickens")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("DELETE:204 responds with a 204 status and no response body when passed a valid comment_id", () => {
      return request(app).delete("/api/comments/16").expect(204);
    });

    it("DELETE:400 responds with 'bad request' if 'comment_id' is invalid", () => {
      return request(app)
        .delete("/api/comments/chickens")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    it("DELETE:404 responds with 'comment not found' if comment_id is valid but doesn't exist", () => {
      return request(app)
        .delete("/api/comments/20")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment not found");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("GET:200 returns an array", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length).toBe(4);
        });
    });

    it("GET:200 returns array of objects with the required properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.users.forEach((user) => {
            expect(user).toContainKeys(["username", "name", "avatar_url"]);
          });
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
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
});
