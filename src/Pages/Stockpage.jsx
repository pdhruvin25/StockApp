import React, { useState, useEffect } from "react";
import "../CSS/stockpage.css";
import Stock from "../Components/Stock";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsXCircle } from "react-icons/bs";

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
  const [searchedStockData, setSearchedStockData] = useState(null); // Store data for the searched stock
  const [response, setResponse] = useState(null); // Store API response data
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [popularStocksData, setPopularStocksData] = useState([]); // Store data for popular stocks
  const [selectedStock, setSelectedStock] = useState(null); // Store the selected stock symbol
  const [stockNews, setStockNews] = useState([]);
  const [clearStockInfo, setClearStockInfo] = useState(false);

  const [priceTrendScore, setPriceTrendScore] = useState(0);
  const [peScore, setPeScore] = useState(0);
  const [epsScore, setEpsScore] = useState(0);
  const [volumeScore, setVolumeScore] = useState(0);
  const [dayrangeScore, setDayrangeScore] = useState(0);
  const [yearrangeScore, setYearrangeScore] = useState(0);
  const [overallScore, setOverallScore] = useState(""); // Initialize with an initial value, such as an empty string
  const [ovrscore, setOvrScore] = useState(0); // Initialize with an initial value, such as an empty string

  const calculatePriceTrendScore = (currentPrice, priceAvg50, priceAvg200) => {
    const deviationFrom50MA = (currentPrice - priceAvg50) / priceAvg50;
    const deviationFrom200MA = (currentPrice - priceAvg200) / priceAvg200;

    // Assign scores based on deviations (you can adjust these values)
    const score50MA = deviationFrom50MA * 50;
    const score200MA = deviationFrom200MA * 25;

    // Calculate the total score based on the sum of scores from 50MA and 200MA
    const totalScore = score50MA + score200MA;

    return totalScore;
  };
  const fetchStockNews = async (symbol) => {
    const apiKey = "c8900940600098ea62d8a0f27d823099"; // Replace with your API key
    try {
      console.log("Fetching news data for symbol:", symbol);
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&page=0&apikey=${apiKey}`
      );
      console.log("News data response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  const calculatePEScore = (peRatio) => {
    // Define your logic to assign scores based on PE ratio
    // You can adjust the threshold and score values as needed
    if (peRatio < 10) {
      return 100;
    } else if (peRatio >= 10 && peRatio < 20) {
      return 75;
    } else if (peRatio >= 20 && peRatio < 30) {
      return 50;
    } else if (peRatio >= 30 && peRatio < 40) {
      return 25;
    } else {
      return 0;
    }
  };
  const calculateEPSScore = (eps) => {
    if (eps === null || eps <= 0) {
      return 0;
    } else if (eps < 2) {
      return 25;
    } else if (eps >= 2 && eps < 5) {
      return 50;
    } else if (eps >= 5 && eps < 10) {
      return 75;
    } else {
      return 100;
    }
  };
  // Calculate the Volume Score
  const calculateVolumeScore = (currentVolume, averageVolume) => {
    if (currentVolume === null || averageVolume === null) {
      return 0; // Return a low score if volume data is missing
    }

    const volumeRatio = currentVolume / averageVolume;

    if (volumeRatio >= 2) {
      return 100;
    } else if (volumeRatio >= 1) {
      return 75;
    } else if (volumeRatio >= 0.5) {
      return 50;
    } else {
      return 25;
    }
  };

  // Calculate the Day Range Score
  const calculateDayRangeScore = (currentPrice, dayLow, dayHigh) => {
    if (currentPrice === null || dayLow === null || dayHigh === null) {
      return 0; // Return a low score if price or range data is missing
    }

    const priceRatio = (currentPrice - dayLow) / (dayHigh - dayLow);

    if (priceRatio >= 0.8) {
      return 100;
    } else if (priceRatio >= 0.6) {
      return 75;
    } else if (priceRatio >= 0.4) {
      return 50;
    } else if (priceRatio >= 0.2) {
      return 25;
    } else {
      return 0;
    }
  };

  // Calculate the Year Range Score
  const calculateYearRangeScore = (currentPrice, yearLow, yearHigh) => {
    if (currentPrice === null || yearLow === null || yearHigh === null) {
      return 0; // Return a low score if price or range data is missing
    }

    const priceRatio = (currentPrice - yearLow) / (yearHigh - yearLow);

    if (priceRatio >= 0.8) {
      return 100;
    } else if (priceRatio >= 0.6) {
      return 75;
    } else if (priceRatio >= 0.4) {
      return 50;
    } else if (priceRatio >= 0.2) {
      return 25;
    } else {
      return 0;
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
    setSelectedStock(symbol); // Set the selected stock
    setSearchedStock(symbol); // Set the selected stock
    setSearchResults([]); // Clear search results after selection
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

    if (!searchedStock) {
      // If the search bar is empty
      setSearchResults([]); // Clear the search results
      setSearchedStockData(null); // Clear the searched stock data
      setSelectedStock(""); // Set selectedStock to an empty string
      setPriceTrendScore(0);
      setPeScore(0);
      setEpsScore(0);
      setVolumeScore(0);
      setDayrangeScore(0);
      setYearrangeScore(0);
      setOverallScore("");
      setOvrScore(0);
    } else if (searchedStock !== selectedStock) {
      // If the search query has changed from the previous search
      const apiKey = "c8900940600098ea62d8a0f27d823099"; // Replace with your API key
      const searchApiUrl = `https://financialmodelingprep.com/api/v3/search?query=${searchedStock}&limit=5&exchange=NASDAQ&apikey=${apiKey}`;

      try {
        const response = await axios.get(searchApiUrl);
        console.log("Search results:", response.data);
        setSearchResults(response.data);
        setSearchedStockData(null); // Clear the searched stock data
        setSelectedStock(null); // Clear the selected stock
        setPriceTrendScore(0);
        setPeScore(0);
        setEpsScore(0);
        setVolumeScore(0);
        setDayrangeScore(0);
        setYearrangeScore(0);
        setOverallScore("");
        setOvrScore(0);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      // Perform search with the existing query
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
    }

    // Clear stock information if the user clicked the clear button
    if (clearStockInfo) {
      setClearStockInfo(false);
      setSearchResults([]); // Clear the search results
      setSearchedStockData(null); // Clear the searched stock data
      setSelectedStock(""); // Set selectedStock to an empty string
      setPriceTrendScore(0);
      setPeScore(0);
      setEpsScore(0);
      setVolumeScore(0);
      setDayrangeScore(0);
      setYearrangeScore(0);
      setOverallScore("");
      setOvrScore(0);
    }
  };

  useEffect(() => {
    if (selectedStock) {
      setSearchedStockData(null);
      setPriceTrendScore(0);
      setPeScore(0);
      setEpsScore(0);
      setVolumeScore(0);
      setDayrangeScore(0);
      setYearrangeScore(0);
      setOverallScore("");
      setOvrScore(0);

      fetchStockData(selectedStock).then((data) => {
        if (data && data.length > 0) {
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
          const yearrangeScore = calculateYearRangeScore(
            data[0]?.price,
            data[0]?.yearLow,
            data[0]?.yearHigh
          );

          const overallScore =
            priceTrendScore +
            peScore +
            epsScore +
            volumeScore +
            dayrangeScore +
            yearrangeScore;

          setPriceTrendScore(priceTrendScore);
          setPeScore(peScore);
          setEpsScore(epsScore);
          setVolumeScore(volumeScore);
          setDayrangeScore(dayrangeScore);
          setYearrangeScore(yearrangeScore);
          setOvrScore(overallScore);

          if (overallScore >= 500) {
            setOverallScore("Excellent");
          } else if (overallScore >= 400) {
            setOverallScore("Very Good");
          } else if (overallScore >= 300) {
            setOverallScore("Good");
          } else if (overallScore >= 200) {
            setOverallScore("Moderate");
          } else {
            setOverallScore("Poor");
          }
        } else {
          console.error("Error fetching stock data:", data);
          // Handle the error or provide appropriate feedback to the user
        }

        // Now you can use the 'overallScore' or other calculated values as needed
      });
    }
  }, [selectedStock]);

  return (
    <div className="main__container">
      <div className="container">
      {(searchedStock == "" || searchedStock != "" || selectedStock == "" || selectedStock != "") &&(
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
    )}
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
                Search
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
            {searchedStock &&(<div className="stock_selected">
              Selected Stock: {selectedStock}
            </div>)}
          </form>
          <div className="category">
            <div className="category1">
              <h3>Stock Price</h3>
              <h5>
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.price}
              </h5>
            </div>
            <div className="category1">
              <h3>Volume</h3>
              <h5>
                Vol:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.volume}
              </h5>
              <h5>
                Avg. Vol:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.avgVolume}
              </h5>
            </div>

            <div className="category1">
              <h3>Market Cap</h3>
              <h5>
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.marketCap}
              </h5>
            </div>
            <div className="category1">
              <h3>P/E</h3>
              <h5>
                {searchedStockData && searchedStock && searchedStockData[0]?.pe}
              </h5>
            </div>
            <div className="category1">
              <h3>EPS</h3>
              <h5>
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.eps}
              </h5>
            </div>
            <div className="category1">
              <h3>Day High/Low</h3>
              <h5>
                High:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.yearHigh}
              </h5>
              <h5>
                Low:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.yearLow}
              </h5>
            </div>
            <div className="category1">
              <h3>Year High/Low</h3>
              <h5>
                High:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.dayHigh}
              </h5>
              <h5>
                Low:{" "}
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.dayLow}
              </h5>
            </div>
            <div className="category1">
              <h3>Previous Closing</h3>
              <h5>
                {searchedStockData &&
                  searchedStock &&
                  searchedStockData[0]?.previousClose}
              </h5>
            </div>
          </div>
          <div className="score">
            <h2>Score</h2>
            <div className="score_wrapper">
              <div className="single_score">
                <h3>Price Trend</h3>
                {searchedStock && <h5>{priceTrendScore.toFixed(2)}</h5>}
              </div>
              <div className="single_score">
                <h3>P/E</h3>
                {searchedStock && <h5>{peScore}</h5>}
              </div>
              <div className="single_score">
                <h3>EPS</h3>
                {searchedStock && <h5>{epsScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Volume</h3>
                {searchedStock && <h5>{volumeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Day Range</h3>
                {searchedStock && <h5>{dayrangeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Year Range</h3>
                {searchedStock && <h5>{yearrangeScore}</h5>}
              </div>
              <div className="single_score">
                <h3>Overall</h3>
                {searchedStock && <h5>{overallScore}</h5>}
                {searchedStock && <h5>{ovrscore.toFixed(2)}</h5>}
              </div>
            </div>
          </div>
          {selectedStock && (
            <div className="stock__news">
              <Link
                to={`/StockApp/stocks/news/${selectedStock}`} // Update the URL path accordingly
                className="news__button"
              >
                {`Click For ${selectedStock} News`}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stockpage;
