// loads several packages
const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require ('express-session'); // middleware for handling session data
const connectSqlite3 = require ('connect-sqlite3');
// const cookieParser = require ('cookie-parser'); // middleware to parse cookies & making them accessible


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
  "saveUninizialized": false,
  "resave": false,
  "secret": "MySECRET@p4ssw0rd"
}));

// *********** SESSIONS ***********








// *********** MODEL (DATA) ***********

// define the databases you will use
const db = new sqlite3.Database('portfolio-lfm.db')

// creates table projects at startup
db.run("CREATE TABLE projects (projectid INTEGER PRIMARY KEY AUTOINCREMENT, projectTitle TEXT NOT NULL, projectDesc TEXT NOT NULL, projectDate INTEGER NOT NULL, projectImgURL TEXT NOT NULL)", (error) => {
  if (error) {
    console.log("CREATING ERROR: ", error)
  } else {
    const projects = [
      {"id":"1",
        "title":"'Der Hahn ist tot' | 'The Rooster is Dead'",
        "desc":"Development and production of a short film. In a group of six people,  I conceptualised and realised the 5-minute comedy 'The Rooster is Dead' from the script to the final cut, focusing on camera and lighting,  production design, colour grading and title design in post-production.",
        "date":"2023-03",
        "url":"public/img/theRoosterisDead.jpg"},
      {"id":"2",
        "title":"Room of Inspiration",
        "desc":"",
        "date":"2023-06",
        "url":"public/img/RoomOfInspiration.jpg"},
      {"id":"3",
        "title":"Fischbude",
        "desc":"",
        "date":"2023-06",
        "url":"public/img/Fischbude.jpg"},
      {"id":"4",
        "title":"FancyThat!",
        "desc":"",
        "date":"2022-12",
        "url":"public/img/FancyThat.jpg"},
      {"id":"5",
        "title":"Love is a Journey",
        "desc":"Conception and realisation of a wedding magazine. Creative staging of wedding greetings with the look and feel of a 'travel journal' – the special feature here was the illustrative presentation of travel recommendations through graphics, fonts and images on almost 65 pages.",
        "date":"2021-07",
        "url":"public/img/LoveIsAJourney.jpg"},
      {"id":"6",
        "title":"Campusmagazine viel. | 26",
        "desc":"",
        "date":"2023-02",
        "url":"public/img/Campusmagazine-viel_26.jpg"},
      {"id":"7",
        "title":"Campusmagazine viel. | 27",
        "desc":"",
        "date":"2023-08",
        "url":"public/img/Campusmagazine-viel_27.jpg"},
      {"id":"8",
        "title":"Wedding invitation card",
        "desc":"",
        "date":"2023-08",
        "url":"public/img/WeddingCard_SaTo.jpg"},
    ]

    // insert projects
    projects.forEach ( (oneProject) => {
      db.run("INSERT INTO projects (projectid, projectTitle, projectDesc, projectDate, projectImgURL) VALUES (?, ?, ?, ?, ?)", [oneProject.id, oneProject.title, oneProject.desc, oneProject.date, oneProject.url], (error) => {
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
      {"id":"15", "projectid":"7", "skillid": "1"},
      {"id":"16", "projectid":"8", "skillid": "2"},
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

// creates table projectsCategories at startup
db.run("CREATE TABLE projectsCategories (procatid INTEGER PRIMARY KEY AUTOINCREMENT, projectid INTEGER, categoryid INTEGER, FOREIGN KEY (projectid) REFERENCES projects (projectid), FOREIGN KEY (categoryid) REFERENCES categories (categoryid))", (error) => {
  if(error) {
    console.log("ERROR: ", error)
  } else {
    const projectsCategories = [
      {"id":"1", "projectid":"1", "categoryid": "6"},
      {"id":"2", "projectid":"1", "categoryid": "8"},
      {"id":"3", "projectid":"2", "categoryid": "1"},
      {"id":"4", "projectid":"3", "categoryid": "8"},
      {"id":"5", "projectid":"3", "categoryid": "2"},
      {"id":"6", "projectid":"3", "categoryid": "4"},
      {"id":"7", "projectid":"4", "categoryid": "3"},
      {"id":"8", "projectid":"4", "categoryid": "4"},
      {"id":"9", "projectid":"5", "categoryid": "5"},
      {"id":"10", "projectid":"5", "categoryid": "8"},
      {"id":"11", "projectid":"6", "categoryid": "5"},
      {"id":"12", "projectid":"6", "categoryid": "8"},
      {"id":"13", "projectid":"7", "categoryid": "5"},
      {"id":"14", "projectid":"7", "categoryid": "8"},
      {"id":"15", "projectid":"8", "categoryid": "8"},
    ]

    // insert projectsCategories
    projectsCategories.forEach( (oneProjectCategory) => {
      db.run("INSERT INTO projectsCategories (procatid, projectid, categoryid) VALUES (?, ?, ?)", [oneProjectCategory.id, oneProjectCategory.projectid, oneProjectCategory.categoryid], (error) => {
        if(error) {
          console.log("ERROR: ", error)
        } else {
          console.log("Line added into the projectsCategories table!")
        }
      })
    })

    console.log("Table projectsCategories created successfully!")
  }
})

// *********** MODEL (DATA) ***********











// *********** CONTROLLER (ROUTES) ***********

// defines route "/"
app.get('/', (request, response) => {
  db.all("SELECT * FROM projects INNER JOIN projectsCategories ON projects.projectid = projectsCategories.projectid INNER JOIN categories ON projectsCategories.categoryid = categories.categoryid GROUP BY projects.projectid", function (error, theProjects) {
    if(error) {
      const model = {
        dbError: true,
        theError: error,
        projects: [],
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }

      // renders the page with the model
      response.render('portfolio', model)
    }
    else {
      const model = {
        dbError: false,
        theError: "",
        projects: theProjects,
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }

      // renders the page with the model
      response.render('portfolio', model)
    }
  })
});

// defines route "/aboutme"
app.get('/aboutme', (request, response) => {
  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
  }

  // rendering the view
  response.render('aboutme', model);
});

// defines route "/contact"
app.get('/contact', (request, response) => {
  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
  }

  // rendering the view
  response.render('contact', model);
});

// defines route "/login"
app.get('/login', (request, response) => {
  const model = {
    isAdmin: request.session.isAdmin,
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.name,
  }
  // rendering the view
  response.render('login', model);
});

// AUTHENTICATION of the user by username and password
app.post('/login', (request, response) => {
  const un = request.body.un
  const pw = request.body.pw

  console.log("FIELDS: " + un + "," + pw)

  if(un=="leafmllr" && pw=="5678") {
    console.log("Welcome Lea!")

    request.session.isAdmin = true;
    request.session.isLoggedIn = true;
    request.session.name = "Lea";
    response.redirect('/');
  } else {
    console.log("Nice try!")

    request.session.isAdmin = false;
    request.session.isLoggedIn = false;
    request.session.name = "";
    response.redirect('/login');
  }
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

// defines route of a single project
app.get('/:id', (request, response) => {

  // get the id on the dynamic route
  const id = request.params.id

  db.all("SELECT * FROM projects WHERE projectid=?", [id], function(error, selectedProject) {

    if(error) {
      const model = {
        dbError: true,
        theError: error,
        project: {},
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }

      // renders the page with the model
      response.render('project', model);
    }
    else {
      const model = {
        dbError: false,
        theError: "",
        project: selectedProject,
        isAdmin: request.session.isAdmin,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.name,
      }

      console.log("THE ID: "+ id);
      console.log("Project: "+ selectedProject);
      // renders the page with the model
      response.render('project', model);
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
          name: request.session.name
        }
        response.render('portfolio', model)
      } else {
        const model = {
          dbError: false,
          theError: "",
          isAdmin: request.session.isAdmin,
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.name
        }
        response.render('portfolio', model)
      } 
    })
  } else {
    response.redirect('/login')
  }
});

// defines the final default route 404 NOT FOUND
app.use(function(req,res){
  res.status(404).render('404.handlebars');
});

// runs the app and listens to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`);
});

// *********** CONTROLLER (ROUTES) ***********