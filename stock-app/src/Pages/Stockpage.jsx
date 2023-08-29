import React, { useState, useEffect } from "react";
import "../styling/stockpage.css";
import Stock from "../Components/Stock";
import axios from "axios";

const Stockpage = () => {
  const popularStocks = [
    { name: "Apple", symbol: "AAPL" },
    { name: "Amazon", symbol: "AMZN" },
    { name: "Microsoft Corporation", symbol: "MSFT" },
    { name: "Saudi Arabia Oil", symbol: "SE" },
    { name: "Google", symbol: "GOOGL" },
  ];
  const [searchedStock, setSearchedStock] = useState("");
  const [searchedStockData, setSearchedStockData] = useState(null); // Store data for the searched stock
  const [response, setResponse] = useState(null); // Store API response data
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [popularStocksData, setPopularStocksData] = useState([]); // Store data for popular stocks
  const [selectedStock, setSelectedStock] = useState(null); // Store the selected stock symbol

  const [priceTrendScore, setPriceTrendScore] = useState(0);
  const [peScore, setPeScore] = useState(0);
  const [epsScore, setEpsScore] = useState(0);
  const [volumeScore, setVolumeScore] = useState(0);
  const [dayrangeScore, setDayrangeScore] = useState(0);
  const [yearrangeScore, setYearrangeScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);

  const calculatePriceTrendScore = (currentPrice, priceAvg50, priceAvg200) => {
    const deviationFrom50MA = (currentPrice - priceAvg50) / priceAvg50;
    const deviationFrom200MA = (currentPrice - priceAvg200) / priceAvg200;

    // Assign scores based on deviations (you can adjust these values)
    const score50MA =
      deviationFrom50MA > 0
        ? -deviationFrom50MA * 100
        : deviationFrom50MA * 100;
    const score200MA =
      deviationFrom200MA > 0
        ? -deviationFrom200MA * 100
        : deviationFrom200MA * 100;

    // Calculate the total score based on the sum of scores from 50MA and 200MA
    const totalScore = score50MA + score200MA;

    return totalScore;
  };

  const calculatePEScore = (peRatio) => {
    // Define your logic to assign scores based on PE ratio
    // You can adjust the threshold and score values as needed
    if (peRatio < 15) {
      return 100;
    } else if (peRatio >= 15 && peRatio < 25) {
      return 50;
    } else {
      return 0;
    }
  };
  const calculateEPSScore = (eps) => {
    if (eps === null || eps <= 0) {
      return 0; // Return a low score if EPS is missing or non-positive
    } else if (eps < 5) {
      return 1; // Return a moderate score if EPS is between 0 and 5
    } else {
      return 2; // Return a high score if EPS is greater than 5
    }
  };
  // Calculate the Volume Score
  const calculateVolumeScore = (currentVolume, averageVolume) => {
    if (currentVolume === null || averageVolume === null) {
      return 0; // Return a low score if volume data is missing
    }

    const volumeRatio = currentVolume / averageVolume;

    if (volumeRatio >= 2) {
      return 2; // Return a high score if current volume is at least double the average
    } else if (volumeRatio >= 1) {
      return 1; // Return a moderate score if current volume is higher than average
    } else {
      return 0; // Return a low score if current volume is lower than average
    }
  };

  // Calculate the Day Range Score
  const calculateDayRangeScore = (currentPrice, dayLow, dayHigh) => {
    if (currentPrice === null || dayLow === null || dayHigh === null) {
      return 0; // Return a low score if price or range data is missing
    }

    const priceRatio = (currentPrice - dayLow) / (dayHigh - dayLow);

    if (priceRatio >= 0.7) {
      return 2; // Return a high score if current price is close to the day's high
    } else if (priceRatio >= 0.4) {
      return 1; // Return a moderate score if current price is in the middle range
    } else {
      return 0; // Return a low score if current price is closer to the day's low
    }
  };

  // Calculate the Year Range Score
  const calculateYearRangeScore = (currentPrice, yearLow, yearHigh) => {
    if (currentPrice === null || yearLow === null || yearHigh === null) {
      return 0; // Return a low score if price or range data is missing
    }

    const priceRatio = (currentPrice - yearLow) / (yearHigh - yearLow);

    if (priceRatio >= 0.7) {
      return 2; // Return a high score if current price is close to the year's high
    } else if (priceRatio >= 0.4) {
      return 1; // Return a moderate score if current price is in the middle range
    } else {
      return 0; // Return a low score if current price is closer to the year's low
    }
  };

  const fetchPopularStocksData = async (symbols) => {
    const apiKey = "c8900940600098ea62d8a0f27d823099"; // Replace with your API key from financialmodelingprep.com

    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbols.join()}?apikey=${apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  useEffect(() => {
    const popularStockSymbols = popularStocks.map((stock) => stock.symbol);

    // Fetch initial data for popular stocks
    fetchPopularStocksData(popularStockSymbols).then((data) => {
      console.log("Fetched data for popular stocks:", data);
      setPopularStocksData(data);
    });

    // Periodically fetch data for popular stocks every 15 seconds
    const intervalId = setInterval(() => {
      fetchPopularStocksData(popularStockSymbols).then((data) => {
        console.log("Fetched updated data for popular stocks:", data);
        setPopularStocksData(data);
      });
    }, 3600000); //change this back to 15000

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchStockData = async (symbol) => {
    const apiKey = "c8900940600098ea62d8a0f27d823099"; // Replace with your API key from financialmodelingprep.com

    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
      );
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };
  const handleStockClick = (symbol) => {
    console.log("Clicked stock:", symbol); // Log clicked stock symbol
    // Do nothing when popular stock is clicked
  };
  const handleSearchResultClick = (symbol) => {
    console.log("Clicked search result:", symbol);
    setSearchedStock(symbol);
    setSelectedStock(symbol); // Set the selected stock
    setSearchResults([]); // Clear search results after selection
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (searchedStock) {
      const apiKey = "c8900940600098ea62d8a0f27d823099"; // Replace with your API key
      const searchApiUrl = `https://financialmodelingprep.com/api/v3/search?query=${searchedStock}&limit=5&exchange=NASDAQ&apikey=${apiKey}`;

      try {
        const response = await axios.get(searchApiUrl);
        console.log("Search results:", response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]); // Clear the search results when search is empty
    }
  };

  //   useEffect(() => {
  //     if (searchedStockData) {
  //       console.log("Searched stock data available:", searchedStockData);
  //     }
  //   }, [searchedStockData]);

  useEffect(() => {
    if (selectedStock) {
      fetchStockData(selectedStock).then((data) => {
        console.log("FOUND INFO:", data);
        setSearchedStockData(data);

        const currentPrice = data[0]?.price;
        const priceAvg50 = data[0]?.priceAvg50;
        const priceAvg200 = data[0]?.priceAvg200;
        const priceTrendScore = calculatePriceTrendScore(
          currentPrice,
          priceAvg50,
          priceAvg200
        );

        // Calculate the PE and EPS score
        const peScore = calculatePEScore(data[0]?.pe);
        const epsScore = calculateEPSScore(data[0]?.eps); // Calculate EPS score

        const volumeScore = calculateVolumeScore(
          data[0]?.volume,
          data[0]?.avgVolume
        );
        const dayrangeScore = calculateDayRangeScore(
          data[0]?.price,
          data[0]?.dayLow,
          data[0]?.dayHigh
        );
        const yearrangeScore = calculateDayRangeScore(
          data[0]?.price,
          data[0]?.yearLow,
          data[0]?.yearHigh
        );

        const overallScore =
          priceTrendScore +
          peScore * epsScore +
          volumeScore +
          dayrangeScore +
          yearrangeScore;

        setPriceTrendScore(priceTrendScore);
        setPeScore(peScore);
        setEpsScore(epsScore);
        setVolumeScore(volumeScore);
        setDayrangeScore(dayrangeScore);
        setYearrangeScore(yearrangeScore);
        setOverallScore(overallScore);
        // Now you can use the 'overallScore' or other calculated values as needed
      });
    }
  }, [selectedStock]);

  return (
    <div className="main__container">
      <div className="container">
        <div className="popular__stocks">
          <h3>Popular Stocks</h3>
          <div className="list__stocks">
            {popularStocks.map((stock) => {
              const stockData = popularStocksData.find(
                (data) => data.symbol === stock.symbol
              );

              return (
                <Stock
                  key={stock.symbol}
                  name={stock.name}
                  symbol={stock.symbol}
                  data={stockData}
                  onClick={() => handleStockClick(stock.symbol)}
                />
              );
            })}
          </div>
        </div>
        <div className="search__bar">
          <form id="form" className="search_bar" onSubmit={handleSearchSubmit}>
            <div className="text_box">
              <input
                type="search"
                id="query"
                name="stock_name"
                placeholder="Search Stock"
                className="search_bar search__input"
                value={searchedStock}
                onChange={(e) => setSearchedStock(e.target.value)}
              />
              <button type="submit" className="go">
                Go
              </button>
            </div>
            <div className="search_results">
              {searchResults.map((result) => (
                <div
                  key={result.symbol}
                  onClick={() => handleSearchResultClick(result.symbol)}
                >
                  <p className="single_result">
                    {result.symbol} {result.name}
                  </p>
                </div>
              ))}
            </div>
          </form>
          <div className="category">
            <div className="category1">
              <h3>Stock Price</h3>
              <h5>{searchedStockData && searchedStockData[0]?.price}</h5>
            </div>
            <div className="category1">
              <h3>Volume</h3>
              <h5>
                Volume - {searchedStockData && searchedStockData[0]?.volume}
              </h5>
              <h5>
                Avg. Volume -{" "}
                {searchedStockData && searchedStockData[0]?.avgVolume}
              </h5>
            </div>

            <div className="category1">
              <h3>Market Cap</h3>
              <h5>{searchedStockData && searchedStockData[0]?.marketCap}</h5>
            </div>
            <div className="category1">
              <h3>P/E</h3>
              <h5>{searchedStockData && searchedStockData[0]?.pe}</h5>
            </div>
            <div className="category1">
              <h3>EPS</h3>
              <h5>{searchedStockData && searchedStockData[0]?.eps}</h5>
            </div>
            <div className="category1">
              <h3>Day High/Low</h3>
              <h5>
                High - {searchedStockData && searchedStockData[0]?.yearHigh}
              </h5>
              <h5>
                Low - {searchedStockData && searchedStockData[0]?.yearLow}
              </h5>
            </div>
            <div className="category1">
              <h3>Year High/Low</h3>
              <h5>
                High - {searchedStockData && searchedStockData[0]?.dayHigh}
              </h5>
              <h5>Low - {searchedStockData && searchedStockData[0]?.dayLow}</h5>
            </div>
            <div className="category1">
              <h3>Previous Closing</h3>
              <h5>
                High -{" "}
                {searchedStockData && searchedStockData[0]?.previousClose}
              </h5>
            </div>
          </div>
          <div className="score">
            <h2>Score</h2>
            <div className="score_wrapper">
              <div className="single_score">
                <h3>Price Trend</h3>
                {priceTrendScore !== 0 && <h5>{priceTrendScore}</h5>}
              </div>
              <div className="single_score">
                <h3>P/E</h3>
                {peScore !== 0 && <h5>{peScore}</h5>}
              </div>
              <div className="single_score">
                <h3>EPS</h3>
                {epsScore !== 0 && <h5>{epsScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Volume</h3>
                {volumeScore !== 0 && <h5>{volumeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Day Range</h3>
                {dayrangeScore !== 0 && <h5>{dayrangeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Year Range</h3>
                {yearrangeScore !== 0 && <h5>{yearrangeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Overall</h3>
                {overallScore !== 0 && <h5>{overallScore}</h5>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stockpage;
