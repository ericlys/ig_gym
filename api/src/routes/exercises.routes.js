const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const { can } = require("../middlewares/permissions");

const ExercisesController = require("../controllers/ExercisesController");
const ExercisesThumbController = require("../controllers/ExercisesThumbController");
const ExercisesImageController = require("../controllers/ExercisesImageController");

const exercisesRoutes = Router();

const exercisesController = new ExercisesController();
const exercisesThumbController = new ExercisesThumbController();
const exercisesImageController = new ExercisesImageController();

const upload = multer(uploadConfig.MULTER);

exercisesRoutes.post(
  "/", 
  ensureAuthenticated,
  can(["create_exercise"]),
  exercisesController.create
);

exercisesRoutes.get("/bygroup/:group", exercisesController.index);
exercisesRoutes.get("/:id", exercisesController.show);
exercisesRoutes.post("/demo", ensureAuthenticated, upload.single("demo"), exercisesImageController.save);
exercisesRoutes.post("/thumb", ensureAuthenticated, upload.single("thumb"), exercisesThumbController.save);

module.exports = exercisesRoutes;