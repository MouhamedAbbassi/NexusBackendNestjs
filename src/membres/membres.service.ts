import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Membres, MembresDocument } from './schemas/Membres.schema';
import { Model } from 'mongoose';

@Injectable()
export class MembresService {
  constructor(
    @InjectModel(Membres.name) private membresModel: Model<MembresDocument>,
  ) {}
  Add(body: Membres) {
    return this.membresModel.create(body);
  }

  FindAll() {
    return this.membresModel.find();
  }

  FindOne(_id: string) {
    return this.membresModel.findOne({ membreId: _id });
  }

  Update(id: string, body: Membres) {
    return this.membresModel.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  Deletemembre(id: string): Promise<any> {
    return this.membresModel.deleteOne({ _id: id });
  }

  Search(key: string) {
    const keyword = key
      ? {
          $or: [
            { name: { $regex: key, $options: 'i' } },
            { email: { $regex: key, $options: 'i' } },
          ],
        }
      : {};
    return this.membresModel.find(keyword);
  }
  SortByName() {
    return this.membresModel.find().sort({ name: 1 });
  }

  SortByEmail() {
    return this.membresModel.find().sort({ email: 1 });
  }
}