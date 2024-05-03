import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models'
import { ok, serverError } from '../../presentation/helper/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
    sut: LogControllerDecorator
    controllerStub: Controller
    logErrorRepositoryStub: LogErrorRepository
}

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        async log (stackError: string): Promise<void> {
            return new Promise(resolve => { resolve() })
        }
    }
    return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return { sut, controllerStub, logErrorRepositoryStub }
}

const makeController = (): Controller => {
    class ControllerStub implements Controller {
        async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
            return new Promise((resolve) => { resolve(ok(makeFakeAccount())) })
        }
    }
    return new ControllerStub()
}

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
    }
})

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
})

const makeFakeServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
}

describe('LogController Decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const handleSpy = jest.spyOn(controllerStub, 'handle')

        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })

    test('SHould return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = { body: { name: 'Raphael' } }
        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(ok(makeFakeAccount()))
    })

    test('Should call logErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(makeFakeServerError()) }))
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)

        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})
