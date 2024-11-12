import { Box, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import React from "react";
import { svg2img } from "../utils/randomAvatar";
import { addSuffix } from "../utils/funcs";

const tokenDetailRow = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e0e0e0",
  padding: "10px 5px",
};

const TokenDetailModal = ({ token, open, onClose }) => {
  return (
    <Modal
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      open={open}
      onClose={onClose}
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          padding: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" alignItems="center" columnGap={1}>
            <Typography
              variant="h5"
              style={{ fontWeight: "bold" }}
              fontSize="1.2rem"
              lineHeight={1}
            >
              {token?.symbol}
            </Typography>
            <img
              src={
                token.logo
                  ? `https://assets.thetatoken.org/tokens/${token?.logo}`
                  : svg2img(token)
              }
              alt={token?.symbol}
              style={{
                width: "20px",
                marginRight: "10px",
                display: "block",
                borderRadius: 50,
                border: 0,
              }}
            />
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Box style={tokenDetailRow}>
            <Typography variant="body2">Token Name: </Typography>
            <Typography variant="body2">{token?.name}</Typography>
          </Box>

          {parseFloat(token?.derivedUSD) > 0 && (
            <Box style={tokenDetailRow}>
              <Typography variant="body2">Token Conversion Value: </Typography>
              <Typography variant="body2">
                ${addSuffix(token?.derivedUSD)}
              </Typography>
            </Box>
          )}
          {parseFloat(token.totalLiquidityUSD) > 0 && (
            <Box style={tokenDetailRow}>
              <Typography variant="body2">Token Liquidity: </Typography>
              <Typography variant="body2">
                ${addSuffix(token?.totalLiquidityUSD)}
              </Typography>
            </Box>
          )}

          {parseFloat(token?.tradeVolume) > 0 && (
            <Box style={tokenDetailRow}>
              <Typography variant="body2">Trade Volume: </Typography>
              <Typography variant="body2">
                ${addSuffix(token?.tradeVolume)}{" "}
                <span style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                  ($
                  {addSuffix(token?.volume24HrsUSD)} in 24 hrs)
                </span>
              </Typography>
            </Box>
          )}
          {parseFloat(token?.tradeVolumeUSD) > 0 && (
            <Box style={tokenDetailRow}>
              <Typography variant="body2">Market Cap:</Typography>
              <Typography variant="body2">
                ${addSuffix(token?.tradeVolumeUSD)}
              </Typography>
            </Box>
          )}
          {token?.txCount && parseInt(token?.txCount) > 0 && (
            <Box style={tokenDetailRow}>
              <Typography variant="body2">Total Transaction Count: </Typography>
              <Typography variant="body2">
                {addSuffix(token?.txCount)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TokenDetailModal;
