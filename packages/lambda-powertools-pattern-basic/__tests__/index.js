const MockImplementation = () => {
  return {
    before: (handler, next) => { next() }
  }
}

const SampleLogging = jest.fn()
// eslint-disable-next-line no-unused-vars
const MockSampleLogging = jest.mock(
  '@perform/lambda-powertools-middleware-sample-logging',
  () => { return SampleLogging.mockImplementation(MockImplementation) }
)

const CaptureCorrelationIds = jest.fn()
// eslint-disable-next-line no-unused-vars
const MockCaptureCorrelationIds = jest.mock(
  '@perform/lambda-powertools-middleware-correlation-ids',
  () => { return CaptureCorrelationIds.mockImplementation(MockImplementation) }
)

afterEach(() => {
  delete process.env.SAMPLE_DEBUG_LOG_RATE

  SampleLogging.mockClear()
  CaptureCorrelationIds.mockClear()
})

// const LogTimeout = require('@perform/lambda-powertools-middleware-log-timeout')
const util = require('util')

describe('basic pattern', () => {
  describe('when there are no overrides', () => {
    it('should set sample debug log rate to 0.01', async () => {
      const wrap = require('../index')
      const handler = util.promisify(wrap(async () => { }))
      await handler({}, {})
      expect(CaptureCorrelationIds).toHaveBeenCalledWith({ sampleDebugLogRate: 0.01 })
      expect(SampleLogging).toHaveBeenCalledWith({ sampleRate: 0.01 })
    })
  })

  describe('when there is an override for sample debug log rate', () => {
    beforeAll(() => {
      process.env.SAMPLE_DEBUG_LOG_RATE = '0.03'
    })

    it('should set sample debug log rate to 0.03', async () => {
      const wrap = require('../index')
      const handler = util.promisify(wrap(async () => { }))
      await handler({}, {})
      expect(CaptureCorrelationIds).toHaveBeenCalledWith({ sampleDebugLogRate: 0.03 })
      expect(SampleLogging).toHaveBeenCalledWith({ sampleRate: 0.03 })
    })
  })
})
