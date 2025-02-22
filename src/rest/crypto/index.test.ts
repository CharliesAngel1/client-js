import * as sinon from "sinon";
import * as chai from "chai";

import * as request from "../transport/request";
import { cryptoClient } from "./index";

describe("[REST] Crypto", () => {
  chai.should();
  let requestStub;
  const sandbox = sinon.createSandbox();
  const crypto = cryptoClient("invalid");
  beforeEach(() => {
    requestStub = sandbox.stub(request, "get").returns(Promise.resolve({}));
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("aggregates call /v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}", async () => {
    requestStub.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        results: [],
      })
    );
    await crypto.aggregates("BTC", 1, "day", "2019-01-01", "2019-02-01");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql(
        "/v2/aggs/ticker/BTC/range/1/day/2019-01-01/2019-02-01"
      );
  });

  it("aggregates grouped daily call /v2/aggs/grouped/locale/global/market/market/{date}", async () => {
    requestStub.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        results: [],
      })
    );
    await crypto.aggregatesGroupedDaily("2019-02-01");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql(
        "/v2/aggs/grouped/locale/global/market/crypto/2019-02-01"
      );
  });

  it("daily open close call /v1/open-close/crypto/{from}/{to}/{date}", async () => {
    await crypto.dailyOpenClose("BTC", "USD", "2019-01-01");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql("/v1/open-close/crypto/BTC/USD/2019-01-01");
  });

  it("previous close call /v2/aggs/ticker/{ticker}/prev", async () => {
    requestStub.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        results: [],
      })
    );
    await crypto.previousClose("BTC");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v2/aggs/ticker/BTC/prev");
  });

  it("trades call /v3/trades/{cryptoTicker}", async () => {
    sandbox.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        ticks: [],
      })
    );
    await crypto.trades("X:BTC-USD");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v3/trades/X:BTC-USD");
  });

  it("last trade call /v1/last/crypto/{from}/{to}", async () => {
    await crypto.lastTrade("BTC", "ETH");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v1/last/crypto/BTC/ETH");
  });

  it("snapshot - all tickers call /v2/snapshot/locale/global/markets/crypto/tickers", async () => {
    sandbox.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        tickers: [],
      })
    );
    await crypto.snapshotAllTickers();
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql("/v2/snapshot/locale/global/markets/crypto/tickers");
  });

  it("snapshot - gainers / losers call /v2/snapshot/locale/global/markets/crypto/{direction}", async () => {
    sandbox.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        tickers: [],
      })
    );
    await crypto.snapshotGainersLosers("gainers");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql("/v2/snapshot/locale/global/markets/crypto/gainers");
  });

  it("snapshot - ticker call /v2/snapshot/locale/global/markets/crypto/tickers/{ticker}", async () => {
    sandbox.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        status: "",
        ticker: {
          day: {},
          lastTrade: {},
          min: {},
          prevDay: {},
        },
      })
    );
    await crypto.snapshotTicker("X:BTCUSD");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql(
        "/v2/snapshot/locale/global/markets/crypto/tickers/X:BTCUSD"
      );
  });

  it("snapshot - full book l2 call /v2/snapshot/locale/global/markets/crypto/tickers/{ticker}/book", async () => {
    sandbox.restore();
    requestStub = sandbox.stub(request, "get").returns(
      Promise.resolve({
        data: {},
      })
    );
    await crypto.snapshotTickerFullBookL2("BTCUSD");
    requestStub.callCount.should.eql(1);
    requestStub
      .getCalls()[0]
      .args[0].should.eql(
        "/v2/snapshot/locale/global/markets/crypto/tickers/BTCUSD/book"
      );
  });

  it("sma call /v1/indicators/sma/{cryptoTicker}", async () => {
    await crypto.sma("X:BTC-USD");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v1/indicators/sma/X:BTC-USD");
  });

  it("ema call /v1/indicators/ema/{cryptoTicker}", async () => {
    await crypto.ema("X:BTC-USD");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v1/indicators/ema/X:BTC-USD");
  });

  it("macd call /v1/indicators/macd/{cryptoTicker}", async () => {
    await crypto.macd("X:BTC-USD");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v1/indicators/macd/X:BTC-USD");
  });

  it("rsi call /v1/indicators/rsi/{cryptoTicker}", async () => {
    await crypto.rsi("X:BTC-USD");
    requestStub.callCount.should.eql(1);
    requestStub.getCalls()[0].args[0].should.eql("/v1/indicators/rsi/X:BTC-USD");
  });
});
