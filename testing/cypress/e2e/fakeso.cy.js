
describe("Sign In", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  after(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('Sign in as a general user should lead to home page', () => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains('Trending Questions');
  })

  it('Sign in as a moderator should lead to home page', () => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
    
    cy.contains('reported questions');
  })

  it('Sign in with invalid credentials should show an error', () => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("invalid")
    cy.get("#password").type("invalid")
    cy.get("#signInButton").click()
    
    cy.contains('Invalid credentials');
  });
});


describe("Sign Up", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  after(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('Sign up as a general user should be succesful and lead back to sign in page', () => {
    cy.visit("http://localhost:3000");
    cy.get("#signUpLink").click()
    cy.get("#firstName").type("firstName")
    cy.get("#lastName").type("lastName")
    cy.get("#email").type("newUser@gmail.com")
    cy.get("#password").type("test")

    cy.get('input[id=":r4:"]').type('New York, NY');


    cy.get("#signUpButton").click()

    cy.contains('User registered successfully');
    cy.contains('Sign In');
  })

  it('Sign up with missing fields should show an error', () => {
    cy.visit("http://localhost:3000");
    cy.get("#signUpLink").click()
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');
    
    cy.get("#firstName").type("firstName")
    cy.get("#signUpButton").click()
    
    cy.contains('Make sure you fill all the required fields!');

    cy.get("#lastName").type("lastName")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');

    cy.get("#email").type("test@gmail.com")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');

    cy.get("#password").type("test")
    cy.get("#signUpButton").click()

    cy.contains('Make sure you fill all the required fields!');
  });

});


describe("Ask Question", () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");

    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  it('Ask a question should be succesful and lead back to home page', () => {

    cy.get("#askQuestionButton").click()
    cy.get("#title").type("How to compare two double values in Java?")
    cy.get("#description").type("A simple comparison of two double values in Java creates some problems. Let's consider the following simple code snippet in Java.")
    cy.get("#tags").type("tag1").type("{enter}")
    
    cy.get("#postQuestionButton").click()

    cy.contains('All Questions');
    cy.contains('How to compare two double values in Java?');
  });

  it("Check if questions are displayed in descending order of dates.", () => {
    const qTitles = [
      "Object storage for a web application",
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });


  it("successfully shows all questions in model in active order", () => {
    const qTitles = [
      "Quick question about storage on android",
      "Object storage for a web application",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    cy.get("#active").click();
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Adds multiple questions one by one and displays them in All Questions", () => {
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("How to compare two double values in Java?")
    cy.get("#description").type("A simple comparison of two double values in Java creates some problems. Let's consider the following simple code snippet in Java.")
    cy.get("#tags").type("tag1").type("{enter}")
    
    cy.get("#postQuestionButton").click()

    cy.contains('All Questions');
    cy.contains('How to compare two double values in Java?');

    cy.get("#askQuestionButton").click()
    cy.get("#title").type("New Focus Styles & Updated Styling for Button Groups")
    cy.get("#description").type("We’ve released a design update to focus styles across the many components within our design system and as well as a new design for our button group component.")
    cy.get("#tags").type("tag1").type("{enter}")
    
    cy.get("#postQuestionButton").click()

    cy.contains('All Questions');
    
    const qTitles = [
      "How to compare two double values in Java?",
      "New Focus Styles & Updated Styling for Button Groups",
      "Object storage for a web application",
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
  })

  it("Ask a Question creates and displays expected meta data", () => {
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("How to compare two double values in Java?")
    cy.get("#description").type("A simple comparison of two double values in Java creates some problems. Let's consider the following simple code snippet in Java.")
    cy.get("#tags").type("tag1").type("{enter}")
    
    cy.get("#postQuestionButton").click()

    cy.contains('All Questions');
    cy.contains('How to compare two double values in Java?');

    const answers = [
      "0 answers",
      "1 answers",
      "2 answers",
      "3 answers",
      "2 answers",
    ];
    const views = [
      "0 views",
      "103 views",
      "200 views",
      "55 views",
      "23 views",
    ];

    const votes = [
      "0 votes",
      "0 votes",
      "-1 votes",
      "2 votes",
      "1 votes",
    ]
    cy.get(".postStats").each(($el, index, $list) => {
      cy.wrap($el).should("contain", answers[index]);
      cy.wrap($el).should("contain", views[index]);
      cy.wrap($el).should("contain", votes[index]);
    });
    cy.contains("Unanswered").click();
    cy.get(".postTitle").should("have.length", 1);
    cy.contains("1 question");
  });

  it("Ask a Question with empty title shows error", () => {
    cy.get("#askQuestionButton").click()
    cy.get("#description").type("A simple comparison of two double values in Java creates some problems.")
    cy.get("#tags").type("tag1").type("{enter}")
    
    cy.get("#postQuestionButton").click()

    cy.contains('Question title can not be empty');
  });
});



describe("Search Question", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("Search for a question using text content that does not exist", () => {
    cy.get("#searchBar").type("test").type("{enter}");
    cy.contains('No questions found');
    cy.get(".postTitle").should("have.length", 0);
  });

  it("Search string in question text", () => {
    const qTitles = ["Object storage for a web application"];
    cy.visit("http://localhost:3000");
    cy.get("#searchBar").type("40 million{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });


  it("Search string in question text", () => {
    const qTitles = ["Quick question about storage on android"];
    cy.get("#searchBar").type("data remains{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag (t1)", () => {
    const qTitles = ["Programmatically navigate using React router"];
    
    cy.get("#searchBar").type("[react]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag (t2)", () => {
    const qTitles = [
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];

    cy.get("#searchBar").type("[javascript]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag (t3)", () => {
    const qTitles = [
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
    ];

    cy.get("#searchBar").type("[android-studio]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search a question by tag (t4)", () => {
    const qTitles = [
      "Quick question about storage on android",
      "android studio save string shared preference, start activity and load the saved string",
    ];
    cy.get("#searchBar").type("[shared-preferences]{enter}");
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  });

  it("Search for a question using a tag that does not exist", () => {
    cy.get("#searchBar").type("[nonExistentTag]{enter}");
    cy.get(".postTitle").should("have.length", 0);
  });
});



describe("Answer Question", () => {
  beforeEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");

    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("Created new answer should be displayed at the top of the answers page", () => {
    const answers = [
      "Test Answer 1",
      "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
      "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    ];
    cy.contains("Programmatically navigate using React router").click();
    cy.get("#answerQuestionBtn").click();
    cy.get("#description").type(answers[0]);
    cy.get("#postAnswerBtn").click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
    cy.contains("general");
    cy.contains("0 seconds ago");
  });

  it("Answer is mandatory when creating a new answer", () => {
    cy.contains("Programmatically navigate using React router").click();
    cy.get("#answerQuestionBtn").click();
    cy.get("#postAnswerBtn").click();
    // cy.contains("Answer description can not be empty");
  });

  

});


describe("Verifies Question Answer sequence", () => {

  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("6.1 | Adds a question, click active button, verifies the sequence", () => {
    // add a question
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("Test Question A")
    cy.get("#description").type("Test Question A Description")
    cy.get("#tags").type("tag1").type("{enter}")
    cy.get("#postQuestionButton").click()
    
    // add an answer to question of React Router
    cy.contains("Programmatically navigate using React router").click();
    cy.get("#answerQuestionBtn").click();
    cy.get("#description").type("Test Answer A");
    cy.get("#postAnswerBtn").click();

    // go back to main page
    cy.get("#sideBarQuestions").click();

    // add an answer to question of Android Studio
    cy.contains("android studio save string shared preference, start activity and load the saved string").click();
    cy.get("#answerQuestionBtn").click();
    cy.get("#description").type("Test Answer B");
    cy.get("#postAnswerBtn").click();

    // go back to main page
    cy.get("#sideBarQuestions").click();

    // add an answer to question A
    cy.contains("Test Question A").click();
    cy.get("#answerQuestionBtn").click();
    cy.get("#description").type("Test Answer C");
    cy.get("#postAnswerBtn").click();

    // go back to main page
    cy.get("#sideBarQuestions").click();

    // clicks active
    cy.get("#active").click();

    const qTitles = [
      "Test Question A",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
      "Quick question about storage on android",
      "Object storage for a web application",
    ];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  
  });

  it("Checks if a6 and a7 exist in q3 answers page", () => {
    const answers = [
      "Using GridFS to chunk and store content.",
      "Storing content as BLOBs in databases.",
    ];
    cy.contains("Object storage for a web application").click();
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
  });

  it("Checks if a8 exist in q4 answers page", () => {
    cy.contains("Quick question about storage on android").click();
    cy.contains("Store data in a SQLLite database.");
  });

});



describe("Tags", () => {

  beforeEach(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("Adds a question with tags, checks the tags existied", () => {
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("Test Question A")
    cy.get("#description").type("Test Question A Description")
    cy.get("#tags").type("test1").type("{enter}")
    cy.get("#tags").type("test2").type("{enter}")
    cy.get("#tags").type("test3").type("{enter}")
    cy.get("#postQuestionButton").click()

    // clicks tags
    cy.get("#sideBarTags").click();
    cy.contains("test1");
    cy.contains("test2");
    cy.contains("test3");
  });

  it("Checks if all tags exist", () => {
    cy.get("#sideBarTags").click();
    cy.contains("react", { matchCase: false });
    cy.contains("javascript", { matchCase: false });
    cy.contains("android-studio", { matchCase: false });
    cy.contains("shared-preferences", { matchCase: false });
    cy.contains("storage", { matchCase: false });
    cy.contains("website", { matchCase: false });
  });

  it("Checks if all questions exist inside tags", () => {
    cy.get("#sideBarTags").click();
    cy.contains("6 Tags");
    cy.contains("1 question");
    cy.contains("2 question");
  });
});



describe("Question Tags", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("go to question in tag react", () => {
    // all question no. should be in the page
    cy.get("#sideBarTags").click()
    cy.contains("react").click();
    cy.contains("Programmatically navigate using React router");
  });

  it("go to questions in tag storage", () => {
    // all question no. should be in the page
    cy.get("#sideBarTags").click()
    cy.contains("storage").click();
    cy.contains("Quick question about storage on android");
    cy.contains("Object storage for a web application");
  });

  it("create a new question with a new tag and finds the question through tag", () => {

    // add a question with tags
    cy.get("#askQuestionButton").click()
    cy.get("#title").type("Test Question A")
    cy.get("#description").type("Test Question A Description")
    cy.get("#tags").type("test1-tag1").type("{enter}")
    cy.get("#postQuestionButton").click()

    // clicks tags
    cy.get("#sideBarTags").click()
    cy.contains("test1-tag1").click();
    cy.contains("Test Question A");
  });
});

describe("verify tags display", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  })

  it("Clicks on a tag and verifies the tag is displayed", () => {
    const tagNames = "javascript";

    cy.get("#sideBarTags").click()

    cy.contains(tagNames).click();
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });

  it("Clicks on a tag in homepage and verifies the questions related tag is displayed", () => {
    const tagNames = "storage";

    //clicks the 3rd tag associated with the question.
    cy.get(".question_tag_button").eq(0).click();

    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should("contain", tagNames);
    });
  });
});


describe("upvote and downvote for questions and answers", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });


  it("Upvote and downvote for questions", () => {
    // upvote a question
    cy.contains("Quick question about storage on android").click();
    cy.get("#upvoteBtn-question").click();
    cy.get("#voteCount-question").should("contain", "1");

    // downvote a question
    cy.get("#downvoteBtn-question").click();
    cy.get("#voteCount-question").should("contain", "-1");
  });


  it("Upvote and downvote for answers", () => {
    // upvote an answer
    cy.contains("Quick question about storage on android").click();
    cy.get("#upvoteBtn-answer").click();
    cy.get("#voteCount-answer").should("contain", "1");

    // downvote an answer
    cy.get("#downvoteBtn-answer").click();
    cy.get("#voteCount-answer").should("contain", "-1");
  });

  it("Upvote and downvote for comments", () => {
    cy.contains("Quick question about storage on android").click();
    // click the second one 
    cy.get("#panel1-header-question").click();

    cy.get("#upvoteBtn-comment").click();
    cy.get("#voteCount-comment").should("contain", "1");

    cy.get("#downvoteBtn-comment").click();
    cy.get("#voteCount-comment").should("contain", "-1");
  });
});


describe("Add comment", () => {

    before(() => {
      // Seed the database before each test
      cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
      cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
    });

    beforeEach(() => {
      cy.visit("http://localhost:3000");
      cy.get("#email").type("general")
      cy.get("#password").type("test")
      cy.get("#signInButton").click()
    });


    it("Add a comment to a question", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get("#panel1-header-question").click();
      cy.get("#comment-input-question").type("This is a comment");
      cy.get("#postCommentBtn-question").click();
      cy.contains("This is a comment");
    });

    it("Add a comment to an answer", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get('#panel1-header-answer').click();
      cy.get("#comment-input-answer").type("This is a comment");
      cy.get("#postCommentBtn-answer").click();
      cy.contains("This is a comment");
    });

    it("Add an empty comment should show an error", () => {
      cy.contains("Quick question about storage on android").click();
      cy.get('#panel1-header-answer').click();
      cy.get("#postCommentBtn-answer").click();
      cy.contains("Failed to post comment");
    });
});


describe("User page", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });

  it("should display user page", () => {
    const nameList = [
      "Akshay",
      "John",
      "Shiu",
      "Vedant Rishi",
      "Sameer",
      "Sudhanva"
    ]
    cy.get("#sideBarUsers").click();
    nameList.forEach((name) => {
      cy.contains(name);
    });
  })

  it("Click on name should display user info", () => {
    cy.get("#sideBarUsers").click();
    cy.contains("Akshay").click();
    cy.contains("Akshay");
    cy.contains("Boston, MA")
    cy.contains("Questions")
    cy.contains("Answers")
    cy.contains("JavaScript")
    cy.contains("React")
    cy.contains("TypeScript")
  })
})


describe("test report", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });

  it("report question", () => {
    cy.contains("Quick question about storage on android").click();
    cy.get("#reportBtn-question").click();
    cy.contains("Post has been flagged for review");

    cy.get("#sideBarLogout").click()
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains("I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains")
  });

  it("report answer", () => {
    cy.contains("Quick question about storage on android").click();
    cy.get("#panel1-header-answer").click();
    cy.get("#reportBtn-answer").click();
    cy.contains("Post has been flagged for review");
    
    cy.get("#sideBarLogout").click()
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.get("#answersBtn").click();

    cy.contains("Store data in a SQLLite database.");    
  });

  it("report comment", () => {
    cy.contains("Quick question about storage on android").click();
    cy.get("#panel1-header-question").click();
    cy.get("#reportBtn-comment").click();
    cy.contains("Post has been flagged for review");

    cy.get("#sideBarLogout").click()
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.get("#commentsBtn").click();

    cy.contains("This is great")
  });
})


describe("test Moderator", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });


  it("moderator can delete question", () => {
    cy.contains("the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.")
    cy.get("#deleteBtn").click();

    cy.get('#root').should('not.contain', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.');

    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general");
    cy.get("#password").type("test");
    cy.get("#signInButton").click();

    cy.get("#root").should('not.contain', 'Programmatically navigate using React router');
  });

  it("moderator can delete answer", () => {
    cy.get('#answersBtn').click();
    cy.contains("YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);")
    cy.get("#deleteBtn").click();
    cy.get('#root').should('not.contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
    
    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains("android studio save string shared preference, start activity and load the saved string").click()

    cy.get("#answers-section").should('not.contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
  });

  it("moderator can delete comment", () => {
    cy.get('#commentsBtn').click();
    cy.contains("This is so helpful")
    cy.get("#deleteBtn").click();

    cy.get('#root').should('not.contain', 'This is so helpful');

    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains("Object storage for a web application").click()
    
    cy.get("#panel1-header-question").click();

    cy.get("#root").should('not.contain', 'This is so helpful');
  });

});

describe("test moderator ignore", () => {
  before(() => {
    // Seed the database before each test
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#email").type("moderator")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()
  });


  it("moderator can ignore question", () => {
    cy.contains("the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.")
    cy.get("#ignoreBtn").click();

    cy.get('#root').should('not.contain', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.');

    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general");
    cy.get("#password").type("test");
    cy.get("#signInButton").click();

    cy.get("#root").should('contain', 'Programmatically navigate using React router');
  });

  it("moderator can ignore answer", () => {
    cy.get('#answersBtn').click();
    cy.contains("YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);")
    cy.get("#ignoreBtn").click();
    cy.get('#root').should('not.contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
    
    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains("android studio save string shared preference, start activity and load the saved string").click()

    cy.get("#answers-section").should('contain', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);');
  });


  it("moderator can ignore comment", () => {
    cy.get('#commentsBtn').click();
    cy.contains("This is so helpful")
    cy.get("#ignoreBtn").click();

    cy.get('#root').should('not.contain', 'This is so helpful');

    cy.get(".header-avatar").click();

    cy.get("#signOutBtn").click();
    cy.get("#email").type("general")
    cy.get("#password").type("test")
    cy.get("#signInButton").click()

    cy.contains("Object storage for a web application").click()
    
    cy.get("#panel1-header-question").click();

    cy.get("#root").should('contain', 'This is so helpful');
  });
});