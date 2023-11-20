const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://b20fa1719:nMmC6GOwb5bd28fW@my-social-media-app.qoodzmj.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// Define User schema
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

// Passport configuration
passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) return done(null, false, { message: 'Incorrect username.' });
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return done(null, false, { message: 'Incorrect password.' });
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

// Express middleware
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  console.log(req.body);
  res.json({ message: "Login successful", user: req.user });
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  

// Logout route
app.get("/api/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logout successful" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
