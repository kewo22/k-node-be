const request = require("request");

describe("get messages", () => {
  it("should return 200 ok", (done) => {
    request.get("http://localhost:3009/messages", (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it("should return a list, that's not empty", (done) => {
    request.get("http://localhost:3009/messages", (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});
