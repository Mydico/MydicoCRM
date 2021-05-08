import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus, Logger,
    Param,
    Post as PostMethod,
    Put,
    Req,
    Res, UploadedFile,
    UploadedFiles, UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import path from 'path';
import resizeOptimizeImages from 'resize-optimize-images';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Page, PageRequest } from '../../domain/base/pagination.entity';
import File from '../../domain/file.entity';
import { User } from '../../domain/user.entity';
import { AuthGuard } from '../../security';
import { FileService } from '../../service/file.service';
import { DOMAIN_NAME } from '../../utils/constants/app.constsants';

@Controller('api/files')
@UseInterceptors(LoggingInterceptor)

export class FileController {
    logger = new Logger('FileController');

    constructor(private readonly fileService: FileService) { }

    @Get('/')
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: File,
    })
    async getAll(@Req() req: Request, @Res() res): Promise<File[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.fileService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/downloads/:name')
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: File,
    })
    async getOne(@Param('name') name: string, @Res() res: Response): Promise<any> {
        const filetypes = /doc|docx|xls|xlsx|pdf/;
        const directory = filetypes.test(name.split('.')[1]) ? './documents' : './uploads';
        const filePath = `${directory}/${name}`;
        const fileName = path.basename(filePath);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-disposition', 'inline; filename=' + fileName);
        const stream = createReadStream(filePath);
        stream.pipe(res);
    }

    @Get('/views/:name')
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: File,
    })
    async serveFile(@Param('name') name, @Res() res): Promise<any> {
        res.sendFile(name, { root: 'uploads' });
    }

    @Put('/')
   
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: File,
    })
    async put(@Res() res: Response, @Body() file: File): Promise<File> {
        HeaderUtil.addEntityCreatedHeaders(res, 'File', file.id);
        return await this.fileService.update(file);
    }

    @Delete('/:id')
   
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async remove(@Res() res: Response, @Param('id') id: string): Promise<File> {
        HeaderUtil.addEntityDeletedHeaders(res, 'File', id);
        const toDelete = await this.fileService.findById(id);
        return await this.fileService.delete(toDelete);
    }
    @PostMethod('/')
   
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseInterceptors(
        FilesInterceptor('file', 20, {
            storage: diskStorage({
                destination: (req: any, file: any, cb: any) => {
                    const filetypes = /doc|docx|xls|xlsx|pdf/;
                    const uploadPath = filetypes.test(file.mimetype) ? './documents' : './uploads';
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath);
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const mineType = file.originalname.split('.')[1];
                    cb(null, `${name}${new Date().getTime()}.${mineType}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                const filetypes = /jpeg|jpg|png|xml|csv|webp|bitmap|doc|docx|xls|pdf|xlsx|mp3|/;
                const mimetype = filetypes.test(file.mimetype);
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mineType = file.originalname.split('.')[1];
                if (mimetype && extname) {
                    return cb(null, true);
                }
                cb(new HttpException(`unsupportedType.${mineType}`, HttpStatus.BAD_REQUEST), false);
            },
            limits: {
                fileSize: 18388608,
            },
        })
    )
    async upload(@UploadedFiles() files: any[], @Req() req: Request): Promise<any> {
        const currentUser = req.user as User;
        (async () => {
            const arr = [];
            const fileTypeRegex =  /jpeg|jpg|png|xml|csv|webp|bitmap|doc|docx|xls|pdf|xlsx|mp3|/;
            files.forEach(file => {
                if (!fileTypeRegex.test(file.mimetype)) {arr.push(file.path);}
            });
            const options = {
                images: arr,
                width: 600,
                quality: 90,
            };
            await resizeOptimizeImages(options);
        })();
        return await this.fileService.upload(files);
    }

    @PostMethod('/ck-editor/upload')
   
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UseInterceptors(
        FileInterceptor('upload', {
            storage: diskStorage({
                destination: (req: any, file: any, cb: any) => {
                    const filetypes = /doc|docx|xls|xlsx|pdf/;
                    const uploadPath = filetypes.test(file.mimetype) ? './documents' : './uploads';
                    if (!existsSync(uploadPath)) {
                        mkdirSync(uploadPath);
                    }
                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    const name = file.originalname.split('.')[0];
                    const mineType = file.originalname.split('.')[1];
                    cb(null, `${name}${new Date().getTime()}.${mineType}`);
                },
            }),
            fileFilter: (req: any, file: any, cb: any) => {
                const filetypes = /jpeg|jpg|png|xml|csv|webp|bitmap|doc|docx|xls|pdf|xlsx/;
                const mimetype = filetypes.test(file.mimetype);
                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mineType = file.originalname.split('.')[1];
                if (mimetype && extname) {
                    return cb(null, true);
                }
                cb(new HttpException(`unsupportedType.${mineType}`, HttpStatus.BAD_REQUEST), false);
            },
            limits: {
                fileSize: 18388608,
            },
        })
    )
    async ckEditorUpload(@UploadedFile() file: any, @Req() req: Request): Promise<any> {

        return { url: DOMAIN_NAME + 'images/' + file.filename };
    }


    @Get('/excel/downloads')
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: File,
    })
    async downLoadTemplate(@Res() res: Response, @Req() req: Request): Promise<any> {
        const directory = './import-excel-template';
        const filePath = `${directory}/${req.query.name}`;
        const fileName = path.basename(filePath);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-disposition', 'inline; filename=' + fileName);
        const stream = createReadStream(filePath);
        stream.pipe(res);
    }

}
