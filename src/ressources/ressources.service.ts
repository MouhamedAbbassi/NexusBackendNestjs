import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path, { extname } from 'path';
import { Ressources, RessourcesDocument } from './schemas/ressources.schema';
import * as fs from 'fs';


@Injectable()
export class RessourcesService {
    constructor(
        @InjectModel(Ressources.name) private readonly ressourcesModel: Model<RessourcesDocument>,
      ) {}

    async add(body: any): Promise<RessourcesDocument> {
        try {
            const newRessource = new this.ressourcesModel(body);
            return await newRessource.save();
        } catch (error) {
            throw new Error('Failed to add ressource to database');
        }
    }
    
    findAll() {
        return this.ressourcesModel.find().exec();
    }
    
    findOne(filename: string): Promise<RessourcesDocument | null> {
        return this.ressourcesModel.findOne({ fileName: filename }).exec();
    }

 
    async updateResource(id: string, updateData: any): Promise<RessourcesDocument | null> {
        try {
            const resource = await this.findById(id);
            if (!resource) {
                throw new NotFoundException('Resource not found');
            }
    
            // Si les données de mise à jour concernent un lien
            if (updateData.link) {
                // Mettez à jour le chemin du fichier avec le lien
                return await this.ressourcesModel.findByIdAndUpdate(
                    id,
                    { filePath: updateData.link,
                        fileType: 'link' },
                    { new: true }
                );
            }  else if (updateData.file) {
                const file = updateData.file;
                if (resource.fileType !== 'link') {
                    fs.unlinkSync(resource.filePath); // Supprimer l'ancien fichier du système de fichiers
                }
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const newFilename = `${uniqueSuffix}${ext}`;
                const newPath = path.join('./src/images', newFilename);
                fs.renameSync(file.path, newPath); // Déplacez le fichier téléchargé vers le nouveau chemin
  
                return await this.ressourcesModel.findByIdAndUpdate(
                    id,
                    { 
                        fileName: file.originalname,
                        filePath: newPath,
                        fileType: ext === '.pdf' ? 'pdf' : 'image', // Vous pouvez ajuster cette logique selon vos besoins
                        expirationDate: null, // Facultatif : définissez une date d'expiration si nécessaire
                        createdAt: new Date() // Définissez la date de création
                    },
                    { new: true }
                );
            } 
            else {
                // Si les données de mise à jour ne sont pas valides
                throw new BadRequestException('Invalid update data');
            }
        } catch (error) {
            // Gérer les erreurs lors de la mise à jour de la ressource
            throw new InternalServerErrorException('Failed to update resource: ' + error.message);
        }
    }
    delete(id: string) {
        return this.ressourcesModel.findByIdAndDelete(id);
    }
   /* search(key: string) {
        try {
          const keyword = new RegExp(key, 'i');
          return this.ressourcesModel.find({ fileName: keyword });
        } catch (error) {
          throw new Error('Une erreur est survenue lors de la recherche : ' + error.message);
        }
      }*/
    async findOneById(id: string): Promise<Ressources | null> {
        try {
          const resource = await this.ressourcesModel.findOne({ _id: id });
          return resource;
        } catch (error) {
          throw new Error('Failed to find resource');
        }
      }
    async findById(id: string): Promise<Ressources | null> {
        return await this.ressourcesModel.findById(id).exec();
    }
    async getContent(id: string): Promise<Buffer | string | null> {
        try {
            // Récupérer la ressource par son ID
            const resource = await this.findById(id);
            if (!resource) {
                throw new Error('Resource not found');
            }

            // Vérifier le type de fichier
            if (resource.fileType === 'link') {
                // Si c'est un lien, renvoyer simplement le chemin du fichier
                return resource.filePath;
            }

            // Si c'est un fichier physique, lire son contenu et le renvoyer
            const content = fs.readFileSync(resource.filePath);

            return content;
        } catch (error) {
            throw new InternalServerErrorException('Failed to get resource content: ' + error.message);
        }
    }
    Search(key: string) {
        const keyword = key
         ? {
                $or: [
                    { fileName: {$regex: key , $options: 'i'}  },
                    { fileType: {$regex: key , $options: 'i'}  }
                ]
            }
            : {};
        return this.ressourcesModel.find(keyword);
      




    }












}