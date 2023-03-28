const knex = require("../database");
const S3Storage = require("../providers/S3Storage");
const DiskStorage = require("../providers/DiskStorage");

class ExercisesImageController {
  async save(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    let client = new DiskStorage();

    if (process.env.DISK !== 'local') {
      client = new S3Storage();
    }

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Somente usuários autenticados podem salvar imagens", 401);
    }

    const filename = await client.saveFile(avatarFilename, "exercises/gif");
    
    const img_url = process.env.DISK === 'local' ? `${process.env.APP_API_URL}/exercises/gif/${filename}` : `${process.env.AWS_BUCKET_URL}/exercises/gif/${filename}`;
    
    return response.json({ filename, img_url });
  }
}

module.exports = ExercisesImageController;