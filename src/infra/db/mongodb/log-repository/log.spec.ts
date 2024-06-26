import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository()
}

describe('Log MongoDB Repository', () => {
    let errorCollection: Collection
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors')
        await errorCollection.deleteMany({})
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    test('Should create an error log on success', async () => {
        const sut = makeSut()
        await sut.logError('any_error')
        const count = await errorCollection.countDocuments()

        expect(count).toBe(1)
    })
})
