import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailVerification {
  @Prop()
  email: string;

  @Prop()
  token: string;

  @Prop()
  expiresAt: Date;
}

export type EmailVerificationDocument = EmailVerification & Document;
export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);
