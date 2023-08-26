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

    fetchPopularStocksData(popularStockSymbols).then((data) => {
      console.log("Fetched data for popular stocks:", data);
      setPopularStocksData(data);
    });
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

  useEffect(() => {
    if (searchedStockData) {
      console.log("Searched stock data available:", searchedStockData);
    }
  }, [searchedStockData]);

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
                  <p>
                    {result.symbol} {result.name}
                  </p>
                </div>
              ))}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Stockpage;
