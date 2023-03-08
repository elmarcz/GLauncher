module.exports = async (app) => {
  const functions = require("../functions/req.js");
  const passport = require("passport");
  const gameSchema = require("../models/gamesSchema");
  const userSchema = require("../models/userSchema");
  const gShotsSchema = require("../models/gShotsSchema");

  app.get("/", (req, res) => {
    if (req.user == undefined) {
      res.render("pages/noLoged");
    } else {
      res.redirect("/games");
    }
  });

  app.get("/login", functions.yaLogeado, (req, res) => {
    res.render("pages/login");
  });

  app.get("/delete", functions.isLoggedIn, (req, res) => {
    res.render("pages/delete");
  });

  app.post("/delete", functions.isLoggedIn, async (req, res) => {
    await gameSchema.deleteMany({ username: req.user.username });
    await userSchema.deleteMany({ username: req.user.username });

    res.redirect("/logout");
  });

  app.get("/signup", functions.yaLogeado, (req, res) => {
    res.render("pages/signup");
  });

  app.post("/login", functions.yaLogeado, async (req, res) => {
    const { username, password } = req.body;
    passport.authenticate("local.signin", {
      successRedirect: "/games",
      failureRedirect: "/err",
      failureFlash: true,
    })(req, res, username, password);
  });

  app.post("/signup", functions.yaLogeado, async (req, res) => {
    const { username, password } = req.body;
    passport.authenticate("local.signup", {
      successRedirect: "/games",
      failureRedirect: "/err",
      failureFlash: true,
    })(req, res, username, password);
  });

  app.get("/games", functions.isLoggedIn, async (req, res) => {
    const games = await gameSchema.find({ username: req.user.username });
    res.render("pages/games", { games: games });
  });

  app.get("/game/:name", functions.isLoggedIn, async (req, res) => {
    const { name } = req.params;
    const gameSelected = await gameSchema.findOne({
      name: name,
      username: req.user.username,
    });
    const games = await gameSchema.find({ username: req.user.username });
    if (gameSelected == 0 || gameSelected == null) {
      return res.redirect("/games");
    }
    res.render("pages/game", {
      games: games,
      gameSelected: gameSelected,
    });
  });

  app.get("/user/:id", functions.isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params;
      const userFinded = await userSchema.findOne({ _id: id });
      if (!userFinded) {
        // si no se encuentra el usuario, redirigir a una página de error o mostrar un mensaje de error
        return res.status(404).send("Usuario no encontrado");
      }
      console.log("-> " + userFinded.img);
      const gShots = await gShotsSchema.find({ id: req.params.id });
      let backgroundImg;
      let isUser;
      if (gShots == 0) {
        backgroundImg = userFinded.img;
      } else {
        backgroundImg = gShots[0].img;
      }
      if (req.params.id == req.user.id) {
        isUser = true
      } else {
        isUser = false
      }
      res.render("pages/user", {
        userFinded,
        backgroundImg: backgroundImg,
        isUser: isUser
      });
    } catch (err) {
      // manejar cualquier error que ocurra durante la búsqueda del usuario o de las capturas de pantalla
      console.error(err);
      res.status(500).send("Error del servidor");
    }
  });

  app.get("/gshots", functions.isLoggedIn, async (req, res) => {
    const games = await gameSchema.find({ username: req.user.username });
    res.render("pages/gshots", { games: games });
  });

  app.get("/logout", functions.isLoggedIn, async (req, res) => {
    try {
      req.logOut((err) => {
        if (err) throw err;
        res.redirect("/");
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Ha ocurrido un error al cerrar sesión");
    }
  });  

  app.get("/addGame", functions.isLoggedIn, (req, res) => {
    res.render("pages/addGame");
  });

  app.post("/addGame", functions.isLoggedIn, async (req, res) => {
    try {
      const { name, url } = req.body;
      if (!name || !url) {
        throw new Error("Se requieren los campos 'name' y 'url'");
      }
      const game = new gameSchema({
        name: name,
        url: url,
        username: req.user.username,
        hours: 0,
      });
      await game.save();
      res.redirect("/games");
    } catch (err) {
      console.error(err);
      res.status(400).send("Ha ocurrido un error al agregar el juego");
    }
  });  

  app.get("/profile", functions.isLoggedIn, async (req, res) => {
    const user = await userSchema.find({ username: req.user.username });

    res.render("pages/profile");
  });

  app.get("/administrate", functions.isLoggedIn, async (req, res) => {
    res.render("pages/administrate");
  });

  app.post("/profile", functions.isLoggedIn, async (req, res) => {
    const helpers = require('../../lib/helpers.js')
    const { username, password } = req.body;
    const tryer = await userSchema.find({ username: username })
    const passEncripted = await helpers.encryptPassword(password)
    if (tryer >= 0) {
      await gameSchema.updateMany({ username: req.user.username }, { username: username });
      await userSchema.findOneAndUpdate(
        { username: req.user.username },
        {
          username: username,
          password: passEncripted,
        }
      );
      res.render("pages/profile");
    } else {
      res.render("pages/profile");
    }
  });

  app.get("/img", functions.isLoggedIn, async (req, res) => {
    const user = await userSchema.find({ username: req.user.username });
    res.render("pages/img", {
      value: user.url,
    });
  });

  app.post("/img", functions.isLoggedIn, async (req, res) => {
    const img = req.body.img;
    const user = await userSchema.findOneAndUpdate(
      { username: req.user.username },
      {
        img: img,
      }
    );
    res.render("pages/profile", {
      user: user,
    });
  });

  app.get("/gameImg", functions.isLoggedIn, (req, res) => {
    res.render("pages/img", { gameImg: true });
  });

  app.get("/edit/:id", functions.isLoggedIn, (req, res) => {
    res.render("pages/edit", {
      id: req.params.id,
    });
  });

  app.post("/edit/:id", functions.isLoggedIn, async (req, res) => {
    await gameSchema.findOneAndUpdate({ _id: req.params.id }, { img: req.body.img });
    res.redirect("/games");
  });
};
