import { Schema, model, Document } from 'mongoose'

export interface IMessage extends Document {
  content: string
  sender: 'user' | 'bot'
  createdAt: Date
  updatedAt: Date;

}

const MessageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
  },
  {
    timestamps: true,
  }
)

export const Message = model<IMessage>('Message', MessageSchema)
