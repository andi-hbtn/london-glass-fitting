import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { ServiceHandler } from 'src/errorHandler/service.error';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public async send(@Body() bodyParam: ContactDto, @UploadedFile() file: Express.Multer.File,): Promise<any> {
        try {
            const result = await this.contactService.sendEmail(bodyParam, file);
            return result;
        } catch (error) {
            throw new ServiceHandler(error.response, error.status);
        }
    }
}
