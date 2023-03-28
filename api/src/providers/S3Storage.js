const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");
const mime = require('mime');
const { S3 } = require("@aws-sdk/client-s3");

class S3Storage {
  client

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async saveFile(file, folder) {
    const originalName = path.resolve(uploadConfig.TMP_FOLDER, file);

    const fileContent = await fs.promises.readFile(originalName);

    const ContentType = mime.getType(originalName);

    await this.client.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
      ACL: 'public-read',
      Body: fileContent,
      ContentType
    });

    await fs.promises.unlink(originalName);

    return file;
  }

  async deleteFile(file, folder) {
    await this.client.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${folder}/${file}`,
    });
  }
}

module.exports = S3Storage;