import Question from "./question.js";
import Tag from "./tag.js";
import Answer from "./answer.js";

export default class Application {
  constructor({ questions, tags, answers }) {
    this.questions = [];
    this.tags = [];
    this.answers = [];

    questions.forEach((q) => {
      this.questions.push(new Question(q));
    });

    tags.forEach((t) => {
      this.tags.push(new Tag(t));
    });

    answers.forEach((a) => {
      this.answers.push(new Answer(a));
    });
  }

  addAnswer = (qid, answer) => {
    let aid = "a" + (this.answers.length + 1);

    let newanswer = {
      aid: aid,
      text: answer.text,
      ansBy: answer.ansBy,
      ansDate: new Date(),
    };

    this.answers.push(new Answer(newanswer));

    this.getQuestionById(qid).addAnswer(aid);

    return aid;
  };

  addQuestion = (question) => {
    let tagIds = question.tags.map((tname) => this.addTag(tname));
    let qid = "q" + new Date();
    let newQuestion = {
      qid: qid,
      title: question.title,
      text: question.text,
      askedBy: question.askedBy,
      askDate: new Date(),
      ansIds: [],
      tagIds: tagIds,
      views: 0,
    };

    this.questions.push(new Question(newQuestion));

    return qid;
  };

  addTag = (tagname) => {
    let tag = null;

    for (let idx = 0; idx < this.tags.length; idx++) {
      if (this.tags[idx].name == tagname) {
        tag = this.tags[idx];
        break;
      }
    }
    if (tag != null) {
      return tag.tid;
    } else {
      let newId = "t" + (this.tags.length + 1);
      let newTag = { tid: newId, name: tagname };
      this.tags.push(new Tag(newTag));
      return newId;
    }
  };

  getQuestionCountByTag = (tid) => {
    let cnt = 0;
    this.questions.forEach((q) => {
      q.tagIds.forEach((t) => {
        if (t == tid) cnt++;
      });
    });

    return cnt;
  };

  getQuestionsByFilter = (order = "newest", search = "") => {
    search = search.toLocaleLowerCase();
    let qlist = [];
    if (order == "active") {
      qlist = this.#getActiveQuestion();
    } else if (order == "unanswered") {
      qlist = this.#getUnansweredQuestion();
    } else {
      qlist = this.#getNewestQuestion();
    }

    let searchTags = this.#parseTags(search);
    let searchKeyword = this.#parseKeyword(search);

    const res = qlist.filter((q) => {
      if (searchKeyword.length == 0 && searchTags.length == 0) {
        return true;
      } else if (searchKeyword.length == 0) {
        return this.#checkTagInQuestion(q, searchTags);
      } else if (searchTags.length == 0) {
        return this.#checkKeywordInQuestion(q, searchKeyword);
      } else {
        return (
          this.#checkKeywordInQuestion(q, searchKeyword) ||
          this.#checkTagInQuestion(q, searchTags)
        );
      }
    });

    return res;
  };

  getQuestionById = (qid) => {
    return this.questions.find((q) => q.qid == qid);
  };

  getQuestionAnswer = (question) => {
    if (question == null) {
      return [];
    }
    return this.answers
      .filter((a) => {
        for (let aid of question.getAnswersId()) {
          if (aid == a.aid) {
            return true;
          }
        }
        return false;
      })
      .sort((x, y) => {
        if (x.ansDate > y.ansDate) {
          return -1;
        } else if (x.ansDate < y.ansDate) {
          return 1;
        } else {
          return 0;
        }
      });
  };

  getTagCount = () => {
    return this.tags.length;
  };

  getTags = () => {
    return this.tags;
  };

  getTagById = (id) => {
    for (let t of this.tags) {
      if (t.tid == id) {
        return t;
      }
    }

    return null;
  };

  getAnswerById = (id) => {
    for (let a of this.answers) {
      if (a.aid == id) {
        return a;
      }
    }

    return null;
  };

  #getNewestQuestion = () => {
    return this.questions.sort((a, b) => {
      if (a.askDate > b.askDate) {
        return -1;
      } else if (a.askDate < b.askDate) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  #getUnansweredQuestion = () => {
    return this.#getNewestQuestion().filter((q) => q.ansIds.length == 0);
  };

  #getActiveQuestion = () => {
    this.questions.forEach((q) => {
      q.ansIds.forEach((aid) => {
        let a = this.getAnswerById(aid);
        if (a != null) {
          q.setNewestAnswerDate(a.ansDate);
        }
      });
    });

    return this.#getNewestQuestion().sort((a, b) => {
      if (!a.newAnsDate) {
        return 1;
      } else if (!b.newAnsDate) {
        return -1;
      }

      if (a.newAnsDate > b.newAnsDate) {
        return -1;
      } else if (a.newAnsDate < b.newAnsDate) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  #checkKeywordInQuestion = (q, keywordlist) => {
    for (let w of keywordlist) {
      if (
        q.title.toLocaleLowerCase().includes(w.toLocaleLowerCase()) ||
        q.text.toLocaleLowerCase().includes(w.toLocaleLowerCase())
      ) {
        return true;
      }
    }

    return false;
  };

  #checkTagInQuestion = (q, taglist) => {
    for (let tag of taglist) {
      for (let tid of q.tagIds) {
        if (
          tag.toLocaleLowerCase() ==
          this.getTagById(tid).name.toLocaleLowerCase()
        ) {
          return true;
        }
      }
    }

    return false;
  };

  #parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
      word.slice(1, -1)
    );
  };

  #parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
  };
}
