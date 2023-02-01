const axios = require("axios");
const route = "http://localhost:4000/api/image";

let image = {
  title: "Test image",
  width: 25,
  height: 24,
  forSale: true,
  url: "https://fakeurl.com",
};

let newImage = {
  title: "New Test image",
  width: 50,
  height: 45,
  forSale: true,
  url: "https://newfakeurl.com",
};

let invalidImage = {
  title: null,
  width: null,
  height: 45,
  forSale: true,
  url: "badFakeurl",
};

let modelName = "Images";
const NON_EXISTING_ID = "24143a8014829a865bbf700d";

describe(`GET method for ${modelName}`, () => {
  test(`Should GET an array with all ${modelName} items`, async (done) => {
    try {
      const response = await axios.get(route);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expect.any(Array));
      expect(response.data.length).toBe(0);
      done();
    } catch (error) {
      console.log("Error: ", error);
      done.fail(error);
    }
  });

  test(`Should GET a single ${modelName} item by ID`, async (done) => {
    try {
      await axios.post(route, image);
      let response = await axios.get(route);
      let currentImage = response.data.find(
        (element) => element.title === image.title
      );
      response = await axios.get(route + "/" + currentImage._id);
      await axios.delete(route + "/" + currentImage._id);
      expect(response.status).toBe(200);
      expect(response.data[0].title).toEqual(image.title);
      expect(response.data).toEqual(expect.any(Object));
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  test(`Should NOT GET a ${modelName} item  when Non-existing ID is sent`, async (done) => {
    try {
      const response = await axios.get(route + "/" + NON_EXISTING_ID);
      expect(response.status).toBe(200);
      expect(response.data[0]).toBeUndefined();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

describe(`DELETE method for ${modelName}`, () => {
  test(`Should DELETE the ${modelName} item and reply with status 200`, async (done) => {
    try {
      await axios.post(route, image);
      let response = await axios.get(route);
      let currentImage = response.data.find(
        (element) => element.title === image.title
      );
      await axios.delete(route + "/" + currentImage._id);
      response = await axios.get(route + "/" + currentImage._id);
      expect(response.status).toBe(200);
      expect(response.data[0]).toBeUndefined();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

describe(`POST method for ${modelName}`, () => {
  test(`Should INSERT a new ${modelName} item`, async (done) => {
    try {
      await axios.post(route, image);
      let response = await axios.get(route);
      expect(response.data.length).toEqual(1);
      expect(response.status).toBe(200);
      let currentImage = response.data.find(
        (element) => element.title === image.title
      );
      response = await axios.get(route + "/" + currentImage._id);
      expect(response.data[0].title).toEqual(image.title);
      await axios.delete(route + "/" + currentImage._id);
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  test(`Should NOT INSERT a new ${modelName} item and reply with status 200 when required fields are empty`, async (done) => {
    try {
      await axios.post(route, invalidImage);
      let response = await axios.get(route);
      expect(response.data.length).toEqual(0);
      expect(response.status).toBe(200);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});

describe(`PUT method for ${modelName}`, () => {
  test(`Should UPDATE the ${modelName} item by ID with the provided data`, async (done) => {
    try {
      await axios.post(route, image);
      let response = await axios.get(route);
      let currentImage = response.data.find(
        (element) => element.title === image.title
      );
      newImage.id = currentImage._id;
      response = await axios.put(route, newImage);
      expect(response.status).toBe(200);
      response = await axios.get(route + "/" + currentImage._id);
      expect(response.data[0].title).toEqual(newImage.title);
      await axios.delete(route + "/" + currentImage._id);
      done();
    } catch (error) {
      done.fail(error);
    }
  });

  test(`Should NOT UPDATE the ${modelName} item and reply with status 200 when NON_EXISTING_ID ID is sent`, async (done) => {
    try {
      await axios.post(route, image);
      let response = await axios.get(route);
      let currentImage = response.data.find(
        (element) => element.title === image.title
      );
      newImage.id = NON_EXISTING_ID;
      response = await axios.put(route, newImage);
      expect(response.status).toBe(200);
      response = await axios.get(route + "/" + currentImage._id);
      expect(response.data[0].title).toEqual(image.title);
      await axios.delete(route + "/" + currentImage._id);
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});
