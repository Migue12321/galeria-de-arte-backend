const axios = require("axios");
const route = "http://localhost:4000/api/image";
const ImageValidator = require("../../src/Entities/Validators/ImageValidator");

const imageValidator = new ImageValidator();

let image = {
  title: "Test image",
  width: 25,
  height: 24,
  forSale: true,
  url: "https://fakeurl.com",
};

let invalidImage = {
  title: null,
  width: "null",
  height: "po",
  url: "badFakeurl",
};

const NON_EXISTING_ID = "24143a8014829a865bbf700d";

describe(`Image validator`, () => {
  test(`The image should be pass the validator`, async (done) => {
    let response = imageValidator.validate(image);
    expect(response.success).toBe(true);
    expect(response.message).toEqual("");
    done();
  });

  test(`A error in the title should not pass the validator`, async (done) => {
    let response = imageValidator.validate(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating title");
    done();
  });

  test(`A error in the height should not pass the validator`, async (done) => {
    invalidImage.title = "title";
    let response = imageValidator.validate(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating height");
    done();
  });

  test(`A error in the width should not pass the validator`, async (done) => {
    invalidImage.height = "34";
    let response = imageValidator.validate(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating width");
    done();
  });

  test(`A error in the url should not pass the validator`, async (done) => {
    invalidImage.width = "34";
    let response = imageValidator.validate(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating url");
    done();
  });

  test(`A error in the url should not pass the validator`, async (done) => {
    invalidImage.width = "34";
    let response = imageValidator.validate(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating url");
    done();
  });
});
