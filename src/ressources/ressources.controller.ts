import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RessourcesService } from './ressources.service';
import { Ressources, RessourcesDocument } from './schemas/ressources.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Response } from 'express';
import { HistoriquesService } from 'src/historiques/Historiques.service';

@Controller('ressources')
export class RessourcesController {
  constructor(
    private readonly ressourcesService: RessourcesService,
    private readonly HS: HistoriquesService,
    @InjectModel(Ressources.name) private readonly ressourcesModel: Model<RessourcesDocument>,
  ) {}

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|pdf)$/)) {
          return callback(new BadRequestException('Seuls les fichiers image, vidéo et PDF sont autorisés!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async Upload(@UploadedFile() file: Express.Multer.File) {

    try {
      console.log('File received:', file); // Vérifiez si le fichier est correctement téléchargé
      if (!file) {
        throw new BadRequestException('Aucun fichier n\'a été reçu.');
      }

      // Créez une nouvelle instance de votre modèle Ressources avec les données du fichier
      const newRessource = new this.ressourcesModel({
        fileName: file.originalname,
        filePath: file.path, // Ou tout autre chemin où vous stockez le fichier
        fileType: extname(file.originalname), // Obtenez l'extension du fichier
        expirationDate: null, // Facultatif : définissez une date d'expiration si nécessaire
        createdAt: new Date(), // Définissez la date de création
      });

      // Enregistrez la nouvelle ressource dans la base de données
      const addedRessource = await newRessource.save();
         const addHistorique =this.HS.AddHist(newRessource.id,newRessource.fileName);

      return 'File uploaded successfully';
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors du traitement du fichier : ' + error.message);
    }
  }
/*
  @Post('link')
  async handleLink(@Body() linkData: any) {
    try {
      const { link } = linkData;
      const urlPattern = /^(https?):\/\/(?:www\.)?[^\s.]+(?:\.\w{2,})+(?:\/[^\s]*)?$/;
      if (!link || !urlPattern.test(link)) {
        throw new BadRequestException('Le lien n\'est pas valide');
      }
      fs.appendFileSync('links.txt', link + '\n');
      const newLink = new this.ressourcesModel({
        fileName: 'link', // Mettez un nom approprié pour le lien
        filePath: 'links.txt', // Chemin vers le fichier texte
        fileType: 'txt',
        expirationDate: null,
        createdAt: new Date(),
      });
      await newLink.save();
     const addHistorique =this.HS.AddHist(newLink.fileName);
      return { message: 'Lien traité avec succès' };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors du traitement du lien : ' + error.message);
    }
  }*/

  @Post('link')
  async handleLink(@Body() linkData: any) {
    try {
      const { link } = linkData;
      const urlPattern = /^(https?):\/\/(?:www\.)?[^\s.]+(?:\.\w{2,})+(?:\/[^\s]*)?$/;
      if (!link || !urlPattern.test(link)) {
        throw new BadRequestException('Le lien n\'est pas valide');
      }
      fs.appendFileSync('links.txt', link + '\n');
      const newLink = new this.ressourcesModel({
        fileName: link, // Mettez un nom approprié pour le lien
        filePath: 'links.txt', // Chemin vers le fichier texte
        fileType: 'txt',
      
       
        createdAt: new Date(),
      });
      await newLink.save();
     const addHistorique =this.HS.AddHist(newLink.id,newLink.fileName);
      return { message: 'Lien traité avec succès' };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors du traitement du lien : ' + error.message);
    }
  }









  @Get()
  async findAll() {
    return this.ressourcesService.findAll();
  }

 /* @Get('/get-image/:filename')
  async getImage(@Param('filename') filename: string) {
    try {
      const image = await this.ressourcesService.findOneImage(filename);
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      return { status: 'ok', data: image };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération de l\'image : ' + error.message);
    }
  }*/

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const resource = await this.ressourcesService.findOneById(id);
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }
      return resource;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while searching for the resource: ' + error.message);
    }
  }
  
  @Post('/search')
  Search(@Query('key') key) {
    return this.ressourcesService.Search(key);
  }

 
  



  @Put('/upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|pdf)$/)) {
          return callback(new BadRequestException('Seuls les fichiers image, vidéo et PDF sont autorisés!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async handleUpload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log('File received:', file); // Vérifiez si le fichier est correctement téléchargé
      if (!file) {
        throw new BadRequestException('Aucun fichier n\'a été reçu.');
      }
  
      // Récupérer la ressource existante par son ID
      const existingResource = await this.ressourcesService.findOneById(id);
      if (!existingResource) {
        throw new NotFoundException('Ressource non trouvée');
      }
      
      // Mettre à jour les propriétés de la ressource avec les données du fichier
      existingResource.fileName = file.originalname;
      existingResource.filePath = file.path;
      existingResource.fileType = extname(file.originalname);
      existingResource.createdAt = new Date();
  
      // Enregistrer la ressource mise à jour dans la base de données
      const updatedResource = await existingResource.save();
     const upHist =this.HS.UpHist(id,updatedResource.createdAt,updatedResource.modifiedAt, updatedResource.fileName);

      return 'File uploaded successfully';
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors du traitement du fichier : ' + error.message);
    }
  }
 /* @Put('link/:id')
  async updateLink(@Param('id') id: string, @Body() linkData: any) {
      try {
        
          const { link } = linkData;
          const urlPattern = /^(https?):\/\/(?:www\.)?[^\s.]+(?:\.\w{2,})+(?:\/[^\s]*)?$/;
          if (!link || !urlPattern.test(link)) {
              throw new BadRequestException('Le lien n\'est pas valide');
              
          }
  
          // Écrire le lien dans un fichier texte
          fs.writeFileSync('links.txt', link + '\n');
  
          // Mettre à jour le lien dans la base de données
          const updatedResource = await this.ressourcesService.updateResource(id, { link: 'links.txt' , newFileName: linkData.newFileName });
          const upHist =this.HS.UpHist(updatedResource.createdAt,updatedResource.modifiedAt, updatedResource.fileName);
  
          return { message: 'Lien mis à jour avec succès' };
      } catch (error) {
          throw new InternalServerErrorException('Une erreur est survenue lors de la mise à jour du lien : ' + error.message);
      }
  }*/


  @Put('link/:id')
  async handleUpdateLink(@Param('id') id: string, @Body() linkData: any) {
    try {
      const { link } = linkData;
      const urlPattern = /^(https?):\/\/(?:www\.)?[^\s.]+(?:\.\w{2,})+(?:\/[^\s]*)?$/;
      if (!link || !urlPattern.test(link)) {
        throw new BadRequestException('Le lien n\'est pas valide');
      }
      
      // Recherche de la ressource dans la base de données par son ID
      const resource = await this.ressourcesModel.findById(id);
  
      if (!resource) {
        throw new NotFoundException('Ressource non trouvée');
      }
  
      // Mise à jour des champs de la ressource
      resource.fileName = link; // Mettez un nom approprié pour le lien
      resource.filePath = 'links.txt'; // Chemin vers le fichier texte
      resource.fileType = 'txt';
      resource.createdAt = new Date();
      resource.modifiedAt = new Date();
  
      // Enregistrement de la ressource mise à jour dans la base de données
      await resource.save();
  
      // Ajout de l'historique
      const addHistorique = this.HS.AddHist(id,resource.fileName);
  
      return { message: 'Lien mis à jour avec succès' };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la mise à jour du lien : ' + error.message);
    } 
  }




  @Delete("/:id")
  async delete(@Param('id') id: string) {
    try {
      const R = await this.ressourcesService.findById(id);
      console.log(R);
      const DlHist =this.HS.DlHist(R.createdAt,R.fileName);
      return this.ressourcesService.delete(id);
      
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression de la ressource : ' + error.message);
    }
  }

 /* @Get('/search')
  async search(@Query('key') key: string) {
    try {
      return this.ressourcesService.search(key);
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la recherche : ' + error.message);
    }
  }*/
  

  @Get('content/:id')
    async getContent(@Param('id') id: string, @Res() res: Response) {
        try {
            const content = await this.ressourcesService.getContent(id);
            if (!content) {
                return res.status(404).send('Resource not found');
            }

            // Renvoyer le contenu du fichier dans le corps de la réponse HTTP
            res.set('Content-Type', 'application/octet-stream');
            res.send(content);
        } catch (error) {
            return res.status(500).send('Failed to get resource content: ' + error.message);
        }
    }

















}