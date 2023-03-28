const knex = require("../database");
const S3Storage = require("../providers/S3Storage");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;
    let client = new DiskStorage();

    if (process.env.DISK !== 'local') {
      client = new S3Storage();
    }

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    if (user.avatar) {
      // await diskStorage.deleteFile(user.avatar);
      await client.deleteFile(user.avatar, "avatar");
    }

    const filename = await client.saveFile(avatarFilename, "avatar");
    
    await knex("users").where({ id: user_id }).update(user);
    
    user.avatar = process.env.DISK === 'local' ? `${process.env.APP_API_URL}/avatar/${filename}` : `${process.env.AWS_BUCKET_URL}/avatar/${filename}`;
    return response.json(user);
  }
}

module.exports = UserAvatarController;