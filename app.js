// loads several packages
const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require ('express-session'); // middleware for handling session data
const connectSqlite3 = require ('connect-sqlite3');
const cookieParser = require ('cookie-parser'); // middleware to parse cookies & making them accessible
const bcrypt = require('bcrypt'); // middleware for hashing passwords


const port = 8080 // defines the port
const app = express() // creates the Express application

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');






// *********** MIDDLEWARES ***********


// defines a middleware to log all the incoming requests' URL
app.use((request, response, next) => {
  console.log("Req. URL: ", request.url)
  next()
})

// defines a middleware to log all the session information
app.use((request, response, next) => {
  console.log("SESSION: ", request.session)
  next()
})

// define static directory "public" to access css/ and img/
app.use(express.static('public'));


// *********** MIDDLEWARES ***********











// *********** POST Forms ***********


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// *********** POST Forms ***********







// *********** SESSIONS ***********

// store sessions in the database
const SQLiteStore = connectSqlite3(session);

// defines the session
app.use(session({
  store: new SQLiteStore({db:'session-db.db'}),
  saveUninitialized: false,
  resave: false,
  secret: "MySECRET@p4ssw0rd",
}));

// *********** SESSIONS ***********








// *********** MODEL (DATA) ***********

// define the databases you will use
const db = new sqlite3.Database('portfolio-lfm.db')

// creates table projects at startup
db.run("CREATE TABLE projects (projectid INTEGER PRIMARY KEY AUTOINCREMENT, projectTitle TEXT NOT NULL, projectDesc TEXT NOT NULL, projectDate INTEGER NOT NULL, projectImgURL TEXT NOT NULL, categoryfk INTEGER NOT NULL)", (error) => {
  if (error) {
    console.log("CREATING ERROR: ", error)
  } else {
    const projects = [
      {"id":"1",
        "title":"'Der Hahn ist tot' | 'The Rooster is Dead'",
        "desc":"Development and production of a short film. In a group of six people,  I conceptualised and realised the 5-minute comedy 'The Rooster is Dead' from the script to the final cut, focusing on camera and lighting,  production design, colour grading and title design in post-production.",
        "date":"2023-03",
        "url":"theRoosterisDead.jpg",
        "categoryfk":"6"},
      {"id":"2",
        "title":"Room of Inspiration",
        "desc":"My vision for a retreat in ten years seamlessly combines the charm of an old building with the contemporary flair of a loft. Created using Blender for 3D modelling and Adobe Substance Painter for textures, this self-designed space features vintage furniture, open windows, hanging lamps, a spiral staircase and warm evening tones. It's a place to recharge and create, and a glimpse of a future retreat where craft space and design merge for inspiration.",
        "date":"2023-06",
        "url":"RoomOfInspiration.jpg",
        "categoryfk":"1"},
      {"id":"3",
        "title":"Fischbude",
        "desc":"Designing the 'Fischbude' logo was a journey into seaside simplicity. Using classic blue and white tones, we captured the essence of fresh seafood. The playful fish icon at the heart of the design embodies the welcoming coastal charm of this eatery, promising a delicious seafood experience.",
        "date":"2023-06",
        "url":"Fischbude.jpg",
        "categoryfk":"4"},
      {"id":"4",
        "title":"FancyThat!",
        "desc":"Enter the world of 'Fancy That!' and discover a brand dedicated to making life easier and better. The project showcased the brand's eyewear collection while reinforcing the its distinctive identity. A modern UX/UI design for the frontend aims to create an inviting and fresh experience. In addition, a backend system with seamless database integration and the use of handlebars allows users to manage and update content independently.",
        "date":"2022-12",
        "url":"FancyThat.jpg",
        "categoryfk":"3"},
      {"id":"5",
        "title":"Love is a Journey",
        "desc":"Conception and realisation of a wedding magazine. Creative staging of wedding greetings with the look and feel of a 'travel journal' – the special feature here was the illustrative presentation of travel recommendations through graphics, fonts and images on almost 65 pages.",
        "date":"2021-07",
        "url":"LoveIsAJourney.jpg",
        "categoryfk":"5"},
      {"id":"6",
        "title":"Campusmagazine viel. | 27",
        "desc":"As part of a team of five, I was involved in the editorial design of the campus magazine of the Kiel University of Applied Sciences. Our work included the conception and design of columns, polls and photo series, all centred around the theme of 'colour'. The challenge was to seamlessly integrate colour as a core element in the design of each page, ensuring a harmonious and effective reading experience.",
        "date":"2023-08",
        "url":"Campusmagazine-viel_27.jpg",
        "categoryfk":"5"},
      {"id":"7",
        "title":"Wedding invitation card",
        "desc":"This wedding invitation card beautifully combines the beauty of autumn with a touch of elegance, using the vibrant colours of the season. Nature-inspired accents, including leaf motifs, are thoughtfully combined with clean and simple typography. The result is a harmonious balance of simplicity and playfulness that sets the perfect tone for an autumnal wedding celebration.",
        "date":"2023-08",
        "url":"WeddingCard_SaTo.jpg",
        "categoryfk":"8"},
    ]

    // insert projects
    projects.forEach ( (oneProject) => {
      db.run("INSERT INTO projects (projectid, projectTitle, projectDesc, projectDate, projectImgURL, categoryfk) VALUES (?, ?, ?, ?, ?, ?)", [oneProject.id, oneProject.title, oneProject.desc, oneProject.date, oneProject.url, oneProject.categoryfk], (error) => {
        if (error) {
          console.log("INSERT ERROR: ", error)
        } else {
          console.log("Line added into the projects table!")
        }
      })
    })

    console.log("Table projects created successfully!")
  }
})

// creates table skills at startup
db.run ("CREATE TABLE skills (skillid INTEGER PRIMARY KEY AUTOINCREMENT, skillName TEXT NOT NULL, skillType TEXT NOT NULL, skillDesc TEXT NOT NULL)", (error) => {
  if (error) {
    console.log("ERROR: ", error)
  } else {
    const skills = [
      {"id":"1", "name":"Adobe InDesign", "type":"Layout program", "desc":"Layouting digital and printed brochures, posters or flyers."},
      {"id":"2", "name":"Adobe Illustrator", "type":"Layout program", "desc":"Creating illustrations, brandings or typography."},
      {"id":"3", "name":"Adobe Photoshop", "type":"Photo editing program", "desc":"Editing and compositing photos."},
      {"id":"4", "name":"Blender", "type":"3D modelling program", "desc":"3D modeling, rigging, animation, simulation, rendering, compositing and motion tracking."},
      {"id":"5", "name":"Adobe Substance 3D Painter", "type":"3D modelling program", "desc":"3D painting software for texturing and adding materials directly to 3D meshes in real-time."},
      {"id":"6", "name":"Adobe XD", "type":"Layout program", "desc":"Creating and testing designs for websites, mobile apps, and other digital products and experiences."},
      {"id":"7", "name":"Figma", "type":"Layout program", "desc":"Creating and testing designs for websites, mobile apps, and other digital products and experiences."},
      {"id":"8", "name":"Adobe After Effects", "type":"Video editing", "desc":"Animation software for animation, visual effects, and motion picture compositing."},
      {"id":"9", "name":"Adobe Premiere Pro", "type":"Video editing", "desc":"Editing video footage, enhancing and fine-tuning audio and image quality."},
      {"id":"10", "name":"Adobe Lightroom", "type":"Photo editing program", "desc":"Organizing and editing photos."},
      {"id":"11", "name":"HTML/CSS", "type":"Programming language", "desc":"Programming with HTML and CSS."},
      {"id":"12", "name":"JavaScript", "type":"Programming language", "desc":"Programming with Javascript on the client side."},
      {"id":"13", "name":"PHP", "type":"Programming language", "desc":"Programming with PHP on the server side."},
      {"id":"14", "name":"Bootstrap", "type":"Framework", "desc":"A framework for Frontend-CSS and Javascript on the client side."},
      {"id":"15", "name":"Symfony", "type":"Framework", "desc":"A framework for programming PHP."},
      {"id":"16", "name":"Adobe Audition", "type":"Audio editing", "desc":"Editing and appling effects to the audio from video footage."},
      {"id":"17", "name":"Node", "type":"Programming language", "desc":"Programming with Javascript on the server side."},
      {"id":"18", "name":"Express", "type":"Framework", "desc":"A framework for programming Javascript on the server side."},
      {"id":"19", "name":"Craft CMS", "type":"Content management system", "desc":"Managing website content using customizable themes and templates."},
    ]

    // inserts skills
    skills.forEach( (oneSkill) => {
      db.run("INSERT INTO skills (skillid, skillName, skillType, skillDesc) VALUES (?, ?, ?, ?)", [oneSkill.id, oneSkill.name, oneSkill.type, oneSkill.desc], (error) => {
        if(error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the skills table!")
        }
      })
    })

    console.log("Table skills created successfully!")
  }
})

// creates table projectsSkills at startup
db.run("CREATE TABLE projectsSkills (proskillid INTEGER PRIMARY KEY AUTOINCREMENT, projectid INTEGER, skillid INTEGER, FOREIGN KEY (projectid) REFERENCES projects (projectid), FOREIGN KEY (skillid) REFERENCES skills (skillid))", (error) => {
  if(error) {
    console.log("ERROR: ", error)
  } else {
    const projectsSkills = [
      {"id":"1", "projectid":"1", "skillid": "8"},
      {"id":"2", "projectid":"1", "skillid": "9"},
      {"id":"3", "projectid":"1", "skillid": "16"},
      {"id":"4", "projectid":"2", "skillid": "4"},
      {"id":"5", "projectid":"2", "skillid": "5"},
      {"id":"6", "projectid":"3", "skillid": "2"},
      {"id":"7", "projectid":"3", "skillid": "8"},
      {"id":"8", "projectid":"4", "skillid": "11"},
      {"id":"9", "projectid":"4", "skillid": "12"},
      {"id":"10", "projectid":"4", "skillid": "19"},
      {"id":"11", "projectid":"5", "skillid": "1"},
      {"id":"12", "projectid":"5", "skillid": "2"},
      {"id":"13", "projectid":"5", "skillid": "3"},
      {"id":"14", "projectid":"6", "skillid": "1"},
      {"id":"15", "projectid":"7", "skillid": "2"},
    ]

    // insert projectsSkills
    projectsSkills.forEach( (oneProjectSkill) => {
      db.run("INSERT INTO projectsSkills (proskillid, projectid, skillid) VALUES (?, ?, ?)", [oneProjectSkill.id, oneProjectSkill.projectid, oneProjectSkill.skillid], (error) => {
        if(error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the projectsSkills table!")
        }
      })
    })

    console.log("Table projectsSkills created successfully!")
  }
})

// creates table cv at startup
db.run("CREATE TABLE cv (cvid INTEGER PRIMARY KEY AUTOINCREMENT, cvFieldOfWork TEXT NOT NULL, cvType TEXT NOT NULL, cvDesc TEXT NOT NULL, cvDate TEXT NOT NULL, cvPlace TEXT NOT NULL)", (error) => {
  if (error) {
    console.log("CREATING ERROR: ", error)
  } else {
    const cv = [
      {"id":"1",
        "field":"Digital and Print Media Designer Trainee",
        "type":"Education",
        "desc":"Conception and design of print media and websites, branding and packaging, data preparation in pre-press as well as full support for recurring projects, customer and supplier liaison.",
        "date":"2017-08 till 2020-07",
        "place":"Kehrer Werbeagentur"},
      {"id":"2",
        "field":"Bachelor's degree Multimedia Production",
        "type":"Education",
        "desc":"Design, computer science, media theory, media technology, journalism, media studies, media business and media conception.",
        "date":"2021-09 till 2025-03",
        "place":"Fachhochschule Kiel"},
      {"id":"3",
        "field":"Semester abroad at Jönköping University (Sweden)",
        "type":"Education",
        "desc":"",
        "date":"2023-08 till 2023-12",
        "place":"Jönköping University"},
      {"id":"4",
        "field":"Voluntary services in the field of culture and education",
        "type":"Work Experience",
        "desc":"Public relations and print media design assistance.",
        "date":"2016-09 till 2017-07",
        "place":"Volkshochschule Oldenburg"},
      {"id":"5",
        "field":"Final Artwork Designer",
        "type":"Work Experience",
        "desc":"Design and adaptation of packaging up to final artwork according to style guide design guidelines and independent supervision of complete ranges (master design set-ups and design guidelines).",
        "date":"2020-09 till 2021-07",
        "place":"Adwork Werbeagentur"},
      {"id":"6",
        "field":"Freelancer",
        "type":"Work Experience",
        "desc":"Student assistant in editorial design and strategic communications.",
        "date":"2022-02 till now",
        "place":"Fachhochschule Kiel"},
    ]

    // insert projects
    cv.forEach ( (oneMilestone) => {
      db.run("INSERT INTO cv (cvid, cvFieldOfWork, cvType, cvDesc, cvDate, cvPlace) VALUES (?, ?, ?, ?, ?, ?)", [oneMilestone.id, oneMilestone.field, oneMilestone.type, oneMilestone.desc, oneMilestone.date, oneMilestone.place], (error) => {
        if (error) {
          console.log("INSERT ERROR: ", error)
        } else {
          console.log("Line added into the cv table!")
        }
      })
    })

    console.log("Table cv created successfully!")
  }
})

// creates table categories at startup
db.run ("CREATE TABLE categories (categoryid INTEGER PRIMARY KEY AUTOINCREMENT, categoryName TEXT NOT NULL)", (error) => {
  if(error) {
    console.log("ERROR: ", error)
  } else {
    const categories = [
      {"id":"1", "name":"3D Production"},
      {"id":"2", "name":"Animation"},
      {"id":"3", "name":"UX-/UI Design"},
      {"id":"4", "name":"Branding"},
      {"id":"5", "name":"Editorial Design"},
      {"id":"6", "name":"Film"},
      {"id":"7", "name":"Photography"},
      {"id":"8", "name":"Graphic Design"},
    ]

    // insert categories
    categories.forEach( (oneCategory) => {
      db.run("INSERT INTO categories (categoryid, categoryName) VALUES (?, ?)", [oneCategory.id, oneCategory.name], (error) => {
        if(error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the categories table!")
        }
      })
    })

    console.log("Table catgeories created successfully!")
  }
})

// creates table users at startup
db.run ("CREATE TABLE users (userID INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT NOT NULL, userPassword TEXT NOT NULL, userAdmin INTEGER NOT NULL)", (error) => {
  if(error) {
    console.log("ERROR: ", error)
  } else {
    const users = [
      {"id":"1", "name":"admin", "password":"$2b$12$nEpyyeoTs6RYGgS5O8NPWuO9Ri9d9E4s8KvZgngV8ZwIqUi45Lzya", "admin":1},
      {"id":"2", "name":"leafmllr", "password":"$2b$12$XOvTOv8jvi2N82JoHxtXduFbOZSAC.M8kHAcyOsIkBrcP9dohRyhm", "admin":0},
    ]

    // insert users
    users.forEach( (oneUser) => {
      db.run("INSERT INTO users (userID, userName, userPassword, userAdmin) VALUES (?, ?, ?, ?)", [oneUser.id, oneUser.name, oneUser.password, oneUser.admin], (error) => {
        if(error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the users table!")
        }
      })
    })

    console.log("Table users created successfully!")
  }
})

// *********** MODEL (DATA) ***********











// *********** CONTROLLER (ROUTES) ***********


// defines route "/login"
app.get('/login', (request, response) => {
console.log("SESSION: ", request.session)

/* saltRounds = 12
bcrypt.hash("nocoding", saltRounds, function(error, hash) {
  if (error) {
    console.log("Error encrypting the password: ", error)
  } else {
    console.log("Hashed password (GENERATE only ONCE: ", hash)
  }
}); */

  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
  }
  // rendering the view
  response.render('login.handlebars', model);
});

// AUTHENTICATION of the user by username and password
app.post('/login', (request, response) => {
  const un = request.body.un
  const pw = request.body.pw


  db.get("SELECT * FROM users WHERE userName=?", [un], function(error, user) {
    // console.log("User Data: ", user.userPassword);

    if (error) {

      console.log("DB ERROR: ", error);
      response.redirect('/login');

    } else {

      bcrypt.compare(pw, user.userPassword, function (error, result) {
        // console.log("RESULT: ", result)
        // console.log("LoginPW: ", pw)
  
        if (error) {
          console.log("Error in comparing encryption: ", error)

        } else if (result == true) {
          console.log("User is logged in!")
    
          request.session.isAdmin = (user.userAdmin == 1);
          request.session.isLoggedIn = true;
          request.session.name = user.userName;
    
          response.redirect('/');
        } else {
          console.log("User is NOT logged in!")
          response.redirect('/login');
        }
      })

    }

    
  })


});

// defines route "/logout"
app.get('/logout', (request, response) => {
  request.session.destroy( (error) => {
    console.log("Error while destroying the session: " + error)
  });
  console.log("Log out, bye, bye!");

  // rendering the view
  response.redirect('/');
});





// defines route "/"
app.get('/', (request, response) => {
  response.redirect('/portfolio');
});

// defines route "/portfolio"
app.get('/portfolio', (request, response) => {

  // Number of projects per side
  const numberPerPage = 3;

  // Number of all projects per SQL-Request to calculate pagination
  db.get("SELECT COUNT (*) AS projectCount FROM projects", (countError, countRow) => {
    if (countError) {
      const model = {
        dbError: true,
        theError: countError,
        projects: [],
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      };

      response.render('portfolio.handlebars', model);
    } else {
      // Number of all projects
      const totalProjectCount = countRow.projectCount;
      // page from the URL or page 1
      const page = parseInt(request.query.page) || 1;
      // Calculating the offset value
      const offset = (page - 1) * numberPerPage;
      // Calculating number of pages
      const totalPages = Math.ceil(totalProjectCount / numberPerPage);
      // Erzeuge ein Array von Seitenzahlen von 1 bis totalPages
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);  

      
      const nextPage = page + 1;
      const prevPage = (page - 1) ? page - 1 : null;

      // getting projects for the current page
      db.all("SELECT * FROM projects JOIN categories ON projects.categoryfk = categories.categoryid LIMIT ? OFFSET ?", [numberPerPage, offset], function (error, theProjects) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            projects: [],
            isAdmin: request.session.isAdmin,
            isLoggedIn: request.session.isLoggedIn,
            name: request.session.name,
          }
    
          // renders the page with the model
          response.render('portfolio.handlebars', model)
        } else {

          console.log("Anzahl der Seiten: ", totalPages)
          const model = {
            dbError: false,
            theError: "",
            projects: theProjects,
            isAdmin: request.session.isAdmin,
            isLoggedIn: request.session.isLoggedIn,
            name: request.session.name,
            currentPage: page,
            totalPages,
            pages,
            nextPage,
            prevPage,
          };
    
          // renders the page with the model
          response.render('portfolio.handlebars', model)
        } 
    
      });
    }
  });
  
});

// defines route "/contact"
app.get('/contact', (request, response) => {
  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
  }
  // rendering the view
  response.render('contact.handlebars', model);
});






// defines route "/aboutme"
app.get('/aboutme', (request, response) => {
  db.all("SELECT * FROM cv ORDER BY cvDate DESC", function (error, theCV) {
    if(error) {
      const model = {
        dbError: true,
        theError: error,
        milestone: [],
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }
      console.log("Didn't found anything for CV. :(")

      // renders the page with the model
      response.render('aboutme.handlebars', model)
    }
    else {
      const model = {
        dbError: false,
        theError: "",
        milestone: theCV,
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        helpers: {
          theTypeWE(value) { return value == "Work Experience"; },
          theTypeE(value) { return value == "Education"; },
        }
      }
      console.log("The CV should be shown.")

      // renders the page with the model
      response.render('aboutme.handlebars', model)
    }
  })
});

// sends the form for a NEW CV milestone
app.get('/aboutme/add', (request, response) => {
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    }
    console.log("Create a new milestone!");

    response.render('newmilestone.handlebars', model);
  } else {
    response.redirect('/login')
  }
});

// CREATES a new CV milestone
app.post ('/aboutme/add', (request, response) => {
  const newMilestone = [
    request.body.mileField, request.body.mileType, request.body.mileDesc, request.body.cvDate, request.body.milePlace
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run("INSERT INTO cv (cvFieldOfWork, cvType, cvDesc, cvDate, cvPlace) VALUES (?, ?, ?, ?, ?)", newMilestone, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the cv table!")
      }
      response.redirect('/')
    })
  } else {
    response.redirect('/login')
  }
})

// DELETES a single CV milestone
app.get('/aboutme/delete/:id', (request, response) => {
  const id = request.params.id

  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run('DELETE FROM cv WHERE cvid=?', [id], (error, theCV) => {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isAdmin: request.session.isAdmin,
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.name,
          projectDeletion: false,
        }
        response.redirect('/adminfeedback', model)
      } else {
        const model = {
          dbError: false,
          theError: "",
          isAdmin: request.session.isAdmin,
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.name,
          projectDeletion: true,
        }
        response.render('adminfeedback.handlebars', model)
      } 
    })
  } else {
    response.redirect('/login')
  }
});

// sends the form for UPDATE a CV milestone
app.get('/aboutme/update/:id', (request, response) => {
  const id = request.params.id

  db.get ("SELECT * FROM cv WHERE cvid=?", [id], (error, theMilestone) => {
    if (error) {
      console.log("ERROR: ", error)
      const model = {
        dbError: true,
        theError: true,
        milestone: {},
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
      }
      // renders the page with the model
      response.render("updatemilestone.handlebars", model)
    } else {
      const model = {
        dbError: false,
        theError: "",
        milestone: theMilestone,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        helpers: {
          theTypeWE(value) { return value == "Work Experience"; },
          theTypeE(value) { return value == "Education"; },
        }
      }
      // renders the page with the model
      response.render("updatemilestone.handlebars", model)
    }
  })

});

// modifies an existing CV milestone
app.post('/aboutme/update/:id', (request, response) => {
  const id = request.params.id
  const updatedMilestone = [
    request.body.newMileField, request.body.newMileType, request.body.newMileDesc, request.body.newCvDate, request.body.newMilePlace, id
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run("UPDATE projects SET cvFieldOfWork=?, cvType=?, cvDesc=?, cvDate=?, cvPlace=? WHERE cvid=?", updatedMilestone, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Succsessfully updated Milestone!")
      }
      response.redirect('/')
    })
  } else {
    response.redirect ('/login')
  }
})





// defines route of a single project
app.get('/:id', (request, response) => {

  // get the id on the dynamic route
  const id = request.params.id

  // Initialize variables to store project and categories
  let projectData = null;
  let skillsData = null;

  // Query to get the project by ID
  db.all("SELECT * FROM projects JOIN categories ON projects.categoryfk = categories.categoryid WHERE projects.projectid=?", [id], function(error, selectedProject) {

    if(error) {
      const model = {
        dbError: true,
        theError: error,
        project: {},
        skills: {},
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }

      // renders the page with the model
      response.render('project.handlebars', model);
    }
    else {
      // Store the selected project data
      projectData = selectedProject;

      db.all("SELECT * FROM projectsSkills INNER JOIN skills ON projectsSkills.skillid = skills.skillid INNER JOIN projects ON projectsSkills.projectid = projects.projectid INNER JOIN categories ON projects.categoryfk = categories.categoryid WHERE projects.projectid=?", [id], function(error, projectSkills) {
        if (error) {
          const model = {
            dbError: true,
            theError: error,
            project: projectData,
            skills: {},
            isAdmin: request.session.isAdmin,
            isLoggedIn: request.session.isLoggedIn,
            name: request.session.name,
          }

          // renders the page with the model
          response.render('project.handlebars', model);
        } else {
          // Store the selected categories data
          skillsData = projectSkills;

          const model = {
            dbError: false,
            theError: "",
            project: projectData,
            skills: projectSkills,
            isAdmin: request.session.isAdmin,
            isLoggedIn: request.session.isLoggedIn,
            name: request.session.name,
          }
          
          // renders the page with the model
          response.render('project.handlebars', model);
        }
      })
    }
  })
});

// DELETES a single project
app.get('/:id/delete', (request, response) => {
  const id = request.params.id

  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run('DELETE FROM projects WHERE projectid=?', [id], (error, theProjects) => {
      if (error) {
        const model = {
          dbError: true,
          theError: error,
          isAdmin: request.session.isAdmin,
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.name,
          projectDeletion: false,
        }
        response.redirect('/adminfeedback', model)
      } else {
        const model = {
          dbError: false,
          theError: "",
          isAdmin: request.session.isAdmin,
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.name,
          projectDeletion: true,
        }
        response.render('adminfeedback.handlebars', model)
      } 
    })
  } else {
    response.redirect('/login')
  }
});

// sends the form for a NEW project
app.get('/project/new', (request, response) => {
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    }
    console.log("Create a new project!");

    response.render('newproject.handlebars', model);
  } else {
    response.redirect('/login')
  }
});

// CREATES a new project
app.post ('/project/new', (request, response) => {
  const newProject = [
    request.body.prot, request.body.prodesc, request.body.prodate, request.body.proimgURL, request.body.procategory
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run("INSERT INTO projects (projectTitle, projectDesc, projectDate, projectImgURL, categoryfk) VALUES (?, ?, ?, ?, ?)", newProject, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the project table!")
      }
      response.redirect('/')
    })
  } else {
    response.redirect('/login')
  }
})

// sends the form for UPDATE a project
app.get('/:id/update', (request, response) => {
  const id = request.params.id

  db.get ("SELECT * FROM projects WHERE projectid=?", [id], (error, theProject) => {
    if (error) {
      console.log("ERROR: ", error)
      const model = {
        dbError: true,
        theError: true,
        project: {},
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
      }
      // renders the page with the model
      response.render("updateproject.handlebars", model)
    } else {
      const model = {
        dbError: false,
        theError: "",
        project: theProject,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
        isAdmin: request.session.isAdmin,
        helpers: {
          theTypeA(value) { return value == "1"; },
          theTypeB(value) { return value == "2"; },
          theTypeC(value) { return value == "3"; },
          theTypeD(value) { return value == "4"; },
          theTypeE(value) { return value == "5"; },
          theTypeF(value) { return value == "6"; },
          theTypeG(value) { return value == "7"; },
          theTypeH(value) { return value == "8"; },
        }
      }
      // renders the page with the model
      response.render("updateproject.handlebars", model)
    }
  })

});

// modifies an existing project
app.post('/:id/update', (request, response) => {
  const id = request.params.id
  const updatedProject = [
    request.body.newprot, request.body.newprodesc, request.body.newprodate, request.body.newproimgURL, request.body.newprocategory, id
  ]
  if (request.session.isLoggedIn==true && request.session.isAdmin==true) {
    db.run("UPDATE projects SET projectTitle=?, projectDesc=?, projectDate=?, projectImgURL=?, categoryfk=? WHERE projectid=?", updatedProject, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Succsessfully updated Project!")
      }
      response.redirect('/')
    })
  } else {
    response.redirect ('/login')
  }
})

// defines route "/adminfeedback"
app.get('/adminfeedback', (request, response) => {
  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
    projectDeletion: request.session.projectDeletion,
  }

  // rendering the view
  response.render('adminfeedback.handlebars', model);
});






// defines the final default route 404 NOT FOUND
app.use(function(request,response){
  response.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`);
});

// *********** CONTROLLER (ROUTES) ***********