const axios = require("axios");
const route = "http://localhost:4000/api/image";
const ImageService = require("../../src/Service/ImageService");
const imageRepository = require("../../src/Adapters/Repositories/ImageRepository");

const imageService = new ImageService(imageRepository);

let image = {
  title: "Test dimage",
  width: 25,
  height: 24,
  forSale: true,
  url: "https://fakeurl.com",
};
let updateImage = {
  title: "Test dimage",
  width: 25,
  height: 24,
  forSale: true,
  url: "https://fakeurl.com",
  $set: {
    title: "w",
    width: "02",
    height: "3",
    forSale: false,
    url: "https://firebasestorage.googleapis.com/v0/b/galleria-de-arte.appspot.com/o/pictures%2Fw?alt=media&token=936e4f97-bd6b-4905-9d5f-9aaa5bd2afc0",
  },
};
let invalidImage = {
  title: null,
  width: "null",
  height: "po",
  url: "badFakeurl",
};

const NON_EXISTING_ID = "24143a8014829a865bbf700d";

describe(`Create a new Image`, () => {
  imageRepository.insert = jest.fn().mockReturnValue({
    success: true,
    message: "The image was created successfully",
  });

  test(`The image should be created correctly`, async (done) => {
    let response = await imageService.create(image);
    expect(response.success).toBe(true);
    expect(response.message).toEqual("The image was created successfully");
    done();
  });

  test(`The image should not be created correctly`, async (done) => {
    let response = await imageService.create(invalidImage);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating title");
    done();
  });
});

describe(`Get an image`, () => {
  imageRepository.getAll = jest.fn().mockReturnValueOnce([
    {
      _id: "63dd1ac649710ef31fea7d07",
      title: "w",
      width: "02",
      height: "02",
      forSale: false,
      url: "https://firebasestorage.googleapis.com/v0/b/galleria-de-arte.appspot.com/o/pictures%2Fw?alt=media&token=936e4f97-bd6b-4905-9d5f-9aaa5bd2afc0",
    },
  ]);

  imageRepository.getOne = jest.fn().mockReturnValueOnce({
    _id: "63dd1ac649710ef31fea7d07",
    title: "w",
    width: "02",
    height: "02",
    forSale: false,
    url: "https://firebasestorage.googleapis.com/v0/b/galleria-de-arte.appspot.com/o/pictures%2Fw?alt=media&token=936e4f97-bd6b-4905-9d5f-9aaa5bd2afc0",
  });

  test(`When getAll is called I should receive an array`, async (done) => {
    let response = await imageService.getAll();
    expect(response).toEqual([
      {
        _id: "63dd1ac649710ef31fea7d07",
        title: "w",
        width: "02",
        height: "02",
        forSale: false,
        url: "https://firebasestorage.googleapis.com/v0/b/galleria-de-arte.appspot.com/o/pictures%2Fw?alt=media&token=936e4f97-bd6b-4905-9d5f-9aaa5bd2afc0",
      },
    ]);
    expect(response.length).toBeGreaterThanOrEqual(1);
    expect(response).toBeInstanceOf(Array);

    done();
  });

  test(`When getOne is called I should recieve an array`, async (done) => {
    let response = await imageService.getImageById("63dd1ac649710ef31fea7d07");
    expect(response).toEqual({
      _id: "63dd1ac649710ef31fea7d07",
      title: "w",
      width: "02",
      height: "02",
      forSale: false,
      url: "https://firebasestorage.googleapis.com/v0/b/galleria-de-arte.appspot.com/o/pictures%2Fw?alt=media&token=936e4f97-bd6b-4905-9d5f-9aaa5bd2afc0",
    });
    done();
  });

  test(`When getOne is called with a non existing id I should recieve an error`, async (done) => {
    imageRepository.getOne = jest.fn().mockReturnValueOnce({
      success: false,
      message: "",
    });
    let response = await imageService.getImageById(NON_EXISTING_ID);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("");
    done();
  });
});

describe(`Delete an image`, () => {
  imageRepository.delete = jest.fn().mockReturnValue({
    success: true,
    message: "The item 63dd1ac649710ef31fea7d07 was deleted successfully",
  });

  test(`When Delete is called I should recieve a success response`, async (done) => {
    let response = await imageService.delete("63dd1ac649710ef31fea7d07");
    expect(response.success).toEqual(true);
    expect(response.message).toEqual(
      "The item 63dd1ac649710ef31fea7d07 was deleted successfully"
    );
    done();
  });

  test(`When Delete is called and id don't exist I should recieve an error message`, async (done) => {
    imageRepository.delete = jest
      .fn()
      .mockRejectedValue(new Error("Mock error"));

    let response = await imageService.delete(NON_EXISTING_ID);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("Error: Mock error");
    done();
  });
});

describe(`Update an image`, () => {
  imageRepository.update = jest.fn().mockReturnValue({
    success: true,
    message: "The image was updated successfully",
  });

  test(`When update is called I should recieve a success true response`, async (done) => {
    let response = await imageService.update(
      "63dd1ac649710ef31fea7d07",
      updateImage
    );
    expect(response.success).toEqual(true);
    expect(response.message).toEqual(
      "The item 63dd1ac649710ef31fea7d07 was deleted successfully"
    );
    done();
  });

  test(`When update is called and id don't exist I should recieve an error message`, async (done) => {
    imageRepository.update = jest
      .fn()
      .mockRejectedValue(new Error("Mock error"));
    let response = await imageService.update(NON_EXISTING_ID, updateImage);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("Error: Mock error");
    done();
  });
});
