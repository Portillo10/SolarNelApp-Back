import mongoose from 'mongoose'

export const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log('MongoDB connection success')

    } catch (error) {
         throw new Error('Error al conectar a la base de datos' + error)
    }
}

