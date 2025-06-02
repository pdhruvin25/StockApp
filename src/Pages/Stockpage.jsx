import React, { useState, useEffect } from "react";
import "../CSS/stockpage.css";
import Stock from "../Components/Stock";
import { Link } from "react-router-dom";
import axios from "axios";
import { BentoGrid, BentoCard } from "../Components/magicui/BentoGrid";

const Stockpage = () => {
  const popularStocks = [
    { name: "Apple", symbol: "AAPL" },
    { name: "Amazon", symbol: "AMZN" },
    { name: "Microsoft Corporation", symbol: "MSFT" },
    { name: "Saudi Arabia Oil", symbol: "SE" },
    { name: "Google", symbol: "GOOGL" },
    { name: "Netflix", symbol: "NFLX" },
    { name: "Tesla", symbol: "TSLA" },
    { name: "Mastercard", symbol: "MA" },
    { name: "VISA", symbol: "VS" },
    { name: "Coca Cola", symbol: "KO" },
    { name: "Meta", symbol: "META" },
    { name: "Berkshire", symbol: "BHLB" },
  ];

  const [searchedStock, setSearchedStock] = useState("");
  const [searchedStockData, setSearchedStockData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [popularStocksData, setPopularStocksData] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  // Scores
  const [priceTrendScore, setPriceTrendScore] = useState(0);
  const [peScore, setPeScore] = useState(0);
  const [epsScore, setEpsScore] = useState(0);
  const [volumeScore, setVolumeScore] = useState(0);
  const [dayrangeScore, setDayrangeScore] = useState(0);
  const [yearrangeScore, setYearrangeScore] = useState(0);
  const [overallScore, setOverallScore] = useState("");
  const [ovrscore, setOvrScore] = useState(0);

  const apiKey = "c8900940600098ea62d8a0f27d823099";

  const calculatePriceTrendScore = (currentPrice, priceAvg50, priceAvg200) => {
    const dev50 = (currentPrice - priceAvg50) / priceAvg50;
    const dev200 = (currentPrice - priceAvg200) / priceAvg200;
    return dev50 * 50 + dev200 * 25;
  };

  const calculatePEScore = (peRatio) => {
    if (peRatio < 10) return 100;
    if (peRatio < 20) return 75;
    if (peRatio < 30) return 50;
    if (peRatio < 40) return 25;
    return 0;
  };

  const calculateEPSScore = (eps) => {
    if (eps <= 0) return 0;
    if (eps < 2) return 25;
    if (eps < 5) return 50;
    if (eps < 10) return 75;
    return 100;
  };

  const calculateVolumeScore = (current, avg) => {
    const ratio = current / avg;
    if (ratio >= 2) return 100;
    if (ratio >= 1) return 75;
    if (ratio >= 0.5) return 50;
    return 25;
  };

  const calculateRangeScore = (current, low, high) => {
    const ratio = (current - low) / (high - low);
    if (ratio >= 0.8) return 100;
    if (ratio >= 0.6) return 75;
    if (ratio >= 0.4) return 50;
    if (ratio >= 0.2) return 25;
    return 0;
  };

  const fetchPopularStocksData = async () => {
    try {
      const symbols = popularStocks.map((s) => s.symbol).join(",");
      const res = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`
      );
      setPopularStocksData(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchPopularStocksData();
    const intervalId = setInterval(fetchPopularStocksData, 3600000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
    setSearchedStock(symbol);
    setSearchResults([]);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchedStock) return;
    try {
      const res = await axios.get(
        `https://financialmodelingprep.com/api/v3/search?query=${searchedStock}&limit=5&exchange=NASDAQ&apikey=${apiKey}`
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    if (!selectedStock) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://financialmodelingprep.com/api/v3/quote/${selectedStock}?apikey=${apiKey}`
        );
        const data = res.data[0];
        setSearchedStockData(res.data);

        const scores = {
          priceTrend: calculatePriceTrendScore(
            data.price,
            data.priceAvg50,
            data.priceAvg200
          ),
          pe: calculatePEScore(data.pe),
          eps: calculateEPSScore(data.eps),
          volume: calculateVolumeScore(data.volume, data.avgVolume),
          day: calculateRangeScore(data.price, data.dayLow, data.dayHigh),
          year: calculateRangeScore(data.price, data.yearLow, data.yearHigh),
          longTermRange: calculateRangeScore(data.price, data.fiveYearLow, data.fiveYearHigh),
        };

        const totalScore =
          scores.priceTrend +
          scores.pe +
          scores.eps +
          scores.volume +
          scores.day +
          scores.year;

        setPriceTrendScore(scores.priceTrend);
        setPeScore(scores.pe);
        setEpsScore(scores.eps);
        setVolumeScore(scores.volume);
        setDayrangeScore(scores.day);
        setYearrangeScore(scores.year);
        setOvrScore(totalScore);

        if (totalScore >= 500) setOverallScore("Excellent");
        else if (totalScore >= 400) setOverallScore("Very Good");
        else if (totalScore >= 300) setOverallScore("Good");
        else if (totalScore >= 200) setOverallScore("Moderate");
        else setOverallScore("Poor");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [selectedStock]);

  return (
    <div className="main__container">
      <div className="container">
        <div className="list__stocks">
          {popularStocks.map((stock) => {
            const data = popularStocksData.find(
              (d) => d.symbol === stock.symbol
            );
            return (
              <Stock
                key={stock.symbol}
                name={stock.name}
                symbol={stock.symbol}
                data={data}
                onClick={() => handleStockClick(stock.symbol)}
              />
            );
          })}
        </div>

        <div className="search__bar">
          <form onSubmit={handleSearchSubmit}>
            <div className="text_box">
              <input
                type="search"
                placeholder={
                  selectedStock ? `Selected: ${selectedStock}` : "Search Stock"
                }
                className="search__input"
                value={searchedStock}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchedStock(value);

                  // Reset selected stock and scores
                  if (selectedStock) {
                    setSelectedStock(null);
                    setSearchedStockData(null);
                    setPriceTrendScore(0);
                    setPeScore(0);
                    setEpsScore(0);
                    setVolumeScore(0);
                    setDayrangeScore(0);
                    setYearrangeScore(0);
                    setOverallScore("");
                    setOvrScore(0);
                  }

                  // If the input is empty, clear search results
                  if (value === "") {
                    setSearchResults([]);
                  }
                }}
              />

              <button type="submit" className="go">
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="search_results">
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    className="single_result"
                    onClick={() => handleStockClick(result.symbol)}
                  >
                    {result.symbol} {result.name}
                  </div>
                ))}
              </div>
            )}
          </form>

          {searchedStockData && (
            <div className="category">
              <div className="category1">
                <h3>Price</h3>
                <h5>{searchedStockData[0]?.price}</h5>
              </div>
              <div className="category1">
                <h3>Volume</h3>
                <h5>{searchedStockData[0]?.volume}</h5>
                <h5>Avg: {searchedStockData[0]?.avgVolume}</h5>
              </div>
              <div className="category1">
                <h3>Market Cap</h3>
                <h5>{searchedStockData[0]?.marketCap}</h5>
              </div>
              <div className="category1">
                <h3>P/E</h3>
                <h5>{searchedStockData[0]?.pe}</h5>
              </div>
              <div className="category1">
                <h3>EPS</h3>
                <h5>{searchedStockData[0]?.eps}</h5>
              </div>
              <div className="category1">
                <h3>Day High/Low</h3>
                <h5>H: {searchedStockData[0]?.dayHigh}</h5>
                <h5>L: {searchedStockData[0]?.dayLow}</h5>
              </div>
              <div className="category1">
                <h3>Year High/Low</h3>
                <h5>H: {searchedStockData[0]?.yearHigh}</h5>
                <h5>L: {searchedStockData[0]?.yearLow}</h5>
              </div>
              <div className="category1">
                <h3>Previous Close</h3>
                <h5>{searchedStockData[0]?.previousClose}</h5>
              </div>
            </div>
          )}

          {searchedStockData && (
            <div className="score">
              <h2>Score</h2>
              <div className="score_wrapper">
                <div className="single_score">
                  <h3>Price Trend</h3>
                  <h5>{priceTrendScore.toFixed(1)}</h5>
                </div>
                <div className="single_score">
                  <h3>P/E</h3>
                  <h5>{peScore}</h5>
                </div>
                <div className="single_score">
                  <h3>EPS</h3>
                  <h5>{epsScore}</h5>
                </div>
                <div className="single_score">
                  <h3>Volume</h3>
                  <h5>{volumeScore}</h5>
                </div>
                <div className="single_score">
                  <h3>Day</h3>
                  <h5>{dayrangeScore}</h5>
                </div>
                <div className="single_score">
                  <h3>Year</h3>
                  <h5>{yearrangeScore}</h5>
                </div>
                <div className="single_score">
                  <h3>Overall</h3>
                  <h5>{overallScore}</h5>
                  <h5>{ovrscore.toFixed(1)}</h5>
                </div>
              </div>
            </div>
          )}

          {selectedStock && (
            <div className="stock__news">
              <Link
                to={`/StockApp/stocks/news/${selectedStock}`}
                className="news__button"
              >
                {`View ${selectedStock} News`}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stockpage;
