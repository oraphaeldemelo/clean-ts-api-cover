import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
})

beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await (await accountCollection).deleteMany({})
})

afterAll(async () => {
    await MongoHelper.disconnect()
})

describe('SignUp Middleware', () => {
    test('Should return an account on sucess', async () => {
        await request(app)
        .post('/api/signup')
        .send({ name: 'Raphael', email: 'raphael@email.com', password: '123', passwordConfirmation: '123' })
        .expect(200)
    })
})
