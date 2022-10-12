import { Controller, HttpCode, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileElementResponse } from "./responses/file-element.response";
import { FilesService } from "./files.service";
import { MFile } from "./utils";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)]
    if (file.mimetype.includes('image')) {
      const webP = await this.filesService.convertToWebP(file.buffer);
      const webPFileName = `${file.originalname.split('.')[0]}.webp`
      saveArray.push(new MFile({ originalname: webPFileName, buffer: webP }));
    }
    return this.filesService.saveFiles(saveArray);
  }

}
