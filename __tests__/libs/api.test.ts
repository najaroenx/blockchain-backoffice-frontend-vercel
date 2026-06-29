import { ApiClient, ApiError } from '@/libs/api'

describe('ApiClient', () => {
  it('should create an instance with base URL', () => {
    const client = new ApiClient('https://api.example.com')
    expect(client).toBeDefined()
  })

  it('should create an instance with default URL', () => {
    const client = new ApiClient()
    expect(client).toBeDefined()
  })

  it('should have get method', () => {
    const client = new ApiClient('https://api.example.com')
    expect(typeof client.get).toBe('function')
  })

  it('should have post method', () => {
    const client = new ApiClient('https://api.example.com')
    expect(typeof client.post).toBe('function')
  })

  it('should have put method', () => {
    const client = new ApiClient('https://api.example.com')
    expect(typeof client.put).toBe('function')
  })

  it('should have delete method', () => {
    const client = new ApiClient('https://api.example.com')
    expect(typeof client.delete).toBe('function')
  })
})

describe('ApiError', () => {
  it('should create an error with message and status code', () => {
    const error = new ApiError('Test error', 404)
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(404)
    expect(error.name).toBe('ApiError')
  })

  it('should create an error with details', () => {
    const details = { field: 'test' }
    const error = new ApiError('Test error', 400, details)
    expect(error.details).toEqual(details)
  })
})
