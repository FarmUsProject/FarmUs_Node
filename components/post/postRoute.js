module.exports = (app) => {
    const postController = require("./postController");

    // 후기 불러오기
    app.get("/post/getPostring:FarmID", postController.getPostings);

    //후기 작성
    app.post("/post:FarmID", postController.writePost)
}