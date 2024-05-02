import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'

beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
})

beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
