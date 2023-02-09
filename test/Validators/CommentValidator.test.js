const axios = require("axios");
const route = "http://localhost:4000/api/comment";
const CommentValidator = require("../../src/Entities/Validators/CommentValidator");

const commentValidator = new CommentValidator();

let comment = {
  title: "Test comment",
  width: 25,
  height: 24,
  forSale: true,
  url: "https://fakeurl.com",
};

let invalidComment = {
  title: null,
  width: "null",
  height: "po",
  url: "badFakeurl",
};

const NON_EXISTING_ID = "24143a8014829a865bbf700d";

describe(`Comment validator`, () => {
  test(`The comment should be pass the validator`, async (done) => {
    let response = commentValidator.validate(comment);
    expect(response.success).toBe(true);
    expect(response.message).toEqual("");
    done();
  });

  test(`A error in the title should not pass the validator`, async (done) => {
    let response = commentValidator.validate(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating title");
    done();
  });

  test(`A error in the height should not pass the validator`, async (done) => {
    invalidComment.title = "title";
    let response = commentValidator.validate(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating height");
    done();
  });

  test(`A error in the width should not pass the validator`, async (done) => {
    invalidComment.height = "34";
    let response = commentValidator.validate(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating width");
    done();
  });

  test(`A error in the url should not pass the validator`, async (done) => {
    invalidComment.width = "34";
    let response = commentValidator.validate(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating url");
    done();
  });

  test(`A error in the url should not pass the validator`, async (done) => {
    invalidComment.width = "34";
    let response = commentValidator.validate(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating url");
    done();
  });
});
