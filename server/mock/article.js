
const faker = require("faker");
const fs = require("fs");
const path = require("path");
const articleList = [];
const { allTag } = require('./tag')
const mockFullContent = fs
  .readFileSync(path.join(__dirname, "../../static/md/example.md"))
  .toString();
faker.locale = "zh_CN";

for (let i = 0; i < 100; i++) {
  articleList.push({
    id: i,
    title: faker.lorem.sentence(6, 10),
    abstractContent: faker.lorem.sentences(8),
    imageURL: "/example.png",
    timestamp: faker.date.past().getTime(),
    author: faker.name.findName(),
    tag: faker.random.arrayElement(allTag),
    preface: faker.lorem.sentences(5),
    fullContent: mockFullContent
  });
}

module.exports = {
  allArticle: articleList,
  getArticlePage: (page, pageSize) => articleList.slice((page-1)*pageSize, (page-1)*pageSize + pageSize),
  getArticleByTag: (tag, page, pageSize) => {
    const result = articleList.filter(val => val.tag.name === tag)
    return {
      total: result.length,
      data: result.slice((page-1)*pageSize, (page-1)*pageSize + pageSize)
    }
  }
}