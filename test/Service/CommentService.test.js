const axios = require("axios");
const route = "http://localhost:4000/api/comment";
const CommentService = require("../../src/Service/CommentService");
const commentRepository = require("../../src/Adapters/Repositories/CommentRepository");

const commentService = new CommentService(commentRepository);
let comment = {
  comment: "Test comment",
  imageId: "24143a8014829a865bbf700d",
};

let updateComment = {
  comment: "New Test comment",
  imageId: "24143a8014829a865bbf700d",
  $set: {
    comment: "Update Test comment",
    imageId: "24143a8014829a865bbf700d",
  },
  
};

let invalidComment = {
  comment: null,
  imageId: "24143a8014829a865bbf700d",
};

const NON_EXISTING_ID = "24143a8014829a865bbf700d";

describe(`Create a new Comment`, () => {
  commentRepository.insert = jest.fn().mockReturnValue({
    success: true,
    message: "The comment was created successfully",
  });

  test(`The comment should be created correctly`, async (done) => {
    let response = await commentService.create(comment);
    expect(response.success).toBe(true);
    expect(response.message).toEqual("The comment was created successfully");
    done();
  });

  test(`The comment should not be created correctly`, async (done) => {
    let response = await commentService.create(invalidComment);
    expect(response.success).toBe(false);
    expect(response.message).toEqual("Error validating comment");
    done();
  });
});

describe(`Get an comment`, () => {
  commentRepository.getAll = jest.fn().mockReturnValueOnce([
    {
      _id: "63dd1ac649710ef31fea7d07",
      comment: "Test comment",
      imageId: "24143a8014829a865bbf700d",
    },
  ]);

  commentRepository.getOne = jest.fn().mockReturnValueOnce({
    _id: "63dd1ac649710ef31fea7d07",
    comment: "Test comment",
    imageId: "24143a8014829a865bbf700d",
  });

  test(`When getAll is called I should receive an array`, async (done) => {
    let response = await commentService.getAll();
    expect(response).toEqual([
      {
        _id: "63dd1ac649710ef31fea7d07",
        comment: "Test comment",
        imageId: "24143a8014829a865bbf700d",
      },
    ]);
    expect(response.length).toBeGreaterThanOrEqual(1);
    expect(response).toBeInstanceOf(Array);

    done();
  });

  test(`When getOne is called I should recieve an array`, async (done) => {
    let response = await commentService.getCommentById(
      "63dd1ac649710ef31fea7d07"
    );
    expect(response).toEqual({
      _id: "63dd1ac649710ef31fea7d07",
      comment: "Test comment",
      imageId: "24143a8014829a865bbf700d",
    });
    done();
  });

  test(`When getOne is called with a non existing id I should recieve an error`, async (done) => {
    commentRepository.getOne = jest.fn().mockReturnValueOnce({
      success: false,
      message: "",
    });
    let response = await commentService.getCommentById(NON_EXISTING_ID);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("");
    done();
  });
});

describe(`Delete an comment`, () => {
  commentRepository.delete = jest.fn().mockReturnValue({
    success: true,
    message: "The item 63dd1ac649710ef31fea7d07 was deleted successfully",
  });

  test(`When Delete is called I should recieve a success response`, async (done) => {
    let response = await commentService.delete("63dd1ac649710ef31fea7d07");
    expect(response.success).toEqual(true);
    expect(response.message).toEqual(
      "The item 63dd1ac649710ef31fea7d07 was deleted successfully"
    );
    done();
  });

  test(`When Delete is called and id don't exist I should recieve an error message`, async (done) => {
    commentRepository.delete = jest
      .fn()
      .mockRejectedValue(new Error("Mock error"));

    let response = await commentService.delete(NON_EXISTING_ID);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("Error: Mock error");
    done();
  });
});

describe(`Update an comment`, () => {
  commentRepository.update = jest.fn().mockReturnValue({
    success: true,
    message: "The comment was updated successfully",
  });

  test(`When update is called I should recieve a success true response`, async (done) => {
    let response = await commentService.update(
      "63dd1ac649710ef31fea7d07",
      updateComment
    );
    expect(response.success).toEqual(true);
    expect(response.message).toEqual(
      "The comment was updated successfully"
    );
    done();
  });

  test(`When update is called and id don't exist I should recieve an error message`, async (done) => {
    commentRepository.update = jest
      .fn()
      .mockRejectedValue(new Error("Mock error"));
    let response = await commentService.update(NON_EXISTING_ID, updateComment);
    expect(response.success).toEqual(false);
    expect(response.message).toEqual("Error: Mock error");
    done();
  });
});
