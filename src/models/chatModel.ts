import mongoose, { Schema, Document } from 'mongoose'

interface IData extends Document {
  name?: string
  mail?: string
  hiddenText?: string
}

const DataSchema: Schema = new Schema({
  name: { type: String, required: false },
  mail: { type: String, required: false },
  hiddenText: { type: String, required: false },
})

const DataModel = mongoose.model<IData>('Data', DataSchema)

export default DataModel
