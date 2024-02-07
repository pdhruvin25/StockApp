import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/news.css";

const News = () => {
  const { symbol } = useParams();
  const [newsData, setNewsData] = useState([]);

  const fetchStockNews = async (symbol) => {
    const apiToken = "Rlys48Pd9kkchdgI2sc73jfj4BuGPY9JM34b0K7p"; // Replace with your API token
    try {
      const response = await axios.get(
        `https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=${apiToken}&group_similar=true&limit=5`
      );
      return response.data.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchStockNews(symbol).then((data) => {
      setNewsData(data);
    });
  }, [symbol]);

  return (
    <div className="news__container">
      <h1>News for {symbol}</h1>
      <div className="news">
        {newsData.map((newsItem, index) => (
          <div key={index} className="news__item">
            <h3>{newsItem.title}</h3>
            <h5 className="published_date">{newsItem.published_at}</h5>
            <p className="description">Description: {newsItem.description}</p>
            <p className="snippet">{newsItem.snippet}</p>

            <a
              href={newsItem.url}
              className="read_more_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
