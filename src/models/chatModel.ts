import { Schema, model, Document } from 'mongoose'
import { IMessage } from './messageModel'

export interface IChat extends Document {
  firstName: string
  lastName: string
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  {
    timestamps: true,
  }
)

export const Chat = model<IChat>('Chat', ChatSchema)
