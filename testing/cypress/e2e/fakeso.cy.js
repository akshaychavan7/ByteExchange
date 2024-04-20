
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