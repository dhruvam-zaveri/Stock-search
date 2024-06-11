import axios from "axios";

import { addDays, addMonths } from "./../utils/addMonths.js";

const getCompanyDescription = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;
    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/stock/profile2?symbol=${ticker_symbol}&token=${finnhub_api_key}`;

    let response = await axios.get(finnhub_url);
    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getStockQuote = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;
    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/quote?symbol=${ticker_symbol}&token=${finnhub_api_key}`;

    let response = await axios.get(finnhub_url);
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getChartData = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const polygon_api_key = process.env.POLYGON_API_KEY;
    const polygon_base_url = process.env.POLYGON_BASE_URL;
    const multiplier = 1;
    const timespan = "day";
    const toDate = new Date().toISOString().split("T")[0];
    // console.log(toDate);

    let fromDate = addMonths(new Date(), -6);
    fromDate = addDays(fromDate, -1).toISOString().split("T")[0];
    // console.log(fromDate);

    let polygon_url = `${polygon_base_url}/aggs/ticker/${ticker_symbol.toUpperCase()}/range/${multiplier}/${timespan}/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;

    // console.log(polygon_url);

    const response = await axios.get(polygon_url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getHourlyValidation = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const polygon_api_key = process.env.POLYGON_API_KEY;
    const polygon_base_url = process.env.POLYGON_BASE_URL;
    const multiplier = 1;
    const timespan = "hour";
    // const finnhub_api_key = process.env.FINNHUB_API_KEY;
    // let finnhub_url = `${process.env.FINNHUB_BASE_URL}/quote?symbol=${ticker_symbol}&token=${finnhub_api_key}`;

    // let stockQuoteRes = await axios.get(finnhub_url);
    // let quoteData = stockQuoteRes.data;
    // console.log(quoteData);

    // const toDate = new Date(quoteData["t"] * 1000).toISOString().split("T")[0];
    // console.log("To: ", toDate);

    // let fromDate = addDays(new Date(), -3).toISOString().split("T")[0];
    // console.log("From: ", fromDate);

    let today = new Date();
    const isMonday = today.getDay() === 1;
    let year = today.getFullYear();
    let month = (today.getMonth() + 1).toString().padStart(2, "0");
    let day = today.getDate().toString().padStart(2, "0");
    today = `${year}-${month}-${day}`;

    let past = new Date();
    past.setFullYear(past.getFullYear());
    past.setMonth(past.getMonth());
    past.setDate(past.getDate() - 1);
    year = past.getFullYear();
    month = (past.getMonth() + 1).toString().padStart(2, "0");
    day = past.getDate().toString().padStart(2, "0");
    past = `${year}-${month}-${day}`;
    if (isMonday) {
      const now = new Date();
      const sixThirtyAM = new Date();
      sixThirtyAM.setHours(6, 30, 0, 0);
      const isBeforeSixThirtyAM = now < sixThirtyAM;

      if (isBeforeSixThirtyAM) {
        today = new Date();
        today.setDate(today.getDate() - 3);
        month = (today.getMonth() + 1).toString().padStart(2, "0");
        day = today.getDate().toString().padStart(2, "0");
        today = `${year}-${month}-${day}`;

        past = new Date();
        past.setDate(past.getDate() - 4);
        month = (past.getMonth() + 1).toString().padStart(2, "0");
        day = past.getDate().toString().padStart(2, "0");
        past = `${year}-${month}-${day}`;
      } else {
        today = new Date();
        today.setDate(today.getDate() - 1);
        month = (today.getMonth() + 1).toString().padStart(2, "0");
        day = today.getDate().toString().padStart(2, "0");
        today = `${year}-${month}-${day}`;

        past = new Date();
        past.setDate(past.getDate() - 2);
        month = (past.getMonth() + 1).toString().padStart(2, "0");
        day = past.getDate().toString().padStart(2, "0");
        past = `${year}-${month}-${day}`;
      }
    }
    console.log("Past: ", past);
    console.log("Today:", today);
    let polygon_url = `${polygon_base_url}/aggs/ticker/${ticker_symbol.toUpperCase()}/range/${multiplier}/${timespan}/${past}/${today}?adjusted=true&sort=asc&apiKey=${polygon_api_key}`;
    console.log("Polygon URL: ", polygon_url);
    const response = await axios.get(polygon_url);

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error });
  }
};

const getCompanyNews = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;

    const toDate = new Date().toISOString().split("T")[0];
    let fromDate = addMonths(new Date(), -1);
    fromDate = fromDate.toISOString().split("T")[0];

    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/company-news?symbol=${ticker_symbol}&&from=${fromDate}&to=${toDate}&token=${finnhub_api_key}`;

    const response = await axios.get(finnhub_url);
    const data = await response.data;
    const articles = [];
    data.forEach((article) => {
      if (
        article.image != "" &&
        article.url != "" &&
        article.headline != "" &&
        article.datetime != ""
      ) {
        articles.push(article);
      }
    });
    res.json(articles.slice(0, 20));
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getRecommendationTrends = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;

    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/stock/recommendation?symbol=${ticker_symbol}&&token=${finnhub_api_key}`;

    const response = await axios.get(finnhub_url);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getInsiderSentiment = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;

    const toDate = new Date().toISOString().split("T")[0];
    const fromDate = "2022-01-01";

    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/stock/insider-sentiment?symbol=${ticker_symbol}&&from=${fromDate}&&to=${toDate}&&token=${finnhub_api_key}`;

    const response = await axios.get(finnhub_url);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getCompanyPeers = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;

    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/stock/peers?symbol=${ticker_symbol}&&token=${finnhub_api_key}`;

    const response = await axios.get(finnhub_url);
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

const getCompanyEarnings = async (req, res) => {
  try {
    const ticker_symbol = req.params.symbol;
    const finnhub_api_key = process.env.FINNHUB_API_KEY;

    let finnhub_url = `${process.env.FINNHUB_BASE_URL}/stock/earnings?symbol=${ticker_symbol}&&token=${finnhub_api_key}`;

    const response = await axios.get(finnhub_url);

    // TODO: Replace any values that are null with 0

    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ "Error:": error.message });
  }
};

export {
  getCompanyDescription,
  getStockQuote,
  getChartData,
  getHourlyValidation,
  getCompanyNews,
  getRecommendationTrends,
  getInsiderSentiment,
  getCompanyPeers,
  getCompanyEarnings,
};
