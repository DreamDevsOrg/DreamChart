import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenListRequest } from "../redux/actions/tokenAction";
import { formatNumber } from "../utils/funcs";
import TokenListLogo from "../assets/img/Tokenbar-Logo.png";
import TopTokenList from "./common/TopTokenList";
import TokenTable from "./TokenTable";
import Modal from "./common/Modal"; // Import the Modal component
import "./style.css";
import { createTheme, useMediaQuery } from "@mui/material";
import { svg2img } from "../utils/randomAvatar";

const TokenList = () => {
  // Existing theme and media query setup
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0, sm: 600, md: 960, lg: 1160, xl: 1560,
      },
    },
  });
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const MediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isMediumScreen, setIsMediumScreen] = useState(MediumScreen);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTokenListRequest());
  }, [dispatch]);

  const tokenList = useSelector((state) => state.tokenReducer.tokenList);
  const [filteredTokenList, setFilteredTokenList] = useState([...tokenList]);

  // Existing logic for limitedTokenList
  const sortedTokenList = tokenList.sort(
    (a, b) =>
      (b.volume24HrsETH * 1) / (b.tradeVolumeETH * 1) -
      (a.volume24HrsETH * 1) / (a.tradeVolumeETH * 1)
  );
  const limitedTokenList = sortedTokenList.slice(0, 10)
    // Basic Mapping
    .map((item, index) => ({
      ...item,
      num: "#" + (index + 1),
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      logo: item.logo,
      riserate: (
        ((item.volume24HrsETH * 1) / (item.tradeVolumeETH * 1)) *
        100
      ).toFixed(2),
    }));

  // New state for selected token and modal visibility
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Existing state for editing and input text
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("Select Token/Contract Address ⌄");

  useEffect(() => {
    setFilteredTokenList([...tokenList]);
  }, [tokenList, isEditing]);

  // Handle token click to open modal
  const handleTokenClick = (token) => {
    console.log(token);
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedToken(null);
  };

  // Existing functions for input handling
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFilteredTokenList(
      [...tokenList].filter((obj) =>
        obj.symbol.toLowerCase().includes(e.target.value.toLowerCase()) ||
        obj.id.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      handleSaveClick();
    }
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setFilteredTokenList([...tokenList]);
    setText("Select Token/Contract Address ⌄");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="tokenlist-background font-header">
      <img
        src={TokenListLogo}
        alt="Token List Logo"
        className="token-list-logo"
      />
      <TopTokenList
        tokenList={limitedTokenList}
        onTokenClick={handleTokenClick}
      />
      <div
        className="dropdown-container font-header"
        style={{ position: "relative" }}
      >
        {isEditing ? (
          <input
            type="text"
            placeholder={text}
            className="dropdown-button"
            onChange={handleInputChange}
            style={{ fontFamily: "altivo" }}
            autoFocus
          />
        ) : (
          <button
            onClick={handleEditClick}
            className="dropdown-button"
            style={{ overflow: "hidden", fontFamily: "altivo" }}
          >
            {text}
          </button>
        )}
        {isEditing && (
          <div
            ref={divRef}
            style={{
              position: "absolute",
              top: "calc(45px)",
              transform: "translateX(-50%)",
              width: isLargeScreen ? "60vw" : "100vw",
              backgroundColor: "#191919",
              padding: "10px",
              borderRadius: "5px",
              zIndex: "50",
              color: "white",
              border: `2px solid transparent`,
              left: isLargeScreen ? "-13vw" : "-37vw",
              animation: 'slideInTable 0.5s ease-in',
            }}
          >
            <TokenTable tokenData={filteredTokenList} onTokenClick={handleTokenClick} />
          </div>
        )}
      </div>
      {isModalOpen && selectedToken && (
        <Modal onClose={handleCloseModal}>
          <div className="token-header">
            { selectedToken.logo && (
              <img
                src={
                  `https://assets.thetatoken.org/tokens/${selectedToken.logo}`
                }
                style={{ width: "40px", marginRight: "15px" }}
              />
            ) }
            <h2>{selectedToken.name} ({selectedToken.symbol})</h2>
          </div>

          <div className="token-info">
            <div className="info-row">
              <span className="key">Price:</span>
              <span>${selectedToken.derivedUSD}</span>
            </div>
            <div className="info-row">
              <span className="key">24h Volume:</span>
              <span>${formatNumber(Number(selectedToken.volume24HrsUSD))}</span>
            </div>
            <div className="info-row">
              <span className="key">Market Cap:</span>
              <span>${formatNumber(Number(selectedToken.tradeVolumeUSD))}</span>
            </div>
            <div className="info-row">
              <span className="key">Total Liquidity:</span>
              <span>${formatNumber(Number(selectedToken.totalLiquidityUSD))}</span>
            </div>
            <div className="info-row">
              <span className="key">Transaction Count:</span>
              <span>{selectedToken.txCount}</span>
            </div>
            <div className="info-row">
              <span className="key">Contract Address:</span>
              <span>
                <a className="address" href={`https://explorer.thetatoken.org/account/${selectedToken.id}`} target="_blank" rel="noopener noreferrer">
                {selectedToken.id}
                  <i className="fas fa-external-link-alt" style={{ marginLeft: '8px', fontSize: '14px' }}></i>
                </a>
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { TokenList };
