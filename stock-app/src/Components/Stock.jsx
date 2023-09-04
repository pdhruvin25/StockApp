import React from "react";
import "../CSS/stock.css";

const Stock = ({ name, symbol, onClick, data }) => {
  console.log("Stock component rendering for:", symbol);

  console.log("Rendering stock info for", symbol);

  if (!data) {
    console.log("No data available for", symbol);

    return (
      <div className="stock__container" onClick={onClick}>
        <div className="stock__title">
          <h4 className="title">{name}</h4>
          <div className="stock__info">
            <div className="stock__info-left">
              <h5>{symbol}</h5>
            </div>
            <div className="stock__info-right">
              <p className={`latest-price gray-bg`}>N/A</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latestPrice = data.price || "N/A";
  const previousClose = data.previousClose || "N/A";
  const priceChange = latestPrice - previousClose;
  const priceChangePercentage = ((priceChange / previousClose) * 100).toFixed(
    2
  );
  const priceChangeColorClass =
    priceChange < 0 ? "red" : priceChange === 0 ? "gray" : "green"; // Determine color based on price change

  return (
    <div
      className={`stock__container ${priceChangeColorClass}`}
      onClick={onClick}
    >
      <div className="stock__title">
        <h4 className="title">{name}</h4>
        <div className="stock__info">
          <div className="stock__info-left">
            <h5>{symbol}</h5>
          </div>
          <div className="stock__info-right">
            <p className={`latest-price ${priceChangeColorClass}-bg`}>
              {latestPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
